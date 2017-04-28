/*
 *
 * @providesModule BZMHomeTemplate5
 *
 * ---------------
 * |   |         |
 * |   |         |
 * |   |----------
 * |   |    |    |
 * |   |    |    |
 * ---------------
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
var BZMHomeTemplate5 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func,
    },

    render: function () {
        var optData = this.props.optData;
        if (optData.length < 4) {
            return (
                <View/>
            );
        }
        var data1 = optData[0];
        var data2 = optData[1];
        var data3 = optData[2];
        var data4 = optData[3];

        var tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);
        return (
            <View style={[styles.bzm_template_c5,{height:tHeight}]}>
                <View style={styles.bzm_template5_content}>
                    <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                        style={styles.bzm_template5_left}
                                        onPress={() => this.props.openWindow(data1)}>
                        <View style={styles.bzm_template5_right_1}>
                            <TBImage style={styles.bzm_template5_image}
                                     urlPath={data1.pic}/>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.left_right_line}/>
                    <View style={styles.bzm_template5_right}>
                        <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                            style={styles.bzm_template5_right_top}
                                            onPress={() => this.props.openWindow(data2)}>
                            <View style={styles.bzm_template5_right_top}>
                                <TBImage style={styles.bzm_template5_image}
                                         urlPath={data2.pic}/>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.bzm_template5_bottom_line}/>
                        <View style={styles.bzm_template5_right_row}>
                            <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                                style={styles.bzm_template5_right_1}
                                                onPress={() => this.props.openWindow(data3)}>
                                <View style={styles.bzm_template5_right_1}>
                                    <TBImage style={styles.bzm_template5_image}
                                             urlPath={data3.pic}/>
                                </View>
                            </TouchableHighlight>
                            <View style={styles.bzm_template5_h_vline}/>
                            <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                                style={styles.bzm_template5_right_1}
                                                onPress={() => this.props.openWindow(data4)}>
                                <View style={styles.bzm_template5_right_1}>
                                    <TBImage style={styles.bzm_template5_image}
                                             urlPath={data4.pic}/>
                                </View>
                            </TouchableHighlight>
                        </View>

                    </View>
                </View>
                <View style={styles.bzm_template5_bottom_line}/>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    bzm_template_c5: {
        backgroundColor:'transparent',
    },
    bzm_template5_content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    bzm_template5_right_top: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 169
    },
    bzm_template5_right_row: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 206
    },
    bzm_template5_left: {
        flex: 342
    },
    bzm_template5_right: {
        flex: 408
    },
    bzm_template5_right_1: {
        flex: 1
    },
    bzm_template5_image: {
        flex: 1,
        backgroundColor:'transparent'
    },
    bzm_template5_bottom_line: {
        height: BZMCoreStyle.lineHeight(),
        backgroundColor:'transparent'
    },
    left_right_line: {
        width: BZMCoreStyle.lineHeight(),
        backgroundColor:'transparent'
    },
    bzm_template5_h_vline: {
        width: BZMCoreStyle.lineHeight(),
        backgroundColor:'transparent'
    }
});

module.exports = BZMHomeTemplate5;
