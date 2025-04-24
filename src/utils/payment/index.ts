const fs = require('fs');
const crypto = require('crypto');
import { resolve } from 'path';
/**
 * 生成支付时需要的 唯一订单id
 */
export function generateOutTradeNo(prefix = '') {
  // 获取当前时间戳（YYYYMMDDHHmmss格式）
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');

  // 生成4位随机数
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  // 组合成订单号（前缀 + 时间戳 + 随机数）
  return `${prefix}${timestamp}${randomNum}`;
}

const privateKey = `
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDMqReT1BLNR5V2
4c2ckXIfl8/I+b5lDG9iNKinv6rRC6B8IdGT1jLIagkLd3uzpuny79C1Jje8xooK
/IzV0a52Ijkjs7+qpTlvtduHPyeIZLhCCqiiROtYljif076wganrVRomNjuQc7zB
JFXWGGsGbqCp+pQtCNk0r08s6M+g5xM+mx8El66LTVFnzT1ResNXUGVtZjkqbipF
8UgSqn1/nmBUoCqrzAiTxeIQux8ng0fx1BcOCK1pi1N00z4bWAVX2Ls5QXzMiX7L
8QfOzgc6kvDDp2Fud225Oy8kcHcsODMB4TAyER9pJTQBOebhhKU9a+eq3/Tp6twD
gJCnDtPbAgMBAAECggEAcNPfna3S17zZF3sQwXolsmkdMi0M2+RpG3jwadpur2R7
izORuLDjuj1K0zmBxt8EJtwy8UsqezXxMHFeqxo31gSz/4y+47LG4WEer4cPok/0
jOQXZ64bGPFoMiSoAeLZ7FU0X1CSseY8bzY65Bb+GcOva0YrnlA8fqEPQzDuFkOQ
lcdY0onxNtxZJM/UcHwvNx2hf4Kxsor5nw5G3FOzJIrTzS1SWUry/wf6hTR6GgAU
ljR4GxwUdmzMQi5RUbbzM9SmtbsZ8NQ38lznc9zTqdJky8Bb5Mh90t3GrjZz/Tcg
tzOWOzvyQLuNMgAXpjgDoP34ayvPCEFb0N6f+ksoMQKBgQD62+pT1nL0JKCQ5cAh
mvCw1/LfL7BLb+sIAVCUad3dFi18mcp5KYK2pLT+OSCXGhiSOse6gd8rpnW+blPk
s2LPjmEIBwhBAJL/em6QUXE/8UzU6M8vUQd1YXYlOtuF+W6pvvAKoz12vZvGBmkL
ZmnXW3qzgspSew8OuY0nKOdBlQKBgQDQ2s4NeSU50kr4wkR611AD/cd9uveaVlxV
FdJNEiSXDqlUlojjwU9eebHG8GVaOEhwqFEshlnGySBciFtbuttI5fAxTTiDYAyZ
Qu+OimI1ls2i52fzC7Tobu2SNawcRDzyGLlqfodhNv7Z92CYxooiEM8G/+EvnmZS
yu6+adNDrwKBgFdv7bY5Kio01g6LNjPAaKKLMqleWumAYgCRTL/eQqm8ADDM/gjL
UjdNI5T03oosW2IkwNceS2ZQh/vPQsiVShykOOfuY48cnyATUZRV/s5V0fzoBMcu
TBY62U5SvI9vCIZ7+fkLOvI3VqNoOpbxpHSe+x60uMaVBAOS40NB+5EdAoGAZw4w
cnF+ruNXXxvs0nh/4RhOYXnqR1upv8o+tQzoxSjU4QpOjaOLWGDQGgvw1u3CwOQs
+b1pey8vKrmV6tNu9K+RL6Kc6iZw0Qc4Uaty/mJlIabxofn60F48F9MoE+KP+B2/
EA9TGeMbKc5o+bmt21VT8m48XVTZxKyh1Y8+Ub0CgYEA9xK+uEUodFeDhSJSzapA
ZOGCQRu8BJynQcIZJaMyRak7qlVG/RZBROPrBmXCUMyo8ldep7ij/7ZUnGYq9dbW
enxhbWLsTyMoJZUgGdC5oO6Qxr7uyIsSzKRqhVyr8Oeyibwq8OfE6b8vSmlrXheI
fPBY191106H9DAB6mIFQ958=
-----END PRIVATE KEY-----
`;

const privateKey2 = `
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAptpm+qvIDCh/9wjU26SQCK26ogYkBhDrYxnAaw2JbbBsp1oD
bHKk+1r381NeBUG2HEFAuU+Fr72u5ot3yKdzoF/FajAzQNKnm569/D3upKoi8mYB
aST15Uig8j8qoUW1U217LL0jEHlSnHV3lcaDTXqDpTRR4Bfz9IqOgJgFZ8/oTfEo
mSrjrLYef81Eyxr7ZIMQXEKKEK7V4UXKS0+/fDsiG/cXidhzt8UbTL9vqXqxM2+I
DImyO+FAc/tkBG55LmzxPto1Nq0WbnZzRM/wTzrd0I/8NlevxtFbphg4evlHjFNI
7+GrqR87ViEwuAJJ9Je5QQjct5YJfFRWiZ5CMQIDAQABAoIBAGBi/GhEgezcHIg1
ltlHaFlLGuxsRbUnYwM9phVxnXk7GJlYe2/TjpERjPkIqOC6hBwwadZjJORP3FCc
Mtc8PKRhjuZ377O7vU0915x2nnyLOGL1IE2AJ3iLi0ZFzTea0FPgg+5lWHM00s9F
YI6qPcGtS41M+xtMWwZiYE3TBBRibHiY8ugGyaNAhiMKehyW05uApjlIF55wwCGx
BkyESJpGRR/6853iHke6Ge+xVcMa9QmQdoH0QqL/8kT28PL568mJJr0Ow/83t4+d
Pe70YPzKAxgUnaDsHJqO+b8qH69AEs8rTI5h2Mon6pH+bJT66KUoiXhn+Kf+4LSs
henRP10CgYEA1QJSfuFOWVRjrg3N/rAIc/Ak84BTZavbyrkqBSuoTs9i/nMI/hOz
VxpDntg7Bx2Tctl6sZO3GioTxKdc/YYaTKci1TKBbeginpsqEQVgwkMCy8HpvUmR
fyAMqLwZC4h9+j+NiZtuoFJDTCgv+WYbasX+kWYEUM21bnSYuO7yEQsCgYEAyIdP
r9uzqPgzN34Tmx+CNTa16VjhBh+zkBtXRLDLhWBeIYxoYNJARD98Pb1XZdvpkZZW
Sk7MfaKo2/DomzyyyB/MbHWwAdFi3yb4y7uMJfyC1MzdUSNN3Vp579hJxHkJ+nN4
Ys76yfcEeVOLnvUT1Z0KKCdIWRdT1Lgi+X1itzMCgYBJUXlPzwGG4fNFj97d0X23
Wmt9nSgXkOYgi0eZbAOMzPmIF9R6kBFk49dur4Lx2g5Ms+r1gKC/0sfnIqxxX11i
EQ1+UNoYGJUB/uql3TIG68XkmKR50P7RwRhaZBRC0gJ6xrFTMjsL2ATuC88niyvY
vrn3FiRaI9RVZrDCxwxvLQKBgEXW4okEAqGBuAzGqztmkOnJoTehDdYdKmOxMgap
cGiGdKJIjX3THDDoz3ONQyglnEZpTqpYoV3MTfU0BT8zt6x9bqwDnQY1D7NalmIW
cqw0Mri8lQQSQKcsQLWo5aA466G/n5kCL1Qx5OwAjesRvhOyuvvbGpZ0ymyWqQ+t
fLkDAoGATcul1L8y5D/wNVP1GXbXMZfBsFP3bbqy8c+Ashm6g8OLm2mGNntd5Z6h
1KkID7Yksh+dZ6t7XaPBtGACXX5Eryr537JVvdX8hAVCp5HVtaN/9VBVP8Ka2e4s
VS/xeNgOMQ7uzhRPBJ8HiTmdI1nHhDnYQpGiBgQn0Z5RAkSvFMk=
-----END RSA PRIVATE KEY-----
`;

/**
 * 生成 调起支付的 paySign
 */
export async function generatePaySign(params: {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  prepay_id: string;
}) {
  const signStr =
    [
      params.appId,
      params.timeStamp,
      params.nonceStr,
      `prepay_id=${params.prepay_id}`,
    ].join('\n') + '\n';

  // 3. 使用 RSA-SHA256 签名
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signStr);
  const signature = signer.sign(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    'base64',
  );

  console.log('signature', signature);

  return signature;
}
