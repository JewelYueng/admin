import Vue from "vue"
import Router from "vue-router"
import FilesManager from "components/home/FilesManager"
import Home from "components/home/index"
import algorithmManager from "components/home/algorithmManager/index"
import userManager from "components/home/userManager"

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
        },
        {
          path: "methods",
          name: 'methods',
          component: algorithmManager
        },
        {
          path: "users",
          name: 'users',
          component: userManager
        }
      ]
    }
  ]
})
