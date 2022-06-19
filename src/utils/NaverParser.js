// 문자열 형태의 데이터 리스트에서 주가 데이터만 추출하기
export const getStockDate = (data) => {
    let list = data.split('\n').filter((item) => item.slice(0,1) === '[')
    let result = list.map(item => {
        return item.replace(/[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '').split(' ')
    })
    return result;
}


export const splitData = (rawData) => {
    let categoryData = [];
    let values = [];
    let volumes = [];
    for (let i = 0; i < rawData.length; i++) {
        let date = rawData[i].splice(0, 1)[0];
        let dateFormat = `${date.substring(0,4)}-${date.substring(4,2)}-${date.substring(6,4)}`
      categoryData.push(dateFormat);        //거래일
      //주가정보
      // NaverAPI [시가 - 고가 - 저가 - 종가 - 거래량 - 외국인소진율] 에서
      // Echart용 [시가 - 종가 - 고가 - 저가 - 거래량 - 외국인소진율] 으로 변환
      let numberData = rawData[i].map(value => Number(value))
      values.push([numberData[0], numberData[3], numberData[1], numberData[2], numberData[4], numberData[5]]);
      volumes.push([i, Number(rawData[i][4]), Number(rawData[i][0]) > Number(rawData[i][3]) ? 1 : -1]);         //거래량
    }
    return {
      categoryData: categoryData,
      values: values,
      volumes: volumes
    };
  }
  
export const calculateMA = (dayCount, data) => {
    var result = [];
    for (var i = 0, len = data?.values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += data?.values[i - j][1];
      }
      result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
  }