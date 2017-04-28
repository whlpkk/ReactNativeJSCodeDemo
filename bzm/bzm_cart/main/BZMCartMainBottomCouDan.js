/*
 *
 * @providesModule BZMCartMainBottomCouDan
 */
'use strict';
var TBImage = require('TBImage');
var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreUtils = require('BZMCoreUtils');
var TBFacade = require('TBFacade');
var TBLogin = require('TBLogin');
var TBExposureManager = require('TBExposureManager');
var TBTip = require('TBTip');
var BZMCoreStyle = require('BZMCoreStyle');
var BZMCartMainModel = require('BZMCartMainModel');
var BZMComponentPriceView = require('BZMComponentPriceView');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartMainBottomCouDan = React.createClass({
    propTypes: {
        cartModel: PropTypes.instanceOf(BZMCartMainModel),
        onSelect: PropTypes.func.isRequired,
        onPayError: PropTypes.func.isRequired
    },
    _forwardToCoudan: function () {
        var sellerInfo = this.props.cartModel.itemList[0].sellerInfo;
        var sellerId = sellerInfo.sellerId;
        var nickName = sellerInfo.nickName;
        var pArr = [];
        var url = 'http://th5.m.zhe800.com/h5/coudan/index?';
        pArr.push('sellerId=' + sellerId);
        pArr.push('nickName=' + encodeURIComponent(nickName));
        var queryString = pArr.join("&");
        url = url + queryString;

        TBFacade.forward(1, url);
    },


    _openOrderPage: function () {
        var pArr1 = [];
        var pArr2 = [];
        var url = 'http://th5.m.zhe800.com/h5/cart/order/my?';

        var items = this.props.cartModel.getSelectedItems().selectedDeals;

        for (var key in items) {
            var deal = items[key];
            pArr1.push(deal.product.productId);
            pArr2.push(deal.product.skuNum);
        }
        url = url + "productId=" + pArr1.join(",") + "&skuNum=" + pArr2.join(",");
        TBFacade.forward(1, url);
    },

    _checkCart: function () {
        var items = this.props.cartModel.getSelectedItems().selectedDeals;
        var pArr = [];
        var url = 'http://th5.m.zhe800.com/h5/api/cart/checkcart?';

        for (var key in items) {
            var deal = items[key];
            pArr.push('productId=' + deal.product.productId);
            pArr.push('skuNum=' + deal.product.skuNum);
        }

        url = url + pArr.join("&");
        fetch(url).then((response) => {
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
            TBTip.show("网络异常，请稍候再试");
        }).then((obj) => {
            if (obj.hasOwnProperty('result')) {
                if (obj.result.code == 0) {
                    this._openOrderPage();
                } else {
                    this.props.onPayError(obj);
                }
            } else {
                TBTip.show("网络异常，请稍候再试");
            }
        });
    },

    render: function () {
        if (this.props.cartModel == null) {
            return (<View />);
        }
        var list2 = this.props.cartModel.getSelectedItems();
        var totalPrice = this.props.cartModel.shopCouponData.discountTotal.totalPrice;
        var discountPrice = this.props.cartModel.shopCouponData.discountTotal.discountPrice;

        var selectedCount = list2.dealCount;
        var payText = "去结算(" + selectedCount + ")";
        var payBackgroundColor = '#b5b6b7';
        if (selectedCount > 0) {
            payBackgroundColor = '#EF4949';
        }

        return (
            <View style={styles.container}>
                <View style={styles.topLine}/>
                <View style={styles.content}>
                    <View style={styles.leftContainer}>
                        <View style={styles.sumBox}>
                            <Text style={styles.sumText}>共:</Text>
                            <BZMComponentPriceView price={totalPrice}/>
                        </View>
                        <Text style={styles.postText}>可享受{discountPrice}元优惠</Text>
                    </View>
                    <TouchableHighlight onPress={this._forwardToCoudan}>
                        <View style={styles.bLeftBox}>
                            <Text style={styles.rightBtnText}>继续凑单</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._checkCart}>
                        <View style={[styles.rightBtnContainer,{backgroundColor:payBackgroundColor}]}>
                            <Text style={styles.rightBtnText}>{payText}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

});

var styles = StyleSheet.create({

    container: {
        height: 48
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ffffff'
    },

    leftContainer: {
        marginLeft: 10,
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center'
    },
    allSelectText: {
        marginLeft: 10,
        flex: 1,
        color: '#27272F',
        fontSize: 14
    },
    leftImage: {
        marginLeft: 12,
        width: 20,
        height: 20,
        backgroundColor: '#ffffff'
    },
    sumText: {
        color: '#545C66',
        fontSize: 13
    },
    priceText: {
        color: '#E30C26',
        fontSize: 14
    },
    postText: {
        color: '#545C66',
        fontSize: 11
    },
    topLine: {
        height: BZMCoreStyle.lineHeight(),
        backgroundColor: '#D5D5D5'
    },
    rightBtnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    rightBtnText: {
        color: '#ffffff',
        fontSize: 14
    },
    sumBox: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    bLeftBox: {
        padding: 20,
        flex: 1,
        backgroundColor: '#ff9333',
        justifyContent: 'center'
    }
});

module.exports = BZMCartMainBottomCouDan;
