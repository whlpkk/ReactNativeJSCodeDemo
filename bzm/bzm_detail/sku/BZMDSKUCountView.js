/*
 * @providesModule BZMDSKUCountView
 * @flow
 */
'use strict';

var React = require('react-native');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMDSKUModel = require('BZMDSKUModel');
var TBImage = require('TBImage');
var TBTip = require('TBTip');
var {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    } = React;
var sections = null;
var PropTypes = React.PropTypes;
var skuModel = null;
var countItem = null;
var BZMDSKUCountView = React.createClass({
    propTypes: {
        skuModel: PropTypes.instanceOf(BZMDSKUModel).isRequired,
        item: PropTypes.object.isRequired,
        onFocus: PropTypes.func.isRequired,
    },

    _checkCount:function(count1) {
        if (count1 < 1) {
            count1 = 1;
            TBTip.show("已经最少了,还要闹哪样~");
            return false;
        }
        //获取库存
        var stockCount = 0;
        if (skuModel.skuItems.length < 2) {
            stockCount = skuModel.stock.total;
        } else {
            var obj = skuModel.getSelectedSku();
            if (obj == null || !obj.hasOwnProperty('item')) {
                TBTip.show("请选择商品属性");
                return false;
            }
            var stockObj = skuModel.stockOfId(obj.item.propertyNum);
            if (stockObj != null) {
                stockCount = stockObj.count;
            }
        }

        var maxBuyLimit = skuModel.dealInfo.product.maxBuyLimit;
        if (maxBuyLimit > 0 && count1 > maxBuyLimit) {
            TBTip.show("最多只能购买" + maxBuyLimit + "件");
            return false;
        } else if (count1 > stockCount) {
            TBTip.show("最多只能购买" + stockCount + "件");
            return false;
        }
        return true;
    },

    _onChangeText:function(e) {
        if (e.length<1) {
            countItem.count = '0';
            skuModel.bzmData.count = countItem.count;
            this.forceUpdate();
            return;
        }
        var count1 = parseInt(e);
        if (!this._checkCount(count1)) {
            return;
        }
        countItem.count = e;
        skuModel.bzmData.count = countItem.count;
        this.forceUpdate();
    },

    onPressPlusBtn: function () {
        var count1 = parseInt(countItem.count);
        count1++;
        if (!this._checkCount(count1)) {
            return;
        }

        countItem.count = '' + count1;

        //最大数量的提示
        skuModel.bzmData.count = countItem.count;
        this.forceUpdate();
    },
    onPressMinusBtn: function () {
        var count1 = parseInt(countItem.count);
        count1--;
        if (!this._checkCount(count1)) {
            return;
        }

        countItem.count = '' + count1;
        skuModel.bzmData.count = countItem.count;
        this.forceUpdate();
    },
    render: function () {
        skuModel = this.props.skuModel;
        sections = skuModel.sections;
        countItem = this.props.item;
        return (
            <View style={styles.countContainer}>
                <View style={styles.countTextContainer}>
                    <Text style={styles.countText}>购买数量</Text>
                </View>
                <View style={styles.countInputContainer}>
                    <TouchableHighlight
                        style={styles.plusButtonTouch}
                        onPress={() => this.onPressMinusBtn()}>
                        <View style={styles.plusButtonTouch}>
                            <TBImage style={styles.countBtn}
                                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_sku_minus.png")}/>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.inputContainer}>
                        <TextInput keyboardType="numeric"
                                   editable={true}
                                   style={styles.inputText}
                                   value={countItem.count}
                                   onChangeText={this._onChangeText} 
                                   onFocus={this.props.onFocus}
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.plusButtonTouch}
                        onPress={() => this.onPressPlusBtn()}>
                        <View style={styles.plusButtonTouch}>
                            <TBImage style={styles.countBtn}
                                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_sku_plus.png")}/>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );

    }

});

var styles = StyleSheet.create({

    countContainer: {
        height: 44,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
    },
    countTextContainer: {
        left: 10,
        justifyContent: 'center',
        flex: 1
    },
    countText: {
        color: '#000000',
        fontSize: 14
    },
    inputContainer: {
        width: 45,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },
    inputText: {
        height: 30,
        textAlign: 'center'
    },
    countInputContainer: {
        marginRight: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 10
    },
    countBtn: {
        width: 30,
        height: 27,
        backgroundColor: '#ffffff'
    },
    plusButtonTouch: {
        height: 35,
        width: 35,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

module.exports = BZMDSKUCountView;

