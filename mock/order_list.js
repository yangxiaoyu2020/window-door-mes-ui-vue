const fs = require('fs');


const itemdata =  {
        "orderId": 1,
        "orderName": "ORD-7182",
        "customerId": 6,
        "customerName": "liuwei",
        "projectName": "Project-732",
        "financeId": 8,
        "financeName": "zhouli",
        "auditorId": 9,
        "auditorName": "liuqiang",
        "technicianId": 10,
        "technicianName": "zhouli",
        "productionPlannerId": 6,
        "productionPlannerName": "liuwei",
        "warehouseManagerId": 7,
        "warehouseManagerName": "wangchen",
        "shippingManagerId": 8,
        "shippingManagerName": "zhouli",
        "status": "Pending",
        "prepaymentAmount": 350.00,
        "totalAmount": 1050.00,
        "deliveryDate": "2024-06-05",
        "creationDate": "2024-06-01T10:00:00.000+00:00",
        "lastUpdate": "2024-06-01T10:30:00.000+00:00",
        "list": [
            {
                "status": "Pending",
                "actionDate": "2024-05-25T15:08:11.000+00:00",
                "userId": 6,
                "userName": "liuwei",
                "notes": null
            },
            {
                "status": "Processing",
                "actionDate": "2024-05-27T15:08:11.000+00:00",
                "userId": 7,
                "userName": "wangchen",
                "notes": null
            },
            {
                "status": "Shipped",
                "actionDate": "2024-05-29T15:08:11.000+00:00",
                "userId": 8,
                "userName": "zhouli",
                "notes": null
            }
        ]
    }

module.exports = function (app, Mock) {
    app.get('/api/order/list', (req, res) => {
        const {  pageNum, pageSize, status } = req.query;
        console.log("/api/order/list");
        console.log(pageNum);
        console.log(pageSize)
        console.log(status)
        const accessToken = req.headers['x-access-token'];
        fs.readFile('mock/order_data.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading mock data file:', err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal Server Error'
                });
                return;
            }
        
            // 解析 JSON 数据
        const orderData = JSON.parse(data);
        const {list} = orderData;
        
        // 模拟用户名和密码验证逻辑
        if (accessToken) {
            const mockData = Mock.mock({
                code: 200,
                message: 'ok',
                access_token: accessToken,
                data: 
                    {
                        "list": list.slice((pageNum-1)*pageSize, pageNum*pageSize),
                        "pageNum":  Number(pageNum),
                        "pageSize": Number(pageSize),
                        "total": 14
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
    });

    app.get('/api/order/item', (req, res) => {
        console.log("/api/order/item");
        const {  orderId } = req.query;
        console.log(orderId);
        
        const accessToken = req.headers['x-access-token'];
        
        // 模拟用户名和密码验证逻辑
        if (accessToken) {
            const mockData = Mock.mock({
                code: 200,
                message: 'ok',
                access_token: accessToken,
                data: itemdata              
            });
            res.json(mockData);
        } else {
            res.status(401).json({
                code: 401,
                message: '用户名或密码错误'
            });
        }
        }
        );
    };


