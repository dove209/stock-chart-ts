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
          const { data } = await axios.get(`naverAPI/siseJson.naver?symbol=${corpCode?.stock_code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=day`)
          const rawData = getStockDate(data);
          setStockData(splitData(rawData))
          setIsSearching(false);
        } catch (e) {
          console.log(e)
        }
      }
    }
    getNaverStockData()
  }, [isSearching])

  useEffect(() => {
    // console.log(stockData)
  }, [stockData])

  return (
    <>
      <div>{corpCode?.corp_name} {corpCode?.corp_code} {corpCode?.stock_code}</div>
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