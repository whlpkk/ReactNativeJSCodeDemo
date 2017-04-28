/*
 *
 * @providesModule BZMCartMainDeal
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    ListView,
    View,
    TouchableHighlight,
    Text
    } = React;
var TBFacade = require('TBFacade');
var TBImage = require('TBImage');
var BZMCartMainModel = require('BZMCartMainModel');
var BZMCartMainDealCoupon = require('BZMCartMainDealCoupon');
var BZMCartMainDealSeller = require('BZMCartMainDealSeller');
var BZMCartMainDealItemView = require('BZMCartMainDealItemView');
var BZMCartMainDealCouDan = require('BZMCartMainDealCouDan');
var BZMCoreStyle = require('BZMCoreStyle');

var PropTypes = React.PropTypes;
var shopData = null;
var dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => true
});

var BZMCartMainDeal = React.createClass({
    propTypes: {
        shopData: PropTypes.object.isRequired,
        cartModel: PropTypes.instanceOf(BZMCartMainModel),
        onPressSellerBtn:PropTypes.func.isRequired,
        onPressDealBtn:PropTypes.func.isRequired,
        onPressEdit: PropTypes.func.isRequired,
        onPressDelete: PropTypes.func.isRequired
    },

    openWindow: function (url) {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.forward(cTag, url);
    },

    //曝光函数
    _exposureItems: function() {
        this.props.cartModel.checkExposureItems();
    },
    _onChangeVisibleRows: function(visibleRows, changedRows) {
        var itemDetailList = this.props.shopData.itemDetailList;
        for (var index in changedRows.s1) {
            var deal = itemDetailList[index];
            if (deal == undefined) {
                return;
            }
            if (changedRows.s1[index]) {
                deal.appearTime = new Date().getTime();
            }else {
                deal.disAppearTime = new Date().getTime();
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
        shopData = this.props.shopData;
        var sourceArr = [];
        var itemDetailList = shopData.itemDetailList;
        var promotionId = null;
        for (var inx in itemDetailList) {
            var item = itemDetailList[inx];
            sourceArr.push(item);
            sourceArr.push(1);
            if (promotionId == null) {
                promotionId = item.product.promotionId;
            }
        }
        shopData.sellerInfo.promotionId=promotionId;
        if (sourceArr.length > 1) {
            sourceArr.splice(-1, 1)
        }
        dataSource = dataSource.cloneWithRows(sourceArr);

        var viewItems = [];
        viewItems.push(
            <BZMCartMainDealSeller
                key="dealSeller"
                sellerInfo={shopData.sellerInfo}
                onPressLeftBtn={(sellerInfo)=>{this.props.onPressSellerBtn(sellerInfo)}}
            />
        );
        viewItems.push(<View key="btLine1" style={styles.sellerBottomLine}/>);
        if (!this.props.cartModel.isFinishCouDanPage && shopData.hasOwnProperty("sellerRule")) {
            viewItems.push(<BZMCartMainDealCoupon key="dealCoupon" sellerRule={shopData.sellerRule}/>);
        }
        viewItems.push(<ListView key="listView" ref="listView"
                                 dataSource={dataSource}
                                 renderRow={this.renderRow}
                                 style={styles.listView}
                                 scrollEnabled={false}
                                 onChangeVisibleRows={this._onChangeVisibleRows}
                                 onMomentumScrollBegin={this._onMomentumScrollBegin}
                                 onMomentumScrollEnd={this._onMomentumScrollEnd}
        />);
        if (!this.props.cartModel.isFinishCouDanPage && shopData.hasOwnProperty("sellerRule")
            && shopData.sellerRule.hasOwnProperty("unsatisfyRule")
            //&& shopData.sellerRule.unsatisfyRule.length > 0
        ) {
            viewItems.push(<BZMCartMainDealCouDan cartModel={this.props.cartModel} key="couDan" shopData={shopData}/>);
            viewItems.push(<View key="couDanLine" style={styles.couDanBottomLine}/>);
        } else {
            viewItems.push(<View key="couDanLine" style={styles.couDanBottomLine}/>);
        }
        return (
            <View style={styles.container} ref="containerView">
                {viewItems}
            </View>

        );
    },

    renderRow: function (item) {
        if (item.hasOwnProperty("product")) {
            return (
                <BZMCartMainDealItemView
                    onPressLeftBtn={(dealItem)=>{this.props.onPressDealBtn(dealItem)}}
                    onPressEdit={(dealItem)=>{this.props.onPressEdit(dealItem)}}
                    onPressDelete={(dealItem)=>{this.props.onPressDelete(dealItem)}}
                    dealItem={item}/>
            );
        } else {
            return (
                <View style={styles.dealSepLine}/>
            );
        }

    }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        flex: 1
    },
    listView: {
        backgroundColor: '#F5FCFF'
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

module.exports = BZMCartMainDeal;
