import React, { useState } from 'react'
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ICorpNameType, corpNameState } from '../recoil/corpName';

const Container = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
        width: 200px;
        height: 30px;
        border: 1px solid #000;
        border-radius: 5px;
        padding-left: 5px;
    }
    button {
        margin-left: 10px;
        width: 50px;
        height: 36px;
        background-color: #fff;
        border: 1px solid #000;
        cursor: pointer;
        border-radius: 5px;
    }
`

const CorpSearch = (): JSX.Element => {
    const [input, setInput] = useState<string>('');
    const setCorpName = useSetRecoilState(corpNameState);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const search = () => {
        setCorpName(input)
    }
    return (
        <Container>
            <input
                type={'text'}
                value={input}
                onChange={onChange}
                placeholder={'종목명 입력'}
            />
            <button onClick={search}>검색</button>
        </Container>
    )
}

export default CorpSearch