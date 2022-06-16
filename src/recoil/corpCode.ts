import { atom } from "recoil";

export interface ICorpCodeType {
    corp_code: string;
    corp_name: string;
    stock_code: string;
};

// 업데이트
export const corpCodeState = atom<ICorpCodeType | undefined>({
    key: 'corpCode',
    default: {
        corp_code: '',
        corp_name: '',
        stock_code: ''
    }
})
