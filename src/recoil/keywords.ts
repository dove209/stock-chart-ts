import { atom } from "recoil";

export interface IKeywords {
    id: number,
    text: string
};

// 업데이트
let init = localStorage.getItem('keywords') ?? '[]';
export const keywordsState = atom<IKeywords[]>({
    key: 'keywords',
    default: JSON.parse(init)
})
