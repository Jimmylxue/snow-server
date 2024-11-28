// autocannon -c 10000 -d 10 -p 10 http://47.102.223.164:3000/user/login 压力测试

const axios = require('axios');

let config = {
  method: 'post',
  url: 'http://localhost:9998/link/upload',
  params: {
    // links: [
    //   "aaa",
    //   "https://detail.tmall.com/item.htm?spm=a21n57.sem.item.2.26ef3903V3Of8O&priceTId=214782b317315888608474132eb2ad&utparam=%7B%22aplus_abtest%22%3A%22af1eaa10ac90097ebbaa299cd2b7baf3%22%7D&id=706768759272&xxc=ad_ztc",
    //   "https://item.taobao.com/item.htm?spm=a21n57.sem.item.51.26ef3903V3Of8O&priceTId=214782b317315891600037243eb2ad&utparam=%7B%22aplus_abtest%22%3A%223af7a57eae99207961b6165fa57b1430%22%7D&id=846624170353&ns=1&abbucket=10#detail&xxc=taobaoSearch",
    //   "https://item.taobao.com/item.htm?spm=a21n57.sem.item.58.26ef3903V3Of8O&priceTId=214782b317315891600037243eb2ad&utparam=%7B%22aplus_abtest%22%3A%22ae4cd6c81c72a87535d097ea2a444a31%22%7D&id=848660741702&ns=1&abbucket=10#detail&xxc=taobaoSearch",
    //   "https://item.taobao.com/item.htm?spm=a21n57.sem.item.58.26ef3903V3Of8O&priceTId=214782b317315891600037243eb2ad&utparam=%7B%22aplus_abtest%22%3A%22ae4cd6c81c72a87535d097ea2a444a31%22%7D&id=848660741702&ns=1&abbucket=10#detail&xxc=taobaoSearch"
    // ],
    // links: [
    //   "bbb",
    //   "https://item.taobao.com/item.htm?spm=a21n57.sem.item.103.26ef3903V3Of8O&priceTId=214782b317315892186623044eb2ad&utparam=%7B%22aplus_abtest%22%3A%226c2d842d267a13990803847c70f83681%22%7D&id=713934533519&ns=1&xxc=ad_ztc",
    //   "https://item.taobao.com/item.htm?id=673166820970&spm=a21n57.sem.item.110.26ef3903V3Of8O&priceTId=214782b317315892186623044eb2ad&utparam=%7B%22aplus_abtest%22%3A%22c83b3decc3f88e8a327810e2dfd60de9%22%7D&xxc=ad_ztc",
    //   "https://detail.tmall.com/item.htm?spm=a21n57.sem.p4pright.2.4b863903ab2u24&priceTId=214782b317315892787267416eb2ad&utparam=%7B%22aplus_abtest%22%3A%229237289fcbf0987f2e0ef454eb41a752%22%7D&id=733069259166&ns=1&xxc=ad_ztc"
    // ],

    links: [
      'https://item.taobao.com/item.htm?id=836969595238&spm=a21n57.sem.item.147.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%22948a70867d2efc03eea03bb350757c8c%22%7D&&xxc=ad_ztc',
      'https://detail.tmall.com/item.htm?id=807737268574&spm=a21n57.sem.item.146.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%22bbeb73b47190b9ae6b255e359a5cb1f0%22%7D&xxc=ad_ztc',
      'https://item.taobao.com/item.htm?id=825974764142&spm=a21n57.sem.item.149.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%228a5f177fc83fcf57cf120025ff3c19c6%22%7D&xxc=ad_ztc',
      'https://detail.tmall.com/item.htm?id=835275480350&spm=a21n57.sem.item.153.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%22db6fc79ec33c28dc8111760421db6372%22%7D&xxc=ad_ztc',
    ],
    coin: 5,
    second: 20,
  },
};

const getConfig = () => {
  if (config.method === 'get') {
    return config;
  } else {
    return {
      method: 'post',
      url: config.url,
      data: config.params,
    };
  }
};

axios
  .request(getConfig())
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    // console.log("请求失败！", error.status, error?.response.statusText)
    console.log('请求失败！', error);
  });
