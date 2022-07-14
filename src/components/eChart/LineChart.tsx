import React, { useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts";

import { IStockData } from '../../../types/stockData';

type LineChartProps = {
    stockData: IStockData
}

const LineChart = ({ stockData }: LineChartProps) => {
    const getOption = useCallback(() => {
        let closePrice = stockData?.values.map((item) => item[1]);
        let foreignRatio = stockData?.values.map((item) => item[5]);
        // let minPrice = Math.min(...closePrice);
        return {
            animation: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                borderWidth: 1,
                borderColor: '#00b222',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                formatter: function (params: any) {
                    let idx = params[0].dataIndex;
                    let dateHeader = `<div class='header'>${params[0].name}</div>`
                    let tooltipArr = [];
                    // CB 발행 공시
                    if (stockData?.cvbdIsDecsn[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>CB발행 (${stockData?.cvbdIsDecsn[idx]?.bd_tm}회차) [${stockData?.cvbdIsDecsn[idx]?.bd_knd}] </p>
                            <p>사채 총액:<b>${stockData?.cvbdIsDecsn[idx]?.bd_fta}원</b></p>
                            ${stockData?.cvbdIsDecsn[idx]?.fdpp_fclt !== '-' ? `<p>시설자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_fclt}원</b></p>` : ''}
                            ${stockData?.cvbdIsDecsn[idx]?.fdpp_bsninh !== '-' ? `<p>영업양수자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_bsninh}원</b></p>` : ''}
                            ${stockData?.cvbdIsDecsn[idx]?.fdpp_op !== '-' ? `<p>운영자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_op}원</b></p>` : ''}
                            ${stockData?.cvbdIsDecsn[idx]?.fdpp_dtrp !== '-' ? `<p>채무상황자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_dtrp}원</b></p>` : ''}
                            ${stockData?.cvbdIsDecsn[idx]?.fdpp_ocsa !== '-' ? `<p>타법인 증권 취득 자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_ocsa}원</b></p>` : ''}
                            ${stockData?.cvbdIsDecsn[idx]?.fdpp_etc !== '-' ? `<p>기타자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_etc}원</b></p>` : ''}
                            <p>전환가액:<b>${stockData?.cvbdIsDecsn[idx]?.cv_prc}원</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;최소전환가액:<b>${stockData?.cvbdIsDecsn[idx]?.act_mktprcfl_cvprc_lwtrsprc}원</b></p>
                            <p>전환청구기간: <b>${stockData?.cvbdIsDecsn[idx]?.cvrqpd_bgd} ~ ${stockData?.cvbdIsDecsn[idx]?.cvrqpd_edd}</b></p>
                        </div>
                        `);
                    }
                    //BW 발행 공시
                    if (stockData?.bwbdIsDecsn[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>BW발행 (${stockData?.bwbdIsDecsn[idx]?.bd_tm}회차) [${stockData?.bwbdIsDecsn[idx]?.bd_knd}] </p>
                            <p>사채 총액:<b>${stockData?.bwbdIsDecsn[idx]?.bd_fta}원</b></p>
                            ${stockData?.bwbdIsDecsn[idx]?.fdpp_fclt !== '-' ? `<p>시설자금:<b>${stockData?.bwbdIsDecsn[idx]?.fdpp_fclt}원</b></p>` : ''}
                            ${stockData?.bwbdIsDecsn[idx]?.fdpp_bsninh !== '-' ? `<p>영업양수자금:<b>${stockData?.bwbdIsDecsn[idx]?.fdpp_bsninh}원</b></p>` : ''}
                            ${stockData?.bwbdIsDecsn[idx]?.fdpp_op !== '-' ? `<p>운영자금:<b>${stockData?.bwbdIsDecsn[idx]?.fdpp_op}원</b></p>` : ''}
                            ${stockData?.bwbdIsDecsn[idx]?.fdpp_dtrp !== '-' ? `<p>채무상황자금:<b>${stockData?.bwbdIsDecsn[idx]?.fdpp_dtrp}원</b></p>` : ''}
                            ${stockData?.bwbdIsDecsn[idx]?.fdpp_ocsa !== '-' ? `<p>타법인 증권 취득 자금:<b>${stockData?.bwbdIsDecsn[idx]?.fdpp_ocsa}원</b></p>` : ''}
                            ${stockData?.bwbdIsDecsn[idx]?.fdpp_etc !== '-' ? `<p>기타자금:<b>${stockData?.bwbdIsDecsn[idx]?.fdpp_etc}원</b></p>` : ''}
                            <p>행사가액:<b>${stockData?.bwbdIsDecsn[idx]?.ex_prc}원</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;최소행사가액:<b>${stockData?.bwbdIsDecsn[idx]?.act_mktprcfl_cvprc_lwtrsprc}원</b></p>
                            <p>권한행사기간: <b>${stockData?.bwbdIsDecsn[idx]?.expd_bgd} ~ ${stockData?.bwbdIsDecsn[idx]?.expd_edd}</b></p>
                        </div>
                        `)
                    }
                    // 유상증자 공시
                    if (stockData?.piicDecsn[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>유상증자</p>
                            <p>증자방식:<b>${stockData?.piicDecsn[idx]?.ic_mthn}</b></p>
                            ${stockData?.piicDecsn[idx]?.fdpp_fclt !== '-' ? `<p>시설자금:<b>${stockData?.piicDecsn[idx]?.fdpp_fclt}원</b></p>` : ''}
                            ${stockData?.piicDecsn[idx]?.fdpp_bsninh !== '-' ? `<p>영업양수자금:<b>${stockData?.piicDecsn[idx]?.fdpp_bsninh}원</b></p>` : ''}
                            ${stockData?.piicDecsn[idx]?.fdpp_op !== '-' ? `<p>운영자금:<b>${stockData?.piicDecsn[idx]?.fdpp_op}원</b></p>` : ''}
                            ${stockData?.piicDecsn[idx]?.fdpp_dtrp !== '-' ? `<p>채무상황자금:<b>${stockData?.piicDecsn[idx]?.fdpp_dtrp}원</b></p>` : ''}
                            ${stockData?.piicDecsn[idx]?.fdpp_ocsa !== '-' ? `<p>타법인 증권 취득 자금:<b>${stockData?.piicDecsn[idx]?.fdpp_ocsa}원</b></p>` : ''}
                            ${stockData?.piicDecsn[idx]?.fdpp_etc !== '-' ? `<p>기타자금:<b>${stockData?.piicDecsn[idx]?.fdpp_etc}원</b></p>` : ''}
                        </div>
                        `)
                    }
                    // 전환가액조정 공시
                    if (stockData?.adjustCB[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>${stockData?.adjustCB[idx]?.report_nm}</p>
                        </div>
                        `)
                    }
                    // 주식등의대량보유상황보고
                    if (stockData?.majorStock[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>주식등의 대량보유상황보고서</p>
                            <p>대표보고자:<b>${stockData?.majorStock[idx]?.repror}</b></p>
                            <p>보유비율 증감:<b>${stockData?.majorStock[idx]?.stkrt_irds}%</b></p>
                            <p>보고사유:<b>${stockData?.majorStock[idx]?.report_resn}</b></p>

                        </div>
                        `)
                    }
                    // 타법인 주식 및 출자증권 양수
                    if (stockData?.ocsisInh[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>타법인 주식 및 출자증권 양수</p>
                            <p>발행회사:<b>${stockData?.ocsisInh[idx]?.iscmp_cmpnm}</b></p>
                            <p>양수목적:<b>${stockData?.ocsisInh[idx]?.inh_pp}</b></p>
                        </div>
                        `)
                    }
                    // 타법인 주식 및 출자증권 양도
                    if (stockData?.ocsisTrf[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>타법인 주식 및 출자증권 양도</p>
                            <p>발행회사:<b>${stockData?.ocsisTrf[idx]?.iscmp_cmpnm}</b></p>
                            <p>양도목적:<b>${stockData?.ocsisTrf[idx]?.trf_pp}</b></p>
                        </div>
                        `)
                    }
                    // 주권 관련 사채권 양수
                    if (stockData?.stkrtbdInh[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>주권 관련 사채권 양수</p>
                            <p>사채권(회차):<b>${stockData?.stkrtbdInh[idx]?.stkrtbd_kndn}(${stockData?.stkrtbdInh[idx]?.tm}회차)</b></p>
                            <p>양수목적:<b>${stockData?.stkrtbdInh[idx]?.inh_pp}</b></p>
                        </div>
                        `)
                    }
                    // 주권 관련 사채권 양도
                    if (stockData?.stkrtbdTrf[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>주권 관련 사채권 양도</p>
                            <p>사채권(회차):<b>${stockData?.stkrtbdTrf[idx]?.stkrtbd_kndn}(${stockData?.stkrtbdTrf[idx]?.tm}회차)</b></p>
                            <p>양도목적:<b>${stockData?.stkrtbdTrf[idx]?.trf_pp}</b></p>
                        </div>
                        `)
                    }
                    // 임원ㆍ주요주주 소유보고
                    if (stockData?.eleStock[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>임원ㆍ주요주주 소유보고</p>
                            <p>보고자(직위):<b>${stockData?.eleStock[idx]?.repror}(${stockData?.eleStock[idx]?.isu_exctv_ofcps})</b></p>
                            <p>주주:<b>${stockData?.eleStock[idx]?.isu_main_shrholdr}</b></p>
                            <p>소유 증가 수(비율):<b>${stockData?.eleStock[idx]?.sp_stock_lmp_irds_cnt}(${stockData?.eleStock[idx]?.sp_stock_lmp_irds_rate}%)</b></p>
                        </div>
                        `)
                    }
                    // 신규시설투자
                    if (stockData?.newFacill[idx]) {
                        tooltipArr.push(`
                        <div class='notice'>
                            <p class='title'>${stockData?.newFacill[idx].report_nm}</p>
                        </div>
                        `)
                    }
                    if (tooltipArr.length === 0) {
                        tooltipArr.push(`
                        <div class='tooltip'>
                            <p><span class='price'></span>종가<b>${closePrice[idx].toLocaleString()}원</b></p>
                            <p><span class='foreign'></span>외인지분<b>${foreignRatio[idx]}</b></p>
                        </div>
                    `);
                    }
                    return `<div class='dart_tooltip'>
                                ${dateHeader}
                                ${tooltipArr.join('<div class="line"></div>')}
                            </div>
                            `
                }
            },
            grid: [
                {
                    left: '5%',
                    right: '5%',
                    top: '12%',
                    height: '73%'
                }
            ],
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: stockData?.categoryData,
            },
            yAxis: [
                {
                    type: 'value',
                    name: '종가',
                    scale: true,
                    // min: minPrice - Math.pow(10, minPrice.toString().length - 1),
                },
                {
                    type: 'value',
                    name: '외인지분',
                    scale: true,
                    splitLine: {
                        show: false,
                    },
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    name: '종가',
                    type: 'line',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    data: closePrice,
                    label: {
                        show: true,
                        position: 'top',
                        distance: 0,
                        color: '#0F1291',
                        fontWeight: 'bold',
                        formatter: function (d: any) {
                            let labelArr = [];
                            if (stockData?.cvbdIsDecsn[d.dataIndex]) {
                                labelArr.push(`CB발행\n(${stockData?.cvbdIsDecsn[d.dataIndex]?.bd_tm}회차)`);
                            }
                            if (stockData?.bwbdIsDecsn[d.dataIndex]) {
                                labelArr.push(`BW발행\n(${stockData?.bwbdIsDecsn[d.dataIndex]?.bd_tm}회차)`);
                            }
                            if (stockData?.piicDecsn[d.dataIndex]) {
                                labelArr.push(`유증`);
                            }
                            if (stockData?.adjustCB[d.dataIndex]) {
                                labelArr.push(`CB조정\n(${stockData?.adjustCB[d.dataIndex].rount}회차)`);
                            }
                            if (stockData?.majorStock[d.dataIndex]) {
                                labelArr.push(`대량보유`);
                            }
                            if (stockData?.ocsisInh[d.dataIndex]) {
                                labelArr.push(`타법인 주식 양수`);
                            }
                            if (stockData?.ocsisTrf[d.dataIndex]) {
                                labelArr.push(`타법인 주식 양도`);
                            }
                            if (stockData?.stkrtbdInh[d.dataIndex]) {
                                labelArr.push(`사채권 양수`);
                            }
                            if (stockData?.stkrtbdTrf[d.dataIndex]) {
                                labelArr.push(`사채권 양도`);
                            }
                            if (stockData?.eleStock[d.dataIndex]) {
                                labelArr.push(`임원ㆍ주주 소유`);
                            }
                            if (stockData?.newFacill[d.dataIndex]) {
                                labelArr.push(`신규시설투자`);
                            }
                            if (labelArr.length !== 0) {
                                labelArr.push('↓')
                            }
                            return labelArr.join('\n');
                        }
                    },
                },
                {
                    name: '외인지분',
                    type: 'line',
                    yAxisIndex: 1,
                    showSymbol: false,
                    data: foreignRatio,
                    itemStyle: {
                        color: 'rgba(0, 0, 0, 0.2)'
                    },

                }
            ]
        };
    }, [stockData])

    // let timer: any = null;
    const onChartZoom = (e: any) => {
        // if (timer !== null) {
        //     clearTimeout(timer);
        // }
        // timer = setTimeout(function () {
        //  //do something
        // }, 150);
        if (e.batch) { //해당 차트에서 Zoom한 경우
            let cnadlechartDom = document.querySelector('.candleChart') as HTMLElement;
            let candleChart = echarts.getInstanceByDom(cnadlechartDom) as echarts.ECharts;
            let { start, end } = e.batch[0];
            candleChart.dispatchAction({
                type: 'dataZoom',
                start: start,
                end: end
            })
        }
    }

    const onClick = (e: any) => {
        // 전환사채 발행 결정
        if (stockData.cvbdIsDecsn[e.dataIndex]) {
            let rceptNo = stockData?.cvbdIsDecsn[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, 'CB', 'width=1300, height=1000, scrollbars=yes')
        }
        // 신주인수권부사채 발행 결정
        if (stockData.bwbdIsDecsn[e.dataIndex]) {
            let rceptNo = stockData?.bwbdIsDecsn[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, 'BW', 'width=1300, height=1000, scrollbars=yes')
        }
        // 유상증자 발행 결정
        if (stockData.piicDecsn[e.dataIndex]) {
            let rceptNo = stockData?.piicDecsn[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '유상증자', 'width=1300, height=1000, scrollbars=yes')
        }

        // 전환사채가의조정
        if (stockData.adjustCB[e.dataIndex]) {
            let rceptNo = stockData?.adjustCB[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, 'CB조정', 'width=1300, height=1000, scrollbars=yes')
        }

        // 주식등대량보유상황
        if (stockData.majorStock[e.dataIndex]) {
            let rceptNo = stockData?.majorStock[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '대량보유상황', 'width=1300, height=1000, scrollbars=yes')
        }

        // 타법인 주식 및 출자증권 양수 
        if (stockData.ocsisInh[e.dataIndex]) {
            let rceptNo = stockData?.ocsisInh[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '타법인 주식 양수', 'width=1300, height=1000, scrollbars=yes')
        }
        // 타법인 주식 및 출자증권 양도
        if (stockData.ocsisTrf[e.dataIndex]) {
            let rceptNo = stockData?.ocsisTrf[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '타법인 주식 양도', 'width=1300, height=1000, scrollbars=yes')
        }
        // 주권 관련 사채권 양수
        if (stockData.stkrtbdInh[e.dataIndex]) {
            let rceptNo = stockData?.stkrtbdInh[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '사채권 양수', 'width=1300, height=1000, scrollbars=yes')
        }
        // 주권 관련 사채권 양도
        if (stockData.stkrtbdTrf[e.dataIndex]) {
            let rceptNo = stockData?.stkrtbdTrf[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '사채권 양도', 'width=1300, height=1000, scrollbars=yes')
        }
        // 임원ㆍ주요주주 소유 보고
        if (stockData.eleStock[e.dataIndex]) {
            let rceptNo = stockData?.eleStock[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '임원ㆍ주요주주 소유 보고', 'width=1300, height=1000, scrollbars=yes')
        }
        // 신규시설투자
        if (stockData.newFacill[e.dataIndex]) {
            let rceptNo = stockData?.newFacill[e.dataIndex]?.rcept_no;
            window.open(`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`, '신규시설투자', 'width=1300, height=1000, scrollbars=yes')
        }
    }

    const onEvents = {
        'datazoom': onChartZoom,
        'click': onClick
    }

    return (
        <ReactECharts
            className={'lineChart'}
            option={getOption()}
            style={{ height: 'calc(100% - 400px)' }}
            onEvents={onEvents}
        />
    )
}

export default React.memo(LineChart)