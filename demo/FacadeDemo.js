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
    } = React;
var { UIManager, ScrollViewManager } = require('NativeModules');
var TBFacade = require('../bzm/bzm_core/components/TBFacade');
var TBTip = require('../bzm/bzm_core/components/TBTip');

class FacadeDemo extends React.Component {

    getNativeInfo() {
        TBFacade.nativeInfo((data) => {
            TBTip.show(data.platform + "," + data.deviceId);
        });

    }

    getUser() {
        TBFacade.user((data) => {
            TBTip.show(data.userId + ",");
        });
    }

    touchScrollView() {


        var scrollView = this.refs["scrollViewTest"];
        var reactTag = React.findNodeHandle(scrollView);
        console.log("lll=:" + reactTag);
        ScrollViewManager.scrollTo(reactTag, {x: 0, y: 0});
        ScrollViewManager.getContentSize(reactTag, function (message) {
            TBTip.show('x:' + message.x + ',' + 'y:' + message.y);
        });
    }

    render() {
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;
        // return <React.Text style={styles.text}>Hello World (Again)</React.Text>;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer} ref="navView">
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.getNativeInfo}>
                        <Text style={styles.text}>nativeInfo</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.scrollContainer} onPress={this.getUser}>
                    <Text style={styles.text}>user</Text>
                </TouchableHighlight>
                <ScrollView style={styles.scrollContainer} ref="scrollViewTest">
                </ScrollView>

            </View>);
    }
}

var styles = StyleSheet.create({
    touchableContainer: {
        marginTop: 20,
        marginLeft: 10,
        justifyContent: "center",
        height: 44,
        width: 50,
        backgroundColor: '#777b7c',
    },

    text: {
        textAlign: "center",
        height: 60,
        color: '#ffffff',
        backgroundColor: '#777b7c',
    },
    container: {
        backgroundColor: '#eeeeee',
        flex: 1,
    },
    scrollContainer: {
        backgroundColor: '#333333',
        width: 270,
    },
    topContainer: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#11ffee',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

});

React.AppRegistry.registerComponent('FacadeDemo', () => FacadeDemo);
