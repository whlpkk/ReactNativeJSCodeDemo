/*
 * @providesModule BZMDSKUBottomView
 * @flow
 */
'use strict';

var React = require('react-native');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMDSKUModel = require('BZMDSKUModel');
var BZMCoreStyle = require('BZMCoreStyle');
var TBLogin = require('TBLogin');
var TBFacade = require('../../bzm_core/components/TBFacade');
var TBTip = require('../../bzm_core/components/TBTip');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;
var skuModel = null;
var BZMDSKUBottomView = React.createClass({
    propTypes: {
        onBuy: PropTypes.func,
        onCart: PropTypes.func,
        skuModel: PropTypes.instanceOf(BZMDSKUModel).isRequired
    },

    _onBuy:function(obj) {
        if (this.props.onBuy != undefined) {
            this.props.onBuy(obj);
        }
    },

    _onCart:function(obj) {
        if (this.props.onCart != undefined) {
            this.props.onCart(obj);
        }
    },

    getSelectedSKU: function () {
        var obj = skuModel.getSelectedSku();

        var count = parseInt(skuModel.bzmData.count);

        if (obj == null || obj.selectedItems.length < 1) {
            if (skuModel.skuItems.length < 2) {
                var img = skuModel.bzmData.vPicture;

                if (img.indexOf(skuModel.imageBaseUrl) > -1) {
                    img = img.substr(skuModel.imageBaseUrl.length);
                }
                if (skuModel.dealInfo.sku.length > 0) {
                    obj = {item: skuModel.dealInfo.sku[0]};
                } else {
                    obj = {item: {propertyNum: "", vPicture: img}};
                }
            } else {
                obj = null;
            }
        }
        if (obj != null) {
            obj.skuSelCount = count;
        }

        return obj;
    },

    _addToCart: function (skuObj) {
        var deal = skuModel.dealInfo;
        var productId = deal.product.id;
        var skuNum = skuObj.item.propertyNum;
        var count = skuModel.bzmData.count;
        var price = skuObj.item.curPrice;

        var param = [];
        param.push("productId=" + productId);
        param.push("skuNum=" + skuNum);
        param.push("count=" + count);
        param.push("price=" + price);
        param.push("jk=" + skuModel.jk);
        var queryString = param.join("&");
        var urlString = BZMCoreUtils.REQUEST_BASE_URL + "/h5/api/cart/addcart?" + queryString;
        fetch(urlString).then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status == 401) {
                TBLogin.login(
                    (e)=> {
                        this._addToCart(skuObj);
                    }, (e)=> {
                        //显示某个默认页面
                        TBTip.show('取消登录');
                    }
                );
            } else {
                return null;
            }
        }, (e) => {
            TBTip.show("添加失败");
        }).then((obj) => {
            if (obj.hasOwnProperty('result') && obj.result.code == 0) {
                TBTip.show("添加成功");
                TBFacade.removeItem(BZMCoreUtils.CART_LAST_REFRESH_TEIME,()=>{});
                this._onCart(obj);
            } else {
                TBTip.show("添加失败");
            }
        });
    },

    //更新购物车的sku时如果更改了sku属性,则需先删除再更新,如果只是更新数量则不用调用该接口
    _updateCartSKU: function (skuObj) {
        var deal = skuModel.dealInfo;
        var zId = deal.product.id;
        var skuNum = deal.product.skuNum;
        var urlString = BZMCoreUtils.REQUEST_BASE_URL + '/h5/api/cart/delete?productId=' + zId + "&skuNum=" + skuNum;
        fetch(urlString).then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status == 401) {
                TBLogin.login(
                    (e)=> {
                        this._updateCartSKU(skuObj);
                    }, (e)=> {
                        //显示某个默认页面
                        TBTip.show('取消登录');
                    }
                );
            } else {
                return null;
            }
        }, (e) => {
            TBTip.show("保存失败");
        }).then((obj) => {
            if (obj.hasOwnProperty('code') && obj.code == 0) {
                this._updateCart(skuObj);
            } else {
                TBTip.show("保存失败");
            }
        });
    },

    _updateCartError: function (obj) {
        var message = obj.result.failDescList[0].desc;
        var errorMessage = null;
        if (obj.checkList != null && obj.checkList.length > 0) {
            for (var j = 0; j < obj.checkList.length; j++) {
                var checkItem = obj.checkList[j];
                var isOutOfGauge = checkItem.isOutOfGauge;
                var isOutOfStock = checkItem.isOutOfStock;

                if (isOutOfGauge) {
                    errorMessage = "(限购" + checkItem.maxBuyLimit + "件)";
                    //限购数量错误信息显示
                } else if (isOutOfStock) {
                    errorMessage = "(限购" + checkItem.skuCount + "件)";
                    //超库存错误信息显示
                }
            }
        }
        if (errorMessage != null) {
            message += errorMessage;
        }
        TBTip.show(message);
    },

    _updateCart: function (skuObj) {
        var deal = skuModel.dealInfo;
        var productId = deal.product.id;
        var skuNum = skuObj.item.propertyNum;
        var count = skuModel.bzmData.count;
        var price = skuObj.item.curPrice;
        if (skuObj.item.hasOwnProperty('curPrice')) {
            price = skuObj.item.curPrice;
        }

        var param = [];
        param.push("productId=" + productId);
        param.push("skuNum=" + skuNum);
        param.push("count=" + count);
        param.push("price=" + price);
        //param.push("jk=" + skuModel.jk);
        var queryString = param.join("&");
        var urlString = BZMCoreUtils.REQUEST_BASE_URL + "/h5/api/cart/updatecart?" + queryString;
        fetch(urlString).then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status == 401) {
                TBLogin.login(
                    (e)=> {
                        this._updateCart(skuObj);
                    }, (e)=> {
                        //显示某个默认页面
                        TBTip.show('取消登录');
                    }
                );
            } else {
                return null;
            }
        }, (e) => {
            TBTip.show("保存失败");
        }).then((obj) => {
            if (obj.hasOwnProperty('result')) {
                if (obj.result.code == 0) {
                    this._onCart(skuObj);
                } else {
                    this._updateCartError(obj);
                }
            } else {
                TBTip.show("保存失败");
            }
        });
    },

    onPressSure: function () {
        var obj = this.getSelectedSKU();
        if (obj == null || !obj.hasOwnProperty('item')) {
            TBTip.show("请选择商品属性");
        } else {
            obj.dataNoChange = false;
            if (skuModel.action == 'edit') { //购物车编辑
                var deal = skuModel.cartModel.editDeal;
                var deal2 = skuModel.cartModel.getDealByZIDAndSKU(deal.product.productId, obj.item.propertyNum);
                if (deal2 != null) {
                    if (deal2.product.productId == deal.product.productId
                        && deal2.product.skuNum == deal.product.skuNum) {
                        //同一个商品,不用处理; 只更新数量
                        //判断前后数量是否有变化,如果有则更新
                        var count2 = parseInt(skuModel.bzmData.count);
                        if (deal.product.count == count2) {
                            obj.dataNoChange = true;
                            this._onCart(obj);
                        } else {
                            this._updateCart(obj);
                        }
                    } else {
                        TBTip.show("您选择的商品已在购物车中,请直接购买");
                    }
                } else {
                    //添加到购物车
                    this._updateCartSKU(obj);
                }
            } else if(skuModel.action == 'cart') {
                this.onPressCart();
            }
            else {
                this.onPressBuy();
            }
        }

    },

    onPressCart: function () {
        var obj = this.getSelectedSKU();
        if (obj == null) {
            TBTip.show("请选择商品属性");
        } else {
            this._addToCart(obj);
        }
    },
    onPressBuy: function () {
        var obj = this.getSelectedSKU();
        if (obj == null || !obj.hasOwnProperty('item')) {
            TBTip.show("请选择商品属性");
        } else {
            this._onBuy(obj);
        }
    },
    render: function () {
        skuModel = this.props.skuModel;
        skuModel.pressSure = ()=> {
            this.onPressSure()
        };

        let bottomBtnType = skuModel.bottomBtnType;
        if (bottomBtnType == undefined) {
            bottomBtnType = "";
        }

        if (bottomBtnType == "sure") {
            return (
                <View style={styles.bottomContainer}>
                    <TouchableHighlight style={styles.bRightBtn} underlayColor={BZMCoreStyle.RED_UNDERLAY_COLOR}
                                        onPress={this.onPressSure}>
                        <Text style={styles.btnText}>确定</Text>
                    </TouchableHighlight>
                </View>
            );
        } else if (bottomBtnType == "cart") {
            return (
                <View style={styles.bottomContainer}>
                    <TouchableHighlight style={styles.bLeftBtn}
                                        underlayColor={BZMCoreStyle.ORANGE_UNDERLAY_COLOR}
                                        onPress={this.onPressCart}>
                        <Text style={styles.btnText}>加入购物车</Text>
                    </TouchableHighlight>
                </View>
            );
        } else {
            return (
                <View style={styles.bottomContainer}>
                    <TouchableHighlight style={styles.bLeftBtn}
                                        underlayColor={BZMCoreStyle.ORANGE_UNDERLAY_COLOR}
                                        onPress={this.onPressCart}>
                        <Text style={styles.btnText}>加入购物车</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.bRightBtn} onPress={this.onPressBuy}>
                        <View style={styles.bRightBtn}>
                            <Text style={styles.btnText}>立即购买</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            );
        }

    }

});

var styles = StyleSheet.create({
    bottomContainer: {
        flexDirection: 'row',
        height: 44,
        justifyContent: 'flex-start'
    },
    bLeftBtn: {
        backgroundColor: '#ff9333',
        flex: 1,
        justifyContent: 'center'
    },
    bRightBtn: {
        backgroundColor: '#ef4949',
        flex: 1,
        justifyContent: 'center'
    },
    btnText: {
        color: '#ffffff',
        textAlign: 'center'
    }
});

module.exports = BZMDSKUBottomView;
