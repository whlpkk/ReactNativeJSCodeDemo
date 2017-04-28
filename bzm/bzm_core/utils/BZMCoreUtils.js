/*
 *
 * @providesModule BZMCoreUtils
 */
'use strict';

var TBFacade = require('TBFacade');
class BZMCoreUtils {
    static REQUEST_BASE_URL:string = "http://th5.m.zhe800.com";
    static HOME_YOUPIN_LOPP_KEY:string = "home_youpin"; //用于记录每5条一次的轮播
    static JKSTRING_KEY:string = "JKSTRING_KEY";
    static CART_LAST_REFRESH_TEIME:string = "cart_last_rtime";

    static calculateHeight(template_height:number,
                           original_width:number):number {
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        return (template_height * screenWidth) / original_width;
    }

    /**
     * 去掉字符串前后的空格
     * @param str 入参:要去掉空格的字符串
     * @returns
     */
    static trimAll(str:string):string {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    /**
     * 去掉字符串前的空格
     * @param str 入参:要去掉空格的字符串
     * @returns
     */
    static trimLeft(str:string):string {
        return str.replace(/^\s*/g, '');
    }

    /**
     * 去掉字符串后的空格
     * @param str 入参:要去掉空格的字符串
     * @returns
     */
    static trimRight(str:string):string {
        return str.replace(/\s*$/, '');
    }

    /**
     * 判断字符串是否为空
     * @param str 传入的字符串
     * @returns {boolean}
     */
    static isEmpty(str:string):boolean {
        return !!(str != null && str.length > 0);
    }

    /**
     * 判断两个字符串子否相同
     * @param str1
     * @param str2
     * @returns {Boolean}
     */
    static isEquals(str1:string, str2:string):boolean {
        return str1 == str2;
    }

    /**
     * 忽略大小写判断字符串是否相同
     * @param str1
     * @param str2
     * @returns {Boolean}
     */
    static isEqualsIgnoreCase(str1:string, str2:string):boolean {
        return str1.toUpperCase() == str2.toUpperCase();
    }

    /**
     * 判断js对象的长度
     * @param obj
     * @param min
     * @param max
     * @returns {Boolean}
     */
    static checkLength(obj:object, min:number, max:number):boolean {
        return !(obj.length < min || obj.length > max);
    }

    /**
     * 判断是否是数字
     * @param value
     * @returns {Boolean}
     */
    static isNum(value:object):boolean {
        return !!(value != null && value.length > 0 && isNaN(value) == false);
    }

    /**
     * 判断是否是中文
     * @param str
     * @returns {Boolean}
     */
    static isChine(value:object):boolean {
        return !!(value != null && value.length > 0 && isNaN(value) == false);
    }

    /**
     * 将分转成元
     * @param value
     * @returns {number}
     */
    static fenToYuan(value:number):number {
        return value / 100;
    }

    static tipType(state:number):object {
        if (state >= 500) {
            return {
                errorMessage: "工程师们正在抢修，请稍后再试",
                imageUrl: 'bundle://message_server_error@2x.png'
            };
        } else if (state == 404) {
            return {
                errorMessage: "工程师们正在抢修，请稍后再试",
                imageUrl: 'bundle://message_server_error@2x.png'
            };
        } else if (state == 401) {
            //需要用户登录
            return {};
        } else {
            return {
                errorMessage: "网络不稳定，请检查网络配置",
                imageUrl: 'bundle://message_server_error@2x.png'
            }
        }
    }

    static baseICONPath():string {
        return "http://i0.tuanimg.com/cs/zhe800rapp/img";
    }

    static dealIMGBasePath():string {
        return "http://z2.tuanimg.com/imagev2/trade/";
    }

    static iconURL(urlPath):string {
        return BZMCoreUtils.baseICONPath() + "/" + urlPath;
    }

    /**
     * 将字符串元转成合适数字
     * @param x
     * @returns {*}
     */
    static toDecimal(x:string):number {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return 0;
        }
        var s = f.toString();
        var rs = s.indexOf('.');
        var z = parseInt(f),
            y = 0;
        if (rs > 0) {
            y = parseFloat("0." + s.split(".")[1]);
        }
        f = Math.round(z * 100 + y * 100) / 100;
        return f;
    }

    /**
     * 追加out参数,打点
     * @param queryString
     * @param onSuccess
     */
    static wrapperOut(queryString:string, onSuccess:Function) {
        TBFacade.nativeInfo((data) => {
        });
    }


    static jsonParse(jsonString:string) {
        var ret = null;
        try {
            ret = JSON.parse(jsonString);
        } catch (e) {
            console.log("json 转换失败:" + e);
        }

        return ret;

    }

    /**
     * 将字符串转为日期
     * @param dString 如:2010-04-05 10:08:44
     * @returns {Date}
     */
    static stringToDate(dString:string) {
        var str = dString.replace(/-/g, "/");
        return new Date(str);
    }
}

/**
 * 将Date转成String
 * @param format
 * @returns String
 */
Date.prototype.Format = function (fmt) {
    //eg: date.Format("yyyy.MM.dd")
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = BZMCoreUtils;
