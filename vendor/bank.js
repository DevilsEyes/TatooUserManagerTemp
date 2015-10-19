define(function () {

    var bank = {
        bankList: {
            'CMBCCNBS': '招商银行',
            'ICBKCNBJ': '工商银行',
            'PCBCCNBJ': '建设银行',
            'SPDBCNSH': '上海浦东发展银行',
            'ABOCCNBJ': '农业银行',

            'FJIBCNBA': '兴业银行',
            'BJCNCNBJ': '北京银行',
            'EVERCNBJ': '光大银行',
            'MSBCCNBJ': '民生银行',
            'SZCBCNBS': '平安银行',

            'COMMCNSH': '深圳银行',
            'SZDBCNBS': '交通银行',
            'CIBKCNBJ': '中信银行',
            'GDBKCN22': '广发银行'
        },
        getlist: function () {
            var array = [];
            for (var i in bank.bankList) {
                array.push({
                    code: i,
                    name: bank.bankList[i]
                })
            }
            return array;
        }
    };

    return bank;
});