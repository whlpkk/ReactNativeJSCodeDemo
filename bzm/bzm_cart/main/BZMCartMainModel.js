/*
 * @providesModule BZMCartMainModel
 * @flow
 */
'use strict';
var BZMCoreUtils = require('BZMCoreUtils');
var TBExposureManager = require('TBExposureManager');


var BZMCartMainModel = function (cartListData, shopCouponData, isCouDanFinish) {
    this.cartListData = cartListData;
    if (cartListData.hasOwnProperty("invalidItemList")) {
        this.invalidItemList = cartListData.invalidItemList; //失效商品
    }
    this.itemList = cartListData.itemList;
    this.shopCouponData = shopCouponData;
    this.cartList = null;
    this.selectAll = false;
    this.selectedItems = null;
    this.editDeal = null; //保存当前编辑的deal
    this.isFinishCouDanPage = isCouDanFinish; //是否为完成凑单页面

    this.pageId = "shopc";
    this.pageName = "shopc";

    this.getDealByZIDAndSKU = function (zid:string, skuNum:string) {
        for (var inx in this.itemList) {
            var item = this.itemList[inx];
            var itemDetailList = item.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                if (deal.product.productId == zid && deal.product.skuNum == skuNum) {
                    return deal;
                }
            }
        }
        return null;
    };

    this.getDealByZIDAndSKU = function (zid:string, skuNum:string) {
        for (var inx in this.itemList) {
            var item = this.itemList[inx];
            var itemDetailList = item.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                if (deal.product.productId == zid && deal.product.skuNum == skuNum) {
                    return deal;
                }
            }
        }
        return null;
    };

    /**
     * 获取店铺优惠
     * @param sellerId
     */
    this.getShopCouponBySellerId = function (sellerId) {
        var descList = shopCouponData.descList;
        for (var inx in descList) {
            var item = descList[inx];
            if (item.sellerId == sellerId) {
                return item;
            }
        }
        return null;
    };

    this.getSelectedDealOfDeal = function (deal) {
        if (this.selectedItems == null) {
            this.selectedItems = this.getSelectedItems();
        }
        if (this.selectedItems == null) {
            return null;
        }
        var productId = deal.product.productId;
        var skuNum = deal.product.skuNum;
        for (var inx in this.selectedItems.selectedDeals) {

            var dealItem = this.selectedItems.selectedDeals[inx];
            if (dealItem.product.productId == productId && dealItem.product.skuNum == skuNum) {
                return dealItem;
            }
        }

        return null;
    };
    this.getSelectedSellerOfId = function (sellerId) {
        if (this.selectedItems == null) {
            this.selectedItems = this.getSelectedItems();
        }
        if (this.selectedItems == null) {
            return null;
        }
        for (var inx in this.selectedItems.items) {

            var seller = this.selectedItems.items[inx];
            if (seller.sellerInfo.sellerId == sellerId) {
                return seller;
            }
        }

        return null;
    };
    this.getSelectedRuleItemOfSeller = function (sellerId) {
        if (this.selectedItems == null) {
            this.selectedItems = this.getSelectedItems();
        }
        if (this.selectedItems == null) {
            return null;
        }
        for (var inx in this.selectedItems.items) {

            var seller = this.selectedItems.items[inx];
            if (seller.sellerInfo.sellerId == sellerId) {
                return seller;
            }
        }

        return null;
    };

    this.getRulePrice = function (item, seller) {
        var retPrice = seller.totalPrice;

        function sortRule(arr) {
            var priceArr = [];
            for (var pInx in arr) {
                var pItem = arr[pInx];
                var sp1 = pItem.split("-");
                var s1 = parseFloat(sp1[0]);
                var s2 = parseFloat(sp1[1]);
                priceArr.push({p1: s1, p2: s2});
            }
            //做降排列
            priceArr.sort(function (a, b) {
                return a.p1 < b.p1 ? 1 : -1
            });

            return priceArr;
        }

        var arr = item.rule.split(",");
        var inx = 0;
        switch (item.type) {
            case 1:
            {
                //满减
                var priceArr = sortRule(arr);
                seller.ruleOk = false;
                for (inx in priceArr) {
                    var pObj = priceArr[inx];
                    if (seller.totalPrice >= pObj.p1) {
                        //满足条件
                        retPrice = seller.totalPrice - pObj.p2;
                        seller.unsatisfyGap = 0;
                        seller.ruleOk = true;
                        seller.rule = pObj;
                        break;
                    }
                }
                if (!seller.ruleOk) {
                    //不满足满减
                    var obj1 = priceArr[priceArr.length - 1];
                    seller.unsatisfyGap = obj1.p1 - seller.totalPrice;
                    seller.rule = obj1;
                }
            }
                break;
            case 2:
            {
                //满减，上不封顶
                var priceArr2 = sortRule(arr);
                if (priceArr2.length > 0) {
                    var pObj2 = priceArr2[0];
                    var pCount = seller.totalPrice / pObj2.p1;
                    pCount = parseInt(pCount);
                    var price3 = pObj2.p2 * pCount;
                    retPrice = seller.totalPrice - price3;
                    seller.ruleOk = seller.totalPrice >= pObj2.p1;
                    seller.rule = pObj2;
                    seller.pCount = pCount;

                    if (!seller.ruleOk) {
                        //不满足满减
                        var obj3 = priceArr2[priceArr2.length - 1];
                        seller.unsatisfyGap = obj3.p1 - seller.totalPrice;
                        seller.ruleOk = false;
                        seller.rule = obj3;
                    }
                }

            }
                break;
            case 3:
            {
                //满折
                var discountArr = sortRule(arr);
                seller.pCount = seller.dealCount;
                for (inx in discountArr) {
                    var dObj = discountArr[inx];
                    if (seller.dealCount >= dObj.p1) {
                        //满足条件
                        retPrice = (seller.totalPrice * dObj.p2) / 10;
                        seller.ruleOk = true;
                        seller.rule = dObj;
                        break;
                    }
                }

                if (!seller.ruleOk) {
                    //不满足
                    var obj4 = discountArr[discountArr.length - 1];
                    seller.unsatisfyGap = obj4.p1 - seller.dealCount;
                    seller.ruleOk = false;
                    seller.rule = obj4;
                }
            }
                break;
            case 4:
            {
                //满多少件包邮
            }
                break;
            case 5:
            {
                //满多少钱包邮
            }
                break;
        }
        return retPrice;
    };

    /**
     * 获取商家优惠
     * @param seller //{sellerInfo:{}, totalPrice:0}
     */
    this.getCouponOfSeller = function (seller) {
        var totalPrice = seller.totalPrice;
        shopCouponData = this.shopCouponData;
        if (shopCouponData == null || !shopCouponData.hasOwnProperty("descList")) {
            return 0;
        }
        if (shopCouponData.hasOwnProperty("result")) {
            if (shopCouponData.result.code != 0) {
                return 0;
            }
        } else {
            return 0;
        }

        for (var inx in shopCouponData.descList) {
            var item = shopCouponData.descList[inx];

            if (item.sellerId == seller.sellerInfo.sellerId) {
                totalPrice = this.getRulePrice(item, seller);
                break;
            }
        }

        return totalPrice;
    };

    this.getPriceOfItems = function (items) {
        var sum = 0;
        for (var inx1 in items) {
            var deal = items[inx1].product;
            var curPrice = parseFloat(deal.curPrice);
            curPrice = curPrice * 100;
            curPrice = curPrice * deal.count;
            sum += curPrice;
        }
        sum = BZMCoreUtils.fenToYuan(sum);
        return sum;
    };

    this.deleteDealFromLocal = function (dealParam) {
        var productId = dealParam.product.productId;
        var skuNum = dealParam.product.skuNum;
        for (var inx in this.itemList) {
            var item = this.itemList[inx];
            var didFound = false;
            var itemDetailList = item.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                if (deal.product.productId == productId && deal.product.skuNum == skuNum) {
                    itemDetailList.splice(inx1, 1);
                    didFound = true;
                    break;
                }
            }
            if (itemDetailList.length < 1) {
                this.itemList.splice(inx, 1);
            }

            if (didFound) {
                this.selectedItems = null;
                this.refreshItems();
                break;
            }

        }
    };

    this.getSelectedItems = function () {
        var retArr = [];
        var dealCount = 0;
        var totalPrice = 0;
        var selectedDeals = [];
        for (var inx in this.itemList) {
            var item = this.itemList[inx];

            var itemDetailList = item.itemDetailList;
            var seller = {};
            seller.sellerInfo = item.sellerInfo;
            seller.deals = [];
            seller.dealCount = 0;
            seller.rule = null;
            seller.ruleOk = false; //是否满足优惠条件
            seller.unsatisfyGap = 0; //当不满足需求时, 显示还差多少满足需求
            seller.sel = false; //是否有选择的商品

            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                if (deal.cartSelected) {
                    seller.sel = true;
                    dealCount++;
                    seller.dealCount += deal.product.count;
                    seller.deals.push(deal);
                    selectedDeals.push(deal);
                }
            }
            seller.totalPrice = this.getPriceOfItems(seller.deals);
            seller.oTotalPrice = seller.totalPrice; //没有优惠的价格
            if (seller.sel) {
                //获取商家优惠,如果满足条件,则从totalPrice减去
                seller.totalPrice = this.getCouponOfSeller(seller);
                retArr.push(seller);
                totalPrice += seller.totalPrice;
            }
        }
        this.selectedItems = {
            items: retArr,
            dealCount: dealCount,
            totalPrice: totalPrice,
            selectedDeals: selectedDeals
        };

        return this.selectedItems;
    };

    this.getSellerSatisfy = function (sellerId) {
        shopCouponData = this.shopCouponData;
        if (shopCouponData == null || !shopCouponData.hasOwnProperty("descList")) {
            return null;
        }

        if (shopCouponData.hasOwnProperty("result")) {
            if (shopCouponData.result.code != 0) {
                return null;
            }
        } else {
            return null;
        }

        for (var inx in shopCouponData.descList) {
            var item = shopCouponData.descList[inx];
            if (item.sellerId == sellerId) {
                return item;
            }
        }

        return null;
    };

    /**
     * 根据每个deal的选中状态更新seller和全选的状态
     */
    this.updateAllSelectState = function () {
        this.selectedItems = null;
        var selectAction = true;
        for (var inx in this.itemList) {
            var item = this.itemList[inx];
            var sellerInfo = item.sellerInfo;
            var sellerSelectAction = true;

            var itemDetailList = item.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                if (!deal.cartSelected) {
                    sellerSelectAction = false;
                    selectAction = false;
                    break;
                }
            }
            sellerInfo.cartSelected = sellerSelectAction;
        }
        this.selectAll = selectAction;
    };

    this.updateSellerSelectState = function (sellerInfo) {
        var selectAction = sellerInfo.cartSelected;
        for (var inx in this.itemList) {
            var item = this.itemList[inx];
            if (sellerInfo.sellerId == item.sellerInfo.sellerId) {
                var itemDetailList = item.itemDetailList;
                for (var inx1 in itemDetailList) {
                    var deal = itemDetailList[inx1];
                    deal.cartSelected = selectAction;
                }
                break;
            }
        }

        this.updateAllSelectState();
    };

    this.getDealByItemKey = function (itemKey:string) {
        for (var inx in this.itemList) {
            var item = this.itemList[inx];
            var itemDetailList = item.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                if (deal.cartItemIndexKey == itemKey) {
                    return deal;
                }
            }
        }
        return null;
    };

    this.updateItemListSelectState = function (selectAction:boolean) {
        if (this.itemList == null) {
            return;
        }
        this.selectedItems = null;
        for (var inx in this.itemList) {
            var item = this.itemList[inx];
            var sellerInfo = item.sellerInfo;
            sellerInfo.cartSelected = selectAction;

            var itemDetailList = item.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                deal.cartSelected = selectAction;
            }
        }
        this.selectAll = selectAction;
    };

    this.updateSellerRule = function () {
        //获取商家满减
        if (shopCouponData != null && shopCouponData.hasOwnProperty("descList")) {
            for (var inx in this.itemList) {
                var item = this.itemList[inx];
                var sellerInfo = item.sellerInfo;

                var satisfyItem = this.getSellerSatisfy(sellerInfo.sellerId);
                if (satisfyItem != null) {
                    item.sellerRule = satisfyItem;
                }
            }
        }
    };

    this.topCartData = function () {
        if (this.isFinishCouDanPage) {
            return [];
        }
        var cartData = [
            {
                type: "tb_cart"
            },
            {
                type: "mall_sep"
            }
        ];
        if (this.invalidItemList != undefined && this.invalidItemList.length > 0) {
            cartData.push({
                type: "invalid_goods"
            });
        }
        return cartData;
    };

    this.refreshItems = function () {
        var cartData = this.topCartData();
        this.updateSellerRule();
        this.cartList = cartData.concat(this.itemList);
    };
    this.generateItemKey = function () {
        if (this.itemList == null) {
            return;
        }
        this.selectedItems = null;
        var itemIndex = 0;
        for (var inx in this.itemList) {
            var item = this.itemList[inx];

            var itemDetailList = item.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];
                deal.cartItemIndexKey = deal.product.productId + itemIndex;
                deal.errorMessage = null;
                deal.analysisIndex = itemIndex + 1;
                deal.appearTime = 0;
                deal.disAppearTime = 0;
                itemIndex++;
            }
        }
    };
    this.initFunction = function () {
        var cartData = this.topCartData();

        //获取商家满减
        this.updateSellerRule();
        this.updateItemListSelectState(false);
        this.generateItemKey();
        if (this.itemList != null && this.itemList.length > 0) {
            this.cartList = cartData.concat(this.itemList);
        } else {
            cartData.push({
                type: "empty"
            });
            this.cartList = cartData;
        }
    };

    /**
     * 用于购物车商品列表的展示
     * @param shopData
     */
    this.getSellerListDeals = function (shopData) {
        var sourceArr = [];
        var itemDetailList = shopData.itemDetailList;
        var promotionId = null;
        for (var inx in itemDetailList) {
            var item = itemDetailList[inx];
            sourceArr.push(item);
            sourceArr.push({type: "cart_dealsepline"});
            if (promotionId == null) {
                promotionId = item.product.promotionId;
            }
        }
        shopData.sellerInfo.promotionId = promotionId;
        if (sourceArr.length > 1) {
            sourceArr.splice(-1, 1)
        }

        var viewItems = [];
        viewItems.push({type: "cart_seller", data: shopData.sellerInfo});
        viewItems.push({type: "cart_sellerbottomline"});
        if (!this.isFinishCouDanPage && shopData.hasOwnProperty("sellerRule")) {
            viewItems.push({type: "cart_sellerrule", data: shopData.sellerRule});
        }
        viewItems.push(...sourceArr);
        if (!this.isFinishCouDanPage && shopData.hasOwnProperty("sellerRule") && shopData.sellerRule.hasOwnProperty("unsatisfyRule")) {
            viewItems.push({type: "cart_coudan", data: shopData});
            viewItems.push({type: "cart_coudanbottomline"});
        } else {
            viewItems.push({type: "cart_coudanbottomline"});
        }
        return viewItems;
    };

    this.checkExposureItems = function () {

        for (var inx in this.itemList) {
            var pItem = this.itemList[inx];

            var itemDetailList = pItem.itemDetailList;
            for (var inx1 in itemDetailList) {
                var deal = itemDetailList[inx1];

                if (deal.appearTime < 1) {
                    continue;
                }
                var appearTime = deal.appearTime;
                var disAppearTime = deal.disAppearTime;
                var tt = disAppearTime - appearTime;

                if (tt > 1000 || tt < 0) {
                    var sourceType = "2";
                    if (deal.product.isLightAudit > 0) {
                        //轻审核
                        sourceType = "6";
                    }

                    var analysisVO = {
                        analysisId: deal.product.promotionId,
                        analysisType: "deallist",
                        analysisIndex: deal.analysisIndex,
                        analysisSourceType: sourceType
                    };
                    TBExposureManager.exposureItems(analysisVO,
                        Math.floor(appearTime / 1000),
                        this.pageId, this.pageName
                    );
                    deal.appearTime = 0;
                    deal.disAppearTime = 0;

                }

            }
        }
    };
    this.initFunction();
};

module.exports = BZMCartMainModel;
