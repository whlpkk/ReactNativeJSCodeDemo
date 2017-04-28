/*
 * @providesModule BZMDSKUView
 */
'use strict';
var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ListView,
    } = React;
var dismissKeyboard = require('dismissKeyboard');
var LayoutAnimation = require('LayoutAnimation');
var TBTagFlow = require('../../bzm_core/components/TBTagFlow');
var TBAlert = require('TBAlert');
var BZMDSKUModel = require('BZMDSKUModel');
var BZMDSKUBottomView = require('BZMDSKUBottomView');
var BZMDSKUTopView = require('BZMDSKUTopView');
var BZMDSKUCountView = require('BZMDSKUCountView');
var BZMCoreStyle = require('BZMCoreStyle');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var PropTypes = React.PropTypes;
var skuModel = null;
var sections = null;
var _skuListView = null;
var _listScrollEnabled = true;
var _keyboardBarBottom = -60;

var secDataSource = new ListView.DataSource({
    rowHasChanged: function (row1, row2) {
        //响应每次刷新
        //return row1.id !== row2.id;
        return true;
    }
});
var skuDataSource = new ListView.DataSource({
    rowHasChanged: function (row1, row2) {
        //响应每次刷新
        //return row1.id !== row2.id;
        return true;
    }
});
var BZMDSKUView = React.createClass({
    selectedSKUs: [],
    propTypes: {
        ...View.propTypes,
        onPressClose: PropTypes.func.isRequired,
        onSelectItem: PropTypes.func.isRequired,
        onBuy: PropTypes.func,
        onCart: PropTypes.func,
        skuModel: PropTypes.instanceOf(BZMDSKUModel)
    },

    skuResponderKeyboardWillShow: function (e:Event) {
        if (!this.props.skuModel || !this.props.skuModel.enableResponseKeyboard) {
            return;
        }
        var mk = LayoutAnimation.create(200,  LayoutAnimation.Types.linear,LayoutAnimation.Properties.opacity);
        LayoutAnimation.configureNext(mk);
        _keyboardBarBottom = e.endCoordinates.height;
        this.forceUpdate();
    },

    skuResponderKeyboardWillHide: function (e:Event) {
        if (!this.props.skuModel || !this.props.skuModel.enableResponseKeyboard) {
            return;
        }
        _keyboardBarBottom = -60;
        var mk = LayoutAnimation.create(200,  LayoutAnimation.Types.linear,LayoutAnimation.Properties.opacity);
        LayoutAnimation.configureNext(mk);

        _listScrollEnabled = true;
        _skuListView.scrollTo({x: 0, y: 0, animated: true});
        this.forceUpdate();
    },

    skuResponderKeyboardDidShow: function (e:Event) {
        // TODO(7693961): The event for DidShow is not available on iOS yet.
        // Use the one from WillShow and do not assign.
        console.log(e);
    },

    skuResponderKeyboardDidHide: function (e:Event) {
        console.log(e);
    },
    componentWillMount: function () {
        this.keyboardWillOpenTo = null;
        this.additionalScrollOffset = 0;
        RCTDeviceEventEmitter.addListener('keyboardWillShow', this.skuResponderKeyboardWillShow);
        RCTDeviceEventEmitter.addListener('keyboardWillHide', this.skuResponderKeyboardWillHide);
        RCTDeviceEventEmitter.addListener('keyboardDidShow', this.skuResponderKeyboardDidShow);
        RCTDeviceEventEmitter.addListener('keyboardDidHide', this.skuResponderKeyboardDidHide);

    },

    onPressBuy: function (obj) {
        this.props.onBuy(obj);
    },
    onPressCart: function (obj) {
        this.props.onCart(obj);
    },
    //目前只支持2级联动
    onPressSKUItem: function (skuItem) {
        var skuObject = skuModel.selectSKUItem(skuItem);
        this.forceUpdate();
        this.props.onSelectItem(skuObject);
    },

    onPressClose: function () {
        if (this.props.onPressClose) {
            this.props.onPressClose();
        }
    },
    _onPressFinish:function() {
        dismissKeyboard();
    },
    _onFocus: function (e) {
        _listScrollEnabled = false;
        var kk = _skuListView.scrollProperties.contentLength - 44 - 20;
        _skuListView.scrollTo({x: 0, y: kk, animated: true});
        this.forceUpdate();
    },
    render: function () {
        if (!this.props.skuModel) {
            return (<View/>);
        }
        skuModel = this.props.skuModel;
        if (this.props.skuModel.sections !== sections) {
            sections = this.props.skuModel.sections;
            let data = {
                id: 1000,
                type: "count",
                count: skuModel.bzmData.count
            };
            sections.push(data);
            sections.forEach(function (item) {
                for (var key2 in item.data) {
                    var item2 = item.data[key2];
                    item2.secId = item.id;
                    item2.tagDisabled = false;
                    if (item2.disabled) {
                        item2.tagDisabled = item2.disabled;
                    }
                }
            });

            this.props.skuModel.resetSKUDisableState();
        }

        secDataSource = secDataSource.cloneWithRows(sections);
        return (
            <View style={styles.container}>
                <BZMDSKUTopView skuModel={skuModel} onPressClose={this.onPressClose}/>
                <View style={styles.bottomLine}/>
                <ListView
                    ref={(listView) => { _skuListView = listView; }}
                    style={styles.sContainer}
                    dataSource={secDataSource}
                    scrollEnabled={_listScrollEnabled}
                    renderRow={this.renderRow}/>

                <BZMDSKUBottomView onBuy={this.onPressBuy}
                                   onCart={this.onPressCart}
                                   skuModel={skuModel}/>
                <View style={[styles.keyboardToolbar,{bottom:_keyboardBarBottom}]}
                >
                    <TouchableHighlight onPress={() => this._onPressFinish()}>
                        <View style={styles.finishTextBox}>
                        <Text>完成</Text>
                            </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    },
    renderRow: function (rowItem) {
        if (rowItem.type == "count") {
            return (
                <View style={styles.countContainerOut}>
                    <BZMDSKUCountView skuModel={skuModel} item={rowItem}
                                      onFocus={this._onFocus}/>
                    <View style={styles.bottomLine}/>
                </View>
            );
        }

        skuDataSource = skuDataSource.cloneWithRows(rowItem.data);
        return (
            <View>
                <View style={styles.skuSection}><Text>{rowItem.name}</Text></View>
                <TBTagFlow style={styles.sinContainer}
                           dataSource={skuDataSource}
                           renderItem={this.renderSKURow}/>
                <View style={styles.skuSep}/>
                <View style={styles.bottomLine}/>
            </View>
        );
    },
    renderSKURow: function (rowItem) {
        if (rowItem.tagDisabled) {
            return (
                <View style={styles.btContainerDisabled}>
                    <Text style={styles.sku_text_disabled}>{rowItem.name}</Text>
                </View>
            );
        }
        if (rowItem.selected) {
            return (
                <TouchableHighlight style={styles.btContainerSel}
                                    underlayColor={BZMCoreStyle.RED_UNDERLAY_COLOR}
                                    onPress={() => this.onPressSKUItem(rowItem)}>
                    <Text style={styles.sku_text_sel}>{rowItem.name}</Text>
                </TouchableHighlight>
            );
        } else {
            return (
                <TouchableHighlight style={styles.btContainer}
                                    underlayColor={BZMCoreStyle.LIGHTGRAY_UNDERLAY_COLOR}
                                    onPress={() => this.onPressSKUItem(rowItem)}>
                    <Text style={styles.sku_text}>{rowItem.name}</Text>
                </TouchableHighlight>
            );
        }
    }
});
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'column'
    },
    btContainer: {
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        marginLeft: 10,
        marginTop: 10,
        height: 30,
        borderRadius: 10
    },
    sku_text: {
        color: '#27272F',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 12
    },
    sku_text_sel: {
        color: '#FFFFFF',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 12
    },
    sku_text_disabled: {
        color: '#BEBEBE',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 12
    },
    btContainerSel: {
        justifyContent: 'center',
        backgroundColor: '#ef4949',
        marginLeft: 10,
        marginTop: 10,
        height: 30,
        borderRadius: 10
    },
    btContainerDisabled: {
        justifyContent: 'center',
        backgroundColor: '#93999b',
        marginLeft: 10,
        marginTop: 10,
        height: 30,
        borderRadius: 10
    },

    sContainer: {
        backgroundColor: '#ffffff',
        //flexDirection: 'column'
    },
    sinContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight: 10
    },
    countContainerOut: {
        height: 64,
        backgroundColor: '#ffffff'
    },
    skuSection: {
        marginLeft: 10,
        paddingTop: 10
    },
    bottomLine: {
        backgroundColor: '#F1F1F1',
        marginLeft: 10,
        marginRight: 10,
        height: 0.5
    },
    skuSep: {
        height: 10
    },
    keyboardToolbar: {
        backgroundColor: '#F1F1F1',
        height: 35,
        width:screenWidth,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position:'absolute'
    },
    finishText: {
        color: '#27272F',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 14
    },
    finishTextBox: {
        backgroundColor: '#F1F1F1',
        padding:10,
        height:35
    }
});

module.exports = BZMDSKUView;