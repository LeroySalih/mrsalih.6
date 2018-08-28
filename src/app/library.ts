export function toDictionary<T>(arr: T[], fieldName: string): {[id: string]: T} {
  const dict: {[id: string]: T} = {};

  arr.forEach((item) => {
    dict[item[fieldName]] = item;
  });

  return dict;
}
