/*
 * @providesModule BZMDSKUTopView
 * @flow
 */
'use strict';

var React = require('react-native');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMDSKUModel = require('BZMDSKUModel');
var TBAnimation = require('TBAnimation');
var TBImage = require('TBImage');
var BZMDCheapAmountType = require('BZMDCheapAmountType');

var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;
var skuModel = null;

var BZMDSKUTopView = React.createClass({
    propTypes: {
        action: PropTypes.string,
        onPressClose: PropTypes.func.isRequired,
        skuModel: PropTypes.instanceOf(BZMDSKUModel).isRequired
    },
    onPressClose: function () {
        if (this.props.onPressClose) {
            this.props.onPressClose();
        }
    },

    onPressThumbnail: function () {
        var sections = skuModel.sections;
        if (sections == null || sections.length < 1) {
            return;
        }

        var sec1 = sections[0];
        var arr = [];

        var inx = -1;
        var pIndex = 0;
        let IMG_BASE = skuModel.imageBaseUrl;
        sec1.data.forEach(function (item) {
            inx++;
            arr.push({title: item.name, image: IMG_BASE + item.vPicture});
            if (sec1.selectedItem != null && sec1.selectedItem.id == item.id) {
                pIndex = inx;
            }
        });
        //没有sku
        if (sec1.data.length < 1) {
            arr.push({title: "", image: this.props.skuModel.bzmData.vPicture});
            console.log(this.props.skuModel.bzmData.vPicture)
        }

        var pView = this.refs["tbimage"];
        var reactTag = React.findNodeHandle(pView);

        TBAnimation.imageViewer(reactTag, arr, pIndex);
    },
    render: function () {
        skuModel = this.props.skuModel;
        var price = skuModel.bzmData.priceSection;
        if (skuModel.dealInfo.hasOwnProperty('dealrecord')) {
            var dealrecord = skuModel.dealInfo.dealrecord;
            var cheapAmount = skuModel.dealInfo.cheapAmount;
            var cheapAmountType = dealrecord.cheapAmountType;
            if (cheapAmountType == null) {
                cheapAmountType = BZMDCheapAmountType.DEFAULT;
            }
            if (cheapAmount == null) {
                cheapAmount = 0;
            } else {
                cheapAmount = parseFloat(cheapAmount);
            }
            var enableChangePrice = false;
            var brandProtected = dealrecord.brandProtected; //品牌保护
            if (cheapAmountType == BZMDCheapAmountType.LIMIT) {
                enableChangePrice = true;
            } else if (cheapAmountType == BZMDCheapAmountType.LIJIAN && brandProtected == 0) {
                //如果是拍下立减，且不是品牌保护
                enableChangePrice = true;
            }
            if (enableChangePrice) {
                price -= cheapAmount;
            }
        }
        return (
            <View style={styles.topContainer}>
                <TouchableHighlight style={styles.topLeftContainer} onPress={this.onPressThumbnail}>
                    <View style={styles.topLeftContent}>
                        <TBImage ref="tbimage" style={styles.topLeftImage}
                                 clipsToBounds={true}
                                 urlPath={skuModel.bzmData.vPicture}
                                 defaultPath={"bundle://common_small_default@2x.png"}/>
                    </View>
                </TouchableHighlight>

                <View style={styles.topRightContainer}>
                    <Text style={styles.topPriceText}>￥{price}</Text>
                    <Text style={styles.topText}>库存{skuModel.bzmData.stockCount}件</Text>
                    <Text style={styles.topText}>{skuModel.bzmData.skuSelect}</Text>
                </View>

                <View style={styles.closeBtnContainer}>
                    <TouchableHighlight style={styles.closeBtn} onPress={this.onPressClose}>
                        <View style={styles.closeBtn}>
                            <TBImage style={styles.closeImg}
                                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_sku_close.png")}/>
                        </View>
                    </TouchableHighlight>
                </View>

            </View>
        );

    }

});

var styles = StyleSheet.create({
    topContainer: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 100
    },
    topRightContainer: {
        paddingTop: 20,
        paddingVertical: 5,
        backgroundColor: '#ffffff',
        justifyContent: 'space-around'
    },
    topLeftContainer: {
        marginTop: -20,
        marginLeft: 10,
        height: 104,
        width: 104
    },
    topLeftContent: {
        height: 104,
        width: 104,
        backgroundColor: '#ffffff',
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#D5D5D5'
    },
    topLeftImage: {
        top: 1.5,
        left: 1.5,
        width: 100,
        height: 100,
        borderRadius: 3,
        backgroundColor: '#eeeeee'
    },
    topText: {
        fontSize: 12,
        color: '#27272F',
        marginLeft: 10,
        marginTop: 5
    },
    topPriceText: {
        fontSize: 12,
        color: '#E30C26',
        marginLeft: 10
    },
    closeBtnContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'flex-end',
        marginRight: 0
    },
    closeBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 0,
        backgroundColor: '#ffffff'
    },
    closeImg: {
        width: 20,
        height: 20,
        backgroundColor: '#ffffff'
    }
});

module.exports = BZMDSKUTopView;

