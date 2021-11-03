import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';

const categoryDomManager = (() => {
  const addEventListeners = () => {
    categoryBtns.forEach(btn => 
      btn.addEventListener('click', showCategory)
    );
  };

  const showCategory = event => {
    const category = event.target.getAttribute('data-category');
    
    PubSub.publish(eventTypes.SHOW_TODOS, {category});
  };

  const categoryBtns = [...document.querySelectorAll('.categories__btn')];
})();

export default categoryDomManager;