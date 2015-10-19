/**
 * Created by nic on 2015/6/11.
 */

require.config({
    baseUrl: './',
    paths: {
        //test:'test.js',

        jquery: 'vendor/jquery/jquery.min.js',
        text: 'vendor/require/text',
        domReady: 'vendor/require/domReady',
        css: 'vendor/require/css.js',
        mmRouter: 'vendor/avalon/mmRouter.js',
        SysConfig: 'config/SysConfig.js',
        SysUtil: 'config/SysUtil.js',
        SysValue: 'config/SysValue.js',
        jsonp: 'vendor/jsonp/jsonp.js',
        md5: 'vendor/jquery/jquery.md5.js',
        Jcrop: 'vendor/jquery/jquery.Jcrop.min.js',
        layer: 'vendor/layer/layer.js',
        juicer: 'vendor/juicer/juicer.js',
        plupload: 'vendor/plupload/plupload.full.min.js',
        qiniu: 'vendor/qiniu/qiniu.min.js',

        myQiniu: 'vendor/myQiniu.js',
        Address: 'vendor/Address.js',
        unitTemp: 'vendor/Template.js',
        bank: 'vendor/bank.js',

        Zebar: 'vendor/zebra/zebra_datepicker.js',

        //登录页面
        login: 'pages/Other/login/main.js',

        //商品相关页面
        commodityList: 'pages/Commodity/commodityList/main.js',
        commodityAdd: 'pages/Commodity/commodityAdd/main.js',
        commodityAuthList: 'pages/Commodity/commodityAuthList/main.js'

    },
    priority: ['text', 'css'],
    shim: {
        jquery: {
            exports: "jQuery"
        },
        avalon: {
            exports: "avalon"
        },

        jsonp: ['jquery'],
        md5: ['jquery'],
        Jcrop: ['jquery', 'css!/static/css/jquery.Jcrop.min.css'],
        bank: ['css!/static/css/bank.css'],
        Zebar: ['jquery'],
        myQiniu: ['qiniu', 'plupload']
    }
});

require(['avalon', "SysUtil?v=fqwff", "SysConfig", 'mmRouter', 'main?201sdg436g', "domReady!", "Zebar", "jsonp", 'md5'], function (avalon, SysUtil, SysConfig) {

    require(['login?2015071sg6',
        'commodityList?20151017gerheS',
        'commodityAdd?20151017fsdfS',
        'commodityAuthList?20151017BS',
        'layer',
        "css!./static/css/skin/layer.css",
        "css!./vendor/zebra/css/bootstrap.css",
        "ready!"], function () {
        avalon.router.error(function () {
            require(["text!./static/template/404.html"], function (not_found) {
                avalon.templateCache.not_found = not_found;
                avalon.vmodels.root.bodyPage = "not_found";
            });
        });
        $.jsonp({
            //url: SysConfig.ApiUrl + "V3.0.0/User/login",
            url: SysConfig.ApiUrl + "V3.0.0/CompanyManage/login?_method=GET",
            callbackParameter: "callback",
            success: function (data) {
                data = JSON.parse(data);
                console.dir(data);
                SysUtil.RoleCheck(data);
                avalon.history.start({
                    basepath: "/"
                });
            },
            error: function () {
                layer.msg('您的网络连接不太顺畅哦');
                layer.closeAll('loading');
            }
        });
        avalon.scan(document.body);
    });
});
