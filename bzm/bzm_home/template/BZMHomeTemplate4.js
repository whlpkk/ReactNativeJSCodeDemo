/*
 *
 * @providesModule BZMHomeTemplate4
 *
 * 标题
 * ---------
 * |       |
 * |       |
 * ---------
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreStyle = require('BZMCoreStyle');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var {
    StyleSheet,
    TouchableHighlight,
    View,
    } = React;

var PropTypes = React.PropTypes;
var BZMHomeTemplate4 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func
    },

    _openWindow: function (optData) {
        this.props.openWindow(optData);
    },

    render: function () {
        var optData = this.props.optData[0];
        var enableTouch = true;
        if (optData.value == null || optData.value == undefined || optData.value.length < 1) {
            enableTouch = false;
        }
        var tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);
        if (!enableTouch) {
            return (
                <View style={[styles.bzm_template_c4,{height:tHeight}]}>
                    <View style={styles.bzm_template4_auto}>
                        <TBImage style={styles.bzm_template4_image}
                                 urlPath={optData.pic}/>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.bzm_template_c4}>
                    <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                        style={styles.bzm_template4_auto}
                                        onPress={() => this._openWindow(optData)}>
                        <View style={styles.bzm_template4_auto}>
                            <TBImage style={styles.bzm_template4_image}
                                     urlPath={optData.pic}/>
                        </View>
                    </TouchableHighlight>
                </View>
            );
        }
    }
});

var styles = StyleSheet.create({
    bzm_template_c4: {
        backgroundColor:'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    bzm_template4_image: {
        flex: 1,
        backgroundColor:'transparent'
    },
    bzm_template4_auto: {
        flex: 1
    }
});

module.exports = BZMHomeTemplate4;
