export interface Chart {
    id: number;
    type: string;
    data: any[];
    options: {
      title: {
        text: string;
      };
      tooltip: object;
      xAxis: {
        data: any[];
      };
      yAxis: object;
      series: Array<{
        type: string;
        data: any[];
      }>;
    };
  }