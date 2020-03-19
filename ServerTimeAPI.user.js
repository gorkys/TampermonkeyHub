// ==UserScript==
// @name         各电商平台服务器时间
// @namespace    https://github.com/gorkys/TampermonkeyHub
// @version      1.0.2
// @description  try to take over the world!
// @author       Gorkys
// @license      MIT
// @match        *://*.taobao.com/*
// @match        *://*.jd.com/*
// @match        *://*.vmall.com/*
// @match        *://*.suning.com/*
// @match        *://*.pinduoduo.com/*
// @match        *://*.dewu.com/*
// @supportURL   https://github.com/gorkys/TampermonkeyHub
// @updateURL    https://github.com/gorkys/TampermonkeyHub/ServerTimeAPI.user.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const initBox = () => {
        const style = `#timeBox{background-color:rgba(255,255,255,0.7);width:260px;font-size:14px;position:fixed;top:20%;right:-150px;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}#timeBox:hover{right:10px}.title{font-size:16px;font-weight:bold;margin:10px 0}.title span{font-size:12px;color:#9c9c9c}.time{text-align:left;padding-left:20px}.time p{margin-top:1px}.time span{color:red;font-size:16;font-weight:bold;margin-left:20px}`
        const html = `
                <div id='timeBox'>
                    <h3 class="title">
                        各电商平台服务器时间 <span>by: Gorkys</span>
                    </h3>
                    <div class='time'>
                        <p><a href='http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp'>淘宝</a> :&nbsp;&nbsp; <span id='taobao'>无法获取</span></p>
                        <p><a href='https://buy.vmall.com/getSkuRushbuyInfo.json'>华为</a> :&nbsp;&nbsp; <span id='vmall'>无法获取</span></p>
                        <p><a href='https://a.jd.com//ajax/queryServerData.html'>京东</a> :&nbsp;&nbsp; <span id='jd'>无法获取</span></p>
                        <p><a href='https://ju.m.suning.com/ajax/getSystemTime_querySystemTime2.html'>苏宁</a> :&nbsp;&nbsp; <span id='suning'>无法获取</span></p>
                        <p><a href='https://api.pinduoduo.com/api/server/_stm'>拼多多</a> : <span id='pinduoduo'>无法获取</span></p>
                        <p><a href='https://m.poizon.com/client/cold'>得物(毒)</a> : <span id='dewu'>无法获取</span></p>
                    </div>
                </div>
                `
        var stylenode = document.createElement('style');
        stylenode.setAttribute("type", "text/css");
        if (stylenode.styleSheet) { // IE
            stylenode.styleSheet.cssText = style;
        } else { // w3c
            var cssText = document.createTextNode(style);
            stylenode.appendChild(cssText);
        }
        var node = document.createElement('div');
        node.innerHTML = html;
        document.head.appendChild(stylenode);
        document.body.appendChild(node);
    }

    const querySystemTime2 = (val) => {
        return val
    }

    const ajaxSeverTime = (url, type) => {
        const details = {
            method: 'GET',
            url: url,
            onload: (responseDetails) => {
                if (responseDetails.status === 200) {
                    let getTime = ''
                    const res = type === 'suning' ? eval(responseDetails.responseText) : JSON.parse(responseDetails.responseText)

                    switch (type) {
                        case 'taobao':
                            getTime = +res.data.t
                            break
                        case 'vmall':
                            getTime = res.currentTime
                            break
                        case 'jd':
                            getTime = res.serverTime
                            break
                        case 'suning':
                            getTime = res.timeStamp
                            break
                        case 'pinduoduo':
                            getTime = res.server_time
                            break
                        case 'dewu':
                            getTime = +res.data.timestamp
                    }
                    setInterval(() => {
                        document.querySelector(`#${type}`).innerText = formatDate(getTime)
                        getTime += 100
                    }, 100)
                }
            }
        }
        GM_xmlhttpRequest(details)
    }

    // 时间戳转换日期格式
    const formatDate = (value) => {
            const date = new Date(+value + 100);
            // const yyyy = date.getFullYear();// 年
            // const MM = date.getMonth() + 1;// 月
            // MM = MM < 10 ? ('0' + MM) : MM;
            // const dd = date.getDate();// 日
            // dd = dd < 10 ? ('0' + dd) : dd;
            const h = date.getHours(); // 时
            const m = date.getMinutes(); // 分
            const s = date.getSeconds(); // 秒
            const ms = Math.floor(new Date().getMilliseconds() / 100) // 毫秒 + ' ' + ms
            return fillZero(h) + ':' + fillZero(m) + ':' + fillZero(s) + '.' + ms
        }
        // 时间补0
    const fillZero = (str, len = 2) => {
        return (`${str}`).padStart(len, '0')
            // return (`${str}`).slice(-len)
    }

    initBox()

    const timeAPI = {
        // http://acs.m.taobao.com/gw/mtop.common.getTimestamp/ 备用
        taobao: 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp',
        // 可带参数https://buy.vmall.com/getSkuRushbuyInfo.json?skuIds=10086175997878&t=1583496687456
        vmall: 'https://buy.vmall.com/getSkuRushbuyInfo.json',
        jd: 'https://a.jd.com//ajax/queryServerData.html',
        suning: 'https://ju.m.suning.com/ajax/getSystemTime_querySystemTime2.html?_=1583498034772&callback=querySystemTime2',
        pinduoduo: 'https://api.pinduoduo.com/api/server/_stm',
        dewu: 'https://m.poizon.com/client/cold'
    }

    for (let i in timeAPI) {
        if (window.location.href.indexOf(i) != -1) {
            ajaxSeverTime(timeAPI[i], i)
        }
    }

})();