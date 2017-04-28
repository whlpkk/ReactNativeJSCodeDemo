/*
 *
 * @providesModule BZMCartMainInvalid
 */
'use strict';

var React = require('react-native');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');
var BZMCartMainModel = require('BZMCartMainModel');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartMainInvalid = React.createClass({
    propTypes: {
        cartModel: PropTypes.instanceOf(BZMCartMainModel)
    },
    onPressInvalid: function () {
        var param = JSON.stringify(this.props.cartModel.invalidItemList);
        param = encodeURIComponent(param);
        var url = "http://th5.m.zhe800.com/h5/cart/exp/my?invalidItemList="+param;
        console.log("onPressInvalid: "+url);
        TBFacade.forward(1, url);
    },

    render: function () {
        var carModel = this.props.cartModel;
        return (
            <TouchableHighlight style={styles.touchContainer} onPress={this.onPressInvalid}>
                <View style={styles.touchContainer}>
                    <TBImage style={styles.leftImage}
                             clipsToBounds={true}
                             urlPath={BZMCartUtils.iconURL("bzm_cart_invalid.png")}
                    />
                    <View style={styles.rightContainer}>
                        <Text style={styles.topText}>已失效商品({carModel.invalidItemList.length})</Text>
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
        height: 45,
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
        width: 20,
        height: 20,
        backgroundColor:'#ffffff',
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
        fontSize:14,
        color:'#545C66'
    }
});

module.exports = BZMCartMainInvalid;