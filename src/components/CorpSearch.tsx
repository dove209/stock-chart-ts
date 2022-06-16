/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

import { useSetRecoilState, useRecoilState } from 'recoil';
import { corpCodeState } from '../recoil/corpCode';
import { periodState } from '../recoil/period';
import { isSearchState } from '../recoil/isSearch';
import corpCode from '../corpData/corp_code.json';

import { oneMonthAgo, sixMonthAgo, oneYearAgo, twoYearAgo } from '../utils/Date';


const Container = styled.div`
    border: 1px solid #999;
    border-radius: 6px;
    padding: 8px 30px 0px;
    box-shadow: 0px 3px 5px rgba(0,0,0,0.1);
    & > div {
        display: flex;
        align-items: center;
        height: 47px;
        padding: 8px 0px;
        border-bottom: 1px solid #e1e1e1;
        &:last-child {
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

    // 종목명 검색
    .corpName {
        & > input {
            width: 200px;
            height: 100%;
            border: 1px solid #e1e1e1;
            border-radius: 5px;
            padding-left: 5px;
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
`

const CustomDatePicker = styled(DatePicker)`
    width: 100px;
    height: 100%;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    padding-left: 5px;
    font-size: 0.9rem;
`

const CorpSearch = (): JSX.Element => {
    const [corpName, setCorpName] = useState<string>('');               //종목명 검색
    const setCorpCode = useSetRecoilState(corpCodeState);               //검색된 종목의 코드 객체
    const [period, setPeriod] = useRecoilState(periodState);            // 시작일 ~ 종료일
    const [periodMenu, setPeriodMenu] = useState<string>('oneYear');    // 기간 메뉴 1년전(기본)
    const [isSearching, setIsSearching] = useRecoilState(isSearchState);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCorpName(e.target.value.toUpperCase())
    }

    // 기간 메뉴 선택
    const periodMenuClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        let text = (e.currentTarget as Element).textContent;
        setPeriod({
            ...period,
            endDate: new Date()
        })
        switch (text) {
            case '1개월':
                setPeriodMenu('oneMonth');
                setPeriod({
                    ...period,
                    startDate: oneMonthAgo(new Date())
                })
                break
            case '6개월':
                setPeriodMenu('sixMonth');
                setPeriod({
                    ...period,
                    startDate: sixMonthAgo(new Date())
                })
                break
            case '1년':
                setPeriodMenu('oneYear');
                setPeriod({
                    ...period,
                    startDate: oneYearAgo(new Date())
                })
                break
            case '2년':
                setPeriodMenu('twoYear');
                setPeriod({
                    ...period,
                    startDate: twoYearAgo(new Date())
                })
                break
            default:
                setPeriodMenu('');
                setPeriod({
                    ...period,
                    startDate: oneMonthAgo(new Date())
                })
                break
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            search()
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
            setCorpCode(findedCorp)
            setIsSearching(true);
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
        setPeriodMenu('oneYear')
    }


    return (
        <Container>
            <div className='corpName'>
                <h4>회사이름</h4>
                <input
                    autoFocus
                    type={'text'}
                    value={corpName}
                    onChange={onChange}
                    placeholder={'종목명 입력'}
                    onKeyDown={handleKeyPress}
                />
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
            <div className='noticeType'>
                <h4>공시유형</h4>
            </div>

            <div className='bntWrap'>
                <button id='searchBtn' onClick={search}>검색</button>
                <button id='initBtn' onClick={initBntClick}>초기화</button>
            </div>

        </Container>
    )
}

export default CorpSearch