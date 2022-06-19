import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { dateFormat } from '../utils/Date';
import { getStockDate, splitData, calculateMA } from '../utils/NaverParser';

import { useRecoilValue, useRecoilState } from 'recoil';
import { corpCodeState } from '../recoil/corpCode';
import { periodState } from '../recoil/period';
import { isSearchState } from '../recoil/isSearch';
const upColor = '#ec0000';
const downColor = '#00da3c';

interface IStockData {
    categoryData: string[]
    values: number[][]
    volumes: number[][]
}

const NaverStock = (): JSX.Element => {
 
    const corpCode = useRecoilValue(corpCodeState);
    const period = useRecoilValue(periodState);
    const [isSearching, setIsSearching] = useRecoilState(isSearchState)

    const [stockData, setStockData] = useState<IStockData>();

    useEffect(() => {
        const getNaverStockData = async () => {
            if (isSearching) {
                try {
                    const startTime = dateFormat(period?.startDate);
                    const endTime = dateFormat(period?.endDate);
                    const { data } = await axios.get(`naverAPI/siseJson.naver?symbol=${corpCode?.stock_code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=day`)
                    const rawData = getStockDate(data);
                    setStockData(splitData(rawData))
                    setIsSearching(false);
                } catch (e) {
                    console.log(e)
                }
            }
        }
        getNaverStockData()
    }, [isSearching])

    useEffect(() => {
        console.log(stockData)

    }, [stockData])

    const options = {
     animation: false,
      legend: {
        bottom: 10,
        left: 'center',
        data: ['MA5', 'MA10', 'MA20', 'MA30']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        }
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all'
          }
        ],
        label: {
          backgroundColor: '#777'
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false
          },
          brush: {
            type: ['lineX', 'clear']
          }
        }
      },
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
          colorAlpha: 0.1
        }
      },
      visualMap: {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: downColor
          },
          {
            value: -1,
            color: upColor
          }
        ]
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          height: '50%'
        },
        {
          left: '10%',
          right: '8%',
          top: '63%',
          height: '16%'
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
          name: 'Dow-Jones index',
          type: 'candlestick',
          data: stockData?.values,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: undefined,
            borderColor0: undefined
          },
          tooltip: {
            formatter: function (param: any) {
              param = param[0];
              return [
                'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                'Open: ' + param.data[0] + '<br/>',
                'Close: ' + param.data[1] + '<br/>',
                'Lowest: ' + param.data[2] + '<br/>',
                'Highest: ' + param.data[3] + '<br/>'
              ].join('');
            }
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: calculateMA(5, stockData),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(10, stockData),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'MA20',
          type: 'line',
          data: calculateMA(20, stockData),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'MA30',
          type: 'line',
          data: calculateMA(30, stockData),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: stockData?.volumes,
          
        }
      ]
      };
    return (
        <>
            <div>{corpCode?.corp_name} {corpCode?.corp_code} {corpCode?.stock_code}</div>
            {!!stockData &&
                <ReactECharts 
                    option={options} 
                    style={{height: '500px',}}
                />
            }

        </>

    )
}

export default NaverStock