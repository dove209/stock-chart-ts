// 1개월전
export const oneMonthAgo = (nowDate) => {
    return new Date(nowDate.setMonth(nowDate.getMonth() - 1));
}

// 6개월전 
export const sixMonthAgo = (nowDate) => {
    return new Date(nowDate.setMonth(nowDate.getMonth() - 6));
}

// 1년전
export const oneYearAgo = (nowDate) => {
    return new Date(nowDate.setFullYear(nowDate.getFullYear() - 1));
}

// 2년전
export const twoYearAgo = (nowDate) => {
    return new Date(nowDate.setFullYear(nowDate.getFullYear() - 2));
}

//날짜 포맷 변경(YYYYMMDD)
export const dateFormat = (date) => {
    return (date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0')) //월일자를 2자리로 맞추기
}