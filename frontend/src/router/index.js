import {
	createRouter,
	createWebHistory
} from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('../views/Home.vue')
	},
	{
		path: '/device',
		name: 'Device',
		component: () => import('../views/Device.vue')
	},
	{
		path: '/error',
		name: 'Error',
		component: () => import('../views/Error.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
