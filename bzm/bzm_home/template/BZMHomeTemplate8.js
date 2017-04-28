/*
 *
 * @providesModule BZMHomeTemplate8
 *
 * -------------
 * |   |   |   |
 * |   |   |   |
 * -------------
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
    ListView
    } = React;

var tHeight ;
var PropTypes = React.PropTypes;
var BZMHomeTemplate8 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func
    },

    renderRow1: function (item) {
        if (typeof item == 'number') {
            return (<View style={[styles.bzm_template8_h_vline,{height:tHeight,backgroundColor:this.props.backGroundColor}]}/>);
        }
        return (
            <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                style={[styles.bzm_template8_cell,{height:tHeight}]}
                                onPress={() => this.props.openWindow(item)}>
                <View style={[styles.bzm_template8_cell,{height:tHeight}]}>
                    <TBImage style={styles.bzm_template8_image}
                             urlPath={item.pic}/>
                </View>
            </TouchableHighlight>

        );
    },
    render: function () {
        var optData = this.props.optData;
        if (optData.length < 3) {
            return (
                <View/>
            );
        }
        var arr = [];

        optData.forEach(function (item) {
            arr.push(item);
        });
        arr.splice(1,0,1);
        arr.splice(3,0,1);

        var dc1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        dc1 = dc1.cloneWithRows(arr);

        tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);
        return (
            <View style={[styles.bzm_template_c8,{height:tHeight}]}>
                <ListView
                    dataSource={dc1}
                    renderRow={this.renderRow1}
                    style={styles.bzm_template8_list}
                    horizontal={true}
                    removeClippedSubviews={false}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={[styles.bzm_template8_bottom_line,{backgroundColor:this.props.backGroundColor}]}/>
            </View>
        );
    }
});

let Dimensions = require('Dimensions');
let screenWidth = Dimensions.get('window').width;
let cellWidth = screenWidth / 3;

var styles = StyleSheet.create({
    bzm_template_c8: {
        backgroundColor:'transparent',
    },
    bzm_template8_list: {
        flex: 1
    },
    bzm_template8_cell: {
        // backgroundColor: '#ffffff',
        backgroundColor:'transparent',
        width: cellWidth,
    },

    bzm_template8_image: {
        flex: 1,
        // backgroundColor: '#ffffff'
        backgroundColor:'transparent'
    },
    bzm_template8_auto: {
        flex: 1
    },
    bzm_template8_text: {
        fontSize: 14,
        color: '#333333'
    },
    bzm_template8_bottom_line: {
        height: BZMCoreStyle.lineHeight(),
    },
    bzm_template8_h_vline: {
        width: BZMCoreStyle.lineHeight(),
    }
});

module.exports = BZMHomeTemplate8;
