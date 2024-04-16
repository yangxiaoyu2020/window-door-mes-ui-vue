module.exports = function (app, Mock) {
    app.get('/health', (req, res) => {
        const currentTime = new Date();
        const mockData = Mock.mock({
            status: 'ok',
            message: 'Server is running smoothly',
            uptime: '@integer(100, 10000)', // 模拟服务运行时间，单位为秒
            currentTime: currentTime.toISOString() // 当前时间，以 ISO 格式返回

        });
        res.json(mockData);
    });
};