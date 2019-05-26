// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './http/config'
import store from './store'
import base from './assets/js/base'
import Cookie from 'js-cookie'
import qs from 'qs'
import dynamicRouter from './router/dynamicRouter.js'
import excel from 'xlsx-json'
import excelTemp from './assets/js/excelTemp'
import meal from './assets/js/meal'
import printJS from 'print-js'
import {
    Pagination,
    Checkbox,
    DatePicker,
    Form,
    FormItem,
    Input,
    Col,
    CheckboxGroup,
    Tree,
    Select,
    Option,
    Tooltip,
    Upload,
    MessageBox,
    TimeSelect,
    TimePicker,
    InputNumber,
    Radio,
    RadioGroup,
    Dialog,
    Message,
    Switch
 } from 'element-ui'
import urls from './http/urls'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import './assets/css/app.less'
import './assets/css/elementUi.less'
Vue.config.productionTip = false
Vue.prototype.$baseApi = process.env.BASE_API
Vue.prototype.$axios = axios
Vue.prototype.$urls = urls
Vue.prototype.$printJS = printJS
Vue.prototype.$base = base
Vue.prototype.$excel = excel
Vue.prototype.$excelTemp = excelTemp
Vue.prototype.$meal = meal
Vue.prototype.qs = qs
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Col)
Vue.use(CheckboxGroup)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tooltip)
Vue.use(Upload)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Dialog)
Vue.use(Switch)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$message = Message



router.beforeEach((to, from, next) => {
    if (Cookie.get('token')) {
        if (to.path === '/') {
            // location.href = window.location.href.split('#')[0]
            next()
        } else {
            if(store.state.menuItem.length==0){
                let menu = localStorage.getItem('menuList')
                let menuList = JSON.parse(menu)
                let arr = []
                dynamicRouter.forEach(i=>{
                    menuList.forEach(j=>{
                        if(i.meta.roles[0]==j.keyCode){
                            arr.push({
                                path:i.path,
                                name:i.name,
                                title:j.zhCn,
                                icon: i.icon,
                                component:i.component,
                                parentId:j.parentId,
                                id: j.id
                            })
                        }
                        i.children.forEach(k=>{
                            if(k.meta.roles[0]==j.keyCode){
                                if(j.keyCode=="C6300"){
                                    let a = dynamicRouter.find(i=>i.meta.roles[0]=='C6000').children.find(j=>j.meta.roles[0]=='C6300').children
                                    arr.push({
                                        path:k.path,
                                        name:k.name,
                                        title:j.zhCn,
                                        component:k.component,
                                        parentId:j.parentId,
                                        id: j.id,
                                        children:a
                                    })
                                }else{
                                    arr.push({
                                        path:k.path,
                                        name:k.name,
                                        title:j.zhCn,
                                        component:k.component,
                                        parentId:j.parentId,
                                        id: j.id
                                    })
                                }
                            }
                        })
                    })
                })
                let arr1 = arr.filter(i=>i)
                arr1 = Object.values(base.formattingJson(arr1))
                router.addRoutes(arr1)
                store.dispatch('setMenu',arr1)
                next({ ...to, replace: true })
            }else {
                next()
            }
        }
    } else {
        if(to.path=='/'||to.path=='/experience'||to.path=='/retrievePassword'||to.path=='/appointmentSuccess'||to.path=='/retrievePasswordConfirm'){
            next()
        }else{
            location.href = window.location.href.split('#')[0]
            sessionStorage.setItem('redirectUrl',encodeURIComponent(location.href))
            next()
        }
    }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
