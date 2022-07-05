// 문자열 형태의 데이터 리스트에서 주가 데이터만 추출하기
export const getStockDate = (data) => {
  let list = data.split("\n").filter((item) => item.slice(0, 1) === "[");
  let result = list.map((item) => {
    return item.replace(/[\[\],\"]/gi, "").split(" ");
  });
  return result;
};

// 이동 평균선 계산
export const calculateMA = (dayCount, data) => {
  var result = [];
  for (var i = 0, len = data?.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data?.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(0));
  }
  return result;
};



// 차트, 공시 정보가 포함된 메인 데이터
export const MainData = (rawData, cdbdData, piicData) => {
  let categoryData = [];
  let values = [];
  let volumes = [];

  for (let i = 0; i < rawData.length; i++) {
    let date = rawData[i][0];
    let dateFormat = `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(
      6,
      2
    )}`;
    categoryData.push(dateFormat); //거래일
    //주가정보
    // NaverAPI [날짜 - 시가 - 고가 - 저가 - 종가 - 거래량 - 외국인소진율] 에서
    // Echart용 [시가 - 종가 - 고가 - 저가 - 거래량 - 외국인소진율] 으로 변환
    let numberData = rawData[i].map((value) => Number(value));
    values.push([
      numberData[1],
      numberData[4],
      numberData[2],
      numberData[3],
      numberData[5],
      numberData[6],
    ]);
    volumes.push([i, numberData[5], numberData[1] < numberData[4] ? 1 : -1]); //거래량(1  = up, -1 = down)
  }

  // 다트 전환사채 발행 결정 공시
  let cvbdIsDecsn = new Array(categoryData.length).fill(null);
  if (!!cdbdData) {
    cdbdData.forEach((data) => {
      let bddd = data.bddd.replace(/(\s*)/g, "");
      let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(
        8,
        2
      )}`;
      let findIdx = categoryData.indexOf(dateFormat);
      let cvObj = {
        bd_tm: data.bd_tm, //회차
        bd_knd: data.bd_knd, //종류
        bd_fta: data.bd_fta, //총액
        fdpp_fclt: data.fdpp_fclt, //시설자금
        fdpp_bsninh: data.fdpp_bsninh, //영업양수자금
        fdpp_op: data.fdpp_op, //운영자금
        fdpp_dtrp: data.fdpp_dtrp, //채무상환자금
        fdpp_ocsa: data.fdpp_ocsa, //타법인 증권 취득자금
        fdpp_etc: data.fdpp_etc, //기타자금
        cv_prc: data.cv_prc, //전환가액
        act_mktprcfl_cvprc_lwtrsprc: data.act_mktprcfl_cvprc_lwtrsprc, //최소전환가액
        cvrqpd_bgd: data.cvrqpd_bgd, //전환청구기간(시작일)
        cvrqpd_edd: data.cvrqpd_edd, //전환청구기간(종료일)
      };
      cvbdIsDecsn[findIdx] = cvObj;
    });
  }

  //다트 유상증자 결정 공시
  let piicDecsn = new Array(categoryData.length).fill(null);
  if (!!piicData) {
    piicData.forEach((data) => {
      let dateFormat = `${data.rcept_no.substr(0, 4)}-${data.rcept_no.substr(
        4,
        2
      )}-${data.rcept_no.substr(6, 2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
      let piilcObj = {
        fdpp_fclt: data.fdpp_fclt, //시설자금
        fdpp_bsninh: data.fdpp_bsninh, //영업양수자금
        fdpp_op: data.fdpp_op, //운영자금
        fdpp_dtrp: data.fdpp_dtrp, //채무상환자금
        fdpp_ocsa: data.fdpp_ocsa, //타법인 증권 취득자금
        fdpp_etc: data.fdpp_etc, //기타자금
        ic_mthn: data.ic_mthn, //증자방식
      };
      piicDecsn[findIdx] = piilcObj;
    });
  }

  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
    cvbdIsDecsn: cvbdIsDecsn,
    piicDecsn: piicDecsn
  };
};


