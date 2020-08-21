'use strict';

var axios = require('axios');
const querystring = require('querystring');

var citySelector = 1
var url = 'https://news.topurl.cn/api?ip='
switch (citySelector) {
    case 1:
        url += '1.194.1.194'
        break
    case 2:
        url += '59.68.63.223'
        break
    default:
        url += '59.68.63.223'
        break
}

function sendGroupMessage(message) {
    axios({
        method: 'post',
        url: 'https://127.0.0.1:4890/send_group_msg',
        data: querystring.stringify({
            'message': message
        })
    }).then(function (response) {
        console.log(response.data)
    }).catch(function (error) {
        console.log(error)
    })
}

function reportStatus(message) {
    axios({
        method: 'post',
        url: 'https://sc.ftqq.com/SCU23667T029035a265356802fb102074530ba9f75ab5bad3791bc.send',
        data: querystring.stringify({
            'text': '小王遇到了一些问题' + message
        })
    }).then(function (response) {
        console.log(response.data)
    }).catch(function (error) {
        console.log(error)
    })
}

exports.main_handler = async (event, context, callback) => {
    axios({
        method: 'get',
        url: url
    }).then(function (response) {
        console.log(response.data)
        var date = response.data.data.calendar.cYear + '年' + response.data.data.calendar.cMonth + '月' + response.data.data.calendar.cDay + '日 ' + response.data.data.calendar.ncWeek
        let city = response.data.data.weather.city
        var cond
        if (response.data.data.weather.detail.text_day == response.data.data.weather.detail.text_night) {
            cond = response.data.data.weather.detail.text_day
        } else {
            cond = response.data.data.weather.detail.text_day + "转" + response.data.data.weather.detail.text_night
        }
        let temp = response.data.data.weather.detail.low + '℃~' + response.data.data.weather.detail.high + '℃'
        var wind = ''
        let windScale = response.data.data.weather.detail.wind_scale
        let windDirection = response.data.data.weather.detail.wind_direction
        wind = windScale + '级' + windDirection + '风'
        let message = '早上好哇\n今天是' + date + '\n' + city + '\n今日天气：' + cond + '\n气温：' + temp + '\n风力：' + wind
        sendGroupMessage(message)
    }).catch(function (error) {
        reportStatus('今日消息发送失败')
        console.log(error)
    })
    return null;
};