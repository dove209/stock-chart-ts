/* eslint-disable array-callback-return */
import React, { useEffect } from 'react'
import styled from 'styled-components';
import corpCode from '../corpData/corp_code.json';

import { useSetRecoilState, useRecoilState } from 'recoil';
import { corpCodeState } from '../recoil/corpCode';
import { keywordsState } from '../recoil/keywords';
import { IoMdClose } from 'react-icons/io';

const KeywordsConatiner = styled.ul`
    margin-top:8px;
    display: flex;
    align-items: center;
    height: 47px;
    li {
        padding: 5px 8px;
        display: flex;
        align-items: center;
        border-radius: 5px;
        border: 1px solid #e1e1e1;
        font-size: 0.9rem;
        cursor: pointer;
        svg {
            margin-left: 5px;
        }
    }
    li + li {
        margin-left: 10px;
    }
`;

type KeywordsProps = {
    setCorpName: (text: string) => void
}

const Keywords = ({ setCorpName }: KeywordsProps) => {
    const [keywords, setKeywords] = useRecoilState(keywordsState);       // 최근 검색 리스트
    const setCorpCode = useSetRecoilState(corpCodeState);                // 검색된 종목의 코드 객체


    useEffect(() => {
        localStorage.setItem('keywords', JSON.stringify(keywords))
    }, [keywords])

    const keywordClick = (text: string): void => {
        let findedCorp = corpCode.list.find((item) => item.corp_name === text);
        setCorpCode(findedCorp);
        setCorpName(text)

    }

    const removeKeyword = (e: React.MouseEvent<SVGElement>, id: number): void => {
        e.stopPropagation();
        setKeywords(keywords.filter((keyword) => keyword.id !== id))
    }

    return (
        <KeywordsConatiner>
            {keywords.map((item, idx) => {
                if (idx < 8) {
                    return (
                        <li key={item.id} onClick={() => keywordClick(item.text)}>
                            {item.text}
                            <IoMdClose onClick={(e) => removeKeyword(e, item.id)} />
                        </li>
                    )
                }
            }
            )}
        </KeywordsConatiner>
    )
}

export default Keywords