import Vue from "vue"
import Router from "vue-router"
import FilesManager from "components/home/FilesManager"
import Login from "components/login/index"
import Home from "components/home/index"

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "",
          name: 'home',
          component: FilesManager
        },
        {
          path: "files",
          name: 'files',
          component: FilesManager
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
  ]
})
