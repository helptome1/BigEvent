$(function () {
    // 调用方法获取用户基本信息
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录吗?', { icon: 3, title: '提示' },
            function (index) {
                //do something

                // 1.清空本地token
                localStorage.removeItem('token');
                // 2.跳转到登录界面
                location.href = '/login.html'
                // 关闭confirm询问框.
                layer.close(index);
            });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg("获取用户头像失败")
            }
            // console.log(res);
            //调用renderAvatar渲染用户的头像.
            renderAvatar(res.data);
        },
        
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户名
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 3.按需渲染用户的头像
    if (user.user_pic != null) {
        $('.layui-nav-img').attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var firstName = name[0].toUpperCase();
        $('.text-avatar').html(firstName).show();
    }
}
