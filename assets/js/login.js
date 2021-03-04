$(function () {
    // -----------点击去注册,切换到注册页面-------------
    $("#link_reg").on('click', function () {
        $(".reg-box").show();
        $(".login-box").hide();
    })

    $("#link_login").on('click', function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })

    // ---------------------表单校验---------------
    // 使用layui的校验规则对输入的用户名和密码,确认密码进行校验.
    // 从leyui中获取form对象
    var form = layui.form;
    // 从leyui中获取layer对象
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 要拿到确认输入的密码和密码框中的密码进行一次等号判断.
            var pwd = $('.reg-box [name = password]').val();
            if (pwd != value) {
                return "两次密码不一致"
            }
        }
    });

    // ---------------------账户注册 登录--------------

    // 监听注册表单提交
    $("#form_reg").on("submit", function (e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        // 2.发起ajax的post请求
        $.post('/api/reguser', {
            username: $(".reg-box [name=username]").val(),
            password: $(".reg-box [name=password]").val(),
        }, function (res) {
            if (res.status != 0) {
                return console.log(res.message);
            }
            layer.msg('注册成功');
            // 注册成功后直接跳转到登录界面.
            $("#link_login").click();
        });
    })

    // 监听登录表单的提交
    $("#form_login").on("submit", function (e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        // 2.发起ajax的post请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status != 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // 将登陆成功后的token值存入到localstorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = "/index.html"
            }
        })
    })

})