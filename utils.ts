export const genPK = (str: string): string => {
  return str + Math.floor(Math.random() * 1000000000).toString();
};
