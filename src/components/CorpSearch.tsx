/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import axios from 'axios';
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
                &#cbStopBtn {
                    font-size: 14px;
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
    // 기간 선택
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
    // 공시 유형 선택
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
//접기 버튼
const FoldBtn = styled.button`
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #fff;
    border-color: transparent;
    cursor: pointer;
`
// 펼치기 버튼
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
    const [corpName, setCorpName] = useState<string>('');                // 종목명 검색
    const setCorpCode = useSetRecoilState(corpCodeState);                // 검색된 종목의 코드 객체
    const [period, setPeriod] = useRecoilState(periodState);             // 시작일 ~ 종료일
    const [periodMenu, setPeriodMenu] = useState<string>('oneYear');     // 기간 메뉴 1년전(기본)
    const [isSearching, setIsSearching] = useRecoilState(isSearchState); // 검색중
    const [noticeMenu, setNoticeMenu] = useRecoilState(noticeMenuState); // 공시 유형
    const [keywords, setKeywords] = useRecoilState(keywordsState);       // 최근 검색 기록
    const [isFold, setIsFold] = useRecoilState(isFoldState);             // 검색 컨테이너 접기 유무

    // 기간 메뉴 선택
    const periodMenuClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        let text = (e.currentTarget as Element).textContent;
        setPeriodMenu(text === '1개월' ? 'oneMonth' : text === '6개월' ? 'sixMonth' : text === '1년' ? 'oneYear' : text === '2년' ? 'twoYear' : '')
        setPeriod({
            ...period,
            startDate: text === '1개월' ? oneMonthAgo(new Date()) : text === '6개월' ? sixMonthAgo(new Date()) : text === '1년' ? oneYearAgo(new Date()) : text === '2년' ? twoYearAgo(new Date()) : oneMonthAgo(new Date()),
            endDate: new Date()
        })
    }

    // 공시유형 메뉴 선택
    const noticeMenuClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        let text = (e.currentTarget as Element).textContent;
        switch (text) {
            case '유증':
                setNoticeMenu({ ...noticeMenu, piic: !noticeMenu.piic })
                break;
            case 'CB':
                setNoticeMenu({ ...noticeMenu, cb: !noticeMenu.cb })
                break;
            case 'BW':
                setNoticeMenu({ ...noticeMenu, bw: !noticeMenu.bw })
                break;
            case '대량보유':
                setNoticeMenu({ ...noticeMenu, majorStock: !noticeMenu.majorStock })
                break;
            case '사채권 양수도':
                setNoticeMenu({ ...noticeMenu, stkrtbd: !noticeMenu.stkrtbd })
                break;
            case '타법인 주식 양수도':
                setNoticeMenu({ ...noticeMenu, otcprStkInvscr: !noticeMenu.otcprStkInvscr })
                break;
            case '임원ㆍ주요주주 소유':
                setNoticeMenu({ ...noticeMenu, elestock: !noticeMenu.elestock })
                break;
            case '신규시설투자':
                setNoticeMenu({ ...noticeMenu, newFacill: !noticeMenu.newFacill })
                break
            default:
                break;
        }
    }

    // 종목 검색
    const search = () => {
        if (!corpName) {
            alert('종목명을 입력해 주세요.')
            return;
        }
        if (!isSearching) {
            let findedCorp = corpCode.list.find((item) => item.corp_name === corpName);
            if (!findedCorp) {
                alert('일치하는 종목명이 없습니다.')
                return;
            }
            setCorpCode(findedCorp);
            setIsSearching(true);

            // 최근 검색 기록에 없는 경우
            if (!keywords.find((keyword) => keyword.text === findedCorp?.corp_name)) {
                const newKeyword = {
                    id: Date.now(),
                    text: findedCorp.corp_name
                }
                setKeywords([newKeyword, ...keywords])
            }

        }
    }

    // 조기화
    const initBntClick = () => {
        setCorpName('')
        setPeriod({
            ...period,
            startDate: oneYearAgo(new Date()),
            endDate: new Date()
        })
        setNoticeMenu({
            ...noticeMenu,
            piic: true,
            cb: true,
            bw: true,
            majorStock: true,
            otcprStkInvscr: true,
            stkrtbd: true,
            elestock: true,
            newFacill: true,
        })
        setPeriodMenu('oneYear');
    }


    let timer: ReturnType<typeof setInterval>;
    let cnt: number = 0;
    let resultArr: string[] = [];
    const toSearch = () => {
        const proxyDart = process.env.NODE_ENV === 'development' ? '/dartAPI' : '/proxyDart';
        const startTime = dateFormat(period?.startDate);
        const endTime = dateFormat(period?.endDate);
        timer = setInterval(async () => {           
            if (corpCode?.list[cnt]) {
                let cdbdData = (await axios.get(`${proxyDart}/cvbdIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=${corpCode?.list[cnt]?.corp_code}&bgn_de=${startTime}&end_de=${endTime}`)).data.list; //opendart 전환사채
                if (cdbdData) {
                    if (cdbdData.length >= 3) {
                        resultArr.push(`${corpCode.list[cnt].corp_name}(${cdbdData.length})`);
                    }
                } else {
                    console.log('없음....');
                }
            } else {
                clearInterval(timer)
            }
            cnt += 1;
        }, 400)
    }

    const stopSearch = () => {
        clearInterval(timer);
        console.log(resultArr);
        alert(resultArr)
    }

    return (
        <Container isFold={isFold}>
            {isFold ?
                <UnFoldBtn onClick={() => setIsFold(false)}>검색</UnFoldBtn>
                :
                <>
                    <div className='corpName'>
                        <h4>회사명</h4>
                        <AutoComplete value={corpName} setCorpName={setCorpName} />
                    </div>
                    <div className='period'>
                        <h4>기간</h4>
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
                            <li className={periodMenu === 'oneMonth' ? 'active' : undefined} onClick={periodMenuClick}>1개월</li>
                            <li className={periodMenu === 'sixMonth' ? 'active' : undefined} onClick={periodMenuClick}>6개월</li>
                            <li className={periodMenu === 'oneYear' ? 'active' : undefined} onClick={periodMenuClick}>1년</li>
                            <li className={periodMenu === 'twoYear' ? 'active' : undefined} onClick={periodMenuClick}>2년</li>
                        </ul>
                    </div>
                    <div className='dartMenu'>
                        <h4>공시유형</h4>
                        <ul>
                            <li className={noticeMenu.piic ? 'active' : undefined} onClick={noticeMenuClick}>유증</li>
                            <li className={noticeMenu.cb ? 'active' : undefined} onClick={noticeMenuClick}>CB</li>
                            <li className={noticeMenu.bw ? 'active' : undefined} onClick={noticeMenuClick}>BW</li>
                            <li className={noticeMenu.majorStock ? 'active' : undefined} onClick={noticeMenuClick}>대량보유</li>
                            <li className={noticeMenu.stkrtbd ? 'active' : undefined} onClick={noticeMenuClick}>사채권 양수도</li>
                            <li className={noticeMenu.otcprStkInvscr ? 'active' : undefined} onClick={noticeMenuClick}>타법인 주식 양수도</li>
                        </ul>
                    </div>
                    <div className='dartMenu'>
                        <h4></h4>
                        <ul>
                            <li className={noticeMenu.elestock ? 'active' : undefined} onClick={noticeMenuClick}>임원ㆍ주요주주 소유</li>
                            <li className={noticeMenu.newFacill ? 'active' : undefined} onClick={noticeMenuClick}>신규시설투자</li>
                        </ul>
                    </div>

                    {/* 최근 검색 리스트 */}
                    {keywords.length !== 0 &&
                        <Keywords setCorpName={setCorpName} />
                    }

                    <div className='bntWrap'>
                        <button id='searchBtn' onClick={search}>검색</button>
                        <button id='initBtn' onClick={initBntClick}>초기화</button>
                        {/* CB발생 기업 리스트 조회 */}
                        <button id='cbStartBtn' onClick={toSearch}>CB기업조회</button>
                        <button id='cbStopBtn' onClick={stopSearch}>CB조회종료</button>
                    </div>

                    <FoldBtn onClick={() => setIsFold(true)}>접기</FoldBtn>
                </>
            }
        </Container>
    )
}

export default CorpSearch