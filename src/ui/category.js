import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js';

const category = (() => {
  const addEventListeners = () => {
    categoryBtns.forEach(btn => 
      btn.addEventListener('click', showCategory)
    );
  };

  const showCategory = event => {
    const category = event.target.getAttribute('data-category');
    
    PubSub.publish(eventTypes.SHOW_TODOS, {category});
  };

  const toggleSidebr = event => {
    
  }

  const categoryBtns = [...document.querySelectorAll('.category')];
  const sidebar = document.querySelector('.sidebar')
  addEventListeners();
})();

export default category;