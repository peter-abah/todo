const clearElement = element => {
  while (element.lastChild()) {
    element.lastChild().remove();
  }
};

// filters values in an object based on inclusion predicate 
// and returns a new object with values that pass the predicate
// the predicate takes two argument value and key.
const filterObject = (obj, predicate) => {
  return Object.keys(obj).reduce((res, k) => {
    if(predicate(obj[key], key)) res[key] = obj[key];
    return res;
  }, {});
};

export default {clearElement, filterObject};