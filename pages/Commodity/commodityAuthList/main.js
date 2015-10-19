define(["avalon", 'mmRouter', "text!/template/commodityAuthList.html", "SysConfig", 'SysUtil','Address'], function (avalon, router, commodityAuthList, SysConfig, SysUtil,Address) {
    avalon.templateCache.commodityAuthList = commodityAuthList;

    //avalon.vmodels.root.menus.push({
    //    url: "#!/commodityAuthList/",
    //    position:20
    //});

    var model = avalon.define({
        $id: "commodityAuthList",

        list: [],

        page: 1,
        limit: 20,
        Maxpage: 0,

        type:0,

        //province: 0,
        //city: 0,
        //ProvinceList: Address.getSelection(),
        //CityList: [],

        //Search$type:0,
        //Search$description:'',
        //Search$nickname:'',
        //Search$companyName:'',

        totalNum: 0,

        getList: function ($event, page) {

            page = +page;

            var postData = {
                index: model.limit * (page - 1),
                limit: model.limit,
                statuses:model.type==0?[0]:[10]
            };
            //if(+model.city)postData.city = model.city;
            //if(model.Search$type==0&&model.Search$description)postData.description = model.Search$description;
            //else if(model.Search$nickname)postData.nickname = model.Search$nickname;
            //else if(model.Search$companyName)postData.companyName = model.Search$companyName;

            layer.load(2);
            $.jsonp({
                url: SysConfig.ApiUrl + "V3.0.0/CompanyManage/auditingCommodityList?_method=GET",
                data: postData,
                callbackParameter: 'callback',
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    SysUtil.ApiCallback(obj);
                    if (obj.code != 0)return layer.msg(obj.msg);
                    var data = obj.data;
                    console.dir(obj);

                    model.page = page;
                    if (data.count) {
                        model.totalNum = data.count;
                        model.Maxpage = Math.ceil(model.totalNum / model.limit);
                    }
                    model.list = data.list;
                    if(data.list.length==0)layer.msg('一条记录也没有!');
                },
                complete: function () {
                    layer.closeAll('loading');
                }
            })

        },
        e$Auth:function($event,_id,cid){
            layer.open({
                skin: 'mySkin',
                title: '',
                content: '<h1>确定要重新审核这件商品吗？</h1>',
                shade: 0.3,
                shadeClose: true,
                closeBtn: false,
                btn: ["确认", "取消"],
                yes: function ($w) {

                    $.jsonp({
                        url: SysConfig.ApiUrl + "V3.0.0/CompanyManage/CommodityApplication?_method=PUT",
                        data:{
                            _id:cid,
                            CommodityApplicationId:_id
                        },
                        callbackParameter: 'callback',
                        beforeSend:function(){
                            layer.load(2);
                        },
                        success: function (obj) {
                            obj = $.parseJSON(obj);
                            SysUtil.ApiCallback(obj);
                            if (obj.code != 0)return layer.msg(obj.msg);
                            layer.msg('上架成功!');
                            model.getList();
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        }
                    })
                }
            });
        },
        e$detail:function($event,id){
            location.hash = '#!/commodityEdit/' + id;
        },
        e$typeTab:function($event,type){
            if(model.type != type){
                model.type = type;
                model.getList('',1);
            }
        },
        f$status:function(status){
            switch (+status){
                case 0:
                    return '<span style="color:gray">待处理</span>';
                case 1:
                    return '<span style="color:#00cb00">已通过</span>';
                case 2:
                    return '<span style="color:#bb2020">已拒绝</span>';
            }
        }
    });

    //model.$watch('province', function (nv) {
    //    model.CityList = Address.getSelection(nv, 1);
    //    if (model.CityList.length == 1) {
    //        model.city = model.province;
    //    }
    //});

    avalon.router.get("/commodityAuthList/", function () {
        avalon.vmodels.root.bodyPage = "commodityAuthList";
        model.getList('', 1);
    });

});
