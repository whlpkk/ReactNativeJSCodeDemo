/*
 *
 * @providesModule BZMCartMain
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    ListView,
    View,
    StatusBar

    } = React;
var TBFacade = require('../../bzm_core/components/TBFacade');
var TBImage = require('../../bzm_core/components/TBImage');
var TBLoading = require('TBLoading');
var BZMCoreModel = require('BZMCoreModel');
var TBLogin = require('TBLogin');
var TBTip = require('TBTip');
var BZMCartNavigationBar = require('BZMCartNavigationBar');
var BZMCartMainTBCart = require('BZMCartMainTBCart');
var BZMCartMallSep = require('BZMCartMallSep');
//var BZMCartMainDeal = require('BZMCartMainDeal');
var BZMCartMainInvalid = require('BZMCartMainInvalid');
var BZMCartMainBottom = require('BZMCartMainBottom');
var BZMCartMainModel = require('BZMCartMainModel');
var BZMDSKUModel = require('BZMDSKUModel');
var BZMDSKUView = require('BZMDSKUView');
var TBAnimation = require('TBAnimation');
var TBExposureManager = require('TBExposureManager');
var TBAlert = require('TBAlert');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var BZMCartMainEmpty = require('BZMCartMainEmpty');
var BZMCartMainBottomCouDan = require('BZMCartMainBottomCouDan');
var BZMCartMainDealCoupon = require('BZMCartMainDealCoupon');
var BZMCartMainDealSeller = require('BZMCartMainDealSeller');
var BZMCartMainDealItemView = require('BZMCartMainDealItemView');
var BZMCartMainDealCouDan = require('BZMCartMainDealCouDan');
let CART_LIST = BZMCoreUtils.REQUEST_BASE_URL + "/h5/api/cart/list";
let CART_SHOP_COUPON = BZMCoreUtils.REQUEST_BASE_URL + "/h5/api/getdiscounttotal";

var cartListData = null;
var shopCouponData = null;
var cartModel = null;
var refreshPage = true;
var skuModel = null;
var skuLoading = false;
var sku = null;
var stock = null;
var didLoadSKU = false;
var didLoadStock = false;
var firstLoadCouDan = true; //用于完成凑单页面的价格计算
var BZMCartMain = React.createClass({
    getInitialState: function () {
        this.isCouDanFinishPage = this.props.sellerId != undefined;
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true
            }),
            loaded: false,
            loading: false
        };
    },

    _onPressDelete: function (deal) {
        var zId = deal.product.productId;
        var skuNum = deal.product.skuNum;
        var urlString = 'http://th5.m.zhe800.com/h5/api/cart/delete?productId=' + zId + "&skuNum=" + skuNum;

        TBAlert.alert(
            '',
            '确定删除吗?',
            [
                {
                    text: '确定', onPress: () => {

                    this.reloadListData();
                    fetch(urlString).then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else if (response.status == 401) {
                            TBLogin.login(
                                (e)=> {
                                    this._onPressDelete(deal);
                                }, (e)=> {
                                    //显示某个默认页面
                                    TBTip.show('取消登录');
                                }
                            );
                        } else {
                            return null;
                        }
                    }, (e) => {
                        TBTip.show("删除失败");
                    }).then((obj) => {
                        if (obj.hasOwnProperty('code') && obj.code == 0) {
                            TBTip.show("删除成功");
                            cartModel.deleteDealFromLocal(deal);
                            this.loadShopCoupon();
                        } else {
                            TBTip.show("删除失败");
                        }
                    });
                }
                },
                {text: '取消', onPress: () => console.log('取消!')}
            ],
            'default', 'center'
        );
    },

    _openSku: function (deal) {
        if (didLoadSKU && didLoadStock) {
            skuLoading = false;
        }
        if (sku && stock) {
            if (sku.sku == null) {
                TBTip.show('商品属性加载失败');
                return;
            }
            skuModel = new BZMDSKUModel(sku.sku, stock, sku, '', 'sure', 'edit');
            skuModel.selectSKUWithID(deal.product.skuNum);
            skuModel.bzmData.count = deal.product.count + "";
            skuModel.cartModel = cartModel;
            cartModel.editDeal = cartModel.getDealByItemKey(deal.cartItemIndexKey);
            skuModel.enableResponseKeyboard = true;

            this.reloadListData();

            var pView = this.refs["presentView"];
            var cView = this.refs["containerView"];
            var reactTag = React.findNodeHandle(pView);
            var cTag = React.findNodeHandle(cView);
            TBAnimation.presentView(reactTag, cTag);
        }
    },

    _onPressEdit: function (deal) {
        if (skuLoading) {
            return;
        }
        didLoadSKU = false;
        didLoadStock = false;
        sku = null;
        stock = null;
        skuLoading = true;
        var zid = deal.product.productId;
        var skuUrl = BZMCoreUtils.REQUEST_BASE_URL + "/tradeapi/cach/product/v1/" + zid;
        fetch(skuUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            didLoadSKU = true;
            if (response.ok) {
                return response.json();
            } else {
                console.log("response!", response.status);
                return {};
            }
        }, (e) => {
            didLoadSKU = true;
            console.log("请求失败!", e);
            this._openSku(deal);
        }).then((skuObject) => {
            didLoadSKU = true;
            sku = skuObject;

            this._openSku(deal);
        });

        var stockUrl = BZMCoreUtils.REQUEST_BASE_URL + "/h5new/real/prodstatus?zid=" + zid;
        fetch(stockUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            didLoadStock = true;
            if (response.ok) {
                return response.json();
            } else {
                console.log("response!", response.status);
                return {};
            }
        }, (e) => {
            didLoadStock = true;
            console.log("请求失败!", e);
            this._openSku(deal);
        }).then((skuObject) => {
            didLoadStock = true;
            stock = skuObject["/h5/api/skunew"];

            stock = JSON.parse(stock);
            this._openSku(deal);
        });

    },
    openWindow: function (url) {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.forward(cTag, url);
    },

    containerResponderCapture: function (evt) {
        return this.props.tbNativeMoving;
    },

    _updateCartRefreshTime: function() {
        var date1 = new Date();
        var dString = date1.Format('yyyy-MM-dd HH:mm:ss');
        TBFacade.setItem(BZMCoreUtils.CART_LAST_REFRESH_TEIME, dString, ()=>{});
    },

    _reloadModel: function () {
        this._updateCartRefreshTime();
        TBFacade.user((item)=> {
            if (item.hasOwnProperty("userId")) {
                this.loadCartList();
            } else {
                TBLogin.login(
                    (e)=> {
                        this.loadCartList();
                    }, (e)=> {
                        //显示某个默认页面
                        TBTip.show('取消登录');
                    }
                );
            }
        });
    },
    _loadItems:function() {
        if (cartModel == null || cartModel.itemList == null || cartModel.itemList.length < 1) {
            this._reloadModel();
            return;
        }
        TBFacade.getItem(BZMCoreUtils.CART_LAST_REFRESH_TEIME, (value) => {
            if (value != null) {
                var date = BZMCoreUtils.stringToDate(value);
                var date2 = new Date();
                var m1 = date.getTime();
                var m2 = date2.getTime();
                var deta = 1000*60*10; //十分钟刷新一次
                if (m1 - m2 >= deta) {
                    this._reloadModel();
                }
            } else {
                this._reloadModel();
            }
        });
    },
    componentDidMount: function () {
        BZMCoreModel.registerComponent['BZMCartMain'] = (methodName, params) => {
            if (methodName == 'viewDidAppear') {
                this._loadItems();
            } else if (methodName == 'loadItems') {
                this._loadItems();
            } else if (methodName == 'pressSKUBottomBtn') {
                skuModel.pressSure();
            } else if (methodName == 'viewWillDisappear') {
                if (skuModel) {
                    skuModel.enableResponseKeyboard = false;
                }
            }
        };
        this._reloadModel();
    },

    reloadListData: function () {
        var cartList = cartModel.cartList;
        var listData = [];
        let cartLen = cartList.length;
        for (var inx=0; inx<cartLen; inx++) {
            var item = cartList[inx];
            if (item.hasOwnProperty("type")) {
                listData.push(item);
            } else {
                listData.push(...cartModel.getSellerListDeals(item));
            }
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(listData),
            loaded: true,
            loading: false
        });
    },

    reloadList: function () {

        if (refreshPage) {
            refreshPage = false;
            cartModel = new BZMCartMainModel(cartListData, shopCouponData, this.isCouDanFinishPage);
            if (this.isCouDanFinishPage && cartModel.itemList != null && cartModel.itemList.length > 0) {
                var sellerInfo = cartModel.itemList[0].sellerInfo;
                sellerInfo.cartSelected = true;
                cartModel.updateSellerSelectState(sellerInfo);
            }
            this.reloadListData();
        } else {
            cartModel.shopCouponData = shopCouponData;
            cartModel.updateSellerRule();
            this.reloadListData();
            return;
        }

        var containerView = this.refs["containerView"];
        var cTag = React.findNodeHandle(containerView);
        this.state.loading = false;
        TBLoading.hidePageLoading(cTag, {});
    },

    reloadCart: function () {
        if (cartListData != null && shopCouponData != null) {
            this.reloadList();
        }
    },

    loadShopCoupon: function () {
        if (cartListData == null) {
            return;
        }

        var shopList = cartListData.itemList;
        if (shopList == null || shopList.length < 1) {
            shopCouponData = {};
            this.reloadCart();
            return;
        }
        var requestBody = [];
        for (var inx in shopList) {
            var sellerInfo = shopList[inx].sellerInfo;
            var itemDetailList = shopList[inx].itemDetailList;
            var rItem = {};
            rItem.sellerId = sellerInfo.sellerId;
            rItem.prodList = [];
            for (var inx2 in itemDetailList) {
                var dealItem = itemDetailList[inx2];
                var rDeal = {};
                var obj1 = null;
                if (cartModel) {
                    obj1 = cartModel.getSelectedDealOfDeal(dealItem);
                }
                if (obj1 != null || (this.isCouDanFinishPage && firstLoadCouDan)) {
                    rDeal.productId = dealItem.product.productId;
                    rDeal.skuNum = dealItem.product.skuNum;
                    rDeal.count = dealItem.product.count;
                } else {
                    rDeal.productId = "";
                    rDeal.skuNum = "";
                    rDeal.count = 0;
                }

                rItem.prodList.push(rDeal);
            }
            requestBody.push(rItem);
        }
        firstLoadCouDan = false;
        var requestBodyStr = JSON.stringify(requestBody);

        //获取商家优惠, 不影响主页面的展示
        fetch(CART_SHOP_COUPON, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: requestBodyStr
        }).then((response) => {
            this.state.loading = false;
            if (response.ok) {
                return response.json();
            } else if (response.status == 401) {
                TBLogin.login(
                    (e)=> {
                        this.loadShopCoupon();
                    }, (e)=> {
                        //显示某个默认页面
                        TBTip.show('取消登录');
                    }
                );
            } else {
                console.log("response!", response.status);
                return {};
            }
        }, (e) => {
            console.log("请求失败!", e);
            shopCouponData = {};
            this.reloadCart();
        }).then((responseData) => {
            shopCouponData = responseData;
            this.reloadCart();
        });
    },

    loadCartList: function () {
        if (this.state.loading) {
            return;
        }
        this.state.loading = true;
        refreshPage = true;
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;
        var containerView = this.refs["containerView"];
        var cTag = React.findNodeHandle(containerView);
        var detaHeight = BZMCoreStyle.navigationBarHeight();
        if (this.props.hasOwnProperty("nnav")) {
            detaHeight += 49;
        }
        TBLoading.pageLoading(cTag,
            {"x": 0, "y": BZMCoreStyle.navigationBarHeight(),
                "width": screenWidth, "height": screenHeight - detaHeight}
        );
        cartListData = null;
        shopCouponData = null;

        var url = CART_LIST;
        if (this.props.sellerId != undefined) {
            url = "http://th5.m.zhe800.com/h5/api/getprodlistbysellerid?sellerId=" + this.props.sellerId;
        }

        fetch(url).then((response) => {
            this.state.loading = false;
            if (response.ok) {
                return response.json();
            } else if (response.status == 401) {
                TBLogin.login(
                    (e)=> {
                        this.loadCartList();
                    }, (e)=> {
                        //显示某个默认页面
                        TBTip.show('取消登录');
                    }
                );
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
                return {};
            }
        }, (e) => {
            this.state.loading = false;
            console.log("请求失败!", e);
            TBLoading.hidePageLoading(cTag, {});
        }).then((responseData) => {
            console.log(''+responseData);
            if (responseData.hasOwnProperty('result')) {
                if (responseData.result.code == 0) {
                    cartListData = responseData;
                    if (cartListData.itemList != null && cartListData.itemList.length > 0) {
                        this.loadShopCoupon();
                    } else {
                        shopCouponData = {};
                        this.reloadCart();
                    }
                } else {
                    TBLoading.hidePageLoading(cTag, {});
                    cartListData = responseData;
                    shopCouponData = {};
                    this.reloadCart();
                }
            } else {
                //加载失败
                TBLoading.hidePageLoading(cTag, {});
                TBTip.show('加载失败');
            }

        });

    },
    _goBack: function () {
        TBFacade.goBack(0);
    },
    _onPressAll: function () {
        this.reloadListData();
        this.loadShopCoupon();
    },
    _onPressSellerBtn: function (sellerInfo) {
        cartModel.updateSellerSelectState(sellerInfo);
        this.reloadListData();
        this.loadShopCoupon();
    },
    _onPressDealBtn: function (dealItem) {
        cartModel.updateAllSelectState();
        this.reloadListData();
        this.loadShopCoupon();
    },
    _onSelectSku(skuObject) {

    },
    _onPressSkuBuy(skuObject) {
        if (skuObject.dataNoChange) {
            this._onPressClose();
            return;
        }

        var deal = cartModel.editDeal;
        deal.product.count = skuObject.skuSelCount;
        deal.product.skuNum = skuObject.item.propertyNum;
        if (skuObject.hasOwnProperty("selectedItems")) {
            deal.product.skuDescList = [];
            for (var key in skuObject.selectedItems) {
                var item = skuObject.selectedItems[key];
                var obj = {name: item.label, value: item.item.name};
                deal.product.skuDescList.push(obj);
            }
        }

        this._onPressClose();
        //this.reloadListData();
        this.loadShopCoupon();
    },
    _onPressClose() {
        skuModel.enableResponseKeyboard = false;
        var pView = this.refs["presentView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{});
    },
    _onPayError(obj) {
        var params = obj.result.failDescList[0].desc;
        TBTip.show(params);
        if (obj.checkList != null && obj.checkList.length > 0) {
            for (var j = 0; j < obj.checkList.length; j++) {
                var checkItem = obj.checkList[j];
                var isOutOfGauge = checkItem.isOutOfGauge;
                var isOutOfStock = checkItem.isOutOfStock;
                var productId = checkItem.productId;
                var skuNum = checkItem.skuNum;
                //isOutOfGauge  超出限购数量
                //isOutOfStock   超库存   true的话 就是校验不通过
                var dealItem = cartModel.getDealByZIDAndSKU(productId, skuNum);
                if (dealItem != null) {
                    if (isOutOfGauge) {
                        dealItem.errorMessage = "(限购" + checkItem.maxBuyLimit + "件)";
                        //限购数量错误信息显示
                    }
                    if (isOutOfStock) {
                        dealItem.errorMessage = "(限购" + checkItem.skuCount + "件)";
                        //超库存错误信息显示
                    }
                }
            }
            this.reloadListData();
        }
    },

    //曝光函数
    _exposureItems: function() {
        cartModel.checkExposureItems();
    },
    _onChangeVisibleRows: function(visibleRows, changedRows) {
        var dataSource = this.state.dataSource;
        for (var index in changedRows.s1) {
            var isVisible = changedRows.s1[index];
            var item = dataSource.getRowData(0, index);
            if (item.hasOwnProperty('type')) {
                continue;
            }
            if (isVisible) {
                item.appearTime = new Date().getTime();
            }else {
                item.disAppearTime = new Date().getTime();
            }
        }
    },
    _onMomentumScrollBegin : function() {
        this._exposureItems();
    },

    _onMomentumScrollEnd: function(listIndex,e) {

        //曝光逻辑
        this._exposureItems();
    },
    render: function () {
        var contentArr = [];
        var nnav = false;
        if (this.props.hasOwnProperty("nnav")) {
            nnav = true;
        }
        var scrollEnabled = true;
        var title = "购物车";
        if (this.isCouDanFinishPage) {
            title = "完成凑单";
        }
        if (cartModel != null) {
            if (cartModel.itemList == null || cartModel.itemList.length < 1) {
                scrollEnabled = false;
            }
            contentArr.push(<ListView ref="listView" key="i2"
                                      dataSource={this.state.dataSource}
                                      renderRow={this.renderHomeRow}
                                      style={styles.listView}
                                      scrollEnabled={scrollEnabled}
                                      onChangeVisibleRows={this._onChangeVisibleRows}
                                      onMomentumScrollBegin={this._onMomentumScrollBegin}
                                      onMomentumScrollEnd={this._onMomentumScrollEnd}
            />);
            if (cartModel.itemList != null && cartModel.itemList.length >0) {

                if (this.isCouDanFinishPage) {
                    title = "完成凑单";
                    contentArr.push(<BZMCartMainBottomCouDan key="i3"
                                                             cartModel={cartModel}
                                                             onSelect={this._onPressAll}
                                                             onPayError={this._onPayError}
                    />);
                } else {
                    contentArr.push(<BZMCartMainBottom key="i3"
                                                       cartModel={cartModel}
                                                       onSelect={this._onPressAll}
                                                       onPayError={this._onPayError}
                    />);
                }
            }
        }

        return (
            <View style={styles.container} ref="containerView"
                  onStartShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}
                  onMoveShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}>
                <StatusBar barStyle="default"/>
                <BZMCartNavigationBar title={title} nnav={nnav} onBack={this._goBack}/>
                {contentArr}
                <View style={BZMCoreStyle.skuContainer()} ref="presentView" key="i4">
                    <BZMDSKUView
                        skuModel={skuModel}
                        action="sure"
                        onSelectItem={this._onSelectSku}
                        onCart={this._onPressSkuBuy}
                        onPressClose={this._onPressClose}/>
                </View>
            </View>
        );
    },
    onError: function () {
        refreshPage = true;
        this.loadCartList();
    },
    renderHomeRow: function (item) {
        var rowType = "";
        if (item.hasOwnProperty("type")) {
            rowType = item.type;
        }
        switch (rowType) {
            case "empty":
            {
                var Dimensions = require('Dimensions');
                var screenHeight = Dimensions.get('window').height;
                var emptyPageHeight = screenHeight-BZMCoreStyle.navigationBarHeight();
                for (var inx in cartModel.cartList) {
                    var item2 = cartModel.cartList[inx];
                    if (item2.type == "tb_cart") {
                        emptyPageHeight = emptyPageHeight-62;
                    } else if (item2.type == "mall_sep") {
                        emptyPageHeight = emptyPageHeight-42;
                    } else if (item2.type == "invalid_goods") {
                        emptyPageHeight = emptyPageHeight-45-10;
                    }
                }
                return (
                    <BZMCartMainEmpty onError={this.onError} cartModel={cartModel} style={{height:emptyPageHeight}} />
                );
            }
                break;
            case "tb_cart":
            {
                return (
                    <BZMCartMainTBCart />
                );
            }
                break;
            case "mall_sep":
            {
                return (
                    <BZMCartMallSep />
                );
            }
                break;
            case "invalid_goods":
            {
                return (
                    <View>
                        <BZMCartMainInvalid cartModel={cartModel}/>
                        <View style={styles.bottomLine}/>
                        <View style={styles.cartSep}/>
                    </View>

                );
            }
                break;

            case "cart_seller":
            {
                return (
                    <BZMCartMainDealSeller
                        key="dealSeller"
                        sellerInfo={item.data}
                        onPressLeftBtn={(sellerInfo)=>{this._onPressSellerBtn(sellerInfo)}}
                    />
                );
            }
                break;
            case "cart_sellerbottomline":
            {
                return (
                    <View  style={styles.sellerBottomLine}/>
                );
            }
                break;
            case "cart_sellerrule":
            {
                return (
                    <BZMCartMainDealCoupon  sellerRule={item.data}/>
                );
            }
                break;
            case "cart_coudan":
            {
                return (
                    <BZMCartMainDealCouDan cartModel={cartModel} shopData={item.data}/>
                );
            }
                break;
            case "cart_coudanbottomline":
            {
                return (
                    <View  style={styles.couDanBottomLine}/>
                );
            }
                break;
            case "cart_dealsepline":
            {
                return (
                    <View  style={styles.dealSepLine}/>
                );
            }
                break;
            case "":
            {
                return (
                    <BZMCartMainDealItemView
                        onPressLeftBtn={(dealItem)=>{this._onPressDealBtn(dealItem)}}
                        onPressEdit={(dealItem)=>{this._onPressEdit(dealItem)}}
                        onPressDelete={(dealItem)=>{this._onPressDelete(dealItem)}}
                        dealItem={item}/>
                );
            }
                break;
        }
        //return (
        //    <View>
        //        <BZMCartMainDeal
        //            onPressSellerBtn={this._onPressSellerBtn}
        //            onPressDealBtn={this._onPressDealBtn}
        //            onPressEdit={(dealItem)=>{this._onPressEdit(dealItem)}}
        //            onPressDelete={(dealItem)=>{this._onPressDelete(dealItem)}}
        //            cartModel={cartModel}
        //            shopData={item}/>
        //
        //        <View style={styles.cartSep}/>
        //    </View>
        //);
    }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        flex: 1
    },
    listView: {
        backgroundColor: '#eeeeee',
        flex: 0.5
    },
    bottomLine: {
        height: 0.5,
        backgroundColor: '#D5D5D5'
    },
    cartSep: {
        height: 10,
        backgroundColor: '#eeeeee'
    },
    dealSepLine: {
        height: 3,
        backgroundColor: '#ffffff',
        marginLeft: 10,
        marginRight: 10
    },
    sellerBottomLine: {
        height: BZMCoreStyle.lineHeight(),
        backgroundColor: '#F1F1F1'
    },
    couDanBottomLine: {
        height: BZMCoreStyle.lineHeight(),
        backgroundColor: '#D5D5D5'
    }
});

// React.AppRegistry.registerComponent('BZMCartMain', () => BZMCartMain);
module.exports = BZMCartMain;
