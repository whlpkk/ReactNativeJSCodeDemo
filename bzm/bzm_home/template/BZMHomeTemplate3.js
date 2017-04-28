/*
 *
 * @providesModule BZMHomeTemplate3
 *
 * ---------------
 * |      |      |
 * |      |      |
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
    ListView
    } = React;
var tHeight;
var PropTypes = React.PropTypes;
var BZMHomeTemplate3 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        height: PropTypes.number,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func,
    },
    renderRow1: function (item) {

        if (typeof item == 'number') {
            return (<View style={[styles.bzm_template3_h_vline,{height:tHeight,backgroundColor:this.props.backGroundColor}]}/>);
        }

        return (
            <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                style={[styles.bzm_template3_cell,{height:tHeight}]}
                                onPress={() => this.props.openWindow(item)}>
                <View style={styles.bzm_template3_auto}>
                    <TBImage style={styles.bzm_template3_image}
                             urlPath={item.pic}/>
                </View>
            </TouchableHighlight>
        );
    },
    render: function () {
        var optData = this.props.optData;
        tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);

        // console.log(tHeight);
        var index = 0;
        var arr = [];
        optData.forEach(function (item) {
            index++;
            arr.push(item);
            if (index == 1) {
                arr.push(1)
            }
        });
        var dc1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        dc1 = dc1.cloneWithRows(arr);
        return (
            <View style={[styles.bzm_template_c3,{height:tHeight}]}>
                <ListView
                    dataSource={dc1}
                    removeClippedSubviews={false}
                    renderRow={this.renderRow1}
                    style={styles.bzm_template3_auto}
                    horizontal={true}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={[styles.bzm_template3_bottom_line,{backgroundColor:this.props.backGroundColor}]}/>
            </View>
        );
    }
});


let Dimensions = require('Dimensions');
let screenWidth = Dimensions.get('window').width;
let cellWidth = screenWidth / 2;
var styles = StyleSheet.create({
    bzm_template_c3: {
        backgroundColor:'transparent',
    },
    bzm_template3_cell: {
        backgroundColor: 'transparent',
        width: cellWidth,
    },

    bzm_template3_image: {
        flex: 1,
        backgroundColor:'transparent'
    },
    bzm_template3_auto: {
        flex: 1
    },
    bzm_template3_bottom_line: {
        height: BZMCoreStyle.lineHeight(),
    },
    bzm_template3_h_vline: {
        width: BZMCoreStyle.lineHeight()
    }
});

module.exports = BZMHomeTemplate3;
