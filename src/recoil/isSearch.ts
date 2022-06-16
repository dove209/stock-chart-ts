import { atom } from "recoil";

export type IIsSearchType = boolean;

// 업데이트
export const isSearchState = atom<IIsSearchType>({
    key: 'isSearch',
    default: false
})
