
export function reduceObj (arr, obj = {}) {
  return arr.reduce((pre, next) => Object.assign(pre, next), obj);
}

export function trans (obj, pre) {

  if(Array.isArray(obj)) {
    return obj.map(v => trans(v, pre));
  } else {
    const d = Object.keys(obj).map(k => {
      let v = obj[k];
      return {
        [k]: {
          [pre]: v,
        },
      };
    }).reduce((pre, next) => {
      return Object.assign(pre, next);
    }, {});
    return d;
  }
}

export function groupToValue(group) {
  return reduceObj(group.map(obj => {
    return {
      [obj.key]: obj.value
    }
  }));
}

export function typeDefaultValueMap (t) {
  const m = {
    input: '',
    date: '',
    boolean: false,
  };
  const v = m[t]
  return v === undefined ? null : v;
}

export function getXY (e) {
  const operationWidth = 300;
  const bodyWidth = document.body.offsetWidth;

  var pageX = e.pageX - e.offsetX - e.currentTarget.offsetLeft;
  var direction = 'left';

  if (pageX < operationWidth) {
    direction = 'right';
  }

  return {
    direction,
  }
}
