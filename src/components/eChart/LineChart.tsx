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
                            ${stockData?.cvbdIsDecsn[idx]?.bd_tm}회차 [${stockData?.cvbdIsDecsn[idx]?.bd_knd}]<br>
                            총액 : ${stockData?.cvbdIsDecsn[idx]?.bd_fta}원<br>
                            전환가액 : ${stockData?.cvbdIsDecsn[idx]?.cv_prc}원<br>
                            최소전환가액 : ${stockData?.cvbdIsDecsn[idx]?.act_mktprcfl_cvprc_lwtrsprc}원<br>
                        `;
                    } else {
                        return `
                            <div class='tooltip'>
                                <p>종가<b>${closePrice[idx].toLocaleString()}원</b></p>
                            </div>
                        `;
                    }
                  }
            },
            grid: [
                {
                    left: '10%',
                    right: '8%',
                    top: '10%',
                    height: '75%'
                }
            ],
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: stockData?.categoryData,
            },
            yAxis: {
                type: 'value',
                min: minPrice - Math.pow(10, minPrice.toString().length - 1),
            },
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
                        color: 'rgb(255, 70, 131)',
                        formatter: function(d: any) {
                                if(stockData?.cvbdIsDecsn[d.dataIndex]?.bd_tm) {
                                    return `${stockData?.cvbdIsDecsn[d.dataIndex]?.bd_tm}회차`
                                } else {
                                    return ''
                                }

                        }
                    }
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

    const onEvents = {
        'datazoom': onChartZoom,
    }

    return (
        <ReactECharts
            className={'lineChart'}
            option={getOption()}
            style={{ height: '250px' }}
            onEvents={onEvents}
        />
    )
}

export default React.memo(LineChart)