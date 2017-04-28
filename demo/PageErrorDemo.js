'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
    } = React;


var TBTip = require('../bzm/bzm_core/components/TBTip');
var TBImage = require('../bzm/bzm_core/components/TBImage');
var TBPageError = require('../bzm/bzm_core/components/TBPageError');

var { UIManager, TBPageErrorViewManager } = require('NativeModules');

class PageErrorDemo extends React.Component {
    tipBlock() {
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;

        TBTip.show('tipBlock');
    }

    onPressedNoData() {

    }

    render() {
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.onPressedNoData.bind(this)}>
                        <Text style={styles.text}>无数据</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer} onPress={() => TBLoading.show(
        {"x":0, "y":64, "width":screenWidth, "height":screenHeight-64},'','','net500Error' )}>
                        <Text style={styles.text}>500错误</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer} onPress={() => TBLoading.hide()}>
                        <Text style={styles.text}>隐藏弹出</Text>
                    </TouchableHighlight>
                </View>
                <View ref="content" style={styles.content}>
                    <TBPageError
                        style={styles.pageError}
                        title="没有数据呢"
                        imagePath="bundle://message_nodata@2x.png"
                        onTap={this.tipBlock}/>
                </View>
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
        backgroundColor: '#777b7c'
    },
    text: {
        textAlign: "center"
    },
    container: {
        backgroundColor: '#eeeeee',
        flex: 1
    },
    content: {
        backgroundColor: '#333333',
        flex: 1
    },
    topContainer: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#11ffee',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pageError: {
        backgroundColor: '#ffffff',
        flex: 1
    }
});

React.AppRegistry.registerComponent('PageErrorDemo',  ()=> PageErrorDemo);
