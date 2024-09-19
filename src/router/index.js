import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'; // Vuex store

// Import Views and Components
import Home from '@/views/HomeView.vue';
import UserLogin from '@/components/UserLogin.vue';
import UserRegister from '@/components/UserRegister.vue';
import Dashboard from '@/components/Dashboard_.vue';
import QuizDetailsView from '@/components/QuizDetailsView.vue';
import QuizQuestionView from '@/components/QuizQuestionView.vue';
import QuizResultView from '@/components/QuizResultView.vue';
import UserProfileView from '@/components/UserProfileView.vue';

// Define Routes
const routes = [
  { path: '/', component: Home, name: 'Home', meta: { requiresAuth: true } },
  { path: '/login', component: UserLogin, meta: { requiresAuth: false } },
  { path: '/register', component: UserRegister, meta: { requiresAuth: false } },
  { 
    path: '/dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true, requiresAdmin: true } // Add `requiresAdmin` meta
  },
  {
    path: '/quiz/:id',
    name: 'QuizDetails',
    component: QuizDetailsView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz/:id/question/:questionIndex',
    name: 'QuizQuestionView',
    component: QuizQuestionView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz/result',
    name: 'QuizResultView',
    component: QuizResultView,
    props: route => ({ score: Number(route.query.score) }),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId',
    name: 'UserProfileView',
    component: UserProfileView,
    meta: { requiresAuth: true }
  },
];

// Create Router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin']; // Use the isAdmin getter

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to /login');
      next('/login');
    } else {
      // If the route requires admin privileges, check if the user is an admin
      if (to.meta.requiresAdmin && !isAdmin) {
        console.log('User is not an admin, redirecting to /');
        next('/');  // Redirect to home if not an admin
      } else {
        next();  // Proceed if authenticated and has the required role
      }
    }
  } else {
    next();  // Proceed if no authentication is required
  }
});

export default router;
