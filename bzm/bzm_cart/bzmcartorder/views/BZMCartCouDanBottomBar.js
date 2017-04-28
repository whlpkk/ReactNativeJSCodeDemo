/*
 * @providesModule BZMCartCouDanBottomBar
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');
var {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartCouDanBottomBar = React.createClass({
    propTypes: {
        totalprice: PropTypes.string,
        discountprice: PropTypes.string,
        onPressFinishBtn: PropTypes.func.isRequired,
    },

    render: function () {
        var totalprice = this.props.totalprice;
        var discountprice = this.props.discountprice;
        if (totalprice == undefined) {
            totalprice = 0;
        }
        if (discountprice == undefined) {
            discountprice = 0;
        }
        return (
            <View style={styles.container}>
                <TBImage style={styles.background}
                         urlPath={'http://i0.tuanimg.com/cs/img/bzm_udeal/bzm_udeal_navbar_bg.png'}/>
                <View style={styles.bar}>
                    <TouchableHighlight
                        style={[styles.backButton]}
                        underlayColor={'transparent'}
                        onPress={this._onBack}>
                        <View style={styles.circlecontainer}>

                        </View>
                    </TouchableHighlight>
                    <View style={styles.leftContainer}>
                        <Text style={styles.bottomtitle1}>{"共:" + totalprice}</Text>
                        <Text style={styles.bottomtitle2}>{"可享优惠" + discountprice}</Text>
                    </View>
                    <TouchableHighlight
                        onPress={this.props.onPressFinishBtn}>
                        <View style={styles.finishButton}>
                            <Text style={styles.bottomtitleView}>{"完成凑单"}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    },
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        height: 45,
    },
    leftContainer: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        height: 45,
        backgroundColor: '#F8F8F8',
    },
    background: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    bar: {
        position: 'absolute',
        top: 0,
        width: screenWidth,
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
    },

    backButton: {
        width: 50,
        height: 45,
        // alignItems: 'center',
        justifyContent: 'center',
    },
    circlecontainer: {
        height: 45,
        backgroundColor: '#f8f8f8',
    },
    finishButton: {
        width: 88,
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#ef4949',
        justifyContent:'center'
    },

    backArrow: {
        marginLeft: 13,
        width: 12,
        height: 22,
        backgroundColor: 'transparent',
    },
    bottomtitle1: {
        paddingTop: 5,
        fontSize: 14,
        color: '#e30c26',
        textAlign: 'left',
    },
    bottomtitle2: {
        fontSize: 10,
        color: '#9d9d9d',
        textAlign: 'left',
    },
    cartntitlecontainer: {
        marginLeft: 5,
    },
    titleView: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10 + 47,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '400',
        color: '#27272f'
    },
    bottomtitleView: {
        fontSize: 14,
        color: '#f9f9f9'
    }
});

module.exports = BZMCartCouDanBottomBar;
