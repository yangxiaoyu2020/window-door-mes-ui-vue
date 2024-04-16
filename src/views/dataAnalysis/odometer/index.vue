<template>
    <div id="main" style="width: 600px; height: 400px;"></div>
</template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import * as echarts from 'echarts';
  
  const cellSize = [80, 80];
  const pieRadius = 30;
  
  // 获取虚拟数据
  function getVirtualData() {
    const date = +echarts.time.parse('2017-02-01');
    const end = +echarts.time.parse('2017-03-01');
    const dayTime = 3600 * 24 * 1000;
    let data = [];
    for (let time = date; time < end; time += dayTime) {
      data.push([
        echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
        Math.floor(Math.random() * 10000)
      ]);
    }
    return data;
  }
  
  // 创建饼图系列
  const scatterData = getVirtualData();
  const pieSeries = scatterData.map((item, index) => {
    return {
      type: 'pie',
      id: 'pie-' + index,
      center: item[0],
      radius: pieRadius,
      coordinateSystem: 'calendar',
      label: {
        formatter: '{c}',
        position: 'inside'
      },
      data: [
        { name: 'Work', value: Math.round(Math.random() * 24) },
        { name: 'Entertainment', value: Math.round(Math.random() * 24) },
        { name: 'Sleep', value: Math.round(Math.random() * 24) }
      ]
    };
  });
  
  // 创建图表配置项
  const option = {
    tooltip: {},
    legend: {
      data: ['Work', 'Entertainment', 'Sleep'],
      bottom: 20
    },
    calendar: {
      top: 'middle',
      left: 'center',
      orient: 'vertical',
      cellSize: cellSize,
      yearLabel: {
        show: false,
        fontSize: 30
      },
      dayLabel: {
        margin: 20,
        firstDay: 1,
        nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      monthLabel: {
        show: false
      },
      range: ['2017-02']
    },
    series: [
      {
        id: 'label',
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 0,
        label: {
          show: true,
          formatter: function (params) {
            return echarts.time.format(params.value[0], '{dd}', false);
          },
          offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
          fontSize: 14
        },
        data: scatterData
      },
      ...pieSeries
    ]
  };
  
  // 在组件挂载后初始化 ECharts 实例
  onMounted(() => {
    const chartDom = document.getElementById('main');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      myChart.setOption(option);
    }
  });
  </script>
  
  <style>
  /* 根据需要添加样式 */
  </style>
  