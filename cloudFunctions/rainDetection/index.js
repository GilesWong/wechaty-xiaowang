'use strict';
var axios = require('axios')
var sd = require('silly-datetime')
const querystring = require('querystring');

var date = new Date()
let hour = date.getHours()
var timeStr = ''

if (hour >= 7 && hour <= 12) {
    timeStr = '早晨'
} else if (hour >= 12 && hour <= 15) {
    timeStr = '下午'
} else {
    // process.exit(0)
}

var citySelector = 1
var url = ''
var place = ''
switch (citySelector) {
    case 1:
        url = 'https://api.caiyunapp.com/v2.5/ghbkeChNeRd8bvF4/113.39735,33.740241/hourly.json'
        place = '六六盐家属院'
        break
    case 2:
        url = 'https://api.caiyunapp.com/v2.5/ghbkeChNeRd8bvF4/114.3904,30.4820/hourly.json'
        place = '中南民大'
        break
    default:
        url = 'https://api.caiyunapp.com/v2.5/ghbkeChNeRd8bvF4/114.3904,30.4820/hourly.json'
        place = '六六盐家属院'
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
    }).then(function (res) {
        console.log(res.data)
        let haveRain = res.data.result.hourly.description.indexOf('雨')
        let haveSnow = res.data.result.hourly.description.indexOf('雪')
        if (haveRain != -1 || haveSnow != -1) {
            let message = '【' + timeStr + '降水预警】\n' + place + ':\n' + res.data.result.hourly.description
            console.log('将要发送', message)
            sendGroupMessage(message)
        } else {
            console.log('并不打算发送')
        }
    }).catch(function (err) {
        console.log(err)
        reportStatus('降雨提醒检查失败')
    })
    return null
};