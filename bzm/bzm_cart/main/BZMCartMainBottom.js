/*
 *
 * @providesModule BZMCartMainBottom
 */
'use strict';
var TBImage = require('TBImage');
var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreUtils = require('BZMCoreUtils');
var TBFacade = require('TBFacade');
var TBLogin = require('TBLogin');
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

var BZMCartMainBottom = React.createClass({
    propTypes: {
        cartModel: PropTypes.instanceOf(BZMCartMainModel),
        onSelect: PropTypes.func.isRequired,
        onPayError: PropTypes.func.isRequired
    },
    _onSelect: function () {
        var cartModel = this.props.cartModel;
        cartModel.updateItemListSelectState(!cartModel.selectAll);
        this.props.onSelect();
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
        //var price = BZMCoreUtils.toDecimal(list2.totalPrice+"")+"";
        var price = this.props.cartModel.shopCouponData.discountTotal.realPrice;

        var selectedCount = list2.dealCount;
        var payText = "结算(" + selectedCount + ")";
        var payBackgroundColor = '#b5b6b7';
        if (selectedCount > 0) {
            payBackgroundColor = '#EF4949';
        }

        var leftImagePath = null;
        if (this.props.cartModel.selectAll) {
            leftImagePath = "bzm_cart_checked.png";
        } else {
            leftImagePath = "bzm_cart_uncheck.png";
        }
        return (
            <View style={styles.container}>
                <View style={styles.topLine}/>
                <View style={styles.content}>
                    <TouchableHighlight onPress={this._onSelect}>
                        <View style={styles.leftBtnContainer}>
                            <TBImage style={styles.leftImage}
                                     clipsToBounds={true}
                                     urlPath={BZMCartUtils.iconURL(leftImagePath)}
                            />
                            <Text style={styles.allSelectText}>全选</Text>
                        </View>
                    </TouchableHighlight>

                    <View style={styles.sumBox}>
                        <Text style={styles.sumText}>合计:</Text>
                        <BZMComponentPriceView price={price}/>
                    </View>

                    <Text style={styles.postText}>不含运费</Text>

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
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },

    leftBtnContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48 - BZMCoreStyle.lineHeight(),
        marginTop: BZMCoreStyle.lineHeight()
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
        marginRight: 10,
        color: '#545C66',
        fontSize: 11
    },
    topLine: {
        height: BZMCoreStyle.lineHeight(),
        backgroundColor: '#D5D5D5'
    },
    rightBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 48 - BZMCoreStyle.lineHeight(),
        marginTop: BZMCoreStyle.lineHeight(),
        padding: 20
    },
    rightBtnText: {
        color: '#ffffff',
        fontSize: 14
    },
    sumBox: {
        marginRight: 5,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
});

module.exports = BZMCartMainBottom;
