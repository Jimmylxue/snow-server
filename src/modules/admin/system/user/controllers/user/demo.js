// 定义要发送的数据
const data = {
  id: '173137', // 替换为实际的 id
  password: '26096312', // 替换为实际的 password
  noEncrypt: true,
};

function request() {
  // 发送 POST 请求
  fetch('http://127.0.0.1:9999/user/login_by_id', {
    // fetch('http://112.124.42.218:9999/user/login_by_id', {
    method: 'POST', // 请求方法
    headers: {
      'Content-Type': 'application/json', // 指定请求体的内容类型
    },
    body: JSON.stringify(data), // 将数据转换为 JSON 字符串
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('网络响应不正常');
      }
      return response.json(); // 解析 JSON 响应
    })
    .then((data) => {
      console.log('成功:', data); // 处理成功响应
    })
    .catch((error) => {
      console.error('错误:', error); // 处理错误
    });
}

request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
