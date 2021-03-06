$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 实现页码的库文件。
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear()
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());

        var hh = addZero(dt.getHours())
        var mm = addZero(dt.getMinutes())
        var ss = addZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 定义一个补零的函数
    function addZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()

    // -------------获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面结构
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页码函数，渲染分页。
                renderPage(res.total);
            }
        })
    }

    //------------- 获取文章分类的方法----
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类失败！')

                }
                // 调用模板渲染分类
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 让layui重新渲染表单的ui结构。
                form.render();
            }
        })
    }

    // -------------为筛选表单绑定submit事件---------
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的q参数，重新筛选渲染表格数据。
        initTable();
    })


    // ---------------页码--------------
    // 定义页码渲染函数
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条
            limits: [2, 3, 5, 10],
            curr: q.pagenum, //设置默认选中的页码。
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                // 把最新的页码值赋值到q参数中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 重新刷新页码,但是这样写会触发死循环。必须判断renderPage的执行方式。

                if (!first) {
                    initTable();
                }
            }
        });
    }

    // -----------------删除功能-------------
    // 通过代理的方式为删除绑定事件处理
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;

        // 获取到文章的id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg("删除失败！");
                    }
                    console.log(1);
                    layer.msg("删除成功！");
                    // 这里如果将一个页面的数据全部删除，那么就要把页码-1、否则页码跳转，但是数据不加载。
                    // 如果len==1,说明删除后，页面就没有数据了。
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1; 
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})