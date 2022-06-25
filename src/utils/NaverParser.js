// 문자열 형태의 데이터 리스트에서 주가 데이터만 추출하기
export const getStockDate = (data) => {
  let list = data.split('\n').filter((item) => item.slice(0, 1) === '[')
  let result = list.map(item => {
    return item.replace(/[\[\],\"]/gi, '').split(' ')
  })
  return result;
}


export const splitData = (rawData, dartData) => {
  let categoryData = [];
  let values = [];
  let volumes = [];
  

  for (let i = 0; i < rawData.length; i++) {
    let date = rawData[i][0];
    let dateFormat = `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`;
    categoryData.push(dateFormat);        //거래일
    //주가정보
    // NaverAPI [날짜 - 시가 - 고가 - 저가 - 종가 - 거래량 - 외국인소진율] 에서
    // Echart용 [시가 - 종가 - 고가 - 저가 - 거래량 - 외국인소진율] 으로 변환
    let numberData = rawData[i].map(value => Number(value))
    values.push([numberData[1], numberData[4], numberData[2], numberData[3], numberData[5], numberData[6]]);
    volumes.push([i, numberData[5], numberData[1] < numberData[4] ? 1 : -1]);         //거래량(1  = up, -1 = down)
  }

  // 다트 전환사채 발행 결정 공시
  let cvbdIsDecsn = new Array(categoryData.length).fill(null);
  if(!!dartData) {
    for(let i = 0; i < dartData.length; i++) {
      let bddd =  dartData[i].bddd.replace(/(\s*)/g, "");
      let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(8, 2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
      let cvObj  = {
        bd_tm: dartData[i].bd_tm, //회차
        bd_knd: dartData[i].bd_knd, //종류
        bd_fta: dartData[i].bd_fta, //총액
        cv_prc: dartData[i].cv_prc, //전환가액
        act_mktprcfl_cvprc_lwtrsprc: dartData[i].act_mktprcfl_cvprc_lwtrsprc, //최소전환가액
      }
      cvbdIsDecsn[findIdx] = cvObj;
    }
  }
  

  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
    cvbdIsDecsn: cvbdIsDecsn
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
    result.push(+(sum / dayCount).toFixed(0));
  }
  return result;
}