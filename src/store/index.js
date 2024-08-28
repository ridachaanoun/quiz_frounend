import { createStore } from 'vuex';
import auth from './modules/auth'; // Import the auth module
import categories from './modules/categories';
import quizzes from './modules/quizzes';

export default createStore({
  modules: {
    auth,
    categories, // Register the auth module
    quizzes,
  },
});
