import React, { useCallback, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts";

import { IStockData } from '../../../types/stockData';

type LineChartProps = {
    stockData: IStockData
}

const LineChart = ({ stockData }: LineChartProps) => {

    const getOption = useCallback(() => {
        let base = +new Date(1968, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let date = [];
        let data = [Math.random() * 300];
        for (let i = 1; i < 20000; i++) {
            var now = new Date((base += oneDay));
            date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
            data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        }
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
                }
            },
            grid: [
                {
                    left: '10%',
                    right: '8%',
                    top: '10%',
                    height: '50%'
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
                    symbol: 'none',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    data: closePrice
                }
            ]
        };
    }, [stockData])

    // const [candleChart, setCandleChart] = useState<any>();

    // useEffect(() => {
    //     let cnadlechartDom = document.querySelector('.candleChart') as HTMLElement;
    //     setCandleChart(echarts.init(cnadlechartDom))
    // }, [])

    // let timer: any = null;

    // const onChartZoom = (e: any) => {
    //     if (timer !== null) {
    //         clearTimeout(timer);
    //     }
    //     timer = setTimeout(function () {
    //         let candlechartDom = document.querySelector('.candleChart') as HTMLElement;
    //         let candleChart = echarts.init(candlechartDom);
    //         let start = (!e.batch) ? e.start : e.batch[0].start;
    //         let end = (!e.batch) ? e.end : e.batch[0].end;
    //         candleChart.dispatchAction({
    //             type: 'dataZoom',
    //             start: start,
    //             end: end
    //         })
    //     }, 150);
    //     let candlechartDom = document.querySelector('.candleChart') as HTMLElement;
    //     let candleChart = echarts.init(candlechartDom);
    //     let start = (!e.batch) ? e.start : e.batch[0].start;
    //     let end = (!e.batch) ? e.end : e.batch[0].end;
    //     candleChart.dispatchAction({
    //         type: 'dataZoom',
    //         start: start,
    //         end: end
    //     })
    // }

    // const onEvents = {
    //     'datazoom': onChartZoom
    // }

    return (
        <ReactECharts
            className={'lineChart'}
            option={getOption()}
            style={{ height: '200px' }}
        // onEvents={onEvents}
        />
    )
}

export default LineChart