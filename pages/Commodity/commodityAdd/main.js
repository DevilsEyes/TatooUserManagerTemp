/**
 * Created by DevilsEyes on 2015/9/16.
 */
define(["avalon", 'mmRouter', "text!/template/commodityAdd.html", "SysConfig", 'SysUtil', 'myQiniu', "text!/template/dialog.html", "text!/template/dialogClerk.html", 'Jcrop'], function (avalon, router, commodityAdd, SysConfig, SysUtil, myQiniu, dialogHTML, dialogHTML2, Jcrop) {
    avalon.templateCache.commodityAdd = commodityAdd;

    var qiniuConfig = {
        TiggerId: 'uploadimg',
        Max: 0,
        BeforeUpload: function (up, file) {
            file.name = $.md5(file.name + new Date());
            model.isUploading = true;
        },
        UploadComplete: function () {
            model.isUploading = false;
            $('.progress>div').css('width', '0');
            //Draw_img(PAGE_FORM.img);
        },
        FileUploaded: function (up, file, info) {
            info = $.parseJSON(info);
            var imgurl = myQiniu.domain + info.key;
            var data = myQiniu.Qiniu.imageInfo(info.key);
            IMAGES.push({
                url: imgurl,
                width: data.width,
                height: data.height,
                isCrop: false
            });
            model.images = IMAGES;
        },
        UploadProgress: function (percent) {
            $('.progress>div').css('width', percent + '%');
        }

    };

    var IMAGES = [];

    var model = avalon.define({
        $id: "commodityAdd",
        commodityId: '',

        readOnly: false,

        pattern: 'add',//edit
        isUploading: false,

        sale: 0,//0不知道 1已上架 2已下架
        title: '',
        content: '',
        images: [],
        price: '',
        primeCost: '',
        rankNum: '',
        tattooist: {},
        userList: [],
        dialog: {
            window: 0,
            cropWidth: 0,
            croper: {},
            thumb: ''
        },

        //商品下架
        e$Down: function ($event) {
            layer.open({
                skin: 'mySkin',
                title: '',
                content: '<h1>确定要下架这件商品吗？</h1><p>不下架的商品可是没法被编辑的!</p>',
                shade: 0.3,
                shadeClose: true,
                closeBtn: false,
                btn: ["确认", "取消"],
                yes: function ($w) {

                    $.jsonp({
                        url: SysConfig.ApiUrl + "V3.0.0/Commodity/Sale/cancel?_method=POST",
                        data: {
                            _id: model.commodityId
                        },
                        callbackParameter: 'callback',
                        beforeSend: function () {
                            layer.load(2);
                        },
                        success: function (obj) {
                            obj = $.parseJSON(obj);
                            SysUtil.ApiCallback(obj);
                            if (obj.code != 0)return layer.msg(obj.msg);
                            layer.msg('下架成功!');
                            location.hash = '#!/commodityList/';
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        }
                    })
                }
            });
        },

        //商品编辑/添加
        e$EditAdd: function ($event) {
            if (model.isUploading)return;
            var i, imgArray = [], post = {};

            if (!model.title)return layer.msg('请填写标题！');
            if (IMAGES.length == 0)return layer.msg('请选择图片！');
            if (!model.content)return layer.msg('请填写内容！');
            if (!model.tattooist.userId)return layer.msg('请选择纹身师！');
            if (!model.price)return layer.msg('请输入价格！');
            if (!model.primeCost)return layer.msg('请输入市场价！');

            for (i = 0; i < IMAGES.length; i++) {
                if (IMAGES[i].width != IMAGES[i].height) {
                    return layer.msg('有图片不合尺寸要求，请裁剪!');
                } else {
                    imgArray.push(IMAGES[i].url);
                }
            }

            post.data = {
                title: model.title,
                description: model.content,
                images: imgArray,
                price: model.price,
                primeCost: model.primeCost,
                storeId: model.tattooist.userId
            };

            if (model.pattern == 'edit') {
                post.data['_id'] = model.commodityId;
                post.url = "V3.0.0/CompanyManage/modifyCommodity?_method=POST";
            } else {
                post.url = "V3.0.0/CompanyManage/addCommodity?_method=PUT";
            }

            $.jsonp({
                url: SysConfig.ApiUrl + post.url,
                data: post.data,
                callbackParameter: 'callback',
                beforeSend: function () {
                    layer.load(2);
                    model.isUploading = true;
                },
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    SysUtil.ApiCallback(obj);
                    if (obj.code != 0)return layer.msg(obj.msg);
                    console.dir(obj);
                    layer.msg('操作成功！');
                    location.hash = '#!/commodityList/';
                },
                complete: function () {
                    layer.closeAll('loading');
                    model.isUploading = false;
                }
            })

        },

        //图片操作 - 裁剪/设为首页/删除
        e$ImgControl: function ($event, index, type) {
            switch (type) {
                case 'delete':
                    IMAGES.splice(index, 1);
                    return model.images = IMAGES;
                case 'top':
                    var temp = IMAGES.splice(index, 1);
                    IMAGES = temp.concat(IMAGES);
                    return model.images = IMAGES;
                case 'crop':
                    model.dialog.croper = IMAGES[index];
                    model.dialog.index = index;
                    model.dialog.window = layer.open({
                        skin: 'bs',
                        title: '',
                        content: dialogHTML,
                        shade: 0.3,
                        shadeClose: true,
                        closeBtn: true,
                        btn: false,
                        fix: false,
                        //area: ['600px','600px']
                        area: '600px'
                    });
                    avalon.scan(document.body);
                    model.dialog.thumb = '';
                    $('#crop-img').Jcrop({
                        aspectRatio: 1,
                        onSelect: function () {
                            var data = window.croper.tellScaled(),
                                r = $('img#crop-img').width() / model.dialog.croper.width,
                                str = Math.floor(data.w / r) + 'x' + Math.floor(data.h / r) + 'a' + Math.floor(data.x / r) + 'a' + Math.floor(data.y / r),
                                key = model.dialog.croper.url.split('.cc/')[1];

                            model.dialog.cropWidth = Math.floor(data.w / r);
                            model.dialog.thumb = myQiniu.Qiniu.imageMogr2({
                                crop: '!' + str
                            }, key)
                        },
                        onRelease: function () {
                            model.dialog.thumb = '';
                        }
                    }, function () {
                        $('input.jcrop-keymgr').remove();
                        window.croper = this;
                    });


                    return
            }
        },

        //图片裁剪
        e$ImgCrop: function () {
            if (!model.dialog.thumb)return layer.msg('请裁取图片!');
            var index = model.dialog.index;
            var temp = IMAGES[index];
            if (model.dialog.cropWidth >= 750) {
                model.dialog.thumb += '/thumbnail/750x750';
            }
            console.log(model.dialog.thumb);

            $.jsonp({
                url: SysConfig.ApiUrl + "V3.0.0/Upload/qiniuCut",
                data: {
                    qiniuUrl: model.dialog.thumb
                },
                callbackParameter: 'callback',
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    if (obj.code) {
                        layer.msg(obj.msg);
                    } else {
                        IMAGES[index] = {
                            url: obj.data.url,
                            width: +model.dialog.cropWidth,
                            height: +model.dialog.cropWidth
                        };
                        model.images = IMAGES;
                        layer.close(model.dialog.window);
                    }
                },
                error: function () {
                    layer.msg('您的网络连接不太顺畅哦!');
                }
            });
        },

        //选择纹身师
        e$selectUser: function () {
            model.userList = window.clerkList;
            model.dialog.window = layer.open({
                skin: 'bs',
                title: '',
                content: dialogHTML2,
                shade: 0.3,
                shadeClose: true,
                closeBtn: true,
                fix: false,
                btn: false,
                area: '800px'
            });
            avalon.scan(document.body);
        },

        //添加纹身师
        e$AddTattooist: function ($event, index) {

            layer.close(model.dialog.window);
            model.tattooist = window.clerkList[index];

        },

        EditInit: function () {
            model.pattern = 'edit';
            $.jsonp({
                url: SysConfig.ApiUrl + "V3.0.0/Commodity/info?_method=GET",
                data: {
                    _id: model.commodityId
                },
                callbackParameter: 'callback',
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    SysUtil.ApiCallback(obj);
                    if (obj.code != 0)return layer.msg(obj.msg);
                    var data = obj.data.commodityInfo;

                    var i, w, h, str;
                    console.dir(data);

                    model.title = data.title;
                    model.sale = data.sale;
                    IMAGES = [];
                    for (i = 0; i < data.images.length; i++) {
                        str = data.images[i].split('_W_')[1];
                        w = +str.split('X')[0];
                        h = +str.split('X')[1];
                        IMAGES.push({
                            url: data.images[i],
                            width: w,
                            height: h,
                            isCrop: w == h
                        })
                    }
                    model.images = IMAGES;
                    model.content = data.description;
                    model.price = data.price;
                    model.primeCost = data.primeCost;
                    for (i = 0; i < clerkList.length; i++) {
                        if (data.storeId == clerkList[i].userId) {
                            model.tattooist = clerkList[i];
                            break;
                        }
                    }
                    model.readOnly = (model.sale == 1);

                    if (avalon.vmodels.root.companyRole == false) {
                        $('button').remove();
                    }

                },
                complete: function () {
                    layer.closeAll('loading');
                },
                beforeSend: function () {
                    layer.load(2);
                }
            })
        },

        AddInit: function () {
            model.pattern = 'add';//edit
            model.isUploading = false;
            model.readOnly = false;

            model.title = '';
            model.content = '';
            model.sale = 0;
            IMAGES = [];
            model.images = [];
            model.price = '';
            model.primeCost = '';
            model.rankNum = '';
            model.tattooist = {};
        }

    });

    avalon.router.get("/commodityAdd/", function () {
        avalon.vmodels.root.bodyPage = "commodityAdd";
        model.AddInit();
        setTimeout(function () {
            myQiniu.init(qiniuConfig);
        }, 0);
        //model.getList('', 1);
    });

    avalon.router.$types.intStr19 = {pattern: '[0-9&a-z&A-Z]{19}', decode: String};
    avalon.router.get("/commodityEdit/{id:intStr19}", function () {
        avalon.vmodels.root.bodyPage = "commodityAdd";
        model.commodityId = this.params.id;
        model.EditInit();
        setTimeout(function () {
            myQiniu.init(qiniuConfig);
        }, 0);
        //model.getList('', 1);
    });

})
;