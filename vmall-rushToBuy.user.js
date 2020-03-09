// ==UserScript==
// @name         华为商城抢购
// @namespace    https://github.com/gorkys/TampermonkeyHub
// @version      1.1.4
// @description  try to take over the world!
// @author       Gorkys
// @license      MIT

// @match        https://www.vmall.com/product/*.html
// @match        https://*.cloud.huawei.com/*
// @match        https://www.vmall.com/product/*.html?*
// @match        https://www.vmall.com/order/nowConfirmcart
// @supportURL   https://github.com/gorkys/TampermonkeyHub
// @updateURL    https://github.com/gorkys/TampermonkeyHub/vmall-rushToBuy.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.onload = () => {
        // 自动登录(浏览器记住密码的情况下)
        if (window.location.href.indexOf('cloud.huawei') !== -1) {
            setTimeout(() => { $('#btnLogin').click() }, 2000)
        }
        // 提交订单
        if (window.location.href.indexOf('order') !== -1) {
            ec.order.confirmSubmit()
        }
    }

    let cycle = 0

    // 检查登录情况
    if (rush.account.isLogin()) {
        window.onload = () => {
            initBox()
        }
    } else {
        rush.business.doGoLogin()
    }
    const initBox = () => {
        const style = `#rushToBuyBox{background-color:rgba(255,255,255,0.7);width:260px;font-size:14px;position:fixed;top:20%;right:-150px;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}#rushToBuyBox:hover{right:10px}.title{font-size:16px;font-weight:bold;margin:10px 0}.title span{font-size:12px;color:#9c9c9c}#formList{margin:10px}.time span{color:red}#formList input{background:0;height:20px;font-size:14px;outline:0;border:1px solid #ccc;margin-bottom:10px}#formList input:focus{border:1px solid #4ebd0d}#formList div span{font-size:12px;color:red}#formList div{margin-bottom:10px}.countdown{margin-top:10px}`
        const html = `
                    <div id='rushToBuyBox'>
                        <h3 class="title">
                            华为抢购助手 <span>by: Gorkys</span>
                        </h3>
                        <div class='time'>
                            <p>本地与服务器时间相差: <span id='offsetTime'>-1400ms</span></p>
                            <p>网络延迟: <span id='timer'>200ms</span></p>
                        </div>
                        <form id='formList'>
                            <div>活动开始时间</div>
                            <input type="text" id="g_startTime"  value="" placeholder="2020/03/07 12:49:00" />
                            <div>提前开始时间<span>(ms)</span></div>
                            <input type="text" id="g_beforeStartTime" value="" placeholder="150" /></br>
                            <button id='rushToBuy'>开始运行</button><button style='margin-left:5px' id='stop'>停止</button>
                        </form>
                        <div class='countdown'>倒计时: <span id='countdown'>1天 2:3:4</span></div>
                    </div>
                    `
        var stylenode = document.createElement('style');
        stylenode.setAttribute("type", "text/css");
        if (stylenode.styleSheet) {// IE
            stylenode.styleSheet.cssText = style;
        } else {// w3c
            var cssText = document.createTextNode(style);
            stylenode.appendChild(cssText);
        }
        var node = document.createElement('div');
        node.innerHTML = html;
        document.head.appendChild(stylenode);
        document.body.appendChild(node);

        document.querySelector('#offsetTime').innerText = rush.business.offsetTime + 'ms'
        document.querySelector('#timer').innerText = rush.business.timer + 'ms'

        const g_startTime = document.querySelector('#g_startTime')
        const g_beforeStartTime = document.querySelector('#g_beforeStartTime')
        // 设置活动开始时间
        g_startTime.value = rush.activity.getActivity(rush.sbom.getCurrSkuId()).startTime
        g_beforeStartTime.value = '20'

        // 倒计时
        const countdownId = setInterval(() => {
            document.querySelector('#countdown').innerText = getDistanceSpecifiedTime(g_startTime.value, rush.business.getSysDate())
        }, 1000)

        const countdown = document.querySelector('#rushToBuy')
        const stop = document.querySelector('#stop')

        countdown.addEventListener('click', () => {
            countdown.disabled = true
            countdown.innerText = '抢购中...'
            getServerTime(g_startTime.value, g_beforeStartTime.value)
        })
        stop.addEventListener('click', () => {
            countdown.disabled = false
            countdown.innerText = '开始运行'
            clearInterval(cycle)
        })
    }
    // 获取服务器时间
    const getServerTime = (g_startTime, g_beforeStartTime) => {
        $.get('https://buy.vmall.com/getSkuRushbuyInfo.json', (res) => {
            const startTime = new Date(g_startTime).getTime()

            let currentTime = res.currentTime

            cycle = setInterval(() => {
                rushToBuy(startTime, currentTime, g_beforeStartTime)
                currentTime += 10
            }, 10)
        })
    }
    // 提前申购
    const rushToBuy = (startTime, currentTime, g_beforeStartTime) => {
        if (startTime - currentTime <= + g_beforeStartTime) {
            rush.business.doGoRush(2);
            clearInterval(cycle)
        }
    }
    // 抢购倒计时对比
    const getDistanceSpecifiedTime = (dateTime, currentTime) => {
        // 指定日期和时间
        var EndTime = new Date(dateTime).getTime();
        // 当前系统时间
        // var NowTime = new Date();
        // var t = EndTime.getTime() - NowTime.getTime();
        var t = EndTime - currentTime
        var d = Math.floor(t / 1000 / 60 / 60 / 24);
        var h = Math.floor(t / 1000 / 60 / 60 % 24);
        var m = Math.floor(t / 1000 / 60 % 60);
        var s = Math.floor(t / 1000 % 60);
        return `${fillZero(d)}天 ${fillZero(h)}:${fillZero(m)}:${fillZero(s)}`
    }
    // 补零
    const fillZero = (str, len = 2) => {
        return (`${str}`).padStart(len, '0')
        // return (`${str}`).slice(-len)
    }
})();
