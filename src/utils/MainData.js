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
export const mainData = (rawData, cdbdData, bwbdData, piicData, adjustCbData, majorStockData, ocsisInhData, ocsisTrfData, stkrtbdInhData, stkrtbdTrfData, eleStockData, newFacillData) => {
  let categoryData = [];
  let values = [];
  let volumes = [];

  for (let i = 0; i < rawData.length; i++) {
    let date = rawData[i][0];
    let dateFormat = `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6,2)}`;
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

  //전환사채(CB) 발행 결정 공시
  let cvbdIsDecsn = new Array(categoryData.length).fill([]);
  if (!!cdbdData) {
    cdbdData.forEach((data) => {
      let bddd = data.bddd.replace(/(\s*)/g, "");
      let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(8,2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
      let cvObj = {
        rcept_no:data.rcept_no,
        bd_tm: data.bd_tm, //회차
        bd_knd: data.bd_knd, //종류
        bd_fta: data.bd_fta, //총액
        fdpp_fclt: data.fdpp_fclt, //시설자금
        fdpp_bsninh: data.fdpp_bsninh, //영업양수자금
        fdpp_op: data.fdpp_op, //운영자금
        fdpp_dtrp: data.fdpp_dtrp, //채무상환자금
        fdpp_ocsa: data.fdpp_ocsa, //타법인 증권 취득자금
        fdpp_etc: data.fdpp_etc, //기타자금
        bd_intr_ex: data.bd_intr_ex, //표면이자율
        bd_intr_sf: data.bd_intr_sf, //만기이자율
        cv_prc: data.cv_prc, //전환가액
        act_mktprcfl_cvprc_lwtrsprc: data.act_mktprcfl_cvprc_lwtrsprc, //최소전환가액
        cvrqpd_bgd: data.cvrqpd_bgd, //전환청구기간(시작일)
        cvrqpd_edd: data.cvrqpd_edd, //전환청구기간(종료일)
      };
      cvbdIsDecsn[findIdx] = [...cvbdIsDecsn[findIdx], cvObj];
    });
  }

    //신주인수권부사채권(BW) 발행 결정 공시
    let bwbdIsDecsn = new Array(categoryData.length).fill(null);
    if (!!bwbdData) {
      bwbdData.forEach((data) => {
        let bddd = data.bddd.replace(/(\s*)/g, "");
        let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(8,2)}`;
        let findIdx = categoryData.indexOf(dateFormat);
        let cvObj = {
          rcept_no:data.rcept_no,
          bd_tm: data.bd_tm, //회차
          bd_knd: data.bd_knd, //종류
          bd_fta: data.bd_fta, //총액
          fdpp_fclt: data.fdpp_fclt, //시설자금
          fdpp_bsninh: data.fdpp_bsninh, //영업양수자금
          fdpp_op: data.fdpp_op, //운영자금
          fdpp_dtrp: data.fdpp_dtrp, //채무상환자금
          fdpp_ocsa: data.fdpp_ocsa, //타법인 증권 취득자금
          fdpp_etc: data.fdpp_etc, //기타자금
          bd_intr_ex: data.bd_intr_ex, //표면이자율
          bd_intr_sf: data.bd_intr_sf, //만기이자율
          ex_prc: data.ex_prc, //행사가액
          act_mktprcfl_cvprc_lwtrsprc: data.act_mktprcfl_cvprc_lwtrsprc, //최소 조정가액
          expd_bgd: data.expd_bgd, //권리행사기간(시작일)
          expd_edd: data.expd_edd, //권리행사기간(종료일)
        };
        bwbdIsDecsn[findIdx] = cvObj;
      });
    }

  //유상증자 결정 공시
  let piicDecsn = new Array(categoryData.length).fill(null);
  if (!!piicData) {
    piicData.forEach((data) => {
      let dateFormat = `${data.rcept_no.substr(0, 4)}-${data.rcept_no.substr(4,2)}-${data.rcept_no.substr(6, 2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
      let piilcObj = {
        rcept_no:data.rcept_no,
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

  //전환가액조정 공시
  let adjustCB = new Array(categoryData.length).fill(null);
  if (!!adjustCbData) {
    const regExp = /[^0-9]/g;
    adjustCbData.forEach((data) => {
      if(data.report_nm.includes('전환가액의조정')) {
        let dateFormat = `${data.rcept_dt.substr(0, 4)}-${data.rcept_dt.substr(4,2)}-${data.rcept_no.substr(6, 2)}`;
        let findIdx = categoryData.indexOf(dateFormat);
        let adjCbObj = {
          rcept_no:data.rcept_no,
          report_nm: data.report_nm, //리포트 이름
          rount: data.report_nm.replace(regExp, '') //전환가액전환 회사
        };
        adjustCB[findIdx] = adjCbObj;
      }
    });
  }

  //주식등대량보유상황 공시
  let majorStock = new Array(categoryData.length).fill(null);
  if (!!majorStockData) {
    majorStockData.forEach((data) => {
      let findIdx = categoryData.indexOf(data.rcept_dt);
      if(findIdx >= 0) {
        let majorObj = {
          rcept_no:data.rcept_no,
          repror: data.repror, //보고자
          stkrt_irds: data.stkrt_irds, //보유비율 증감
          report_resn: data.report_resn, //보고사유
        };
        majorStock[findIdx] = majorObj;
      }
    });
  }

  // 타법인 주식 및 출자증권 양수 공시
  let ocsisInh = new Array(categoryData.length).fill(null);
  if (!!ocsisInhData) {
    ocsisInhData.forEach((data) => {
      let bddd = data.bddd.replace(/(\s*)/g, "");
      let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(8,2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
      let ocsisInhObj = {
        rcept_no:data.rcept_no,
        iscmp_cmpnm: data.iscmp_cmpnm, //발행회사
        inh_pp: data.inh_pp, //양수목적
      };
      ocsisInh[findIdx] = ocsisInhObj;
    });
  }
  // 타법인 주식 및 출자증권 양도 공시
  let ocsisTrf = new Array(categoryData.length).fill(null);
  if (!!ocsisTrfData) {
    ocsisTrfData.forEach((data) => {
      let bddd = data.bddd.replace(/(\s*)/g, "");
      let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(8,2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
      let ocsisTrfObj = {
        rcept_no:data.rcept_no,
        iscmp_cmpnm: data.iscmp_cmpnm, //발행회사
        trf_pp: data.trf_pp, //양도목적
      };
      ocsisTrf[findIdx] = ocsisTrfObj;
    });
  }

  // 주권 관련 사채권 양수 공시
  let stkrtbdInh = new Array(categoryData.length).fill(null);
  if (!!stkrtbdInhData) {
    stkrtbdInhData.forEach((data) => {
      let bddd = data.bddd.replace(/(\s*)/g, "");
      let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(8,2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
        let stkrtbdInhObj = {
          rcept_no:data.rcept_no,
          stkrtbd_kndn: data.stkrtbd_kndn, //사채 종류
          tm: data.tm, //사채 회차
          inh_pp: data.inh_pp, //양수 목적
        };
        stkrtbdInh[findIdx] = stkrtbdInhObj;
    });
  }
  // 주권 관련 사채권 양도 공시
  let stkrtbdTrf = new Array(categoryData.length).fill(null);
  if (!!stkrtbdTrfData) {
    stkrtbdTrfData.forEach((data) => {
      let bddd = data.bddd.replace(/(\s*)/g, "");
      let dateFormat = `${bddd.substr(0, 4)}-${bddd.substr(5, 2)}-${bddd.substr(8,2)}`;
      let findIdx = categoryData.indexOf(dateFormat);
        let stkrtbdTrfObj = {
          rcept_no:data.rcept_no,
          stkrtbd_kndn: data.stkrtbd_kndn, //사채 종류
          tm: data.tm, //사채 회차
          trf_pp: data.trf_pp, //양도 목적
        };
        stkrtbdTrf[findIdx] = stkrtbdTrfObj;
    });
  }

  //임원ㆍ주요주주 소유보고
  let eleStock = new Array(categoryData.length).fill(null);
  if (!!eleStockData) {
    eleStockData.forEach((data) => {
      let findIdx = categoryData.indexOf(data.rcept_dt);
      if(findIdx >= 0) {
        let eleStockfObj = {
          rcept_no:data.rcept_no,
          repror:data.repror, //보고자
          isu_exctv_rgist_at:data.isu_exctv_rgist_at, //임원
          isu_exctv_ofcps:data.isu_exctv_ofcps, //임원 직위
          isu_main_shrholdr:data.isu_main_shrholdr, //주요 주주
          sp_stock_lmp_irds_cnt: data.sp_stock_lmp_irds_cnt, // 소유 증감 수
          sp_stock_lmp_irds_rate: data.sp_stock_lmp_irds_rate// 소유 증감 비율
        };
        eleStock[findIdx] = eleStockfObj;
      }
    });
  };
  
  //신규시설투자
  let newFacill = new Array(categoryData.length).fill(null);
  if (!!newFacillData) {
    newFacillData.forEach((data) => {
      if(data.report_nm.includes('신규시설투자')) {
        let dateFormat = `${data.rcept_dt.substr(0, 4)}-${data.rcept_dt.substr(4,2)}-${data.rcept_no.substr(6, 2)}`;
        let findIdx = categoryData.indexOf(dateFormat);
        let newFacillObj = {
          rcept_no:data.rcept_no,
          report_nm: data.report_nm, //리포트 이름
        };
        newFacill[findIdx] = newFacillObj;
      }
    });
  };
  
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
    cvbdIsDecsn: cvbdIsDecsn, //CB발행결정
    bwbdIsDecsn: bwbdIsDecsn, //BW발행결정
    piicDecsn: piicDecsn, //유상증자결정
    adjustCB: adjustCB,   //CB가 조정
    majorStock: majorStock, //주식등의대량보유상황
    ocsisInh: ocsisInh, //타법인 주식 증권 양수
    ocsisTrf: ocsisTrf,  //타법인 주식 증권 양도
    stkrtbdInh: stkrtbdInh,  //사채권 양수
    stkrtbdTrf: stkrtbdTrf,  //사채권 양도
    eleStock: eleStock,   //임원ㆍ주요주주 소유보고
    newFacill: newFacill, //신규시설투자
  };
};


