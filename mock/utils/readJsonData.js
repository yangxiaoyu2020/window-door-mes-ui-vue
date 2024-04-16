// readOrderData.js

const fs = require('fs');

// 封装读取文件的函数
function readJsonData(callback, path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading mock data file:', err);
            callback(err, null);
            return;
        }
        callback(null, JSON.parse(data));
    });
}

module.exports = readJsonData;