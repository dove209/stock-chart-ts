import { atom } from "recoil";
import { oneYearAgo, sixMonthAgo } from "../utils/Date";

export interface IPeriodType {
    startDate: any;
    endDate: any;
};

// 업데이트
export const periodState = atom<IPeriodType>({
    key: 'period',
    default: {
        startDate: sixMonthAgo(new Date()), //6개월전(기본)
        endDate: new Date(),
    }
})
