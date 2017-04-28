/*
 *
 * @providesModule BZMCartMallSep
 */
'use strict';

var React = require('react-native');
var BZMCoreUtils = require('BZMCoreUtils');
var {
    StyleSheet,
    Text,
    View,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartMallSep = React.createClass({
    propTypes: {
        action: PropTypes.string,
    },
    render: function () {
        return (
            <View style={styles.container}>
                <View style={styles.leftLine} />
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>折800特卖商城</Text>
                </View>
                <View style={styles.leftLine} />
            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 42,
        justifyContent: 'center',
        backgroundColor: '#eeeeee',
        alignItems: 'center',
        padding:10
    },
    leftLine: {
        width: 60,
        height: 0.5,
        backgroundColor: '#E0E0E0'
    },
    title: {
        marginLeft:10,
        marginRight:10,
        color: '#BEBEBE',
        fontSize:12
    }
});

module.exports = BZMCartMallSep;