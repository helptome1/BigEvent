// 注意每次调用jquery的请求,post,get,ajax都会调用ajaxPrefilter函数
$.ajaxPrefilter(function   (options) {
    // options是配置对象
    // 发起真的ajax请求之前,拼接其请求的跟路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口,设置headers请求头
    if (options.url.indexOf('/my/' != -1)) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    // complete函数,不管请求成功还是失败,都会执行,且返回一定的内容
    options.complete = function (res) {
        // console.log(res);
        // res.responseJSON可以拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.清空本地token
            localStorage.removeItem('token');
            // 2.跳转到登录界面
            location.href = '/login.html'
        }
    }
});