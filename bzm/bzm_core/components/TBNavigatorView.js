/*
 *
 * @providesModule TBNavigatorView
 */
'use strict';

var React = require('react-native');
var TBFacade = require('./TBFacade');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View
    } = React;
var PropTypes = React.PropTypes;
var TBNavigatorView = React.createClass({
    propTypes: {
        ...View.propTypes,
        navigatorData: PropTypes.object.isRequired,
    },
    getDefaultProps: function () {
        return {
            navigatorData: {
                enableCustomContent: false,
                title: ""
            }
        };
    },

    goBack: function () {
        //TBFacade.goBack(1);
    },

    render: function () {
        var navigatorData = this.props.navigatorData;
        if (navigatorData.enableCustomContent) {
            return (
                <View style={styles.topContainer}>

                </View>
            );
        } else {
            return (
                <View style={styles.topContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{navigatorData.title}</Text>
                    </View>
                    <TouchableHighlight style={styles.backBtnContainer} onPress={this.goBack}>
                        <Text style={styles.backBtn}>Back</Text>
                    </TouchableHighlight>

                </View>
            );
        }
    }
});
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var styles = StyleSheet.create({

    title: {
        fontSize: 17,
        color: 'white'
    },
    backBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0000ee',
        width: 50
    },
    backBtn: {
        fontSize: 17,
        color: 'white',
        width: 40,
        height: 30
    },
    titleContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: screenWidth,
        height: 44
    },
    topContainer: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        paddingTop: 20,
        backgroundColor: '#1155ee',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
});

module.exports = TBNavigatorView;
