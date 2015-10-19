define(['text!../static/template/unitPage.html',
    'text!../static/template/unitFormItem.html',
    'text!../static/template/unitButton.html',
    'juicer'],
    function (page,FormItem,button,juicer) {

        console.log(juicer(button));

    return {
        page:juicer(page),
        formItem:juicer(FormItem),
        button:juicer(button)
    };

});