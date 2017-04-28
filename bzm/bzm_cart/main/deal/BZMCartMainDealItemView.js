/*
 *
 * @providesModule BZMCartMainDealItemView
 */
'use strict';


var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreUtils = require('BZMCoreUtils');
var TBImage = require('TBImage');
var TBTip = require('TBTip');
var TBFacade = require('TBFacade');

var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartMainDealItemView = React.createClass({
    propTypes: {
        dealItem: PropTypes.object.isRequired,
        onPressLeftBtn: PropTypes.func.isRequired,
        onPressEdit: PropTypes.func.isRequired,
        onPressDelete: PropTypes.func.isRequired
    },
    _onPressLeftBtn: function () {
        this.props.dealItem.cartSelected = !this.props.dealItem.cartSelected;
        this.props.onPressLeftBtn(this.props.dealItem);
    },

    _onTouchEdit: function () {
        this.props.onPressEdit(this.props.dealItem);
    },
    _onTouchDelete: function () {
        this.props.onPressDelete(this.props.dealItem);
    },
    _forwardToDeal: function () {
        var dealData = this.props.dealItem;
        var zid = dealData.product.productId;
        var promotionId = dealData.product.promotionId;
        var url = "zhe800://m.zhe800.com/mid/zdetail?zid="+zid+"&dealid="+promotionId;
        TBFacade.forward(1, url);
    },

    render: function () {
        var dealData = this.props.dealItem;
        var dealImage = BZMCoreUtils.dealIMGBasePath() + dealData.product.skuImageUrl;
        if (dealData.product.skuImageUrl.length<1) {
            dealImage = BZMCoreUtils.dealIMGBasePath() + dealData.product.imagesUrl.split(",")[0];
        } else {
            dealImage = BZMCoreUtils.dealIMGBasePath() + dealData.product.skuImageUrl;
        }
        var skuDescList = dealData.product.skuDescList;
        var skuString = "";
        for (var inx in skuDescList) {
            var item = skuDescList[inx];
            skuString += item.name + ": " + item.value + " ";
        }
        let curPriceStr = dealData.product.curPrice;
        let orgPriceStr = dealData.product.orgPrice;
        let curPrice = parseFloat(curPriceStr);
        let orgPrice = parseFloat(orgPriceStr);
        var leftImagePath = null;
        if (dealData.cartSelected) {
            leftImagePath = "bzm_cart_checked.png";
        } else {
            leftImagePath = "bzm_cart_uncheck.png";
        }
        var errorMessage = "";
        if (dealData.errorMessage) {
            errorMessage = dealData.errorMessage;
        }

        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.leftBtnTouch} onPress={this._onPressLeftBtn}>
                    <View style={styles.leftBtnContainer}>
                        <TBImage style={styles.leftImage}
                                 clipsToBounds={true}
                                 urlPath={BZMCartUtils.iconURL(leftImagePath)}
                        />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.rightContainerTouch} onPress={this._forwardToDeal}>
                    <View style={styles.rightContainer}>
                        <TBImage style={styles.dealImage}
                                 clipsToBounds={true}
                                 urlPath={dealImage}
                                 defaultPath={"bundle://common_small_default@2x.png"}
                        />
                        <View style={styles.rightContainer2}>
                            <Text style={styles.topText}
                                  numberOfLines={1}
                            >{dealData.product.productName}</Text>
                            <Text style={styles.bottomText}>{skuString}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.priceText}>￥{curPrice}</Text>
                                <View style={styles.priceTextWeakCon}>
                                    <Text style={styles.priceTextWeakSymbol}>￥</Text>
                                    <Text style={styles.priceTextWeak}>{orgPrice}</Text>
                                </View>
                            </View>
                            <Text style={styles.countText}>X{dealData.product.count} {errorMessage}</Text>
                        </View>

                        <TouchableHighlight style={styles.editContainer} onPress={this._onTouchEdit}>
                            <View style={styles.btnContainer}>
                                <TBImage style={styles.leftImage}
                                         clipsToBounds={true}
                                         urlPath={BZMCartUtils.iconURL("bzm_cart_edit.png")}
                                />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.delContainer} onPress={this._onTouchDelete}>
                            <View style={styles.btnContainer}>
                                <TBImage style={styles.leftImage}
                                         clipsToBounds={true}
                                         urlPath={BZMCartUtils.iconURL("bzm_cart_delete.png")}
                                />
                            </View>
                        </TouchableHighlight>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 100,
        backgroundColor: '#F6F6F6'
    },
    rightContainerTouch: {
        flex: 1
    },
    rightContainer: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#F6F6F6',
        alignItems: 'center'
    },
    rightContainer2: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'flex-start'
    },
    leftBtnTouch: {
        width: 44
    },
    leftBtnContainer: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftImage: {
        width: 20,
        height: 20,
        backgroundColor: '#F6F6F6'
    },
    dealImage: {
        width: 90,
        height: 90,
        backgroundColor: '#9f9f9f'
    },
    topText: {
        fontSize: 14,
        color: '#27272F',
        marginRight: 10
    },
    priceText: {
        fontSize: 13,
        color: '#E30C26',
        marginBottom: 0
    },
    priceTextWeakCon: {
        flexDirection: 'row',
        marginLeft: 4,
    },
    priceTextWeakSymbol: {
        fontSize: 10,
        color: '#BEBEBE'
    },
    priceTextWeak: {
        fontSize: 10,
        color: '#BEBEBE',
        textDecorationLine: 'line-through',
        marginBottom: 1
    },
    bottomText: {
        marginTop: 15,
        fontSize: 11,
        color: '#BEBEBE'
    },
    countText: {
        marginTop: 5,
        fontSize: 11,
        color: '#BEBEBE'
    },
    priceContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    btnContainer: {
        backgroundColor: '#F6F6F6',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editContainer: {
        backgroundColor: '#F6F6F6',
        position: 'absolute',
        width: 35,
        height: 35,
        right: 35 + 3 + 10,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delContainer: {
        backgroundColor: '#F6F6F6',
        position: 'absolute',
        right: 10,
        bottom: 0,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

module.exports = BZMCartMainDealItemView;
