/*
 *
 * @providesModule BZMCartInvalidGMain
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
var TBLogin = require('TBLogin');
var TBTip = require('TBTip');
var BZMCartNavigationBar = require('BZMCartNavigationBar');
var BZMCartInvalidGItemView = require('BZMCartInvalidGItemView');
var BZMCartInvalidGBottomView = require('BZMCartInvalidGBottomView');
var TBAnimation = require('TBAnimation');
var TBAlert = require('TBAlert');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreModel = require('BZMCoreModel');
let CART_LIST = BZMCoreUtils.REQUEST_BASE_URL+"/h5/api/cart/list";

var refreshPage = true;
var invalidItemList = null;

var BZMCartInvalidGMain = React.createClass({
    getInitialState: function () {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true
            }),
            loaded: false,
            loading: false
        };
    },
    _deleteDealFromCache: function (deal) {
        for (var inx in invalidItemList) {
            var item = invalidItemList[inx];

            if (item.product.productId == deal.product.productId
                && item.product.skuNum == deal.product.skuNum) {
                invalidItemList.splice(inx, 1);
                break;
            }
        }
    },
    _deleteDealsFromCache: function (deals) {
        for (var inx in deals) {
            var item = deals[inx];
            this._deleteDealFromCache(item);
        }
        this.reloadListData();
    },

    _deleteDeals: function (deals) {
        var deleteParamArr = [];
        for (var inx in deals) {
            var deal = deals[inx];
            var zId = deal.product.productId;
            var skuNum = deal.product.skuNum;
            deleteParamArr.push("productId=" + zId);
            deleteParamArr.push("skuNum=" + skuNum);
        }
        var queryString = deleteParamArr.join("&");
        var urlString = BZMCoreUtils.REQUEST_BASE_URL+'/h5/api/cart/delete?' + queryString;

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
                            this._deleteDealsFromCache(deals);
                            TBTip.show("删除成功");
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

    _onPressDelete: function (deal) {
        this._deleteDeals([deal]);
    },

    openWindow: function (url) {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.forward(cTag, url);
    },

    containerResponderCapture: function (evt) {
        return this.props.tbNativeMoving;
    },
    componentDidMount: function () {
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

    reloadListData: function () {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(invalidItemList),
            loaded: true,
            loading: false
        });
    },

    loadCartList: function () {
        if (this.props.invalidItemList) {
            var param = this.props.invalidItemList;
            invalidItemList =JSON.parse(param);
            this.reloadListData();
            return;
        }

        if (this.state.loading) {
            return;
        }
        refreshPage = true;
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;
        var containerView = this.refs["containerView"];
        var cTag = React.findNodeHandle(containerView);
        TBLoading.pageLoading(cTag,
            {"x": 0, "y": 64, "width": screenWidth, "height": screenHeight - 64}
        );

        fetch(CART_LIST).then((response) => {
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
            }
        }, (e) => {
            this.state.loading = false;
            console.log("请求失败!", e);
            TBLoading.hidePageLoading(cTag, {});
        }).then((responseData) => {
            this.state.loading = false;
            if (responseData && responseData.hasOwnProperty('invalidItemList')) {
                invalidItemList = responseData.invalidItemList;
                this.reloadListData();
            } else {

            }

            TBLoading.hidePageLoading(cTag, {});
        });

    },
    _goBack: function () {
        TBFacade.goBack(0);
    },

    _onPressClear: function () {
        this._deleteDeals(invalidItemList);
    },

    render: function () {
        return (
            <View style={styles.container} ref="containerView"
                  onStartShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}
                  onMoveShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}>
                <StatusBar barStyle="default"/>
                <BZMCartNavigationBar title="失效商品" onBack={this._goBack}/>
                <ListView ref="listView"
                          dataSource={this.state.dataSource}
                          renderRow={this.renderHomeRow}
                          style={styles.listView}
                />
                <BZMCartInvalidGBottomView onDelete={this._onPressClear}/>
            </View>
        );
    },

    renderHomeRow: function (item) {
        return (
            <View>
                <BZMCartInvalidGItemView
                    onDelete={(dealItem)=>{this._onPressDelete(dealItem)}}
                    deal={item}/>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1
    },
    listView: {
        backgroundColor: '#ffffff'
    }
});

// React.AppRegistry.registerComponent('BZMCartInvalidGMain', () => BZMCartInvalidGMain);
module.exports = BZMCartInvalidGMain;
