1、使用 APPID 和 APPSecret 获取 access_token；

2、使用 access_token 获取 jsapi_ticket ；

3、用时间戳、随机数、jsapi_ticket 和要访问的 url 按照签名算法拼接字符串；

4、对第三步的字符串进行 SHA1 加密，得到签名。
