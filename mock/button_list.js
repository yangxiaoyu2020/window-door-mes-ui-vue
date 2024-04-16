module.exports = function (app, Mock) {
    app.get('/api/menu/buttons/list', (req, res) => {
        const { data  } = req.body;
        console.log('/api/buttons/list');
        const accessToken = req.headers['x-access-token'];
        
        // 模拟用户名和密码验证逻辑
        if (accessToken) {
            const mockData = Mock.mock({
                code: 200,
                message: 'ok',
                access_token: accessToken,
                data: {
                    "authButton": ["add", "edit", "delete", "import", "export"]
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
