$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 弹出层的index。
    var indexAdd = null;
    initArtCateList();
    //----------- 获取文章分类的列表-----------
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //--------- 为添加类别按钮绑定点击事件--------
    $('#btnAddCate').on('click', function () {
        // layer.open返回一个弹出层索引。
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类型',
            content: $('#dialog-add').html()
        });

    })

    // 因为是动态的添加的form表单，使用代理的形式给它添加submit事件。

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('新增分类失败！')
                }

                layer.msg('新增分类成功！')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd);

                initArtCateList();
            }
        })
    })
    var indexEdit = null;
    // 通过代理的形式，为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层。
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类型',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        // -----------编辑按钮发起请求-----------
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                // 快速给form赋值，form表单需要设置lay-filter属性
                form.val('form-edit', res.data);
            }
        })
    })

    // ------------点击确认修改按钮发起ajax请求--------
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('更新分类数据失败！')
                }

                layer.msg('更新分类数据成功！')
                // 根据索引关闭对应的弹出层
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // ------------------删除功能----------------
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function (index) {
            //发起ajax请求删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg('删除分类数据失败！')
                    }
                    layer.msg('删除分类数据成功！')
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })


})