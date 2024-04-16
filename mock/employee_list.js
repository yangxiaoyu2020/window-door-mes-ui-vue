const readJsonData = require('./utils/readJsonData');

const filePath = "mock/mock_data/employ_list.json"

module.exports = function (app, Mock) {
    app.post('/api/employee/list', (req, res) => {
        const { pageNum, pageSize } = req.body;
        console.log('/employee/list');
        const accessToken = req.headers['x-access-token'];
        
        // 模拟用户名和密码验证逻辑
        if (accessToken) {
            readJsonData((err, employData) => {
                if (err) {
                    res.status(500).json({
                        code: 500,
                        message: '服务器错误'
                    });
                }
                else {
                    const mockData = Mock.mock({
                        code: 200,
                        message: 'ok',
                        access_token: accessToken,
                        data:                     {
                            "list": employData.slice((pageNum-1)*pageSize, pageNum*pageSize),
                            "pageNum": pageNum,
                            "pageSize": pageSize,
                            "total": 14
                        }    
                        
                    });
                    res.json(mockData);
                }
            }, filePath);
        }
        else {
            res.status(401).json({
                code: 401,
                message: '用户名或密码错误'
            });
        }

    });
};
