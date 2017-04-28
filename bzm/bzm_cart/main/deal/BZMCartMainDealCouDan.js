/*
 *
 * @providesModule BZMCartMainDealCouDan
 */
'use strict';

var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var TBExposureManager = require('TBExposureManager');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var BZMCartMainModel = require('BZMCartMainModel');
var TBFacade = require('TBFacade');
var TBImage = require('TBImage');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartMainDealCouDan = React.createClass({
    propTypes: {
        cartModel: PropTypes.instanceOf(BZMCartMainModel),
        shopData: PropTypes.object.isRequired
    },
    onPressCouDan: function () {
        var modelVo = {
            analysisId: '',
            analysisType: 'rigup',
            analysisIndex: 0
        };
        var cartModel = this.props.cartModel;
        var pageId = cartModel.pageId;
        var pageName = cartModel.pageName;
        TBExposureManager.pushLogForPageName(pageName, pageId, 1, modelVo);

        var sellerId = this.props.shopData.sellerInfo.sellerId;
        var nickName = this.props.shopData.sellerInfo.nickName;
        var pArr = [];
        var url = 'http://th5.m.zhe800.com/h5/coudan/index?';
        pArr.push('sellerId='+sellerId);
        pArr.push('nickName='+encodeURIComponent(nickName));
        pArr.push('p_refer=');
        pArr.push('pub_page_from=zheclient');
        pArr.push('sku_color=');
        var queryString = pArr.join("&");
        url = url + queryString;

        TBFacade.forward(1, url);
    },

    _ruleOkText: function (rule, ruleItem) {
        var text = "";
        var d1 = 0;
        var d2 = 0;
        switch (ruleItem.type) {
            case 1:
            { //满减
                if (rule.ruleOk) {
                    text = "已选" + rule.totalPrice + "元可享受满" + rule.rule.p1 + "元减" + rule.rule.p2 + "元优惠";
                } else {
                    text = "已选" + rule.totalPrice + "元,还差" + rule.unsatisfyGap + "元,即可享受减" + rule.rule.p2 + "元优惠";
                }
            }
                break;
            case 2:
            {//满减,上不封顶
                if (rule.ruleOk) {
                    d1 = rule.pCount * rule.rule.p1;
                    d2 = rule.pCount * rule.rule.p2;
                    text = "已选" + rule.totalPrice + "元可享受满" + d1 + "元减" + d2 + "元优惠";
                } else {
                    text = "已选" + rule.totalPrice + "元,还差" + rule.unsatisfyGap + "元,即可享受减" + rule.rule.p2 + "元优惠";
                }
            }
                break;
            case 3:
            {
                if (rule.ruleOk) {
                    d1 = rule.rule.p1;
                    d2 = rule.rule.p2;
                    text = "已选" + rule.pCount + "件,可享受" + d1 + "件" + d2 + "折优惠";
                } else {
                    text = "已选" + rule.pCount + "件,还差" + rule.unsatisfyGap + "件,即可享受" + rule.rule.p2 + "折优惠";
                }
            }
                break; //满折
            case 4:
                text = "";
                break; //满多少件包邮
            case 5:
                text = "";
                break; //满多少钱包邮
        }

        return text;
    },

    _ruleFailText: function (ruleItem) {
        var arr = ruleItem.unsatisfyRule.split("-");
        var text = "可享受满" + arr[0] + "元减" + arr[1] + "元优惠";
        switch (ruleItem.type) {
            case 1:
                text = "可享受满" + arr[0] + "元减" + arr[1] + "元优惠";
                break; //满减
            case 2:
                text = "可享受满" + arr[0] + "元减" + arr[1] + "元优惠";
                break; //满减,上不封顶
            case 3:
                text = "可享受满" + arr[0] + "件" + arr[1] + "折优惠";
                break; //满折
            case 4:
                text = "可享受满" + arr[0] + "件包邮";
                break; //满多少件包邮
            case 5:
                text = "可享受满" + arr[0] + "元包邮";
                break; //满多少钱包邮
        }

        return text;
    },

    /**
     * 提示取自服务端, 以该方法为主
     * @returns {string}
     * @private
     */
    _shopCouponText: function () {
        var sellerInfo = this.props.shopData.sellerInfo;
        var shopCoupon = this.props.cartModel.getShopCouponBySellerId(sellerInfo.sellerId);
        var satisfyRule = shopCoupon.satisfyRule;
        var unsatisfyRule = shopCoupon.unsatisfyRule;

        var ruleOk = false;
        if (satisfyRule && satisfyRule.length > 0) {
            ruleOk = true;
        }
        var rule = this.props.cartModel.getSelectedRuleItemOfSeller(sellerInfo.sellerId);
        var sellerSelect = false;
        var selectedSeller = this.props.cartModel.getSelectedSellerOfId(sellerInfo.sellerId);
        if (selectedSeller) {
            sellerSelect = true;
        }
        var arr = null;
        var text = "";
        var ruleArr = null;
        switch (shopCoupon.type) {
            case 1:
            {
                if (sellerSelect) {
                    if (ruleOk) {
                        ruleArr = satisfyRule.split('-');
                        text = "已选" + rule.oTotalPrice + "元可享受满" + ruleArr[0] + "元减" + ruleArr[1] + "元优惠";
                    } else {
                        ruleArr = unsatisfyRule.split('-');
                        text = "已选" + rule.oTotalPrice + "元,还差" + rule.unsatisfyGap + "元,即可享受减" + ruleArr[1] + "元优惠";
                    }
                } else {
                    arr = unsatisfyRule.split("-");
                    text = "可享受满" + arr[0] + "元减" + arr[1] + "元优惠";
                }
            }
                break; //满减
            case 2:
            {
                if (sellerSelect) {
                    if (ruleOk) {
                        ruleArr = satisfyRule.split('-');
                        text = "已选" + rule.oTotalPrice + "元可享受满" + ruleArr[0] + "元减" + ruleArr[1] + "元优惠";
                    } else {
                        ruleArr = unsatisfyRule.split('-');
                        text = "已选" + rule.oTotalPrice + "元,还差" + rule.unsatisfyGap + "元,即可享受减" + ruleArr[1] + "元优惠";
                    }
                } else {
                    arr = unsatisfyRule.split("-");
                    text = "可享受满" + arr[0] + "元减" + arr[1] + "元优惠";
                }
            }
                break; //满减,上不封顶
            case 3:
            {
                if (sellerSelect) {
                    if (ruleOk) {
                        ruleArr = satisfyRule.split('-');
                        text = "已选" + rule.pCount + "件,可享受" + ruleArr[0] + "件" + ruleArr[1] + "折优惠";
                    } else {
                        ruleArr = unsatisfyRule.split('-');
                        text = "已选" + rule.pCount + "件,还差" + rule.unsatisfyGap + "件,即可享受" + ruleArr[1] + "折优惠";
                    }
                } else {
                    arr = unsatisfyRule.split("-");
                    text = "可享受满" + arr[0] + "件" + arr[1] + "折优惠";
                }
            }
                break; //满折
            case 4:
                text = "可享受满" + arr[0] + "件包邮";
                break; //满多少件包邮
            case 5:
                text = "可享受满" + arr[0] + "元包邮";
                break; //满多少钱包邮
        }
        return text;
    },

    render: function () {
        //var ruleItem = this.props.shopData.sellerRule;
        //var sellerInfo = this.props.shopData.sellerInfo;
        //var rule =  this.props.cartModel.selectRuleItemOfSeller(sellerInfo.sellerId);
        //
        //var text = "";
        //if (rule != null && rule.sel) {
        //    text = this._ruleOkText(rule, ruleItem);
        //} else {
        //    text = this._ruleFailText(ruleItem);
        //}

        var text = this._shopCouponText();
        return (
            <TouchableHighlight style={styles.touchContainer} onPress={this.onPressCouDan}>
                <View style={styles.touchContainer}>
                    <Text style={styles.leftText}>{text}</Text>
                    <View style={styles.rightContainer}>
                        <Text style={styles.rightText}>去凑单</Text>
                    </View>
                    <TBImage style={styles.rightImage} urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>
                </View>
            </TouchableHighlight>
        );
    }

});

var styles = StyleSheet.create({
    touchContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 41,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    rightContainer: {
        marginRight: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    leftImage: {
        width: 36,
        height: 36,
        backgroundColor: '#eeeeee',
        marginLeft: 10,
        borderRadius: 3
    },
    rightImage: {
        width: 8,
        height: 14,
        marginRight: BZMCoreStyle.RIGHT_ARROW_MARGIN,
        backgroundColor: '#ffffff'
    },
    leftText: {
        marginLeft: 10,
        fontSize: 12,
        color: '#27272F'
    },
    rightText: {
        fontSize: 13,
        color: '#EF4949'
    }
});

module.exports = BZMCartMainDealCouDan;
