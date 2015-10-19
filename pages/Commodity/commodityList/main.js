/**
 * Created by DevilsEyes on 2015/9/16.
 */
define(["avalon", 'mmRouter', "text!/template/commodityList.html", "SysConfig", 'SysUtil'], function (avalon, router, commodityList, SysConfig, SysUtil) {
    avalon.templateCache.commodityList = commodityList;

    var model = avalon.define({
        $id: "commodityList",

        list: [],
        sale:1,

        Search$sort:1,
        Search$type:0,
        Search$tag:'',
        Search$title:'',

        page: 1,
        limit: 20,
        Maxpage: 0,

        totalNum:0,

        getList: function ($event, page) {

            page = +page;

            var postData = {
                index: model.limit * (page - 1),
                limit: model.limit,
                companyId:window.cid,
                sale:model.sale
                //sort:model.Search$sort,
            };
            //if(model.Search$type&&model.Search$tag)postData.tag = model.Search$tag;
            //else if(model.Search$title)postData.title = model.Search$title;

            layer.load(2);
            $.jsonp({
                url: SysConfig.ApiUrl + "V3.0.0/CompanyManage/CommodityList?_method=GET",
                data: postData,
                callbackParameter: 'callback',
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    SysUtil.ApiCallback(obj);
                    if (obj.code != 0)return layer.msg(obj.msg);
                    var data = obj.data;
                    console.dir(obj);

                    model.page = page;
                    if (data.totalNum) {
                        model.totalNum = data.totalNum;
                        model.Maxpage = Math.ceil(data.totalNum / model.limit);
                    }
                    model.list = data.list;
                    if(data.list.length==0)layer.msg('一条记录也没有!');
                },
                complete: function () {
                    layer.closeAll('loading');
                }
            })

        },
        e$Edit:function($event,index){
            location.hash = '#!/commodityEdit/' + model.list[index]._id;
        },
        e$Cancel:function($event,id){
            layer.open({
                skin: 'mySkin',
                title: '',
                content: '<h1>确定要下架这件商品吗？</h1>',
                shade: 0.3,
                shadeClose: true,
                closeBtn: false,
                btn: ["确认", "取消"],
                yes: function ($w) {

                    $.jsonp({
                        url: SysConfig.ApiUrl + "V3.0.0/CompanyManage/sale?_method=POST",
                        data:{
                            commodityId:id
                        },
                        callbackParameter: 'callback',
                        beforeSend:function(){
                            layer.load(2);
                        },
                        success: function (obj) {
                            obj = $.parseJSON(obj);
                            SysUtil.ApiCallback(obj);
                            if (obj.code != 0)return layer.msg(obj.msg);
                            layer.msg('下架成功!');
                            model.getList();
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        }
                    })
                }
            });
        },
        e$Auth:function($event,id){
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
                            _id:id
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
        e$typeTab:function($event,value){
            model.sale = value;
            model.getList(null,1);
        },
        e$detail:function($event,id){
            location.hash = '#!/commodityEdit/' + id;
        }
    });

    avalon.router.get("/commodityList/", function () {
        avalon.vmodels.root.bodyPage = "commodityList";
        model.getList('', 1);
    });

});
