export const genPK = (str: string): string => {
  const d = new Date("January 01, 2020 00:00:00 GMT+00:00");
  const now = new Date();
  const milisecs = now.getTime() - d.getTime();
  return `${str}-${milisecs}`;
};
