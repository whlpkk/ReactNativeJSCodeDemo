'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ListView,
    TextInput
    } = React;

var TBFacade = require('../bzm/bzm_core/components/TBFacade');
var TBTip = require('../bzm/bzm_core/components/TBTip');
var TBAnimation = require('../bzm/bzm_core/components/TBAnimation');
var TBTagFlow = require('../bzm/bzm_core/components/TBTagFlow');
var BZMDSKUView = require('../bzm/bzm_detail/sku/BZMDSKUView');
var BZMDSKUModel = require('BZMDSKUModel');

var STOCK_URL = 'http://localhost:8081/demo/stock.json?platform=ios&dev=true';
var SKU_URL = 'http://localhost:8081/demo/sku.json?platform=ios&dev=true';

var skuObject = null;
var stockObject = null;
var sections = null;

var defaultCenterTip = "SKU加载成功, 点击顶部SDU测试";
var skuModel = null;

class AnimationDemo extends React.Component {

    wrapperSKU(skuDict) {
        skuObject = skuDict;

        fetch(STOCK_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.wrapperStock(responseData)
            })
            .done();
    }

    wrapperStock(stockDict) {
        stockObject = stockDict;

        sections = {};
        sections.sku = skuObject;
        sections.stock = stockObject;

        skuModel = new BZMDSKUModel(skuObject.sku, stockObject);
        skuModel.selectSKUWithID("1-1001:4-75B");

        this.setState({});
    }

    onTest2() {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.forward(cTag, "http://m.zhe800.com/deal/dailyten?c_id=&deal_from=&page_refer=&schemechannel=test");
    }

    onTest3() {
        fetch(SKU_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.wrapperSKU(responseData)
            })
            .done();
    }

    presentView1() {
        var pView = this.refs["presentView"];
        var cView = this.refs["containerView"];
        var reactTag = React.findNodeHandle(pView);
        var cTag = React.findNodeHandle(cView);
        TBAnimation.presentView(reactTag, cTag);
    }

    _onSelectSku(skuObject) {
        if (skuObject != null && skuObject.selectedItems) {
            var str = "";
            for (var inx in skuObject.selectedItems) {
                var item = skuObject.selectedItems[inx];
                str = str + item.label +":"+item.item.name + " ";
            }
            defaultCenterTip = str;
            this.forceUpdate();
        }
    }

    render() {

        if (sections == null) {
            return (
                <View style={styles.container} ref="containerView">
                    <View style={styles.topContainer} ref="navView">
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.presentView1.bind(this)}>
                            <Text style={styles.text}>SKU</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest2.bind(this)}>
                            <Text style={styles.text}>测试2</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest3.bind(this)}>
                            <Text style={styles.text}>加载SKU</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={styles.presentContainer} ref="presentView">

                    </View>
                </View>);
        }

        return (
            <View style={styles.container} ref="containerView">
                <View style={styles.topContainer} ref="navView">
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.presentView1.bind(this)}>
                        <Text style={styles.text}>SKU</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest2.bind(this)}>
                        <Text style={styles.text}>测试2</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest3.bind(this)}>
                        <Text style={styles.text}>加载SKU</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.text} ref="text_001">{defaultCenterTip}</Text>
                </View>
                <View style={styles.presentContainer} ref="presentView">
                    <BZMDSKUView sections={sections}
                                 skuModel={skuModel}
                                 onSelectItem={this._onSelectSku.bind(this)}
                                 onPressClose={this._onPressClose.bind(this)}/>
                </View>
            </View>);
    }

    _onPressClose() {
        var pView = this.refs["presentView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{});
    }

}
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
let presentHeight = screenHeight - 120;
var styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color: '#ffffff'
    },
    btContainer: {
        justifyContent: 'center',
        backgroundColor: '#007755',
        marginLeft: 10,
        marginTop: 10,
        height: 40
    },


    container: {
        backgroundColor: '#eeeeee',
        flex: 1,
        flexDirection: 'column'
    },

    bottomContainer: {
        backgroundColor: '#5522ee',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    touchableContainer: {
        marginLeft: 10,
        width: 60,
        backgroundColor: '#777b7c'
    },
    topContainer: {
        paddingTop: 20,
        paddingBottom: 0,
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#11ffee',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    presentContainer: {
        backgroundColor: '#333333',
        width: screenWidth,
        position: "absolute",
        top: screenHeight + 60,
        height: presentHeight
    }
});

React.AppRegistry.registerComponent('AnimationDemo', ()=> AnimationDemo);
