import { createRouter, createWebHistory } from 'vue-router'
import CreateCourse from '../views/CreateCourse.vue'
import ListCourses from '../views/ListCourses.vue'
import EditCourse from '../views/EditCourse.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: ListCourses,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateCourse,
    },
    {
      path: '/curso/editar/:id',
      name: 'edit',
      component: EditCourse,
    },
  ],
})

export default router
