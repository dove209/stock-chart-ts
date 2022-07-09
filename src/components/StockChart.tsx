/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { dateFormat } from '../utils/Date';
import { getStockDate, mainData } from '../utils/MainData';

import { useRecoilValue, useRecoilState } from 'recoil';
import { corpCodeState } from '../recoil/corpCode';
import { periodState } from '../recoil/period';
import { isSearchState } from '../recoil/isSearch';

import { IStockData } from '../../types/stockData';
import CandleChart from './eChart/CandleChart';
import LineChart from './eChart/LineChart';

const StockChart = () => {

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
          const { data: priceData } = await axios.get(`naverAPI/siseJson.naver?symbol=${corpCode?.stock_code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=day`); //naver 주식 데이터
          const { data: { list: cdbdData } } = await axios.get(`dartAPI/cvbdIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`); //opendart 전환사채 
          const { data: { list: bwbdData } } = await axios.get(`dartAPI/bdwtIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`); //opendart 신주인수권부사채 
          const { data: { list: piicData } } = await axios.get(`dartAPI/piicDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`); //opendart 유상증자 API
          const { data: { list: adjustCbData } } = await axios.get(`dartAPI/list.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}&page_count=100&pblntf_ty=I`); //opendart 전환가액 조정 공시(I)
          const { data: { list: majorStockData } } = await axios.get(`dartAPI/majorstock.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}`); //opendart 주식등의 대량보유상황 보고
          const { data: { list: ocsisInhData } } = await axios.get(`dartAPI/otcprStkInvscrInhDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`); //opendart 타법인 주식 및 출자증권 양수
          const { data: { list: ocsisTrfData } } = await axios.get(`dartAPI/otcprStkInvscrTrfDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`); //opendart 타법인 주식 및 출자증권 양도
          const rawData = getStockDate(priceData);
          setStockData(mainData(rawData, cdbdData, bwbdData, piicData, adjustCbData, majorStockData, ocsisInhData, ocsisTrfData))
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

export default StockChart