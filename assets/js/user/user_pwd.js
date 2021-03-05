$(function () {
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name = newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听form表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 取得数据的查询字符串，oldPwd=123123&newPwd=111111&rePwd=111111
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // form表单元素有一个reset()重置表单方法。但是需要是dom元素才可以
                // 所以需要把jquery对象[0]转为dom元素
                $('.layui-form')[0].reset();
            }
        })
    })
})