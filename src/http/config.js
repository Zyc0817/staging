import axios from 'axios'
import {Loading, Message} from 'element-ui'
import Cookie from 'js-cookie'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.BASE_API//开发
axios.defaults.timeout = 10 * 1000;
window.showLoading = () => {
    if (!window.$loading) {
        window.$loading = Loading.service({
            lock: true,
            text: '加载中',
            background: 'rgba(0,0,0,0.3)',
            spinner: 'loading',
        });
        window.$loading.$el.classList.add('fadeIn')
    }
};

window.hideLoading = () => {
    if (window.$loading) {
        window.$loading.close();
        window.$loading = null;
    }
};
// request全局拦截
axios.interceptors.request.use(config => {

    //加载进度条
    window.showLoading();

    let token = Cookie.get("token")
    if (token !== undefined) {
        config.headers['Authorization'] = 'Bearer ' + token
    }
    config.headers['Cache-Control'] = 'no-cache'
    config.headers['Pragma'] = 'no-cache'
    config.headers['Expires'] = -1
    return config
}, error => {
    //Loading hide

    window.hideLoading();
    return Promise.reject(error)
});

// // response全局拦截
axios.interceptors.response.use(response => {

    //Loading hide
    if (window.$loading) {
        window.$loading.close();
        window.$loading = null;
    }
    // code处理
    // const code = response.data.code;
    // // 203||服务端登录 && ....
    // if (code === 203) {
    //     Message({
    //         message: "登录已过期",
    //         type: 'error',
    //         duration: 5 * 1000
    //     });
    //     // 登出
    //     //Cookie.remove("token");
    //     Cookie.remove("hashToken");
    //     if (!location.href.includes('#/login')) {
    //         let login_url = '#/login';
    //         // console.log('isMengtian', isMengtian)
    //         if (isMengtian) {
    //             login_url = '#/login_mt';
    //         }
    //         location.href = login_url + '?redirectUrl=' + encodeURIComponent(location.href) + '&u=' + encodeURIComponent(Store.get('username'));
    //         location.reload();
    //     }
    // } else if (code === 299) {
    //     Message({
    //         message: response.data.message || "没有权限",
    //         type: 'error',
    //         duration: 5 * 1000
    //     });
    //     return Promise.reject(response.data)
    // } else {
    //     let $terrace = document.querySelector('.terrace');
    //     if ($terrace) {
    //         $terrace.classList.remove('hide');
    //     }
    //     //超过最大限制2000000字节
    //     if ((response.data.message || '').indexOf('超过最大限制') > -1) {
    //         Message({
    //             message: response.data.message,
    //             type: 'error'
    //         });
    //     }
        
    // }
    return response
}, error => {
    console.log(error.response.status)
    if(error.response.status==401) {
        location.href = window.location.href.split('#')[0]
        sessionStorage.setItem('redirectUrl',encodeURIComponent(location.href))
    }
    
    // router.push({path:'/',params:location.href})
    //Loading hide
    if (window.$loading) {
        window.$loading.close();
        window.$loading = null;
    }
    Message({
        message: "系统异常",
        type: 'error',
        duration: 5 * 1000
    });
    return Promise.reject(error.response)
});

export default axios