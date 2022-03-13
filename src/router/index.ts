import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import GamePage from '@/views/GamePage.vue';
import LeaderboardsPage from '@/views/LeaderboardsPage.vue';
import LeaderboardPage from '@/views/LeaderboardPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  { path: '/profile/:username', component: ProfilePage, props: true },
  { path: '/play', component: GamePage },
  { path: '/play/:id', component: GamePage, props: true },
  { path: '/leaderboard', component: LeaderboardsPage },
  { path: '/leaderboard/:mode/:page', component: LeaderboardPage, props: true},
  { path: '/:notFound(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
