import { createRouter, createWebHistory } from 'vue-router';

import Posts from '../Posts.vue';
import Search2 from '../Search2.vue';
import Chat from '../Chat.vue';
import Chatbox from '../Chatbox.vue'; // One-on-one chat
import Settings from '../Settings.vue';
import Videos from '../Videos.vue';
import Viewer from '../Viewer.vue';

const routes = [
  {
    path: '/',
    name: 'Posts',
    component: Posts
  },
  {
    path: '/posts',
    name: 'PostsPage',
    component: Posts
  },
  {
    path: '/videos',
    name: 'Videos',
    component: Videos
  },
  {
    path: '/user/:username',
    name: 'UserProfile',
    component: Search2,
    props: true
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/chatbox/:userId/:username',
    name: 'Chatbox',
    component: Chatbox,
    props: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/viewer',
    name: 'Viewer',
    component: Viewer
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Example: Simple auth check (replace with real logic)
function isAuthenticated() {
  // Replace with actual auth check (e.g., from localStorage, Vuex, or API)
  return !!localStorage.getItem('userToken');
}

// Global navigation guard for protected routes
router.beforeEach((to, from, next) => {
  // Example: Protect /settings route
  if (to.path === '/settings' && !isAuthenticated()) {
    // Optionally emit a global notification event here
    window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: 'Please log in to access settings.' } }));
    return next('/');
  }
  // Emit loading event for route change
  window.dispatchEvent(new Event('route-loading'));
  next();
});

// Global error handler for navigation failures
router.onError((error) => {
  // Emit a global notification event for errors
  window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: error.message || 'Navigation error' } }));
});

// Optionally, listen for route changes to hide loading spinner
router.afterEach(() => {
  window.dispatchEvent(new Event('route-loaded'));
});

export default router;
