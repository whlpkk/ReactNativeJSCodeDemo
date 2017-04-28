/*
 *
 * @providesModule BZMCartMainDealSeller
 */
'use strict';
var TBImage = require('TBImage');
var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var TBFacade = require('TBFacade');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartMainDealSeller = React.createClass({
    propTypes: {
        sellerInfo: PropTypes.object.isRequired,
        onPressLeftBtn:PropTypes.func.isRequired
    },
    _onPressLeftBtn: function () {
        this.props.sellerInfo.cartSelected = !this.props.sellerInfo.cartSelected;
        this.props.onPressLeftBtn(this.props.sellerInfo);
    },
    _forwardToSeller: function () {
        var promotionId = this.props.sellerInfo.promotionId;
        var pArr = [];
        var url = 'http://th5.m.zhe800.com/h5/shopindex?';
        pArr.push('id='+promotionId);
        pArr.push('pub_page_from=zheclient');
        pArr.push('p_refer='+promotionId);
        var queryString = pArr.join("&");
        url = url + queryString;

        TBFacade.forward(1, url);
    },
    render: function () {
        let sellerInfo = this.props.sellerInfo;
        var shopIcon = "bzm_cart_seller.png";
        if (sellerInfo.proportion) {
            shopIcon = "bzm_cart_gold.png";
        }
        var leftImagePath = null;
        if (sellerInfo.cartSelected) {
            leftImagePath = "bzm_cart_checked.png";
        } else {
            leftImagePath = "bzm_cart_uncheck.png";
        }
        return (
            <TouchableHighlight style={styles.containerTouch} onPress={this._forwardToSeller}>
                <View style={styles.container}>
                    <TouchableHighlight style={styles.leftBtnTouch} onPress={this._onPressLeftBtn}>
                        <View style={styles.leftBtnContainer}>
                            <TBImage style={styles.leftImage}
                                     clipsToBounds={true}
                                     urlPath={BZMCartUtils.iconURL(leftImagePath)}
                            />
                        </View>
                    </TouchableHighlight>

                    <TBImage style={styles.leftImage}
                             clipsToBounds={true}
                             urlPath={BZMCartUtils.iconURL(shopIcon)}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{this.props.sellerInfo.nickName}</Text>
                    </View>
                    <TBImage style={styles.rightImage}
                             clipsToBounds={true}
                             urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}
                    />
                </View>
            </TouchableHighlight>
        );
    }

});

var styles = StyleSheet.create({
    containerTouch: {
        flex: 1,
        height: 44
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    leftBtnTouch: {
        width: 44,
        height: 44
    },
    leftBtnContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftImage: {
        width: 20,
        height: 20,
        backgroundColor: '#ffffff'
    },
    leftLine: {
        width: 60,
        height: 1,
        backgroundColor: '#E0E0E0'
    },
    titleContainer: {
        marginLeft: 10,
        flex: 1,
        alignItems: 'flex-start'
    },
    rightImage: {
        width: 8,
        height: 14,
        marginRight: BZMCoreStyle.RIGHT_ARROW_MARGIN,
        backgroundColor: '#ffffff'
    },
    title: {
        marginRight: 10,
        color: '#27272F',
        fontSize: 14
    }
});

module.exports = BZMCartMainDealSeller;
