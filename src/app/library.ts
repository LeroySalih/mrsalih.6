export function toDictionary<T>(arr: T[], fieldName: string): {[id: string]: T} {
  const dict: {[id: string]: T} = {};

  arr.forEach((item) => {
    dict[item[fieldName]] = item;
  });

  return dict;
}



export function countByClassification <T>(data: T[], classifier: (t: T) => string) {

  const result: {[id: string]: number} = {};

  data.forEach((item: T) => {
    if (result[classifier(item)] === undefined) {
      result[classifier(item)] = 0;
    }
    result[classifier(item)] += 1;
  });

  return result;
}

export function sumByClassification <T>(data: T[],
          classifier: (t: T) => string,
          value: (t: T) => number) {

  const result: {[id: string]: number} = {};

  data.forEach((item: T) => {
    if (result[classifier(item)] === undefined) {
      result[classifier(item)] = 0;
    }
    result[classifier(item)] += value(item);
  });

  return result;
}
