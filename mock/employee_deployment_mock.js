const deploymentData = [
    {
      id: "1",
      deploymentId: "东方总部",
      children: [
        { id: "11", deploymentId: "研发部" },
        { id: "12", deploymentId: "市场部" },
        { id: "13", deploymentId: "商务部" },
        { id: "14", deploymentId: "财务部" }
      ]
    },
    {
      id: "2",
      deploymentId: "南方总部",
      children: [
        { id: "21", deploymentId: "研发部" },
        { id: "22", deploymentId: "市场部" },
        { id: "23", deploymentId: "商务部" },
        { id: "24", deploymentId: "财务部" }
      ]
    },
    {
      id: "3",
      deploymentId: "西部工厂", // 或者改为总公司
      children: [
        { id: "31", deploymentId: "研发部" },
        { id: "32", deploymentId: "市场部" },
        { id: "33", deploymentId: "商务部" },
        { id: "34", deploymentId: "财务部" }
      ]
    }
  ];


module.exports = function (app, Mock) {
    app.get('/employee/deployment', (req, res) => {
        console.log('/employee/deployment');
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
                data: deploymentData
                
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
