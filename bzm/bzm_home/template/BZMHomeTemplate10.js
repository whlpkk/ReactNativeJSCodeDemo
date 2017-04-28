/*
 *
 * @providesModule BZMHomeTemplate10
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
var tHeight;

var PropTypes = React.PropTypes;
var BZMHomeTemplate10 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func
    },

    renderRow1: function (item) {
        if (typeof item == 'number') {
            return (<View style={[styles.bzm_template10_h_vline,{height:tHeight,backgroundColor:this.props.backGroundColor}]}/>);
        }
        return (
            <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                style={[styles.bzm_template10_cell,{height:tHeight}]}
                                onPress={() => this.props.openWindow(item)}>
                <View style={[styles.bzm_template10_cell,{height:tHeight}]}>
                    <TBImage style={styles.bzm_template10_image}
                             urlPath={item.pic}/>
                </View>
            </TouchableHighlight>

        );
    },
    render: function () {
        var optData = this.props.optData;
        if (optData.length < 4) {
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
        arr.splice(5,0,1);

        var dc1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        dc1 = dc1.cloneWithRows(arr);

        tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);
        return (
            <View style={[styles.bzm_template_c10,{height:tHeight}]}>
                <ListView
                    dataSource={dc1}
                    renderRow={this.renderRow1}
                    style={styles.bzm_template10_list}
                    horizontal={true}
                    removeClippedSubviews={false}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={[styles.bzm_template10_bottom_line,{backgroundColor:this.props.backGroundColor}]}/>
            </View>
        );
    }
});

let Dimensions = require('Dimensions');
let screenWidth = Dimensions.get('window').width;
let cellWidth = (screenWidth / 2 - BZMCoreStyle.lineHeight())/2;

var styles = StyleSheet.create({
    bzm_template_c10: {
        backgroundColor:'transparent',
    },
    bzm_template10_list: {
        flex: 1
    },
    bzm_template10_cell: {
        // backgroundColor: '#ffffff',
        backgroundColor:'transparent',
        width: cellWidth,
    },

    bzm_template10_image: {
        flex: 1,
        backgroundColor:'transparent'
    },
    bzm_template10_auto: {
        flex: 1
    },
    bzm_template10_text: {
        fontSize: 14,
        color: '#333333'
    },
    bzm_template10_bottom_line: {
        height: BZMCoreStyle.lineHeight(),
    },
    bzm_template10_h_vline: {
        width: BZMCoreStyle.lineHeight(),
    }
});

module.exports = BZMHomeTemplate10;
