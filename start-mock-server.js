const fs = require('fs');
const path = require('path');
const express = require('express');
const Mock = require('mockjs');
const bodyParser = require('body-parser');

// 读取 mock_env 文件
const mockEnvPath = path.join(__dirname, 'mock_env.json');
const mockEnv = JSON.parse(fs.readFileSync(mockEnvPath, 'utf8'));

// 创建 Express 应用
const app = express();

const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:9001'
}));


const port = mockEnv.port || 3000; // 使用 mock_env 文件中的端口号，默认为 3000

// 获取 mock 文件夹路径
const mockFolderPath = path.join(__dirname, 'mock');

// 遍历 mock 文件夹下所有的 JavaScript 文件
fs.readdirSync(mockFolderPath).forEach(file => {
  // 判断文件是否为 JavaScript 文件
  if (file.endsWith('.js')) {
    const filePath = path.join(mockFolderPath, file);
    // 执行每个 JavaScript 文件
    require(filePath)(app, Mock);
    console.log(`Mock server started for file: ${file}`);
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
});
