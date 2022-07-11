import { atom } from "recoil";

export type IIsFoldType = boolean;

// 업데이트
export const isFoldState = atom<IIsFoldType>({
    key: 'isFold',
    default: false
})
