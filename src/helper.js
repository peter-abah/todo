const clearElement = element => {
  while (element.lastChild()) {
    element.lastChild().remove();
  }
};

export default {clearElement}