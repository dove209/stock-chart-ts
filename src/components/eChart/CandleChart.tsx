import React, { useCallback, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts";

import { calculateMA } from '../../utils/NaverParser';
import { IStockData } from '../../../types/stockData';


type CandleChartProps = {
    stockData: IStockData;
}

const CandleChart = ({ stockData }: CandleChartProps) => {
    const getOption = useCallback(() => {
        const upColor = '#ec0000';
        const downColor = '#0A7DF2';
        return {
            animation: false,
            legend: {
                bottom: 10,
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
                    left: '10%',
                    right: '8%',
                    top: '10%',
                    height: '50%'
                },
                {
                    left: '10%',
                    right: '8%',
                    top: '65%',
                    height: '25%'
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
                        show: true
                    }
                },
                {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false }
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
            style={{ height: '500px' }}
            onEvents={onEvents}
        />
    )
}

export default React.memo(CandleChart)