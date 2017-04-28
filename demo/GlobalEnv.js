/*
 *
 * @providesModule GlobalEnv
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    SearchBar,
    TouchableHighlight,
    ScrollView,
    ListView,
    NavigatorIOS,
    AsyncStorage
    } = React;
var { UIManager, ScrollViewManager } = require('NativeModules');
var Dimensions = require('Dimensions');
var TBFacade = require('../bzm/bzm_core/components/TBFacade');
var TBTip = require('../bzm/bzm_core/components/TBTip');
var TBPageError = require('../bzm/bzm_core/components/TBPageError');
var TBLogin = require('../bzm/bzm_core/components/TBLogin');
var TBImage = require('TBImage');
var TBHSwapView = require('TBHSwapView');
var TBExposureManager = require('TBExposureManager');
var TBLoading = require('TBLoading');
var TBAlert = require('../bzm/bzm_core/components/TBAlert');
var TBAnimation = require('../bzm/bzm_core/components/TBAnimation');
var TBTagFlow = require('../bzm/bzm_core/components/TBTagFlow');
var TBRefreshView = require('../bzm/bzm_core/components/TBRefreshView');
var TBScrollPageTopBar = require('../bzm/bzm_core/components/TBScrollPageTopBar');
var TBFavoriteManager = require('../bzm/bzm_core/components/TBFavoriteManager');
var TBIMManager = require('../bzm/bzm_core/components/TBIMManager');
var Swiper = require('react-native-swiper');
var TBShareManager = require('TBShareManager');
var TBSellingReminderManager = require('TBSellingReminderManager');

class GlobalEnv extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <TBImage style={styles.thumbnail} urlPath="http://img0.imgtn.bdimg.com/it/u=3511668386,2191093184&fm=21&gp=0.jpg"/>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    thumbnail: {
        width: 100,
        height: 60
    }
});

React.AppRegistry.registerComponent('GlobalEnv', () => GlobalEnv);
