import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import corpCode from '../corpData/corp_code.json';


const InputBox = styled.div`
    position: relative;
    width: 455px;
    height: 100%;
    border: 1px solid #e1e1e1;
    padding-left: 5px;
    display:flex;
    flex-direction: row;
    z-index: 3;
    border-radius: 5px;
    &:focus-within {
        border-color: rgba(0,0,0,0.3);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    input {
        background-color: transparent;
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
    }
`

const DropDownBox = styled.ul`
  position: absolute;
  width: 455px;
  top: 29px;
  left: -1px; 
  background-color: #fff;
  border: 1px solid #e1e1e1;
  border-top: none;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 2px 5px rgb(0, 0, 0, 0.3);
  list-style-type: none;
  z-index: 3;
  font-size: 0.8rem;
`

const DropDownItem = styled.li`
padding: 8px 5px;
cursor: pointer;
  &.selected, &:hover {
    background-color: rgba(0,0,0,0.1);
  }
`

type AutoCompleteProps = {
    value: string
    setCorpName: (text: string) => void
}


const AutoComplete = ({ value, setCorpName }: AutoCompleteProps) => {
    const [dropDownShow, setDropDwonShow] = useState(false);
    const [dropDownList, setDropDownList] = useState(corpCode.list);
    const [dropDownItemIndex, setDropDownItemIndex] = useState(-1);

    const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase()
        setCorpName(value);
    }

    // 회사명 입력시 포함되는 리스트 가져오기
    useEffect(() => {
        if (!value) {
            setDropDownList([])
        } else {
            const list = corpCode.list.filter(item => item.corp_name.includes(value));
            setDropDownList(list);
        }
    }, [value])


    const onFocus = () => {
        setDropDownItemIndex(-1)
        setDropDwonShow(true)
    }
    const onBlue = () => {
        setDropDwonShow(false)
        if (dropDownItemIndex !== -1) {
            setCorpName(dropDownList[dropDownItemIndex].corp_name)
        }
    }

    return (
        <>
            <InputBox>
                <input
                    autoFocus
                    type={'text'}
                    value={value}
                    placeholder={'종목명 입력'}
                    onChange={changeInputValue}
                    onFocus={onFocus}
                    onBlur={onBlue}
                />
                {(dropDownShow && dropDownList.length !== 0) &&
                    <DropDownBox
                        onMouseLeave={() => setDropDownItemIndex(-1)}
                    >
                        {
                            dropDownList.map((item, idx) => {
                                if (idx < 8) {
                                    return (
                                        <DropDownItem
                                            key={idx}
                                            onMouseOver={() => setDropDownItemIndex(idx)}
                                            className={dropDownItemIndex === idx ? 'selected' : ''}
                                        >
                                            {item.corp_name}
                                        </DropDownItem>
                                    )
                                }
                            })
                        }
                    </DropDownBox>
                }
            </InputBox>
        </>
    )
}

export default AutoComplete