'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
    } = React;

var TBImage = require('../bzm/bzm_core/components/TBImage');
var TBLoading = require('../bzm/bzm_core/components/TBLoading');


class LoadingDemo extends React.Component {
    showPopupLoading() {
        var contentView =  this.refs["contentView"];
        var cTag = React.findNodeHandle(contentView);
        TBLoading.popupLoading(cTag);
    }

    hidePopupLoading() {
        var contentView =  this.refs["contentView"];
        var cTag = React.findNodeHandle(contentView);
        TBLoading.hidePopupLoading(cTag);
    }

    showPageLoading() {
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;

        var contentView =  this.refs["contentView"];
        var cTag = React.findNodeHandle(contentView);
        //TBLoading.pageLoading(cTag,
        //    {"x":0, "y":64, "width":screenWidth, "height":screenHeight-64}
        //);
        TBLoading.pageLoading(cTag, {});
    }

    hidePageLoading() {
        var contentView =  this.refs["contentView"];
        var cTag = React.findNodeHandle(contentView);
        TBLoading.hidePageLoading(cTag, {});
    }

    render() {
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;
        // return <React.Text style={styles.text}>Hello World (Again)</React.Text>;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer} ref="navView">
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.showPopupLoading.bind(this)}>
                        <Text style={styles.text}>弹出</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.hidePopupLoading.bind(this)}>
                        <Text style={styles.text}>隐藏弹出</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.showPageLoading.bind(this)}>
                        <Text style={styles.text}>平铺</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer}
                                        onPress={this.hidePageLoading.bind(this)}>
                        <Text style={styles.text}>隐藏平铺</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.container} ref="contentView">

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
        backgroundColor: '#777b7c',
    },
    text: {
        textAlign: "center",
    },
    container: {
        backgroundColor: '#eeeeee',
        flex: 1,
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

React.AppRegistry.registerComponent('LoadingDemo', ()=> LoadingDemo);
