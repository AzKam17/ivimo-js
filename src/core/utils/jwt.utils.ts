export const ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 3; // 3 hours

export function getExpTimestamp(seconds: number) {
  const currentTimeMillis = Date.now();
  const secondsIntoMillis = seconds * 1000;
  const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;

  return Math.floor(expirationTimeMillis / 1000);
}
