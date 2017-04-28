/*
 *
 * @providesModule BZMPageLoadError
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    TouchableHighlight
    } = React;


var TBTip = require('../bzm/bzm_core/components/TBTip');
var TBImage = require('../bzm/bzm_core/components/TBImage');
var TBPageError = require('../bzm/bzm_core/components/TBPageError');
var TBFacade = require('../bzm/bzm_core/components/TBFacade');

class BZMPageLoadError extends React.Component {
    tipBlock() {

    }

    onPressedNoData() {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.goBack(cTag);
    }

    render() {
        return (
            <View style={styles.container} ref="containerView">
                <View style={styles.topContainer}>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.onPressedNoData.bind(this)}>
                        <View style={styles.backContainer}>
                            <TBImage style={styles.img} urlPath="bundle://common_goback_btn@2x.png" />
                        </View>
                    </TouchableHighlight>
                </View>
                <View ref="content" style={styles.content}>
                    <TBPageError
                        style={styles.pageError}
                        title="页面加载失败"
                        imagePath="bundle://message_server_error@2x.png"
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
        backgroundColor: '#f0f0f0'
    },
    backContainer: {
        justifyContent: "center",
        height: 44,
        width: 50,
        backgroundColor: '#f0f0f0'
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
        backgroundColor: '#f0f0f0',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pageError: {
        backgroundColor: '#ffffff',
        flex: 1
    },
    img: {
        width:12,
        height:22,
        backgroundColor:'transparent'
    }
});

// React.AppRegistry.registerComponent('BZMPageLoadError',  ()=> BZMPageLoadError);
module.exports = BZMPageLoadError;
