/**
 * Created by nic on 2015/7/16.
 */
define(function(){

    return {
        ApiCallback:function(data)
        {
            console.dir(data);
            if (data.code == 4003||data.code == 7001){
                layer.msg('请先登录！');
                avalon.vmodels.root.logined = false;

            }
            else if(data.code==0)avalon.vmodels.root.logined = true;
        },
        LoginSuccess:function()
        {
            location.href = '#!/commodityList/';
            avalon.vmodels.root.logined = true;
        },
        RoleCheck:function(data){
            if (data.code == 4003||data.code == 7001){
                layer.msg('请先登录！');
                avalon.vmodels.root.logined = false;
                location.href = '#!/Login/';
                return;
            }else if(data.code!=0){
                layer.msg(data.msg);
                avalon.vmodels.root.logined = false;
                location.hash = '#!/Login/';
                return;
            }
            else if(data.code==0){
                window.cid = data.data.userInfo.companyId;
                console.log(window.cid);
                window.clerkList = data.data.clerkList;
                window.companyRole = data.data.companyRole;
                avalon.vmodels.root.logined = true;
            }
            //console.log(data.data.companyRole);

            if(data.data.companyRole == 0){
                avalon.vmodels.root.menus[0].submenus[1].visible = false;
                avalon.vmodels.root.menus[0].submenus[2].visible = false;
                avalon.vmodels.root.companyRole = false;
            }else{
                avalon.vmodels.root.menus[0].submenus[1].visible = true;
                avalon.vmodels.root.menus[0].submenus[2].visible = true;
                avalon.vmodels.root.companyRole = true;
            }
            if(location.hash=='#!/login'){
                location.hash = '#!/commodityList/';
            }
        }
    };
});