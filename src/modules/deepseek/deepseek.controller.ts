import { Controller, Get, Query } from '@nestjs/common';
import OpenAI from 'openai';
// const { Configuration, OpenAIApi } = require('openai');

// console.log('key', chatGpt.apiKey);
// const configuration = new Configuration({
//   apiKey: chatGpt.apiKey,
// });

// const openai = new OpenAIApi(configuration);

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-f58eafea48e641fc8f8d87d9027810f7',
});

type TUrlLinkQuery = {
  signature: string;
  nonce: string;
  timestamp: string;
  echostr: string;
};

@Controller('deepseek')
export class DeepSeekController {
  constructor() {}

  // JS安全域名配置
  @Get('/question')
  async question(@Query() req: TUrlLinkQuery) {
    // 429 是请求次数太多
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
      model: 'deepseek-chat',
    });

    console.log(completion.choices[0].message.content);

    return completion.choices[0].message.content;
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
