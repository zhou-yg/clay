var storage = null;

export default {
  setStorage (s) {
    if (!s) {
      throw new Error('a');
    }
    if (!s.setData || !s.getData) {
      throw new Error('b');
    }
    storage = s;
  },
  getStorage () {
    return storage;
  }
};
