$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 定义文章的发布状体
    var art_state = '已发布';

    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法。
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                console.log(res);
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用form.render()方法。
                // 用来高速layui重新渲染
                form.render();
            }
        })
    }
    //----------------图片裁剪区域-------------
    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    //---------------封面图片------------
    // 为选择封面的按钮，绑定事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    // 监听input：file的change事件，获取用户上传的图片
    $('#coverFile').on('change', function (e) {

        // 1.获取用户选择的文件
        var file = e.target.files[0];
        // 判断用户时候选择了图片
        if (file.length === 0) {
            return layer.msg("请选择图片");
        }
        // 2. 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(file);

        // 3.先`销毁`旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //------------------  草稿按钮 ------------
    // 为存为草稿按钮，绑定点击事件处理函数
    // 修改art_state的值
    $('#btnSave2').on('click', function (e) {
        // 注意这里不能清空草稿按钮的默认提交属性，否则会失去提交功能。
        art_state = '草稿';
    })

    // -------------------提交事件--------------
    $('#form-pub').on('submit', function (e) {
        console.log(e);
        // 1. 阻止表单的默认提交行为
        e.preventDefault();

        //2.基于form表单快速创建一个formdata对象， FormData对象要接受一个dom对象
        var fd = new FormData($(this)[0]);

        // 3.把文章的发布状态，添加到fd对象中
        fd.append('state', art_state);

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个Canvas画图
                width: 400,
                height: 200
            })
            .toBlob(function (blob) {
                // 把cover_img数据添加到fd数据中
                fd.append('cover_img', blob);
                // 6.发起ajax请求
                publishArticle(fd);
            })
    });
    // 定义发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果像服务器提交的是formdata格式的数据
            // 必须添加一下两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if(res.status != 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // 成功后跳转到文章列表页面。
                location.href = '/article/art_list.html';
            }
        })
    }
})