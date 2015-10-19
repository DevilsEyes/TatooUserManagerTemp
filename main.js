/**
 * Created by nic on 2015/6/10.
 */


define(['avalon', 'mmRouter', 'SysConfig', 'SysValue', 'SysUtil', 'unitTemp', 'juicer'], function (avalon, mmRouter, SysConfig, SysValue, SysUtil, unitTemp, juicer) {

    $('.main').css('min-height', $('.sidebar').height() + 200);
    avalon.log("加载avalon完毕，开始构建根VM与加载其他模块");
    avalon.templateCache.empty = " ";
    var model = avalon.define({
        $id: "root",
        bodyPage: 'empty',
        companyRole:0,
        role: 0,
        temprole: 0,
        menus: [


            {
                title: "商品",
                icon: 'yen',
                role: 5,
                url: '#!/commodityList/',
                submenus: [
                    {
                        title: "商品 - 列表",
                        url: "#!/commodityList/",
                        name: 'commodityList',
                        role: 5,
                        visible:true
                    },
                    {
                        title: "审核列表",
                        url: "#!/commodityAuthList/",
                        name: 'commodityAuthList',
                        role: 5,
                        visible:true
                    },
                    {
                        title: "编辑/新增",
                        url: "#!/commodityAdd/",
                        name: 'commodityAdd',
                        role: 5,
                        visible:true
                    }
                ]
            }
        ],
        api: SysConfig.ApiUrl,
        apis: [
            ['正式服', SysValue.ApiUrlMain],
            ['测试服', SysValue.ApiUrlTest]
        ],
        logined: false,

        tab: function ($event, role, url) {
            model.role = role;
            location.hash = url;
        },

        creat$input: function (object) {
            return '<input type="text" ms-duplex="' + object['ms-duplex'] + '"/><div>{{' + object['bind'] + '}}</div>';
        },

        creat$button: function (object) {
            var icon, title, skin, myclass, id, visible, click;
            icon = object.icon;
            title = object.title;
            skin = object.skin;
            myclass = object['class'];
            id = object.id;
            visible = object.visible;
            click = object.click;

            return unitTemp.button.render({
                icon: icon,
                title: title,
                skin: skin,
                myclass: myclass,
                id: id,
                visible: visible,
                click: click
            });
        },

        creat$page: function (obj) {
            // {
            //  page:页码变量名,
            //  max:最大值变量名,
            //  geiList:拉取列表函数名
            // }
            if (obj) {
                return unitTemp.page.render({
                    page: obj.page ? obj.page : 'page',
                    max: obj.max ? obj.max : 'Maxpage',
                    getList: obj.getList ? obj.getList : 'getList'
                });
            } else {
                return unitTemp.page.render({
                    page: 'page',
                    max: 'Maxpage',
                    getList: 'getList'
                });
            }
        },

        creat$fromItem: function (obj) {
            // {
            //  key:键值,
            //  link:跳转链接,
            //  value:值的字段/vm绑定函数,
            //  msif:显示条件
            //  filter:过滤器
            //  width:key的宽度(1-12,默认2)
            // }
            if(obj.width){
                obj.pw=12-obj.width;
                obj.lw=obj.width;
            }else{
                obj.pw=10;
                obj.lw=2;
            }
            return unitTemp.formItem.render(obj);
        },

        creat$icon: function (icon) {
            return "<span class='glyphicon glyphicon-" + icon + "' aria-hidden='true'></span>";
        },

        filter$index: function (index, page, limit) {
            if (page && limit)return ((page - 1) * limit + (+index) + 1);
            else return (+index) + 1;
        },

        f$current: function (str) {
            if ((+str) != NaN)return str + ' ￥';
            return '-';
        },
        f$none: function (str) {
            if (!str) return '-';
        }

    });
    model.$watch("api", function (newV, oldV) {
        if (newV != "")SysConfig.ApiUrl = newV;
    });

    model.$watch("bodyPage", function (newV, oldV) {
        for (var i = 0; i < model.menus.length; i++) {
            for (var j = 0; j < model.menus[i].submenus.length; j++) {
                if (newV == model.menus[i].submenus[j].name)return model.role = model.menus[i].submenus[j].role;
            }
        }
    });

    model.$watch("logined", function (newV, oldV) {
        if (newV != oldV && newV == false)window.location.href = './'
    });

    avalon.router.get("/", function () {
        location.href = '#!/login';
    });

    avalon.scan(document.body);
    return model;

});