
export function reduceObj (arr) {
  return arr.reduce((pre, next) => Object.assign(pre, next), {});
}

export function trans (obj, pre) {
  const d = Object.keys(obj).map(k => {
    return {
      [k]: {
        [pre]: obj[k],
      },
    };
  }).reduce((pre, next) => {
    return Object.assign(pre, next);
  }, {});
  return d;
}
