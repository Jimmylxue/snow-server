import { Controller, Get, Query } from '@nestjs/common';
// const { Configuration, OpenAIApi } = require('openai');

// console.log('key', chatGpt.apiKey);
// const configuration = new Configuration({
//   apiKey: chatGpt.apiKey,
// });

// const openai = new OpenAIApi(configuration);

type TUrlLinkQuery = {
  signature: string;
  nonce: string;
  timestamp: string;
  echostr: string;
};

@Controller('gpt')
export class GptController {
  constructor() {}

  // JS安全域名配置
  @Get('/question')
  async question(@Query() req: TUrlLinkQuery) {
    // 429 是请求次数太多
    // const response = await openai.createCompletion(
    //   {
    //     model: 'text-davinci-003',
    //     prompt: 'Say this is a test',
    //     temperature: 0,
    //     max_tokens: 7,
    //   },
    //   {
    //     // timeout: 1000,
    //     // headers: {
    //     //   'Example-Header': 'example',
    //     // },
    //     // proxy: {
    //     //   host: '127.0.0.1',
    //     //   port: 7890,
    //     // },
    //   },
    // );
    // console.log({ openai });
    // return {
    //   code: 200,
    //   result: response,
    // };
  }
}
