/*
 * @providesModule BZMCartNavigationBar
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreUtils = require('BZMCoreUtils');

var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    } = React;

var PropTypes = React.PropTypes;

var BZMCartNavigationBar = React.createClass({
    propTypes: {
        onBack: PropTypes.func,
        nnav: PropTypes.bool,
        title: PropTypes.string
    },

    render: function () {
        var nnav = this.props.nnav;
        var backBtn = null;

        if (!nnav) {
            backBtn = (
                <TouchableHighlight
                    key="i0x1"
                    underlayColor={'transparent'}
                    onPress={this._onBack}>
                    <View style={styles.backButton}>
                        <TBImage style={styles.backArrow}
                                 urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_goback.png'}/>
                    </View>
                </TouchableHighlight>
            );
        }
        return (
            <View style={styles.container}>
                <TBImage style={styles.background}
                         urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_bg.png'}/>

                <View style={styles.titleView}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                {backBtn}
            </View>
        );
    },

    _onBack: function () {
        this.props.onBack && this.props.onBack();
    }

});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        height: 64
    },
    background: {
        flex: 1,

        //backgroundColor: 'transparent'
        backgroundColor: '#00f0f0'
    },

    backButton: {
        width: 50,
        height: 44,
        justifyContent: 'center'
    },
    backButton2: {},

    backArrow: {
        marginLeft: 13,
        width: 12,
        height: 22,
        backgroundColor: 'transparent'
    },

    titleView: {
        position: 'absolute',
        width: screenWidth,
        height: 44,
        top: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 17,
        fontWeight: '400',
        color: '#27272f'
    }
});

module.exports = BZMCartNavigationBar;

