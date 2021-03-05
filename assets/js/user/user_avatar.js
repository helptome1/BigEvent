$(function () {
    var layer = layui.layer;
    // ------------图片剪裁区-----------
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options);


    //------------------图片选择区---------

    $('#btnChooseImage').on('click', function () {
        // 打开文件上传选择框input
        $('#file').click();

        // ----更换剪裁区图片----
        $('#file').on('change', function (e) {
            // 1.拿到用户选择的图片。
            var file = e.target.files[0];
            // 2.根据选择的文件创建一个对应的URL地址,将文件转换成路径。
            var newImgURL = URL.createObjectURL(file);
            // 3.先销毁旧的剪裁区域，然后重新设置图片的路径。之后再创建新的区域。
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域

        })
    })

    // ----------------图片上传区------------
    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 将用户选择的图片转换成base64格式。
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            // 2.调用接口，把用户的头像上传到服务器
            $.ajax({
                method: 'POST',
                url: '/my/update/avatar',
                data: {
                    // 上传一个base64格式的图  
                    avatar: dataURL
                },
                success: function (res) {
                    if(res.status != 0) {
                        return layer.msg('更换头像失败！')
                    }
                    layer.msg('更换头像成功！')
                    // 再iframe子页面调用父页面的函数。
                    window.parent.getUserInfo();
                }
            })
    })
})