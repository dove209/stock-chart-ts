import React, { useEffect } from 'react';
import axios from 'axios';
import { useRecoilValue, useRecoilState } from 'recoil';
import { corpCodeState } from '../recoil/corpCode';
import { periodState } from '../recoil/period';
import { isSearchState } from '../recoil/isSearch';
import { dateFormat } from '../utils/Date';

const NaverStock = (): JSX.Element => {
    const corpCode = useRecoilValue(corpCodeState);
    const period = useRecoilValue(periodState);
    const [isSearching, setIsSearching] = useRecoilState(isSearchState)

    useEffect(() => {
        const getNaverStockData = async () => {
            if (isSearching) {
                try {
                    const startTime = dateFormat(period?.startDate);
                    const endTime = dateFormat(period?.endDate);
                    const { data } = await axios.get(`naverAPI/siseJson.naver?symbol=${corpCode?.stock_code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=day`)
                    console.log(data)
                    setIsSearching(false);
                } catch (e) {
                    console.log(e)
                }
            }
        }
        getNaverStockData()
    }, [isSearching])

    return (
        <div>{corpCode?.corp_name} {corpCode?.corp_code} {corpCode?.stock_code}</div>
    )
}

export default NaverStock