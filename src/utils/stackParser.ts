/**
 * 解析 错误 并通过sourcemap定位原来错误位置
 */

const ErrorStackParser = require('error-stack-parser');
const { SourceMapConsumer } = require('source-map'); // 根据压缩过的错误信息 找回原来的错误信息
const path = require('path');
const fs = require('fs');

export class StackParser {
  sourceMapDir: string = '';
  consumers: any = {};
  constructor(sourceMapDir: string) {
    this.sourceMapDir = sourceMapDir;
    this.consumers = {};
  }

  parseStackTrack(stack, message) {
    // 生成新的错误信息
    const error = new Error(message);
    error.stack = stack;
    const stackFrame = ErrorStackParser.parse(error);
    return stackFrame;
  }

  async getOriginalErrorStack(stackFrame) {
    const origin = [];
    for (let v of stackFrame) {
      origin.push(await this.getOriginPosition(v));
    }

    return origin;
  }

  async getOriginPosition(stackFrame) {
    // 将新的错误信息定位到 sourcemap 中
    let { columnNumber, lineNumber, fileName } = stackFrame;
    console.log(columnNumber, lineNumber, fileName);
    /**
     * path.basename(fileName) 返回 一个 uri 的最后指向的文件
     *  如 fileName = http://127.0.0.1:5500/react-sample/build/static/js/main.js
     *  结果会返回：main.js
     */
    fileName = path.basename(fileName);
    // 判断consumer是否存在
    let consumer = this.consumers[fileName];
    if (consumer === undefined) {
      // 读取sourcemap
      const sourceMapPath = path.resolve(this.sourceMapDir, fileName + '.map');
      // 判断文件是否存在
      if (!fs.existsSync(sourceMapPath)) {
        return stackFrame;
      }
      const content = fs.readFileSync(sourceMapPath, 'utf-8'); // 读取sourcemap源文件
      consumer = await new SourceMapConsumer(content, null);
      this.consumers[fileName] = consumer;
    }
    const parseData = consumer.originalPositionFor({
      line: lineNumber, // 找到对应的行
      column: columnNumber, // 找到对应的列
    });
    return parseData;
  }
}
