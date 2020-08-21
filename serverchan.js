var axios = require('axios')

const SERVER_CHAN_KEY = 'YOUR_SERVERCHAN_TOKEN'


async function notifyUser(message) {
	url = `https://sc.ftqq.com/${SERVER_CHAN_KEY}.send`
	message = JSON.stringify(message)
	res = await axios.post(url, `text=小王报告&desp=${message}`)
	console.log(res.data)
	if (res.data.errmsg == 'success') {
		console.log('server酱发送了：', message)
	} else {
		console.log('server酱:发送失败')
	}
}

module.exports = notifyUser
