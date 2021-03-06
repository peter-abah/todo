import {parse, format} from 'date-fns';

// clears all child nodes in an element
const clearElement = element => {
  while (element.lastChild) {
    element.lastChild.remove();
  }
};

// filters values in an object based on inclusion predicate 
// and returns a new object with values that pass the predicate
// the predicate takes two argument value and key.
const filterObject = (obj, predicate) => {
  return Object.keys(obj).reduce((res, key) => {
    if(predicate(obj[key], key)) res[key] = obj[key];
    return res;
  }, {});
};

// converts a date string in yyyy-MM-dd format to a date object
// returns string if it is falsey
const convertStrToDate = (dateStr) => {
  return dateStr && parse(dateStr, 'yyyy-MM-dd', new Date());
}

const formatDate = (date) => {
  return date ? format(date, 'yyyy-MM-dd') : '';
}

export default {clearElement, filterObject, convertStrToDate, formatDate};