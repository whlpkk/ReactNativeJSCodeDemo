/*
 *
 * @providesModule BZMCartMainTBCart
 */
'use strict';

var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var TBFacade = require('TBFacade');
var TBImage = require('TBImage');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartMainTBCart = React.createClass({
    propTypes: {
        action: PropTypes.string,
    },
    onPressShoppingCart: function () {
        var url = "http://h5.m.taobao.com/awp/base/bag.htm";
        TBFacade.forward(1, url);
    },

    render: function () {
        return (
            <TouchableHighlight style={styles.touchContainer} onPress={this.onPressShoppingCart}>
                <View style={styles.touchContainer}>
                    <TBImage style={styles.leftImage}
                             clipsToBounds={true}
                             urlPath={BZMCartUtils.iconURL("bzm_cart_tbcart.png")}
                    />
                    <View style={styles.rightContainer}>
                        <Text style={styles.topText}>淘宝购物车商品</Text>
                        <Text style={styles.bottomText}>找不到的商品在这里</Text>
                    </View>
                    <TBImage style={styles.rightImage} urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")} />
                </View>
            </TouchableHighlight>
        );
    }

});

var styles = StyleSheet.create({
    touchContainer: {
        flex:1,
        flexDirection: 'row',
        height: 62,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        alignItems:'center'
    },
    rightContainer: {
        marginLeft:10,
        flex:1,
        alignItems:'flex-start'
    },
    leftImage: {
        width: 36,
        height: 36,
        backgroundColor:'#eeeeee',
        marginLeft:10,
        borderRadius: 3
    },
    rightImage: {
        width:8,
        height:14,
        marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
        backgroundColor: '#ffffff'
    },
    topText: {
        fontSize:12,
        color:'#F96A41'
    },
    bottomText: {
        marginTop:4,
        fontSize:10,
        color:'#BEBEBE'
    }
});

module.exports = BZMCartMainTBCart;