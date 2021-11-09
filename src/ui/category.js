import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js';

const category = (() => {
  const addEventListeners = () => {
    categoryBtns.forEach(btn => 
      btn.addEventListener('click', showCategory)
    );

    menuBtn.addEventListener('click', toggleSidebr)
  };

  const showCategory = event => {
    const category = event.target.getAttribute('data-category');
    toggleSidebr();
    PubSub.publish(eventTypes.SHOW_TODOS, {category});
  };

  const toggleSidebr = event => {
    sidebar.classList.toggle('sidebar--hidden')
  }

  const categoryBtns = [...document.querySelectorAll('.category')];
  const sidebar = document.querySelector('.sidebar');
  const menuBtn = document.querySelector('.menu-btn')
  addEventListeners();
})();

export default category;