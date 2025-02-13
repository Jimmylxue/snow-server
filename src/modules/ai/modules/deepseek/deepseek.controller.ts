import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

type TUrlLinkQuery = {
  signature: string;
  nonce: string;
  timestamp: string;
  echostr: string;
};

@Controller('deepseek')
export class DeepSeekController {
  constructor(private readonly configService: ConfigService) {}

  private readonly openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: this.configService.get('DEEPSEEK_API_KEY'),
  });

  // JS安全域名配置
  @Get('/question')
  async question(@Query() req: TUrlLinkQuery) {
    // 429 是请求次数太多
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
      model: 'deepseek-chat',
    });

    console.log(completion.choices[0].message.content);

    return completion.choices[0].message.content;
  }
}
