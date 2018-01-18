import cloneDeep from 'lodash/cloneDeep';

export default function props2DataMixins (propsName, dataName, cb) {
  return {
    props: {
      [propsName]: {},
    },
    data () {
      return {
        [dataName]: cb ? cb(this[propsName]) : cloneDeep(this[propsName]),
      };
    },
    watch: {
      [propsName] (v, old) {
        this[dataName] = cb ? cb(v, old) : cloneDeep(v);
      },
    },
  };
}
