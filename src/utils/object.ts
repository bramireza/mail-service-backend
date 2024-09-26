/* eslint-disable @typescript-eslint/no-explicit-any */
export const groupBy = function<T>(xs: T[], key: keyof T | ((element: T) => string)):{ [x: string]: T[]; } {
  return xs.reduce(function(rv: any, x: T) {
    (rv[typeof key === 'function' ? key(x) : x[key]] = rv[typeof key === 'function' ? key(x) : x[key]] || []).push(x);

    return rv;
  }, {});
};

export const onlyUnique = (value: string, index: number, self: any) => self.indexOf(value) === index;

export const keyBy = <T = any>(arr: Record<string, T>[], key: string) => arr
  .reduce((prev: Record<string, T>, next)=> {
    const newKey = String(next[key]);

    prev[newKey] = next as any;

    return prev;
  }, {});