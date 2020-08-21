'use strict';
var axios = require('axios')
const querystring = require('querystring');

function sendGroupMessageWithQQ(message) {
    axios({
        method: 'post',
        url: 'https://bot.wwg.xyz/send_group_msg',
        data: querystring.stringify({
            'group_id': '828518762',
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
        url: 'https://rest.shanbay.com/api/v2/quote/quotes/today/'
    }).then(function (res) {
        console.log(res.data)
        var sentence = res.data.data.content
        var author = res.data.data.author
        var translation = res.data.data.translation
        var message = '【每日一句】\n' + sentence + '\n--' + author + '\n' + translation
        sendGroupMessageWithQQ(message)
    }).catch(function (err) {
        console.log(err)
        reportStatus('每日一句发送失败')
    })
    return event
};