import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { dateFormat } from '../utils/Date';
import { getStockDate, splitData } from '../utils/NaverParser';

import { useRecoilValue, useRecoilState } from 'recoil';
import { corpCodeState } from '../recoil/corpCode';
import { periodState } from '../recoil/period';
import { isSearchState } from '../recoil/isSearch';

import { IStockData } from '../../types/stockData';
import CandleChart from './eChart/CandleChart';
import LineChart from './eChart/LineChart';

const NaverStock = () => {

  const corpCode = useRecoilValue(corpCodeState);
  const period = useRecoilValue(periodState);
  const [isSearching, setIsSearching] = useRecoilState(isSearchState)

  const [stockData, setStockData] = useState<IStockData>();

  useEffect(() => {
    const getNaverStockData = async () => {
      if (isSearching) {
        try {
          const startTime = dateFormat(period?.startDate);
          const endTime = dateFormat(period?.endDate);
          const { data: priceData } = await axios.get(`naverAPI/siseJson.naver?symbol=${corpCode?.stock_code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=day`)
          const { data: { status, list: dartData } } = await axios.get(`dartAPI/cvbdIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`);
          const rawData = getStockDate(priceData);
          setStockData(splitData(rawData, dartData))
          setIsSearching(false);      
        } catch (e) {
          console.log(e)
        }
      }
    }
    getNaverStockData()
  }, [isSearching])

  useEffect(() => {
    console.log(stockData)
  }, [stockData])

  return (
    <>
      {!!stockData &&
        <>
          <CandleChart stockData={stockData} />
          <LineChart stockData={stockData} />
        </>
      }

    </>

  )
}

export default NaverStock