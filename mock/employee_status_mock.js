module.exports = function (app, Mock) {
    app.get('/employee/status', (req, res) => {
        const { data  } = req.body;
        console.log('/employee/status');
        const accessToken = req.headers['x-access-token'];
        
        // 模拟用户名和密码验证逻辑
        // export interface ResEmployeeStatus {
        //     label: string;
        //     value: number;
        //   }
        if (accessToken) {
            const mockData = Mock.mock({
                code: 200,
                message: 'ok',
                access_token: accessToken,
                data: [
                    {
                        "employeeLabel": "在工作",
                        "employeeVable": 1
                    },
                    {
                        "employeeLabel": "休假",
                        "employeeVable": 0
                    },
                ]
                
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
