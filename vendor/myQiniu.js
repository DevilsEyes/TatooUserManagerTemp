/**
 * Created by DevilsEyes on 2015/9/28.
 */
define(['SysConfig', 'plupload', 'qiniu'], function (SysConfig, plupload, Qiniu) {

    var upload = {
        config: {
            TiggerId: '',
            Max: 0,
            BeforeUpload: function (up, file) {
            },
            UploadComplete: function () {
            },
            FileUploaded: function (up, file, info) {
            },
            UploadProgress: function (percent) {
            }
        },
        asyn$Config: function () {

            var getToken = function () {
                //获取TOKEN
                $.jsonp({
                    url: SysConfig.ApiUrl + "V1.0.0/Upload/token",
                    callbackParameter: "callback",
                    success: function (obj) {
                        obj = $.parseJSON(obj);
                        if (obj.code)return layer.msg(obj.msg);
                        myQiniu.token = obj.data.token;
                        upload.qiniuInit();
                    },
                    error: function (obj) {
                        layer.msg('您的网络连接不太顺畅哦！');
                    }
                });
            };

            if (!myQiniu.domain) {
                //获取路径
                $.jsonp({
                    url: SysConfig.ApiUrl + "V3.0.0/Upload/imageUrl/",
                    data: {
                        "key": "x"
                    },
                    callbackParameter: "callback",
                    success: function (obj) {
                        obj = $.parseJSON(obj);
                        if (obj.code)return layer.msg(obj.msg);
                        myQiniu.domain = obj.data.url.substr(0, obj.data.url.length - 1);
                        getToken();
                    },
                    error: function (obj) {
                        layer.msg('您的网络连接不太顺畅哦！');
                    }
                });
            } else {
                getToken();
            }
        },
        qiniuInit: function () {

            if (myQiniu.self)myQiniu.self.destroy();

            myQiniu.self = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: upload.config.TiggerId, //上传按钮id
                dragdrop: false,
                max_file_size: '100mb',
                chunk_size: '4mb',
                uptoken: myQiniu.token,
                domain: myQiniu.domain,
                unique_names: false,
                save_key: false,
                auto_start: false,

                init: {
                    'FilesAdded': function (up, files) {
                        if (upload.config.Max > 0)var index = 0;
                        plupload.each(files, function (file) {
                            if (upload.config.Max > 0) {
                                if (index >= upload.config.Max) {
                                    return up.removeFile(up.getFile(file.id));
                                }
                                index++;
                            }

                            var fn = file.name.slice((file.name.length - 4));
                            var f = up.getFile(file.id);
                            var pn = fn.toLowerCase();
                            if (pn != '.jpg' && pn != '.png' && pn != '.gif' && pn != '.tga') {
                                up.removeFile(f);
                            } else {
                                f.name = $.md5(file.lastModifiedDate + f.name);
                            }
                        });
                        up.start();
                    },

                    'BeforeUpload': upload.config.BeforeUpload,
                    'UploadComplete': upload.config.UploadComplete,
                    'FileUploaded': upload.config.FileUploaded,
                    'UploadProgress':function (uploader, file) {
                        upload.config.UploadProgress(uploader.total.percent);
                    }
                }
            });
        }
    };

    var myQiniu = {
        domain: '',
        token: '',
        self: null,
        init: function (config) {
            upload.config = config;
            upload.asyn$Config();
        },
        Qiniu:Qiniu
    };

    return myQiniu;
})
;