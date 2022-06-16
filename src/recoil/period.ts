import { atom } from "recoil";
import { oneYearAgo } from "../utils/Date";

export interface IPeriodType {
    startDate: any;
    endDate: any;
};

// 업데이트
export const periodState = atom<IPeriodType>({
    key: 'period',
    default: {
        startDate: oneYearAgo(new Date()), //1년전(기본)
        endDate: new Date(),
    }
})
