const ServerChanNotify = require('./serverchan.js')
const TulingOnMessage = require('./tulingbot.js')
const {
    PuppetPadplus
} = require('wechaty-puppet-padplus')
const {
    PUPPET_PADPLUS_TOKEN,
    BOT_NAME
} = require('./puppet-config.js')
const {
    Wechaty,
    Message,
} = require('wechaty')
const {
    QRCodeTerminal,
    EventLogger
} = require('wechaty-plugin-contrib')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const POST_KEY = 'YOUR_KEY_FOR_AUTHORIZATION'

const bot = new Wechaty({
    puppet: new PuppetPadplus({
        token: PUPPET_PADPLUS_TOKEN,
    }),
    name: BOT_NAME,
})

bot.use(QRCodeTerminal({ small: false }))
bot.use(EventLogger())
var room

bot
    .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.github.io/qrcode/${encodeURIComponent(qrcode)}`))
    .on('login', user => onLogin(user))
    .on('message', message => console.log(`Message: ${message}`))
    .on("error", onError)
    .on("message", TulingOnMessage)
    .on("logout", msg => onError(msg))
    .start()


async function onLogin(user) {
    console.log(`User ${user} logined`)
    room = await bot.Room.find({topic: '学习 x 信息推送群'})
}

function onError(error) {
    ServerChanNotify(error)
}

app.post('/send_group_msg', urlencodedParser, function (req, res) {
    console.log(req.body.group_id)
    if (req.body.token != 'POST_KEY') {
        res.destroy();
        return
    }
    console.log('Received message: ', req.body.message)
    room.say(req.body.message).then(msg => {
        res.end(JSON.stringify(msg))
    }).catch(error => {
        onError(error)
    })
 })


 var server = app.listen(7880, function() {
     console.log('Message Receiver running at: http://%s:%s', server.address().host, server.address().port)
 })
