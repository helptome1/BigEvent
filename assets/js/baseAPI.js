// 注意每次调用jquery的请求,post,get,ajax都会调用ajaxPrefilter函数
$.ajaxPrefilter(function (options) {
    // options是配置对象
    // 发起真的ajax请求之前,拼接其请求的跟路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})