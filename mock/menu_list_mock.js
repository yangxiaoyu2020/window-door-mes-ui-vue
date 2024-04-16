const readJsonData = require('./utils/readJsonData');

const userPath = "mock/mock_data/menu_list_user.json"

module.exports = function (app, Mock) {
    app.get('/api/menu/list', (req, res) => {
        console.log('/api/menu/list');
        const accessToken = req.headers['x-access-token'];
        let filePath = ""
        if (accessToken == "user_token") {
            filePath = "mock/mock_data/menu_list_user.json"
        }
        else {
            filePath = "mock/mock_data/menu_list_admin.json"
        }
        

        
        // 模拟用户名和密码验证逻辑
        if (accessToken) {
            const mockData = Mock.mock({
                code: 200,
                message: 'ok',
                access_token: accessToken,
                data: [{
                            "path": "/home/index",
                            "name": "home",
                            "component": "/home/index",
                            "meta": {
                            "icon": "HomeFilled",
                            "title": "首页",
                            "isLink": "",
                            "isHide": false,
                            "isFull": false,
                            "isAffix": true,
                            "isKeepAlive": true
                            }
                        },
                        {
                          "path": "/order",
                          "name": "订单管理",
                          "redirect": "/order/index",
                          "meta": {
                              "icon": "Menu",
                              "title": "订单",
                              "isLink": "",
                              "isHide": false,
                              "isFull": false,
                              "isAffix": false,
                              "isKeepAlive": true
                          },
                          "children": [
                              {
                                  "path": "/order/index",
                                  "name": "订单管理1",
                                  "component": "/factorytable/index",
                                  "meta": {
                                      "icon": "Menu",
                                      "title": "账号管理",
                                      "isLink": "",
                                      "isHide": false,
                                      "isFull": false,
                                      "isAffix": false,
                                      "isKeepAlive": true
                                  }
                              }
                          ]
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
