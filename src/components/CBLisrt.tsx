/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import corpCode from '../corpData/corp_code.json';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';
import DownloadJSON2CSV from '../utils/DownloadJSON2CSV';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top:0;
    left:0;
    background-color: rgba(0,0,0,0.7);
    z-index:9999;
`
const CBCorpSearch = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform:  translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    .header {
        display: flex;
        justify-content: space-between;
        align-items:center;
        .status {
            font-weight:bold;
            font-size: 1.2rem;
        }
    }
    .corpList {
        width:100%;
        height: 730px;
        overflow: auto;
        .corpItems {
            & > li {
                border: 1px solid #e1e1e1;
                border-radius: 10px;
                padding: 15px 20px;
                .info {
                    font-weight: bold;
                    font-size: 1.1rem;
                    display: flex;
                    justify-content: space-between;
                }
                h1 {
                    font-size:1.1rem;
                    font-weight:bold;
                    text-align: center;
                }
                .funds {
                    display: flex;
                    margin-top: 10px;
                    & > li {
                        flex:1;
                        font-size: 0.9rem;
                        text-align:center;
                    }
                }
            }
            & > li + li {
                margin-top: 10px;
            }
        }
    }
    .btnWrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        button {
            width: 100px;
            height: 32px;
            background-color: #fff;
            border: 1px solid #e1e1e1;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
            font-size: 1rem;
            &.restart {
                background-color: #00b222;
                border: transparent;
                color: #fff;
            }
            &.stop {
                &:hover {
                    background-color: #aaa;
                    color: #fff;    
                }
            }
        }
        button + button {
            margin-left: 10px;
        }
    }

`
function useInterval(callback: any, delay: number | null) {
    const savedCallback = useRef<any>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}



type CBListProps = {
    close: (val: boolean) => void
    startTime: string
    endTime: string
}
const CBLisrt = ({ close, startTime, endTime }: CBListProps) => {
    const [isRunning, setIsRunning] = useState(true);
    const [cnt, setCnt] = useState<number>(0);
    const [corpList, setCorpList] = useState<any>([]);

    const proxyDart = process.env.NODE_ENV === 'development' ? '/dartAPI' : '/proxyDart';

    useInterval(async () => {
        if (corpCode?.list[cnt]) {
            let CBbdData = (await axios.get(`${proxyDart}/cvbdIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.list[cnt]?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list; //opendart ????????????
            if (CBbdData) {
                if (CBbdData.length >= 3) {
                    let totalFunds = 0;
                    let fcltFunds = 0; //????????????
                    let bsninhFunds = 0; //??????????????????
                    let opFunds = 0; //????????????
                    let dtrpFunds = 0; //??????????????????
                    let ocsaFunds = 0; //????????? ?????? ????????????
                    let etcFunds = 0; //????????????
                    CBbdData.forEach((item: any) => {
                        totalFunds += item.bd_fta !== '-' ? Number(item.bd_fta.replace(/,/g, '')) : 0;
                        fcltFunds += item.fdpp_fclt !== '-' ? Number(item.fdpp_fclt.replace(/,/g, '')) : 0;
                        bsninhFunds += item.fdpp_bsninh !== '-' ? Number(item.fdpp_bsninh.replace(/,/g, '')) : 0;
                        opFunds += item.fdpp_op !== '-' ? Number(item.fdpp_op.replace(/,/g, '')) : 0;
                        dtrpFunds += item.fdpp_dtrp !== '-' ? Number(item.fdpp_dtrp.replace(/,/g, '')) : 0;
                        ocsaFunds += item.fdpp_ocsa !== '-' ? Number(item.fdpp_ocsa.replace(/,/g, '')) : 0;
                        etcFunds += item.fdpp_etc !== '-' ? Number(item.fdpp_etc.replace(/,/g, '')) : 0;
                    })
                    let corpObj = {
                        name: corpCode.list[cnt].corp_name,
                        count: CBbdData.length,
                        totalFunds: totalFunds,
                        fcltFunds: fcltFunds,
                        bsninhFunds: bsninhFunds,
                        opFunds: opFunds,
                        dtrpFunds: dtrpFunds,
                        ocsaFunds: ocsaFunds,
                        etcFunds: etcFunds,
                    }
                    setCorpList([...corpList, corpObj])
                }
            } else {
                console.log('??????....');
            }
        } else {
            close(false);
        }
        setCnt(cnt + 1)
    }, isRunning ? 400 : null)


    const download = () => {
        if (isRunning) {
            alert('????????? ?????? ????????????!')
        } else {
            DownloadJSON2CSV(corpList)
        }
    }

    return (
        <Container>
            <CBCorpSearch>
                <div className='header'>
                    <div className='status'>
                        {cnt}/{corpCode.list.length} {isRunning ? '?????????....' : '??????...'}
                    </div>
                    <IoMdClose size={40} style={{ cursor: 'pointer' }} onClick={() => close(false)} />
                </div>
                <div className='corpList'>
                    {corpList.length === 0 ?
                        <div>????????? ????????? ????????????.</div>
                        :
                        <ul className='corpItems'>
                            {corpList.map((corp: any, idx: number) => {
                                return (
                                    <li key={idx}>
                                        <div className='info'>
                                            <p>{corp.name} ({corp.count}???)</p>
                                            <p className='totalFunds'>??? ?????? : {corp.totalFunds.toLocaleString()}???</p>
                                        </div>
                                        <h1>?????? ??????</h1>
                                        <ul className='funds'>
                                            <li>
                                                ??????<br />
                                                {corp.opFunds.toLocaleString()}???
                                            </li>
                                            <li>
                                                ????????? ?????? ??????<br />
                                                {corp.ocsaFunds.toLocaleString()}???
                                            </li>
                                            <li>
                                                ???????????? <br />
                                                {corp.dtrpFunds.toLocaleString()}???
                                            </li>
                                            <li>
                                                ???????????? <br />
                                                {corp.bsninhFunds.toLocaleString()}???
                                            </li>
                                            <li>
                                                ?????? <br />
                                                {corp.fcltFunds.toLocaleString()}???
                                            </li>
                                            <li>
                                                ?????? <br />
                                                {corp.etcFunds.toLocaleString()}???
                                            </li>
                                        </ul>
                                    </li>
                                )
                            })}
                        </ul>
                    }
                </div>

                <div className='btnWrap'>
                    {isRunning ?
                        <button className='stop' onClick={() => setIsRunning(false)}>????????????</button>
                        :
                        <button className='restart' onClick={() => setIsRunning(true)}>?????????</button>
                    }
                    <button className='stop' onClick={download}>????????????</button>
                </div>

            </CBCorpSearch>
        </Container>
    )
}

export default CBLisrt