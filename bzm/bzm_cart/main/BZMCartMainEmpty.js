/*
 *
 * @providesModule BZMCartMainEmpty
 */
'use strict';

var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');
var BZMCartMainModel = require('BZMCartMainModel');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    } = React;

var PropTypes = React.PropTypes;
var BZMCartMainEmpty = React.createClass({
    propTypes: {
        cartModel: PropTypes.instanceOf(BZMCartMainModel).isRequired,
        onError: PropTypes.func.isRequired
    },
    _forwardToHome: function () {
        var url = "zhe800://m.zhe800.com/mid/home?tab=1";
        TBFacade.forward(1, url);
    },
    render: function () {
        var cartListData = this.props.cartModel.cartListData;
        var errorMessage = null;
        if (cartListData && cartListData.result.failDescList != null && cartListData.result.failDescList.length > 0) {
            var message = cartListData.result.failDescList[0].desc;
            var failCode = cartListData.result.failDescList[0].failCode;
            if (failCode == "2007") {
                //购物车为空
            } else {
                errorMessage = message;
            }
        } else {
            errorMessage = "数据加载失败";
        }

        if (errorMessage != null) {
            errorMessage += ",点击重新加载";
            return (
                <TouchableHighlight onPress={this.props.onError}>
                    <View style={[this.props.style, styles.container]}>
                        <Text style={styles.title}>{errorMessage}</Text>
                    </View>
                </TouchableHighlight>
            );
        } else {
            return (
                <View style={[this.props.style, styles.container]}>
                    <TBImage style={styles.topImage}
                             urlPath={BZMCartUtils.iconURL("bzm_cart_empty.png")}
                    />
                    <TouchableHighlight onPress={this._forwardToHome}>
                        <View style={styles.btn}>
                            <Text style={styles.title}>去逛逛</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            );
        }

    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#EEEEEE',
        alignItems: 'center'
    },
    topImage: {
        width: 135,
        height: 165,
        backgroundColor: '#EEEEEE',
        marginBottom: 30,
    },
    btn: {
        width: 110,
        height: 40,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: BZMCoreStyle.lineHeight(),
        borderRadius: 3,
        borderColor: '#545C66'
    },
    title: {
        color: '#545C66',
        fontSize: 15
    }
});

module.exports = BZMCartMainEmpty;