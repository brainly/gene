export const getHttpProtocol = (host: string) => {
  return host.includes('localhost:4200') ? `http://${host}` : `https://${host}`;
};
