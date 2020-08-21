# -*- coding: utf8 -*-
import json
import requests
import time
import sys
from bs4 import BeautifulSoup

def sendGroupMessage(message):
    url = 'https://127.0.0.1:4890/send_group_msg'
    body = {'group_id': '828518762', 'message': message}
    time.sleep(5)

// 有关Leancloud的数据库事宜，请参阅：https://leancloud.cn/docs/rest_api.html

def main_handler(event, context):
    // 先查询当前需要找第几篇
    paramUrl = 'https://leancloud.cn/1.1/classes/onlineParams/yourParamID'  // 利用leancloud做查询之用
    paramHeader = {
        'X-LC-Id': 'Your-X-LC-Id',
        'X-LC-Key': 'Your-X-LC-Key',
        'Content-Type': 'application/json'
    }
    paramResp = requests.get(paramUrl, headers=paramHeader)
    paramObj = json.loads(paramResp.text)
    postNum = int(paramObj['value'])

    // 向B站发送网页请求
    url = 'https://api.bilibili.com/x/space/article?mid=315966694&pn=1&ps=12&sort=publish_time&jsonp=jsonp&callback='
    headers={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36','Referer':'https://space.bilibili.com/315966694/article'}
    
    // 判断需要找的那一篇是否发布
    resp = requests.get(url, headers=headers)
    dataObj = json.loads(resp.text)
    postWanted = '2021考研英语-何凯文每日一句-第' + str(postNum) + '句'
    willDoIndex = -1
    for index in range(0, 10):
        if postWanted in str(dataObj['data']['articles'][index]['title']):
            willDoIndex = index
            break
    if willDoIndex == -1:
        print('还没有第' + str(postNum) + '句，退出')
        sys.exit(0)
    

    // 存在目标文章，开始使用bs4爬取数据
    dailyURL = 'https://www.bilibili.com/read/cv' + str(dataObj['data']['articles'][willDoIndex]['id'])
    resp = requests.get(dailyURL,headers=headers)
    soup = BeautifulSoup(resp.text,'html.parser')
    contents = soup.select('body > div.page-container > div.article-holder > p')
    contentsArray = []
    for item in contents:
        contentsArray.append(item.get_text())
    
    // 发送获得的文章内容
    sendGroupMessage('[英语每日一句]第' + str(postNum) + '句来啦~')
    
    message = ''
    rowsOfMessage = 0
    for i in range(0, len(contentsArray)):
        if contentsArray[i] == '' or rowsOfMessage >= 12:
            if message == '':
                continue
            print(message)
            sendGroupMessage(message)
            message = ''
            rowsOfMessage = 0
        elif '感谢参与投票' not in contentsArray[i] and '微博：' not in contentsArray[i] and '考研交流' not in contentsArray[i] and '文都online' not in contentsArray[i] and '领取考研资料' not in contentsArray[i] and '公众号：' not in contentsArray[i]:
            message += contentsArray[i] + '\n'
            rowsOfMessage += 1
    
    sendGroupMessage('来自：' + dailyURL)
    
    // 修改下一次要发送的篇数
    nextPostNum = postNum + 1
    
    url = 'https://leancloud.cn/1.1/classes/onlineParams/yourParamID'  // 利用leancloud做查询之用
    paramHeader = {
        'X-LC-Id': 'Your-X-LC-Id',
        'X-LC-Key': 'Your-X-LC-Key',
        'Content-Type': 'application/json'
    }
    body = {'value': '' + str(nextPostNum)}
    x = requests.put(url, headers=headers, data=json.dumps(body))
    
    sendGroupMessage('下次是第' + str(nextPostNum) + '句')