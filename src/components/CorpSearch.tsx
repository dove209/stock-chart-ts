/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { dateFormat } from '../utils/Date';

import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import corpCode from '../corpData/corp_code.json';
import { oneMonthAgo, sixMonthAgo, oneYearAgo, twoYearAgo } from '../utils/Date';

import { useSetRecoilState, useRecoilState } from 'recoil';
import { corpCodeState } from '../recoil/corpCode';
import { periodState } from '../recoil/period';
import { isSearchState } from '../recoil/isSearch';
import { keywordsState } from '../recoil/keywords';
import { noticeMenuState } from '../recoil/noticeMenu';
import { isFoldState } from '../recoil/isFold';

import AutoComplete from './AutoComplete';
import Keywords from './Keywords';
import CBList from './CBLisrt';

interface IisFold {
    isFold: boolean
}
const Container = styled.div<IisFold>`
    top: 5px;
    left: 5px;
    position: fixed;
    background-color:#fff;
    width: ${({ isFold }) => isFold ? '52px' : '580px'};
    height: ${({ isFold }) => isFold ? '27px' : '400px'};
    border: 1px solid #999;
    border-radius: 6px;
    padding: ${({ isFold }) => isFold ? '0' : '8px 16px 0px;'}; 
    box-shadow: 3px 5px 10px rgba(0,0,0,0.1);
    z-index:999;
    & > div {
        display: flex;
        align-items: center;
        height: 47px;
        padding: 8px 0px;
        border-bottom: 1px solid #e1e1e1;
        &.bntWrap {
            margin-top: 30px;
            border: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            button {
                width: 100px;
                height: 100%;
                background-color: #fff;
                border: 1px solid #e1e1e1;
                cursor: pointer;
                border-radius: 5px;
                font-weight: bold;
                font-size: 1rem;
                &#searchBtn {
                    background-color: #00b222;
                    border: transparent;
                    color: #fff;
                }
                &#initBtn {
                    &:hover {
                        background-color: #aaa;
                        color: #fff;
                    }
                }
                &#cbStartBtn {
                    font-size: 14px;
                    background-color: #ff1d0a;
                    border: transparent;
                    color: #fff;
                }
            }
            button + button {
                margin-left: 10px;
            }
        }
        h4 {
            width: 90px;
        }
    }
    .react-datepicker-wrapper {
        width: auto;
        height: 100%;
        .react-datepicker__input-container {
            height: 100%;
        }  
    }
    // ?????? ??????
    .period {
        ul {
            display: flex;
            align-items: center;
            height: 100%;
            margin-left: 20px;
            li {
                border: 1px solid #e1e1e1;
                border-radius: 5px;
                width: 50px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bolder;
                cursor: pointer;
                &.active {
                    border-color: #00b222;
                    color: #00b222;
                }
            }
            li + li {
                margin-left: 8px;
            }
        }
    }
    // ?????? ?????? ??????
    .dartMenu {
        ul {
            display: flex;
            align-items: center;
            height: 100%;
            li {
                padding: 0 5px;
                border: 1px solid #e1e1e1;
                border-radius: 5px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bolder;
                cursor: pointer;
                &.active {
                    border-color: #00b222;
                    color: #00b222;
                }
            }
            li + li {
                margin-left: 8px;
            }
        }
    }

`
//?????? ??????
const FoldBtn = styled.button`
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #fff;
    border-color: transparent;
    cursor: pointer;
`
// ????????? ??????
const UnFoldBtn = styled.button`
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-color: transparent;
    border-radius: 6px;
    cursor: pointer;
`

const CustomDatePicker = styled(DatePicker)`
    width: 100px;
    height: 100%;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    padding-left: 5px;
    font-size: 0.9rem;
    outline: none;
`

const CorpSearch = (): JSX.Element => {
    const [corpName, setCorpName] = useState<string>('');                // ????????? ??????
    const setCorpCode = useSetRecoilState(corpCodeState);                // ????????? ????????? ?????? ??????
    const [period, setPeriod] = useRecoilState(periodState);             // ????????? ~ ?????????
    const [periodMenu, setPeriodMenu] = useState<string>('sixMonth');     // ?????? ?????? 1??????(??????)
    const [isSearching, setIsSearching] = useRecoilState(isSearchState); // ?????????
    const [noticeMenu, setNoticeMenu] = useRecoilState(noticeMenuState); // ?????? ??????
    const [keywords, setKeywords] = useRecoilState(keywordsState);       // ?????? ?????? ??????
    const [isFold, setIsFold] = useRecoilState(isFoldState);             // ?????? ???????????? ?????? ??????
    const [isCBSearch, setIsCBSearch] = useState(false);                 // CB?????? ?????? ?????? ??????

    // ?????? ?????? ??????
    const periodMenuClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        let text = (e.currentTarget as Element).textContent;
        setPeriodMenu(text === '1??????' ? 'oneMonth' : text === '6??????' ? 'sixMonth' : text === '1???' ? 'oneYear' : text === '2???' ? 'twoYear' : '')
        setPeriod({
            ...period,
            startDate: text === '1??????' ? oneMonthAgo(new Date()) : text === '6??????' ? sixMonthAgo(new Date()) : text === '1???' ? oneYearAgo(new Date()) : text === '2???' ? twoYearAgo(new Date()) : oneMonthAgo(new Date()),
            endDate: new Date()
        })
    }

    // ???????????? ?????? ??????
    const noticeMenuClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        let text = (e.currentTarget as Element).textContent;
        switch (text) {
            case '??????':
                setNoticeMenu({ ...noticeMenu, piic: !noticeMenu.piic })
                break;
            case 'CB':
                setNoticeMenu({ ...noticeMenu, cb: !noticeMenu.cb })
                break;
            case 'BW':
                setNoticeMenu({ ...noticeMenu, bw: !noticeMenu.bw })
                break;
            case '????????????':
                setNoticeMenu({ ...noticeMenu, majorStock: !noticeMenu.majorStock })
                break;
            case '????????? ?????????':
                setNoticeMenu({ ...noticeMenu, stkrtbd: !noticeMenu.stkrtbd })
                break;
            case '????????? ?????? ?????????':
                setNoticeMenu({ ...noticeMenu, otcprStkInvscr: !noticeMenu.otcprStkInvscr })
                break;
            case '????????????????????? ??????':
                setNoticeMenu({ ...noticeMenu, elestock: !noticeMenu.elestock })
                break;
            case '??????????????????':
                setNoticeMenu({ ...noticeMenu, newFacill: !noticeMenu.newFacill })
                break
            default:
                break;
        }
    }

    // ?????? ??????
    const search = () => {
        if (!corpName) {
            alert('???????????? ????????? ?????????.')
            return;
        }
        if (!isSearching) {
            let findedCorp = corpCode.list.find((item) => item.corp_name === corpName);
            if (!findedCorp) {
                alert('???????????? ???????????? ????????????.')
                return;
            }
            setCorpCode(findedCorp);
            setIsSearching(true);

            // ?????? ?????? ????????? ?????? ??????
            if (!keywords.find((keyword) => keyword.text === findedCorp?.corp_name)) {
                const newKeyword = {
                    id: Date.now(),
                    text: findedCorp.corp_name
                }
                setKeywords([newKeyword, ...keywords])
            }

        }
    }

    // ?????????
    const initBntClick = () => {
        setCorpName('')
        setPeriod({
            ...period,
            startDate: sixMonthAgo(new Date()),
            endDate: new Date()
        })
        setNoticeMenu({
            ...noticeMenu,
            piic: true,
            cb: true,
            bw: false,
            majorStock: false,
            otcprStkInvscr: false,
            stkrtbd: false,
            elestock: false,
            newFacill: false,
        })
        setPeriodMenu('sixMonth');
    }

    return (
        <>
            <Container isFold={isFold}>
                {isFold ?
                    <UnFoldBtn onClick={() => setIsFold(false)}>??????</UnFoldBtn>
                    :
                    <>
                        <div className='corpName'>
                            <h4>?????????</h4>
                            <AutoComplete value={corpName} setCorpName={setCorpName} />
                        </div>
                        <div className='period'>
                            <h4>??????</h4>
                            <CustomDatePicker
                                locale={ko}
                                dateFormat={"yyyy-MM-dd"}
                                selected={period.startDate}
                                onChange={(date) => setPeriod({ ...period, startDate: date })}
                            />
                            <h3>~</h3>
                            <CustomDatePicker
                                locale={ko}
                                dateFormat={"yyyy-MM-dd"}
                                selected={period.endDate}
                                onChange={(date) => setPeriod({ ...period, endDate: date })}
                                maxDate={new Date()}
                            />
                            <ul>
                                <li className={periodMenu === 'oneMonth' ? 'active' : undefined} onClick={periodMenuClick}>1??????</li>
                                <li className={periodMenu === 'sixMonth' ? 'active' : undefined} onClick={periodMenuClick}>6??????</li>
                                <li className={periodMenu === 'oneYear' ? 'active' : undefined} onClick={periodMenuClick}>1???</li>
                                <li className={periodMenu === 'twoYear' ? 'active' : undefined} onClick={periodMenuClick}>2???</li>
                            </ul>
                        </div>
                        <div className='dartMenu'>
                            <h4>????????????</h4>
                            <ul>
                                <li className={noticeMenu.piic ? 'active' : undefined} onClick={noticeMenuClick}>??????</li>
                                <li className={noticeMenu.cb ? 'active' : undefined} onClick={noticeMenuClick}>CB</li>
                                <li className={noticeMenu.bw ? 'active' : undefined} onClick={noticeMenuClick}>BW</li>
                                <li className={noticeMenu.majorStock ? 'active' : undefined} onClick={noticeMenuClick}>????????????</li>
                                <li className={noticeMenu.stkrtbd ? 'active' : undefined} onClick={noticeMenuClick}>????????? ?????????</li>
                                <li className={noticeMenu.otcprStkInvscr ? 'active' : undefined} onClick={noticeMenuClick}>????????? ?????? ?????????</li>
                            </ul>
                        </div>
                        <div className='dartMenu'>
                            <h4></h4>
                            <ul>
                                <li className={noticeMenu.elestock ? 'active' : undefined} onClick={noticeMenuClick}>????????????????????? ??????</li>
                                <li className={noticeMenu.newFacill ? 'active' : undefined} onClick={noticeMenuClick}>??????????????????</li>
                            </ul>
                        </div>

                        {/* ?????? ?????? ????????? */}
                        {keywords.length !== 0 &&
                            <Keywords setCorpName={setCorpName} />
                        }

                        <div className='bntWrap'>
                            <button id='searchBtn' onClick={search}>??????</button>
                            <button id='initBtn' onClick={initBntClick}>?????????</button>
                            <button id='cbStartBtn' onClick={() => setIsCBSearch(true)}>CB????????????</button>
                        </div>

                        <FoldBtn onClick={() => setIsFold(true)}>??????</FoldBtn>
                    </>
                }
            </Container>

            {/* CB?????? ?????? ????????? ????????? */}
            {isCBSearch &&
                <CBList close={setIsCBSearch} startTime={dateFormat(period?.startDate)} endTime={dateFormat(period?.endDate)} />
            }
        </>
    )
}

export default CorpSearch