/**
 * Created by DevilsEyes on 2015/10/16.
 */
define(['Jcrop'],function(){

    var model = avalon.define({
        $id: "croper",

        thumb:'',//缩略图
        url:'',//url
        cropWidth:'',//裁切宽度
        rate:0,//长宽比


        pattern: 'add',//edit
        isUploading: false,

        province: 0,
        city: 0,
        ProvinceList: Address.getSelection(),
        CityList: [],





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
        //area: ['600px','400px']
        area: '600px'
    });
    console.log((new Date()).getTime());
    avalon.scan(document.body);
    model.dialog.thumb = '';
    console.log((new Date()).getTime());
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
        console.log((new Date()).getTime());
        window.croper = this;
    });

    return

});