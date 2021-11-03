

const categoryDomManager = (() => {
  const addEventListeners = () => {
    categoryBtns.forEach(btn => 
      btn.addEventListener('click', showCategory)
    );
  };

  const showCategory = event => {
    const category = event.target.getAttribute('data-category');
    let todos = categoryFuncs[category]();

    showTodos(todos);
  };

  const categoryFuncs = {
    all: allTodos,
    today: todayTodos,
    tommorow: tommorowTodos,
    next7days: nextNDays(7);
  };

  const categoryBtns = [...document.querySelectorAll('.categories__btn')];
})();

export default categoryDomManager