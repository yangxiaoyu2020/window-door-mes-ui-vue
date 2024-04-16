module.exports = function (app, Mock) {
    app.post('/api/auth/login', (req, res) => {
        const { username, password } = req.body;
        // 模拟用户名和密码验证逻辑
        if (username === 'admin' && password === 'e10adc3949ba59abbe56e057f20f883e') {
            const mockData = Mock.mock({
                code: 200,
                message: '登录成功',
                data: {
                    userId: '@integer(10000, 99999)',
                    username: username,
                    token: '@guid'
                }
            });
            res.json(mockData);
        } 
        else  if (username === 'user' && password === 'e10adc3949ba59abbe56e057f20f883e') {
            const mockData = Mock.mock({
                code: 200,
                message: '登录成功',
                data: {
                    userId: '@integer(10000, 99999)',
                    username: username,
                    token: 'user_token'
                }
            });
            res.json(mockData);
        }
        else {
            res.status(401).json({
                code: 401,
                message: '用户名或密码错误'
            });
        }
    });
    app.post('/auth/logout', (req, res) => {
        const mockData = Mock.mock({
            code: 200,
            message: '成功',
            data: {
            }
        });
        res.json(mockData);
    });

};
