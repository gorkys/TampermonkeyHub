// ==UserScript==
// @name         华为商城抢购
// @namespace    https://github.com/gorkys/TampermonkeyHub
// @version      1.0.0
// @description  try to take over the world!
// @author       Gorkys
// @license      MIT
// @match        https://www.vmall.com/product/*.html
// @match        https://www.vmall.com/order/nowConfirmcart
// @supportURL   https://github.com/gorkys/TampermonkeyHub
// @updateURL    https://github.com/gorkys/TampermonkeyHub/vmall-rushToBuy.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const cycle = setInterval(() => {
        getTime()
    }, 200)

    const getTime = () => {
        let data = null;

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                const res = JSON.parse(this.responseText)
                // const startTime = res.skuRushBuyInfoList.startTime
                // const startTime = new Date('2020/03/06 22:32:00').getTime()
                const startTime = 1583633280000

                const currentTime = res.currentTime
                // console.log(getDistanceSpecifiedTime(startTime, currentTime))
                rushToBuy(startTime, currentTime)
            }
        });

        xhr.open("GET", "https://buy.vmall.com/getSkuRushbuyInfo.json");
        // xhr.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 UBrowser/6.2.4098.3 Safari/537.36");

        xhr.send(data);
    }

    const rushToBuy = (startTime, currentTime) => {
        // const currentTime = new Date().getTime()
        if (startTime - currentTime < 100) {
            rush.business.doGoRush(2);
            // console.log('开始抢了,' + (startTime - currentTime).toString())
            // clearInterval(cycle)
        }
    }
    const getDistanceSpecifiedTime = (dateTime, currentTime) => {
        // 指定日期和时间
        // var EndTime = new Date(dateTime);
        // 当前系统时间
        // var NowTime = new Date();
        // var t = EndTime.getTime() - NowTime.getTime();
        var t = dateTime - currentTime
        var d = Math.floor(t / 1000 / 60 / 60 / 24);
        var h = Math.floor(t / 1000 / 60 / 60 % 24);
        var m = Math.floor(t / 1000 / 60 % 60);
        var s = Math.floor(t / 1000 % 60);
        var html = d + " 天" + h + " 时" + m + " 分" + s + " 秒";
        console.log(html);
    }
    ec.order.confirmSubmit()
})();
