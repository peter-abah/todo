const {format} = require('date-fns');

module.exports = (date) => {
  return date ? format(date, 'yyyy-MM-dd') : '';
}