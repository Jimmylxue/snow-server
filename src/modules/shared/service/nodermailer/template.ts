import { TSendMealParams, TSendVerificationParams } from './type';

export function getBaseTemplate({ subject, content }: TSendMealParams) {
  return `<!DOCTYPE HTML>
            <html>
            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>${subject}</title>
            </head>
            <body>
                <div class="mail-box">
                    ${content}
                </div>
                <div style="color:red;">test color</div>
            </body>
          </html>`;
}

/**
 * 获取 邮箱验证码 模板
 * @param
 * @returns
 */
export function getVerificationTemplate({ to, code }: TSendVerificationParams) {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>吉米前端</title>
    </head>
    <body>
      <div class="mail-box">
        ${to}，您好！ 我已经收到你的要求，本次验证码为<span style="color: red"
          >${code}</span
        >。有效期为10分钟。
        <p>
          如果您没有请求次代码，可忽略这封电子邮件。可能别人错误的输入您的邮件地址。
        </p>
      </div>
      <div>谢谢！</div>
      <p>吉米前端</p>
    </body>
  </html>`;
}
