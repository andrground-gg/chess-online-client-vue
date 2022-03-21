import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import GamePage from '@/views/GamePage.vue';
import LeaderboardsPage from '@/views/LeaderboardsPage.vue';
import LeaderboardPage from '@/views/LeaderboardPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home, name: 'Home Page' },
  { path: '/profile/:username', component: ProfilePage, props: true, name: 'Profile' },
  { path: '/play', component: GamePage, name: 'Play Chess' },
  { path: '/play/:id', component: GamePage, props: true, name: 'Active chess game' },
  { path: '/leaderboard', component: LeaderboardsPage, name: 'Leaderboards' },
  { path: '/leaderboard/:mode/:page', component: LeaderboardPage, props: true, name: 'Leaderboard'},
  { path: '/:notFound(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _, next) => {
  if (to.name)
    document.title = to.name?.toString();
  next();
});

export default router;
