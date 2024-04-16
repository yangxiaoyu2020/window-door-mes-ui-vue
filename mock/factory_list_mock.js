const generateData = () => {
    const data = [];
    for (let i = 0; i < 15; i++) {
        const factory = {
            id: `factory_${i + 1}`,
            factoryName: `Factory ${i + 1}`,
            createTime: Date.now(),
            updateTime: Date.now(),
            status: Math.random() < 0.5 ? 0 : 1, // 50% 的概率为 0 或 1
            processNow: Math.floor(Math.random() * 100), // 0 到 99 之间的随机数
            details: { foo: 'bar' } // JSON 格式的示例数据
        };
        data.push(factory);
    }
    return data;
};

const dataList = generateData();


module.exports = function (app, Mock) {
    app.post('/api/factory/list', (req, res) => {
        console.log("/factory/list");
        const {  pageNum, pageSize } = req.body;
        // 模拟用户名和密码验证逻辑
        console.log(pageNum);
        const accessToken = req.headers['x-access-token'];
        if (accessToken) {
            const mockData = Mock.mock({
                code: 200,
                message: '登录成功',
                data: {
                    "list": dataList.slice((pageNum-1)*pageSize, pageNum*pageSize),
                    "pageNum": pageNum,
                    "pageSize": pageSize,
                    "total": 15
                }    
            });
            res.json(mockData);
        } else {
            res.status(401).json({
                code: 401,
                message: '用户名或密码错误'
            });
        }
    });
};