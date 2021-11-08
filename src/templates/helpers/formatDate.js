const {format} = require('date-fns');

module.exports = (date) => {
  debugger
  return date ? format(date, 'yyyy-MM-dd') : '';
}