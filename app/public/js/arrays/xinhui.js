port.on('data', data => {
    console.log("data bite", data)
    console.log('data', data.toString('hex').toUpperCase());
    var values = '';
    var status = '';
    var status_obj = {};
    //如果收到数据小于等于8
    if (data.byteLength <= 8) {
        if (data.byteLength == 1 && (data.toString() == '=' || data.toString() == '.')) {
            data_string = data.toString();
        } else {
            //如果组合起来的长度小于等于8，则继续组合
            if ((data_string.length + data.toString().length) <= 8) {
                data_string += data.toString();
                // 如果等于8则是正确数据
                if (data_string.length == 8) {
                    values = data_string.toUpperCase();
                    if ((values[0] == '.' && values[values.length - 1] == '=') || values[0] == '=' && values[values.length - 1] == '.') {
                        // status_obj.value = parseInt(values.substring(1, 8).toString().split("").reverse().join(""));
                        status_obj.value = parseInt(values.replace('.', '').replace('=', '').toString().split("").reverse().join(""));

                        console.log('最终重量:', status_obj.value);
                        // $('#div_value').in
                        $("#div_value").html(status_obj.value)
                    } 
                }
            } else {
                // 如果等于8则是错误数据
                data_string = '';
            }
        }
    } else {
        console.log('无效数据')
    }
    $('.receive-windows').append("<div>" + values + '</div>');
});