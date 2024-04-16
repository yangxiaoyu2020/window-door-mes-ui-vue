const exampleResFactoryItem = {
    id: "1",
    factoryName: "Example Factory",
    createTime: 1622462400, // 时间戳表示的创建时间
    updateTime: 1622462400, // 时间戳表示的更新时间
    status: 1,
    processNow: 50,
    details: [
        {
          content: 'Custom icon',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          color: '#0bbd87',
        },
        {
          content: 'Custom color',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87',
          children: [
            {
                content: 'Custom icon',
                timestamp: '2018-04-12 20:46',
                size: 'large',
                type: 'primary',
                color: '#0bbd87',
              },
              {
                content: 'Custom icon',
                timestamp: '2018-04-13 20:46',
                size: 'large',
                type: 'primary',
                color: '#0bbd87',
              }
          ]
        },
        {
          content: 'Custom size',
          timestamp: '2018-04-03 20:46',
          size: 'large',
        },
        {
          content: 'Custom hollow',
          timestamp: '2018-04-03 20:46',
          type: 'primary',
          hollow: true,
          children: [
            {
                content: 'Custom icon',
                timestamp: '2018-04-12 20:46',
                size: 'large',
                type: 'primary',
                color: '#0bbd87',
              },
              {
                content: 'Custom icon',
                timestamp: '2018-04-13 20:46',
                size: 'large',
                type: 'primary',
                color: '#0bbd87',
              }
          ]
        },
        {
          content: 'Default node',
          timestamp: '2018-04-03 20:46',
        },
      ]
};

module.exports = function (app, Mock) {
    app.post('/api/factory/index', (req, res) => {
        const { id } = req.body;
        console.log(exampleResFactoryItem);
        // 模拟用户名和密码验证逻辑
        if (id) {
            console.log(id);
            const mockData = Mock.mock({
                code: 200,
                message: 'ok',
                data: exampleResFactoryItem
            });
            res.json(mockData);
        } else {
            res.status(404).json({
                code: 404,
                message: '没有这个'
            });
        }
    });
};
