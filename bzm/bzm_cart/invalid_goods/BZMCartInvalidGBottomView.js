/*
 *
 * @providesModule BZMCartInvalidGBottomView
 */
'use strict';
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

var BZMCartInvalidGBottomView = React.createClass({
    propTypes: {
        onDelete: PropTypes.func.isRequired
    },
    _onSelect: function () {
        this.props.onDelete();
    },

    render: function () {

        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={this._onSelect}>
                    <View style={styles.btnContainer}>
                        <Text style={styles.clearText}>清空</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

});

var styles = StyleSheet.create({

    container: {
        height: 44
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: '#EF4949',
        justifyContent: 'center',
        alignItems: 'center',
        height: 44
    },
    clearText: {
        marginLeft:5,
        color: '#ffffff',
        fontSize: 15
    },
    deleteImage: {
        width: 20,
        height: 20,
        backgroundColor: '#ffffff'
    }
});

module.exports = BZMCartInvalidGBottomView;
