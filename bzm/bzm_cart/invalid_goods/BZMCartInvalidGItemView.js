/*
 *
 * @providesModule BZMCartInvalidGItemView
 */
'use strict';
var TBImage = require('TBImage');
var React = require('react-native');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartInvalidGItemView = React.createClass({
    propTypes: {
        onDelete: PropTypes.func.isRequired,
        deal: PropTypes.object.isRequired
    },

    _onTouchDelete: function () {
        this.props.onDelete(this.props.deal);
    },
    render: function () {
        var dealData = this.props.deal;
        var dealImage = BZMCoreUtils.dealIMGBasePath() + dealData.product.skuImageUrl;
        if (dealData.product.skuImageUrl.length<1) {
            dealImage = BZMCoreUtils.dealIMGBasePath() + dealData.product.imagesUrl.split(",")[0];
        } else {
            dealImage = BZMCoreUtils.dealIMGBasePath() + dealData.product.skuImageUrl;
        }
        return (
            <View style={styles.rightContainerTouch}>
                <View style={styles.rightContainer}>
                    <TBImage style={styles.dealImage}
                             clipsToBounds={true}
                             urlPath={dealImage}
                    />
                    <View style={styles.rightContainer2}>
                        <Text style={styles.topText}
                              numberOfLines={1}
                        >{dealData.product.productName}</Text>
                        <Text style={styles.countText}>X{dealData.product.count}</Text>
                        <View style={styles.bottomLine} />
                    </View>

                    <TouchableHighlight style={styles.delContainer} onPress={this._onTouchDelete}>
                        <View style={styles.btnContainer}>
                            <TBImage style={styles.leftImage}
                                     clipsToBounds={true}
                                     urlPath={BZMCartUtils.iconURL("bzm_cart_delete.png")}
                            />
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

});

var styles = StyleSheet.create({
    rightContainerTouch: {
        backgroundColor: '#ffffff',
        flex: 1
    },
    rightContainer: {
        paddingLeft:10,
        paddingTop:10,
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        height:100
    },
    rightContainer2: {
        marginLeft: 10,
        flex: 1,
        height:90,
        justifyContent:'space-between'
    },
    leftImage: {
        width: 20,
        height: 20,
        backgroundColor: '#ffffff'
    },
    dealImage: {
        width: 90,
        height: 90,
        backgroundColor: '#F6F6F6'
    },
    topText: {
        marginTop:3,
        fontSize: 14,
        color: '#27272F',
        marginRight: 10
    },
    countText: {
        position: 'absolute',
        bottom: 10,
        fontSize: 14,
        color: '#BEBEBE'
    },
    btnContainer: {
        backgroundColor: '#ffffff',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delContainer: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        right: 5,
        bottom: 3,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomLine: {
        height: BZMCoreStyle.lineHeight(),
        backgroundColor: '#E7E7E7'
    }
});

module.exports = BZMCartInvalidGItemView;
