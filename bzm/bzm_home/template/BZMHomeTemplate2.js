/*
 *
 * @providesModule BZMHomeTemplate2
 *
 * --------------
 * |   |        |
 * |   |        |
 * |   |---------
 * |   |        |
 * |   |        |
 * --------------
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
var BZMHomeTemplate2 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func
    },

    render: function () {

        var optData = this.props.optData;
        if (optData.length < 3) {
            return (
                <View/>
            );
        }
        var data1 = optData[0];
        var data2 = optData[1];
        var data3 = optData[2];
        var tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);

        return (
            <View style={[styles.bzm_template_c2,{height:tHeight}]}>
                <View style={styles.bzm_template2_content}>
                    <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                        style={styles.bzm_template2_left}
                                        onPress={() => this.props.openWindow(data1)}>
                        <View style={styles.bzm_template2_auto}>
                            <TBImage style={styles.bzm_template2_image}
                                     urlPath={data1.pic}/>
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.left_right_line,{backgroundColor:this.props.backGroundColor}]}/>
                    <View style={styles.bzm_template2_right}>
                        <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                            style={styles.bzm_template2_right_1}
                                            onPress={() => this.props.openWindow(data2)}>
                            <View style={styles.bzm_template2_auto}>
                                <TBImage style={styles.bzm_template2_image}
                                         urlPath={data2.pic}/>
                            </View>
                        </TouchableHighlight>
                        <View style={[styles.bzm_template2_bottom_line,{backgroundColor:this.props.backGroundColor}]}/>
                        <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                            style={styles.bzm_template2_right_1}
                                            onPress={() => this.props.openWindow(data3)}>
                            <View style={styles.bzm_template2_auto}>
                                <TBImage style={styles.bzm_template2_image}
                                         urlPath={data3.pic}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={[styles.bzm_template2_bottom_line,{backgroundColor:this.props.backGroundColor}]}/>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    bzm_template_c2: {
        // backgroundColor: '#ffffff',
        backgroundColor:'transparent',
        // height: tHeight
    },
    bzm_template2_content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    bzm_template2_left: {
        flex: 340
    },
    bzm_template2_right: {
        flex: 410
    },
    bzm_template2_right_1: {
        flex: 1
    },
    bzm_template2_image: {
        flex: 1,
        // backgroundColor: '#ffffff'
        backgroundColor:'transparent'
    },
    bzm_template2_auto: {
        flex: 1
    },
    bzm_template2_bottom_line: {
        height: BZMCoreStyle.lineHeight(),
        // backgroundColor: '#f0f1f2'
        // backgroundColor:'transparent'
    },
    left_right_line: {
        width: BZMCoreStyle.lineHeight(),
        // backgroundColor: '#f0f1f2'
        // backgroundColor:'transparent'
    },
});

module.exports = BZMHomeTemplate2;
