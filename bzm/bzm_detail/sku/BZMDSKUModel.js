/*
 * @providesModule BZMDSKUModel
 * @flow
 */
'use strict';
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCartMainModel = require('BZMCartMainModel');

/**
 *
 * @param skuItems
 * @param stock
 * @param dealInfo
 * @param jk
 * @param bottomBtnType 取值: sure, cart, default
 * @param action 取值: edit, default, cart, buy
 * @constructor
 */
var BZMDSKUModel = function (skuItems,stock, dealInfo, jk, bottomBtnType, action) {
    this.skuSelectDefault = null;
    this.priceSectionDefault = null;
    this.imageBaseUrl = "http://z2.tuanimg.com/imagev2/trade/";
    this.sections = null;
    this.skuItems = skuItems;
    this.stock = stock;
    this.bzmData = null;
    this.dealInfo = dealInfo;
    this.action = action;
    this.jk = jk;
    this.bottomBtnType = bottomBtnType;
    this.cartModel = null;
    this.enableResponseKeyboard = false;

    if (dealInfo == undefined) {
        this.dealInfo = null;
    }
    if (action == undefined) {
        this.action = null;
    }

    this.selectSKUItem = function (skuItem) {
        var sections = this.sections;

        if (skuItem.selected) {
            var secItem1 = this.getSectionItemOfSecID(skuItem.secId);
            secItem1.selectedItem = null;
            this.restoreState();
            skuItem.selected = false;
        } else {
            this.resetSKUSectionState(skuItem.secId, false); //重置选中状态
            skuItem.selected = true;
            this.updateSKUIDS(skuItem.childIds); //更新关联item的disable状态
            this.updateSKUIDS(skuItem.parentIds); //更新关联item的disable状态
            var secItem = this.getSectionItemOfSecID(skuItem.secId);
            secItem.selectedItem = skuItem;
        }
        this.resetSKUDisableState();

        if (skuItem.hasOwnProperty("vPicture")) {
            this.bzmData.vPicture = this.imageBaseUrl + skuItem.vPicture;
        }
        if (sections[0].selectedItem == null) {
            this.bzmData.vPicture = this.imageBaseUrl + sections[0].data[0].vPicture;
        }

        return this.getSelectedSku();
    };

    this.selectSKUWithID = function (skuNum) {
        if (skuNum == undefined) {
            return;
        }
        var idArr = skuNum.split(":");
        var data1 = null;
        var data2 = null;
        if (idArr.length > 1) {
            data1 = this.skuSectionWithSKU(idArr[0]);
            data2 = this.skuSectionWithSKU(idArr[1]);
        } else {
            data1 = this.skuSectionWithSKU(idArr);
        }
        if (data1 != null && !data1.item.disabled) {
            data1.item.secId = data1.sec.id;
            this.selectSKUItem(data1.item);
        }
        if (data2 != null && !data2.item.disabled) {
            data2.item.secId = data2.sec.id;
            this.selectSKUItem(data2.item);
        }
    };

    this.restoreState = function () {
        var selectedItem = null;
        var secItem = null;
        for (var key1 in this.sections) {
            var secItem1 = this.sections[key1];
            if (secItem1.type != "sku") {
                continue;
            }
            if (secItem1.selectedItem) {
                selectedItem = secItem1.selectedItem;
                secItem = secItem1;
                break;
            }
        }
        if (!selectedItem) { //恢复全部默认状态
            for (var key2 in this.sections) {
                var secItem2 = this.sections[key2];
                this.resetSKUSectionState(secItem2.id, false, false);
            }
        } else {
            this.resetSKUSectionState(secItem.id, false, false);
            selectedItem.selected = true;
            this.updateSKUIDS(selectedItem.childIds); //更新关联item的disable状态
            this.updateSKUIDS(selectedItem.parentIds); //更新关联item的disable状态
        }
    };

    this.getSelectedSku = function () {
        var retArr = [];
        var idSec = null;
        var didFinishSelect = true;
        for (var inx in this.sections) {
            var item1 = this.sections[inx];
            if (item1.type == 'sku') {
                if (item1.selectedItem == null) {
                    didFinishSelect = false;
                    continue;
                }
                retArr.push({label: item1.name, item: item1.selectedItem});
                if (idSec != null) {
                    idSec = idSec + ":" + item1.selectedItem.id;
                } else {
                    idSec = item1.selectedItem.id;
                }
            }
        }
        if (!didFinishSelect) {
            return {
                selectedItems: retArr
            };
        }
        var skuItems = this.skuItems;
        for (var inx1 in skuItems) {
            var item = skuItems[inx1];
            if (item.propertyName.length < 1) {
                continue;
            }
            if (item.propertyNum == idSec) {
                return {
                    item: item,
                    selectedItems: retArr
                };
            }
        }
        return null;
    };

    this.updateChildStateOfSection = function (secItem, skuItemIDs) {
        this.resetSKUSectionState(secItem.id, false, true);
        skuItemIDs.forEach(function (skuID) {
            var data = secItem.data;
            data.forEach(function (skuItem) {
                if (skuItem.id == skuID) {
                    skuItem.tagDisabled = false;
                }
                if (skuItem.disabled) {
                    skuItem.tagDisabled = skuItem.disabled;
                    if (secItem.selectedItem && secItem.selectedItem.id == skuItem.id) {
                        secItem.selectedItem = null;
                    }
                }
            });
        });
    };

    this.skuSectionWithSKU = function (skuId) {
        for (var index in this.sections) {
            var secItem = this.sections[index];
            if (secItem.type == "sku") {
                var data = secItem.data;
                if (data != undefined && data.length > 0) {
                    for (var skuKey in data) {
                        var skuItem = data[skuKey];
                        if (skuItem.id == skuId) {
                            return {item: skuItem, sec: secItem};
                        }
                    }
                }
            }
        }

        return null;
    };

    this.skuItemOfId = function (skuId) {
        var data = this.skuSectionWithSKU(skuId);
        if (data != null) {
            return data.item;
        }

        return null;
    };

    this.updateSKUIDS = function (skuIDS) {
        var retSecItem = null;
        //先找到需要更新的section段, 然后更新该section
        for (var key in skuIDS) {
            var skuID = skuIDS[key];
            for (var secKey in this.sections) {
                var secItem = this.sections[secKey];
                if (secItem.type != "sku") {
                    continue;
                }
                secItem.selected = false;
                if (secItem.data == undefined) {
                    continue;
                }
                var data = secItem.data;
                if (data.length < 1) {
                    continue;
                }

                for (var skuKey in data) {
                    var skuItem = data[skuKey];
                    if (skuItem.id == skuID) {
                        retSecItem = secItem;
                        break;
                    }
                }

                if (retSecItem != null) {
                    break;
                }
            }
        }
        if (retSecItem != null) {
            this.updateChildStateOfSection(retSecItem, skuIDS);
            if (retSecItem.selectedItem) {
                retSecItem.selectedItem.selected = true;
            }
        }
    };
    this.getSectionItemOfSecID = function (secId) {
        for (var key in this.sections) {
            var secItem = this.sections[key];

            if (secItem.id == secId) {
                return secItem;
            }
        }
        return null;
    };

    /**
     * 获取库存
     * @param skuNum
     * @returns {*}
     */
    this.stockOfId = function (skuNum) {
        var stockObject = this.stock;
        var stockItems = stockObject.stockItems;

        for (var index in stockItems) {
            var stock = stockItems[index];
            if (stock.skuNum == skuNum) {
                return stock;
            }
        }

        return null;
    };

    /**
     * 获取原始sku数据
     * @param skuNum
     * @returns {*}
     */
    this.skuOfId = function (skuNum) {
        var skuObject = this.skuItems;

        for (var index in skuObject) {
            var sku = skuObject[index];
            if (sku.propertyNum == skuNum) {
                return sku;
            }
        }

        return null;
    };

    /**
     *
     * @param secId
     * @param selected 更新所有items的默认选中状态
     * @param disabled 该参数可不传, 不传则代表不更新tagDisabled状态
     */
    this.resetSKUSectionState = function (secId, selected, disabled) {
        if (secId == undefined) {
            return;
        }

        for (var key in this.sections) {
            var secItem = this.sections[key];
            if (secItem.type != "sku") {
                continue;
            }
            if (secItem.data == undefined) {
                continue;
            }
            var data = secItem.data;
            if (data.length < 1) {
                continue;
            }

            if (secItem.id == secId) {
                for (var key2 in data) {
                    var skuItem = data[key2];
                    skuItem.selected = selected;
                    if (disabled != undefined) {
                        skuItem.tagDisabled = disabled;
                    }

                    if (skuItem.disabled) {
                        skuItem.tagDisabled = skuItem.disabled;
                    }
                }
                break;
            }
        }
    };

    /**
     * 更新sku状态是否可用,库存为0时不可用
     * @param ids
     * @param pIdFormat 如: "@:232", "223:@"
     */
    this.resetSKUDisableStateOfIds = function (ids, pIdFormat) {
        for (var index in ids) {
            var itemId = ids[index];
            var skuNum = pIdFormat.replace("@", itemId);
            var stock = this.stockOfId(skuNum);
            if (stock != null && stock.count < 1) {
                var obj1 = this.skuItemOfId(itemId);
                if (obj1 != null) {
                    obj1.tagDisabled = true;
                }
            }
        }
    };

    /**
     * 更新sku状态是否可用,库存为0时不可用
     */
    this.resetSKUDisableState = function () {
        var skuItem1 = this.sections[0].selectedItem;
        var skuItem2 = null;
        var id1 = null;
        var ids = null;
        var pIdFormat = null;
        var skuNum = null;
        var stock = null;
        var skuSelect = this.skuSelectDefault;
        var skuObj = null;

        if (skuItem1) {
            id1 = skuItem1.id;
            ids = skuItem1.childIds;
            pIdFormat = id1 + ":@";
            this.resetSKUDisableStateOfIds(ids, pIdFormat);
        }
        if (this.sections.length > 2) {
            //二维
            skuItem2 = this.sections[1].selectedItem;
            if (skuItem2) {
                id1 = skuItem2.id;
                ids = skuItem2.parentIds;
                pIdFormat = "@:" + id1;
                this.resetSKUDisableStateOfIds(ids, pIdFormat);
            }

            if (!skuItem1 && !skuItem2) {
                this.resetSKUSectionState(this.sections[0].id, false, false);
                this.resetSKUSectionState(this.sections[1].id, false, false);
            } else if (skuItem1 && skuItem2) {
                //更新库存
                skuNum = skuItem1.id + ":" + skuItem2.id;
                stock = this.stockOfId(skuNum);
                skuSelect = "已选" + skuItem1.name + "、" + skuItem2.name;
                skuObj = this.skuOfId(skuNum);
            } else {
                if (this.sections.length>0) {
                    if (skuItem1) {
                        skuSelect = "请选择" + this.sections[1].name;
                    } else if (skuItem2) {
                        skuSelect = "请选择" + this.sections[0].name;
                    }
                } else {
                    skuSelect = "";
                }
            }
        } else if (!skuItem1) {
            this.resetSKUSectionState(this.sections[0].id, false, false);
        } else {
            skuNum = skuItem1.id;
            stock = this.stockOfId(skuNum);
            skuSelect = "已选" + skuItem1.name;
            skuObj = this.skuOfId(skuNum);
        }

        if (stock) {
            this.bzmData.stockCount = stock.count;
            this.bzmData.lockCount = stock.lockCount;
        } else {
            this.bzmData.stockCount = this.stock.total;
            this.bzmData.lockCount = this.stock.lockTotal;
        }
        this.bzmData.skuSelect = skuSelect;
        if (skuObj) {
            this.bzmData.priceSection = BZMCoreUtils.fenToYuan(skuObj.curPrice);
        } else {
            this.bzmData.priceSection = this.priceSectionDefault;
        }
    };

    this.convertSKU = function () {
        skuItems = this.skuItems;
        stock = this.stock;

        var secondItems = [];
        var firstItems = [];
        var sectionItems = [];

        var firstDict = {};
        var secondDict = {};

        var t1 = null;
        var t2 = null;

        for (var index in skuItems) {
            var item = skuItems[index];
            if (item.propertyName.length < 1) {
                continue;
            }
            var pName = item.propertyName;
            var propertyNum = item.propertyNum;
            var pNameArr = pName.split(":");
            var proIDArr = propertyNum.split(":");
            if (pNameArr.length > 1) {

                //二维
                var sItem1 = pNameArr[0];
                var arr2 = sItem1.split("-");
                var secName1 = arr2[0];
                var tagName1 = arr2[1];
                var sItem2 = pNameArr[1];
                arr2 = sItem2.split("-");
                var secName2 = arr2[0];
                var tagName2 = arr2[1];
                var id1 = proIDArr[0];
                var id2 = proIDArr[1];

                if (sectionItems.length < 1) {
                    sectionItems.push(secName1);
                    sectionItems.push(secName2);
                }

                if (!firstDict.hasOwnProperty(id1)) {
                    firstDict[id1] = {};
                    t1 = firstDict[id1];
                    t1.name = tagName1;
                    t1.id = id1;
                    t1.childIds = [];
                    t1.disabled = false;
                    t1.tagDisabled = false;
                    t1.selected = false;
                    firstItems.push(t1);
                } else {
                    t1 = firstDict[id1];
                }

                if (!secondDict.hasOwnProperty(id2)) {
                    secondDict[id2] = {};
                    t2 = secondDict[id2];
                    t2.name = tagName2;
                    t2.id = id2;
                    t2.parentIds = [];
                    t2.disabled = false;
                    t2.tagDisabled = false;
                    t2.selected = false;
                    secondItems.push(t2);
                } else {
                    t2 = secondDict[id2];
                }
                t1.vPicture = item.vPicture;
                t1.childIds.push(t2.id);
                t2.parentIds.push(t1.id);

            } else {
                //一维
                var arr3 = pNameArr[0].split("-");
                if (sectionItems.length < 1) {
                    sectionItems.push(arr3[0]);
                }

                t1 = {};
                t1.name = arr3[1];
                t1.id = proIDArr[0];
                t1.propertyNum = propertyNum;
                t1.tagDisabled = false;
                t1.disabled = false;
                t1.selected = false;

                firstItems.push(t1);
            }

        }

        var p_sections = {};
        p_sections.data = {
            stockCount: this.stock.total,
            lockCount: this.stock.lockTotal,
            skuSelect: "",
            priceSection: "",
            count: "1",
            vPicture: ""
        };
        p_sections.skuSections = [];
        var s1 = {};
        s1.type = "sku";
        s1.name = sectionItems[0];
        s1.data = firstItems;
        s1.id = 1;
        p_sections.skuSections.push(s1);

        if (sectionItems.length > 1) {
            var s2 = {};
            s2.id = 2;
            s2.type = "sku";
            s2.name = sectionItems[1];
            s2.data = secondItems;
            p_sections.skuSections.push(s2);
            p_sections.data.skuSelect = "请选择" + s1.name + "、" + s2.name;
        } else if (sectionItems.length > 0) {
            p_sections.data.skuSelect = "请选择" + s1.name;
        } else  {
            p_sections.data.skuSelect = "";
        }
        this.skuSelectDefault = p_sections.data.skuSelect;

        var len = skuItems.length;
        if (len > 1) {
            //按照价格做升序排列
            skuItems.sort(function (a, b) {
                return a.curPrice > b.curPrice ? 1 : -1
            });
            var price1 = skuItems[0].curPrice;
            var price2 = skuItems[len - 1].curPrice;
            if (price2 - price1 > 0.0001) {
                p_sections.data.priceSection = BZMCoreUtils.fenToYuan(price1) + "-" + BZMCoreUtils.fenToYuan(price2);
            } else {
                p_sections.data.priceSection = BZMCoreUtils.fenToYuan(price1);
            }
            if (firstItems.length > 0) {
                p_sections.data.vPicture = this.imageBaseUrl + firstItems[0].vPicture;
            }
        } else {
            var price = skuItems[0].curPrice;
            p_sections.data.priceSection = BZMCoreUtils.fenToYuan(price);
        }
        this.priceSectionDefault = p_sections.data.priceSection;
        this.bzmData = p_sections.data;
        this.sections = p_sections.skuSections;


        if (skuItems.length==1 && this.dealInfo != null) {
            var pItem = skuItems[0];

            if (pItem.vPicture.length<1 && this.dealInfo.product.imgKey.length>0) {
                var imgArr = this.dealInfo.product.imgKey.split(",");
                pItem.vPicture = imgArr[0];
                this.bzmData.vPicture = this.imageBaseUrl + pItem.vPicture;
            }
        }
    };

    this.convertSKU();
};

module.exports = BZMDSKUModel;
