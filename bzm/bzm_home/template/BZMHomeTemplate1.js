/*
 *
 * @providesModule BZMHomeTemplate1
 *
 * -----------------
 * |   |   |   |   |
 * |   |   |   |   |
 * -----------------
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
    Text,
    ListView,
    AlertIOS
    } = React;

var topHeight;
var imgValue;

let Dimensions = require('Dimensions');
let screenWidth = Dimensions.get('window').width;

var cellWidth;
let minWidth = 750 / 2;
var tHeight;
var optDataLength = 4;
var superscriptValue = 18;
var superscriptRight ;
var superscriptTop ;

var PropTypes = React.PropTypes;
var BZMHomeTemplate1 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        badge: PropTypes.object.isRequired,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func,
        openWindow: PropTypes.func
    },

    isCheckin: function (url) {
        return !!(url.indexOf('m.zhe800.com/checkin') > 0 || url.indexOf('m.zhe800.com/mid/checkin') > 0);
    },

    renderRow1: function (item) {

      var autoFontSize = BZMCoreUtils.calculateHeight(10, 320);
      if (optDataLength == 4) {
        //4格用11 ，5格用10
        autoFontSize = BZMCoreUtils.calculateHeight(11, 320);
      }
        if (this.isCheckin(item.value)) {
            var badgeObj = this.props.badge;
            var badgeText = null;
            // badgeObj.badgeText = '新人礼';
            if (!badgeObj.badgeHidden) {
                badgeText = (
                    <View style={[styles.bzm_template1_img_rt, {height:superscriptValue,top:superscriptTop,width:superscriptValue,right:superscriptRight - 6}]}>
                        <Text style={styles.bzm_template1_img_rt_txt}>{badgeObj.badgeText}</Text>
                    </View>
                );
                if (badgeObj.badgeText.length>2) {
                    badgeText = (
                        <View style={[styles.bzm_new_template1_img_rt,{height:superscriptValue,top:superscriptTop,right:superscriptRight-8}]}>
                            <Text style={styles.bzm_new_template1_img_rt_txt}>{badgeObj.badgeText}</Text>
                        </View>
                    );
                }

            }

            return (
                <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                    style={[styles.bzm_template1_cell,{width:cellWidth,height:tHeight}]}
                                    onPress={() => this.props.openWindow(item)}>
                    <View style={[styles.bzm_template1_cell,{width:cellWidth,height:tHeight}]}>
                        <View style={[styles.bzm_template1_cell_t,{width:cellWidth,height:topHeight}]}>
                            <TBImage style={[styles.bzm_template1_image,{width:imgValue,height:imgValue}]}
                                     urlPath={item.pic}/>
                            {badgeText}
                        </View>
                        <View style={styles.bzm_template1_cell_b}>
                            <Text style={[styles.bzm_template1_text,{fontSize:autoFontSize}]}>{badgeObj.title}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        } else {
            return (
                <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                    style={[styles.bzm_template1_cell,{width:cellWidth,height:tHeight}]}
                                    onPress={() => this.props.openWindow(item)}>
                    <View style={[styles.bzm_template1_cell,{width:cellWidth,height:tHeight}]}>
                        <View style={[styles.bzm_template1_cell_t,{width:cellWidth,height:topHeight}]}>
                            <TBImage style={[styles.bzm_template1_image,{width:imgValue,height:imgValue}]}
                                     urlPath={item.pic}/>
                        </View>
                        <View style={styles.bzm_template1_cell_b}>
                            <Text style={[styles.bzm_template1_text,{fontSize:autoFontSize}]}>{item.title}</Text>
                        </View>
                    </View>

                </TouchableHighlight>
            );
        }
    },
    render: function () {
        var optData = this.props.optData;
        tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);

        var imgSize = 106*this.props.height/220;
        var topHeightValue = 166*this.props.height/220;

        topHeight = BZMCoreUtils.calculateHeight(topHeightValue, 750);
        imgValue = BZMCoreUtils.calculateHeight(imgSize, 750);

        cellWidth = screenWidth / optData.length;
        optDataLength = optData.length;

        if (screenWidth >= minWidth) {
            tHeight = this.props.height / 2;
            topHeight = topHeightValue / 2;
            imgValue = imgSize / 2;
            cellWidth = parseInt(screenWidth / optData.length) +1;
        }
        superscriptRight = ( cellWidth - imgValue) / 2;
        superscriptTop = (topHeight - imgValue) / 2-4;

        var dc1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        dc1 = dc1.cloneWithRows(optData);

        return (
            <View style={[styles.bzm_template_c1,{height:tHeight}]}>
                <ListView
                    dataSource={dc1}
                    renderRow={this.renderRow1}
                    style={styles.bzm_template1_list}
                    horizontal={true}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={[styles.bzm_template1_bottom_line,{backgroundColor:this.props.backGroundColor}]}/>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    bzm_template_c1: {
        backgroundColor: 'transparent',
    },
    bzm_template1_list: {
        flex: 1
    },
    bzm_template1_cell: {
        backgroundColor: '#ffffff',
    },
    bzm_template1_cell_t: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bzm_template1_cell_b: {
        flex: 1
    },
    bzm_template1_image: {
        backgroundColor: 'transparent'
    },
    bzm_template1_auto: {
        flex: 1
    },
    bzm_template1_text: {
        textAlign: 'center',
        color: '#333333'
    },
    bzm_template1_bottom_line: {
        height: BZMCoreStyle.lineHeight(),
    },
    bzm_template1_img_rt: {
        borderRadius: 9,
        backgroundColor: '#ef4949',
        position: 'absolute',
        justifyContent: 'center'
    },
    bzm_template1_img_rt_txt: {
        color: '#ffffff',
        fontSize: 9,
        textAlign: 'center',
        backgroundColor:'transparent'
    },
    bzm_new_template1_img_rt: {
        borderRadius: 8,
        backgroundColor: '#ef4949',
        position: 'absolute',
        justifyContent: 'center',
        alignItems:'center'
    },
    bzm_new_template1_img_rt_txt: {
        color: '#ffffff',
        marginLeft:5,
        marginRight:5,
        fontSize: 9,
        textAlign: 'center',
        backgroundColor:'transparent'
    }
});

module.exports = BZMHomeTemplate1;
