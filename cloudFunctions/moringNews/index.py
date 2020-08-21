# coding=utf-8
import requests
import time
from bs4 import BeautifulSoup

def sendGroupMessage(message):
    url = 'https://127.0.0.1:4890/send_group_msg'
    body = {'group_id': '828518762', 'message': message}
    time.sleep(5)


// 数据来源,界面新闻, 仅供学习之用
// 以下判断当天早报是否出现
url = 'https://www.jiemian.com/lists/280.html'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'}
for times in range(1, 26):
    print(times)
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    dateInfo = soup.select('#load-list > div:nth-child(1) > div.news-right > div.news-footer > p > span.date')
    for item in dateInfo:
        date = item.get_text()
    if '分钟前' in date or '今天' in date:
        print('今天的早报有了')
        break
    elif times < 25 and not '今天' in date:
        print('还没有检测到今天的早报，一分钟后重试')
        time.sleep(60)
        continue
    else:
        print('今天莫得早报')
        exit(0)

// 得到早报,开始爬取
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

data = soup.select('#load-list > div:nth-child(1) > div.news-right > div.news-header > h3 > a')
for item in data:
    result = {
        'title': item.get_text(),
        'link': item.get('href')
    }
    
// 使用bs4获取文章内容
newResponse = requests.get(result['link'], headers=headers)
morningPageDataSoup = BeautifulSoup(newResponse.text, 'html.parser')
newsTitles = morningPageDataSoup.select(
    'body > div.content > div > div > div.main-container > div.article-view > div.article-main > div.article-content > section > h3')
newsDigests = morningPageDataSoup.select(
    'body > div.content > div > div > div.main-container > div.article-view > div.article-main > div.article-content > section > p')
news = morningPageDataSoup.find('section')
if news is None:
    news = morningPageDataSoup.find('div', class_='article-content')
    print(1)
newsIndex = 0
newsInfo = []
children = news.children

for item in news:
    string = str(item)
    if 'img src' in string or '\n' == string:
        continue
    newsInfo.append(string)


// 处理得到的新闻
newsList = []
for i in range(0, len(newsInfo)):
    index = i
    if '<h3>' in newsInfo[i] and '<p>' not in newsInfo[i]:
        digest = ''
        for j in range(i+1, len(newsInfo)):
            if '<p>' in newsInfo[j] and '<h3>' not in newsInfo[j] and 'img src' not in newsInfo[j]:
                digest += newsInfo[j] + '\n'
            elif '<h3>' in newsInfo[j]:
                i = j - 1
                break
        newsList.append({
            'title': newsInfo[index].replace('<p>', '').replace('</p>', '').replace('<h3>', '').replace('</h3>', '')
                .replace('<strong>', '').replace('</strong>', ''),
            'digest': digest.replace('<p>', '').replace('</p>', '').replace('<h3>', '').replace('</h3>', '').rstrip()
        })
    else:
        continue

// 发送处理好的内容
sendGroupMessage('开始播报今日早报')

for news in newsList:
    newsMessage = news['title'] + '\n' + news['digest']
    print(newsMessage)
    sendGroupMessage(newsMessage)


sendGroupMessage('今日早报播送完毕')
