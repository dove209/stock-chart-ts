import React, { useCallback, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts";
import { isFoldState } from '../../recoil/isFold';
import { useRecoilValue } from 'recoil';

import { calculateMA } from '../../utils/MainData';
import { IStockData } from '../../../types/stockData';


type CandleChartProps = {
    stockData: IStockData;
}

const CandleChart = ({ stockData }: CandleChartProps) => {
    const isFold = useRecoilValue(isFoldState);
    const getOption = useCallback(() => {
        const upColor = '#ec0000';
        const downColor = '#0A7DF2';
        return {
            animation: false,
            legend: {
                top: 10,
                left: 'center',
                data: ['5일선', '10일선', '20일선', '60일선', '120일선']
            },
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
                    if (params[0].componentSubType === 'candlestick') {
                        return `
                        <div class='tooltip' data-color=${params[0].value[1] < params[0].value[2] ? `upColor` : `downColor`}>
                            <div class='header'>${params[0].name}</div>
                            <p><span></span>시가<b>${params[0].value[1].toLocaleString()}원</b></p>
                            <p><span></span>종가<b>${params[0].value[2].toLocaleString()}원</b></p>
                            <p><span></span>고가<b>${params[0].value[3].toLocaleString()}원</b></p>
                            <p><span></span>저가<b>${params[0].value[4].toLocaleString()}원</b></p>
                        </div>
                    `
                    }
                    else if (params[0].componentSubType === 'bar') {
                        return `
                        <div class='tooltip' data-color=${params[0].value[1] < params[0].value[2] ? `upColor` : `downColor`}>
                            <div class='header'>${params[0].name}</div>
                            <p><span></span>거래량<b>${params[0].value[1].toLocaleString()}</b></p>
                        </div>
                    `
                    }
                }
            },
            axisPointer: {
                label: {
                    backgroundColor: '#777'
                }
            },
            visualMap: {
                show: false,
                seriesIndex: 6,
                dimension: 2,
                pieces: [
                    {
                        value: -1,
                        color: downColor
                    },
                    {
                        value: 1,
                        color: upColor
                    }
                ]
            },
            grid: [
                {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    height: '50%'
                },
                {
                    left: '5%',
                    right: '5%',
                    bottom: '0%',
                    height: '28%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: stockData?.categoryData,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: stockData?.categoryData,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    min: 'dataMin',
                    max: 'dataMax'
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: false
                    }
                },
                {
                    name: '거래량',
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
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
                    name: '단위(원)',
                    type: 'candlestick',
                    data: stockData?.values,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: undefined,
                        borderColor0: undefined
                    },
                    dimensions: ['-', '시가', '종가', '고가', '저가'],
                    encode: {
                        x: 0,
                        y: [1, 2, 3, 4],
                        tooltip: [1, 2, 3, 4]
                    },
                },
                {
                    name: '5일선',
                    type: 'line',
                    showSymbol: false,
                    data: calculateMA(5, stockData),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: '10일선',
                    type: 'line',
                    showSymbol: false,
                    data: calculateMA(10, stockData),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: '20일선',
                    type: 'line',
                    showSymbol: false,
                    data: calculateMA(20, stockData),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: '60일선',
                    type: 'line',
                    showSymbol: false,
                    data: calculateMA(60, stockData),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: '120일선',
                    type: 'line',
                    showSymbol: false,
                    data: calculateMA(120, stockData),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: '거래량',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: stockData?.volumes,
                    encode: {
                        x: 0,
                        y: 5
                    }
                },
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
            let linechartDom = document.querySelector('.lineChart') as HTMLElement;
            let lineChart = echarts.getInstanceByDom(linechartDom) as echarts.ECharts;
            let { start, end } = e.batch[0];
            lineChart.dispatchAction({
                type: 'dataZoom',
                start: start,
                end: end
            })
        }

    }

    const onEvents = {
        'datazoom': onChartZoom
    }

    return (
        <ReactECharts
            className={'candleChart'}
            option={getOption()}
            style={{ height: '400px', width: isFold ? '100%' : 'calc(100% - 580px)', marginLeft: isFold ? '0px' : '580px' }}
            onEvents={onEvents}
        />
    )
}

export default React.memo(CandleChart)