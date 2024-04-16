<template>
    <div ref="chart" style="width: 100%; height: 500px;"></div>
</template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  
  const chart = ref<any>(null);
  
  onMounted(() => {
    let base = +new Date(1988, 9, 3);
    const oneDay = 24 * 3600 * 1000;
    const data = [[base, Math.random() * 300]];
  
    for (let i = 1; i < 20000; i++) {
      const now = new Date((base += oneDay));
      data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
    }
  
    const options = {
      tooltip: {
        trigger: 'axis',
        position: (pt: any) => {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'center',
        text: 'Large Area Chart'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 20
        },
        {
          start: 0,
          end: 20
        }
      ],
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: data
        }
      ]
    };
  
    if (chart.value) {
      const myChart = echarts.init(chart.value);
      myChart.setOption(options);
    }
  });
  </script>
  
  <style scoped>
  /* Add your custom styles here */
  </style>
  