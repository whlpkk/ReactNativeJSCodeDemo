/*
 *
 * @providesModule BZMHomeTemplate9
 *
 * 夜场banner
 * ---------
 * |       |
 * |       |
 * ---------
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var {
    StyleSheet,
    TouchableHighlight,
    View,
    } = React;

var PropTypes = React.PropTypes;
var BZMHomeTemplate9 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func
    },

    render: function () {
        var optData = this.props.optData[0];
        var tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);
        return (
            <View style={[styles.bzm_template_c9,{height:tHeight}]}>
                <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                    style={styles.bzm_template9_touch}
                                    onPress={() => this.props.openWindow(optData)}>
                    <View style={styles.bzm_template9_touch}>
                        <TBImage style={styles.bzm_template9_image}
                                 urlPath={optData.pic}/>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    bzm_template_c9: {
        backgroundColor:'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    bzm_template9_touch: {
        flex: 1
    },
    bzm_template9_image: {
        flex: 1,
        backgroundColor:'transparent'
    }
});

module.exports = BZMHomeTemplate9;
