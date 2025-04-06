import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Device from '../views/Device.vue'
import DeviceError from '../views/DeviceError.vue'

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/device',
    children: [
      { path: 'welcome', component: Welcome },
      { path: 'device', component: Device },
      { path: 'device-error', component: DeviceError }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 