import React, { useEffect } from 'react'
import axios from 'axios'
import { useRecoilValue } from 'recoil';
import { corpNameState } from '../recoil/corpName';

const NaverStock = (): JSX.Element => {
    const corpName = useRecoilValue(corpNameState)
    useEffect(() => {
        const getNaverStockData = async () => {
            try {
                const { data } = await axios.get(`naverAPI/siseJson.naver?symbol=005930&requestType=1&startTime=20220101&endTime=20220614&timeframe=day`)
                console.log(data)
            } catch (e) {
                console.log(e)
            }
        }
        getNaverStockData()
    }, [])

    return (
        <div>{corpName}</div>
    )
}

export default NaverStock