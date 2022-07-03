import React, { useCallback, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts";

import { IStockData } from '../../../types/stockData';

type LineChartProps = {
    stockData: IStockData
}

const LineChart = ({ stockData }: LineChartProps) => {
    const getOption = useCallback(() => {
        let closePrice = stockData?.values.map((item) => item[1]);
        let foreignRatio  = stockData?.values.map((item) => item[5]);
        let minPrice = Math.min(...closePrice);

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
                formatter: function (params:any) {
                    let idx = params[0].dataIndex;
                    if (stockData?.cvbdIsDecsn[idx]) {
                        return `
                        <div class='dart_tooltip'>
                            <div class='header'>${params[0].name}</div>
                            <p>${stockData?.cvbdIsDecsn[idx]?.bd_tm}회차 [${stockData?.cvbdIsDecsn[idx]?.bd_knd}]</p>
                            <p>사채 총액:<b>${stockData?.cvbdIsDecsn[idx]?.bd_fta}원</b></p>
                            <p>시설자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_fclt}원</b></p>
                            <p>영업양수자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_bsninh}원</b></p>
                            <p>운영자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_op}원</b></p>
                            <p>채무상황자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_dtrp}원</b></p>
                            <p>타법인 증권 취득 자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_ocsa}원</b></p>
                            <p>기타자금:<b>${stockData?.cvbdIsDecsn[idx]?.fdpp_etc}원</b></p>
                            <p>전환가액:<b>${stockData?.cvbdIsDecsn[idx]?.cv_prc}원</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;최소전환가액:<b>${stockData?.cvbdIsDecsn[idx]?.act_mktprcfl_cvprc_lwtrsprc}원</b></p>
                            <p>전환청구기간: <b>${stockData?.cvbdIsDecsn[idx]?.cvrqpd_bgd} ~ ${stockData?.cvbdIsDecsn[idx]?.cvrqpd_edd}</b></p>
                        </div>
                        `;
                    } else if(stockData?.piicDecsn[idx]) {
                        return `
                        <div class='dart_tooltip'>
                            <div class='header'>${params[0].name}</div>
                            <p>증자방식:<b>${stockData?.piicDecsn[idx]?.ic_mthn}원</b></p>
                            <p>시설자금:<b>${stockData?.piicDecsn[idx]?.fdpp_fclt}원</b></p>
                            <p>영업양수자금:<b>${stockData?.piicDecsn[idx]?.fdpp_bsninh}원</b></p>
                            <p>운영자금:<b>${stockData?.piicDecsn[idx]?.fdpp_op}원</b></p>
                            <p>채무상황자금:<b>${stockData?.piicDecsn[idx]?.fdpp_dtrp}원</b></p>
                            <p>타법인 증권 취득 자금:<b>${stockData?.piicDecsn[idx]?.fdpp_ocsa}원</b></p>
                            <p>기타자금:<b>${stockData?.piicDecsn[idx]?.fdpp_etc}원</b></p>
                        </div>
                        `  
                    } else {
                        return `
                            <div class='tooltip'>
                                <div class='header'>${params[0].name}</div>
                                <p><span class='price'></span>종가<b>${closePrice[idx].toLocaleString()}원</b></p>
                                <p><span class='foreign'></span>외인지분<b>${foreignRatio[idx]}</b></p>
                            </div>
                        `;
                    }
                  }
            },
            grid: [
                {
                    left: '10%',
                    right: '8%',
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
                    min: minPrice - Math.pow(10, minPrice.toString().length - 1),
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
                        distance: 5,
                        color: '#0F1291',
                        fontWeight: 'bold',
                        formatter: function(d: any) {
                                let text = ''
                                if(stockData?.cvbdIsDecsn[d.dataIndex]) {
                                    text += `CB(${stockData?.cvbdIsDecsn[d.dataIndex]?.bd_tm}회차)`
                                } 
                                if(stockData?.piicDecsn[d.dataIndex]) {
                                    text += `\n유증`
                                }
                                return text;
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

    const onClick = (e:any) => {
        console.log(e)
    }

    const onEvents = {
        'datazoom': onChartZoom,
        'click': onClick
    }

    return (
        <ReactECharts
            className={'lineChart'}
            option={getOption()}
            style={{ height: '250px', marginBottom:'100px' }}
            onEvents={onEvents}
        />
    )
}

export default React.memo(LineChart)