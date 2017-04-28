'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    } = React;

var TBFacade = require('../bzm/bzm_core/components/TBFacade');
var TBLogin = require('../bzm/bzm_core/components/TBLogin');
var TBTip = require('../bzm/bzm_core/components/TBTip');
var TBNavigatorView = require('../bzm/bzm_core/components/TBNavigatorView');

class LoginDemo extends React.Component {
    onTest2() {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.forward(cTag, "http://m.zhe800.com/deal/dailyten?c_id=&deal_from=&page_refer=&schemechannel=test");
    }

    goBack() {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.goBack(cTag);
    }

    onLogin() {
        TBLogin.login(
            function (message) {
                TBTip.show('成功提示', 'success');
            },
            function (e) {
                TBTip.show('取消登录');
            }
        );
    }

    render() {
        var navigatorData = {
            enableCustomContent: false,
            title: "这是标题部分"
        };
        return (
            <View style={styles.container} ref="containerView">
                <View ref="navView" style={styles.topContainer}>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.onLogin}>
                        <Text style={styles.text}>登录</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest2.bind(this)}>
                        <Text style={styles.text}>Open</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.contentLine}/>
                <View style={styles.content}>
                    <TBNavigatorView navigatorData={navigatorData}>

                    </TBNavigatorView>

                    <TouchableHighlight style={styles.touchableContainer} onPress={this.goBack.bind(this)}>
                        <Text style={styles.text}>Back</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    touchableContainer: {
        marginLeft: 10,
        justifyContent: "center",
        width: 50,
        backgroundColor: '#777b7c'
    },
    text: {
        textAlign: "center",
        color: '#ffffff',
        backgroundColor: '#777b7c'
    },
    container: {
        backgroundColor: '#eeeeee',
        flex: 1
    },
    topContainer: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        paddingTop: 20,
        backgroundColor: '#335522',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    content: {
        backgroundColor: '#99aa99',
        flex: 1
    },
    contentLine: {
        backgroundColor: '#eeeeee',
        height: 1
    }
});

React.AppRegistry.registerComponent('LoginDemo', () => LoginDemo);
