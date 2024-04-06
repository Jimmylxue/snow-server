export function generateNonceStr() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonceStr = '';
  for (let i = 0; i < 16; i++) {
    nonceStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonceStr;
}
