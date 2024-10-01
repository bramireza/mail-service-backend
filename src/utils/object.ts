export const groupBy = <T>(arr: T[], key: keyof T | ((elem: T) => string)): Record<string, T[]> => arr.reduce<Record<string, T[]>>((acc, item) => {
  const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    
  if(!acc[groupKey]) 
    acc[groupKey] = [];
    
  acc[groupKey].push(item);
    
  return acc;
}, {});


export const onlyUnique = <T>(value: T, index: number, self: T[]): boolean => self.indexOf(value) === index;

export const keyBy = <T extends Record<string, unknown>, K extends keyof T>(arr: T[], key: K): Record<string, T> => arr
  .reduce((acc: Record<string, T>, item: T) => {
    const newKey = String(item[key]);

    acc[newKey] = item;

    return acc;
  }, {});