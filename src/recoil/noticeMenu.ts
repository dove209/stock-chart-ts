import { atom } from "recoil";

export interface INoticeMenu {
    piic: boolean; //유증
    cb: boolean;    //CB
    bw: boolean;    //BW
    majorStock: boolean;//대량보유
    otcprStkInvscr: boolean; //타법인 주식 증권 양수도
    stkrtbd: boolean; //주권 관련 사채권 양수도
    elestock: boolean; //임원ㆍ주요주주 소유 보고
    newFacill: boolean; //신규시설투자
};

// 업데이트
export const noticeMenuState = atom<INoticeMenu>({
    key: 'NoticeType',
    default: {
        piic: true,
        cb: true,
        bw: false,
        majorStock: false,
        otcprStkInvscr: false,
        stkrtbd: false,
        elestock: false,
        newFacill: false,
    }
})
