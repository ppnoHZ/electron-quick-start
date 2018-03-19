port.on('data', data => {
    console.log('data', data.toString('hex').toUpperCase());
    var values = '';
    var status = '';
    var status_obj = {};
    if (data.byteLength <= 5) {
        if (data.byteLength == 1 && data.toString('hex') == 'ff') {
            data_string = data.toString('hex');
        } else {
            if ((data_string.length + data.toString('hex').length) <= 10) {
                data_string += data.toString('hex');
            } else {
                data_string = '';
                console.log('无效数据')
            }
            if (data_string.length == 10) {
                values = data_string.toUpperCase();
                //取状态位。转换为二进制
                status = parseInt(values.substring(2, 4), 16).toString(2).padStart(8, '0');
                //7 0:量程内  1:超载
                if (parseInt(status[0])) {
                    status_obj.overload = true;
                } else {
                    status_obj.overload = false;
                }
                if (parseInt(status[2])) {
                    status_obj.plus = false;
                } else {
                    status_obj.plus = true;
                }
                if (parseInt(status[3])) {
                    status_obj.stable = true;
                    console.log('稳定数据');
                } else {
                    status_obj.stable = false;
                    console.log('非稳定数据');
                }
                var value = values.substring(8, 10) + values.substring(7, 8) + values.substring(4, 6);
                // console.log('小数:', parseInt(status.substring(5, 8)))
                status_obj.value = parseInt(value) / Math.pow(10, parseInt(status.substring(5, 8) - 1))
                if (!status_obj.plus) {
                    status_obj.value = status_obj.value * -1;
                }
                console.log('最终重量:', status_obj.value)
                // $('#div_value').in
                $("#div_value").html(status_obj.value)
            }
        }
    } else {
        console.log('无效数据')
    }
    $('.receive-windows').append("<div>" + values + '</div>');
});