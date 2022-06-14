import { atom } from "recoil";

export type ICorpNameType = string | null;


// 업데이트
export const corpNameState = atom<ICorpNameType>({
    key: 'corpName',
    default: ''
})