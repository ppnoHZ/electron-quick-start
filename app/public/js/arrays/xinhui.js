

port.on('data', data => {
    console.log("data bite", data)
    console.log('data', data.toString('hex').toUpperCase());
    var values = '';
    var status = '';
    var status_obj = {};
    if (data.byteLength <= 8) {
        if (data.byteLength == 1 && data.toString() == '=') {
            data_string = data.toString();
        } else {
            if ((data_string.length + data.toString().length) <= 8) {
                data_string += data.toString();
            } else {
                data_string = '';
            }
            if (data_string.length == 8) {
                values = data_string.toUpperCase();
                status_obj.value = parseInt(values.substring(1, 8).toString().split("").reverse().join(""));
                console.log('最终重量:', status_obj.value);
                // $('#div_value').in
                $("#div_value").html(status_obj.value)
            }
        }
    } else {
        console.log('无效数据')
    }
    $('.receive-windows').append("<div>" + values + '</div>');
});