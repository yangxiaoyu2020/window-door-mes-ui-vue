


export interface ListItem {
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    description: string;
    status?: "primary" | "success" | "warning" | "info" | "danger";
    extra?: string;
  }
  
  export interface TabItem {
    key: string;
    name: string;
    list: ListItem[];
    emptyText: string;
  }
  
  export const noticesData: TabItem[] = [
    {
      key: "1",
      name: "alert.notify",
      list: [],
      emptyText: "alert.notify"
    },
    {
      key: "2",
      name: "alert.message",
      list: [
        {
          avatar: "",
          title: "杨晓宇 评论了你",
          description: "订单需要审核。",
          datetime: "今天",
          type: "2"
        },
        {
          avatar: "",
          title: "杨晓宇 回复了你",
          description: "快去看看财务",
          datetime: "昨天",
          type: "2"
        },
        {
          avatar: "",
          title: "标题",
          description:
            "请将鼠标移动到此处，以便测试超长的消息在此处将如何处理。本例中设置的描述最大行数为2，超过2行的描述内容将被省略并且可以通过tooltip查看完整内容",
          datetime: "时间",
          type: "2"
        }
      ],
      emptyText: "alert.message"
    },
    {
      key: "3",
      name: "alert.task",
      list: [
        {
          avatar: "",
          title: "第三方紧急变更",
          description:
            "没有备件了 快去下单",
          datetime: "",
          extra: "马上到期",
          status: "danger",
          type: "3"
        },
        {
          avatar: "",
          title: "",
          description: "指派杨晓宇于 2024-06-18 前完成订单审核",
          datetime: "",
          extra: "已耗时 8 天",
          status: "warning",
          type: "3"
        },
        {
          avatar: "",
          title: "异常",
          description: "出现问题",
          datetime: "",
          extra: "进行中",
          type: "3"
        },
        {
          avatar: "",
          title: "111号订单",
          description: "需要提醒客户付款",
          datetime: "",
          extra: "未开始",
          status: "info",
          type: "3"
        }
      ],
      emptyText: "alert.task"
    }
  ];