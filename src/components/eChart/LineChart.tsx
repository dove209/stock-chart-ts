import React, { useCallback } from 'react'
import ReactECharts from 'echarts-for-react';
import { IStockData } from '../../../types/stockData';
import { time } from 'console';

type LineChartProps = {
    stockData: IStockData
    zoom: any
    setZoom: Function
}

const LineChart = ({ stockData, zoom, setZoom }: LineChartProps) => {
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
            animation: true,
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
    return (
        <ReactECharts
            option={getOption()}
            style={{ height: '200px' }}
        />
    )
}

export default LineChart