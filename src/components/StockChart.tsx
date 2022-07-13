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
import { noticeMenuState } from '../recoil/noticeMenu';

import { IStockData } from '../../types/stockData';
import CandleChart from './eChart/CandleChart';
import LineChart from './eChart/LineChart';

const StockChart = () => {

  const corpCode = useRecoilValue(corpCodeState);
  const period = useRecoilValue(periodState);
  const [isSearching, setIsSearching] = useRecoilState(isSearchState);
  const noticeMenu = useRecoilValue(noticeMenuState);
  const [stockData, setStockData] = useState<IStockData>();

  useEffect(() => {
    const getNaverStockData = async () => {
      if (isSearching) {
        try {
          const PROXY = window.location.hostname === 'localhost' ? '/naverAPI' : '/proxy';
          const startTime = dateFormat(period?.startDate);
          const endTime = dateFormat(period?.endDate);
          const { data: priceData } = await axios.get(`${PROXY}/siseJson.naver?symbol=${corpCode?.stock_code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=day`); //naver 주식 데이터
          const piicData = noticeMenu.piic ? (await axios.get(`dartAPI/piicDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list : []; //opendart 유상증자 API
          const cdbdData = noticeMenu.cb ? (await axios.get(`dartAPI/cvbdIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list : []; //opendart 전환사채
          const bwbdData = noticeMenu.bw ? (await axios.get(`dartAPI/bdwtIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list : []; //opendart 신주인수권부사채
          const adjustCbData = noticeMenu.cb ? (await axios.get(`dartAPI/list.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}&page_count=100&pblntf_ty=I`)).data.list : [];//opendart 전환가액 조정 공시(I)
          const majorStockData = noticeMenu.majorStock ? (await axios.get(`dartAPI/majorstock.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}`)).data.list : []; //opendart 주식등의 대량보유상황 보고
          const ocsisInhData = noticeMenu.otcprStkInvscr ? (await axios.get(`dartAPI/otcprStkInvscrInhDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list : [];//opendart 타법인 주식 및 출자증권 양수
          const ocsisTrfData = noticeMenu.otcprStkInvscr ? (await axios.get(`dartAPI/otcprStkInvscrTrfDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list : [];//opendart 타법인 주식 및 출자증권 양도
          const stkrtbdInhData = noticeMenu.stkrtbd ? (await axios.get(`dartAPI/stkrtbdInhDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list : [];//opendart 사채권 양수
          const stkrtbdTrfData = noticeMenu.stkrtbd ? (await axios.get(`dartAPI/stkrtbdTrfDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list : [];//opendart 사채권 양도
          const eleStockData = noticeMenu.elestock ? (await axios.get(`dartAPI/elestock.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}`)).data.list : [];//opendart 임원ㆍ주요주주 소유 보고
          const newFacillData = noticeMenu.newFacill ? (await axios.get(`dartAPI/list.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.corp_code}&bgn_de=${startTime}&end_de=${endTime}&page_count=100&pblntf_ty=I`)).data.list : [];//opendart 신규시설 투자
          const rawData = getStockDate(priceData);
          setStockData(mainData(rawData, cdbdData, bwbdData, piicData, adjustCbData, majorStockData, ocsisInhData, ocsisTrfData, stkrtbdInhData, stkrtbdTrfData, eleStockData, newFacillData));
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