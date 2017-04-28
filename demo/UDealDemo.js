'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text
    } = React;

var TBImage = require('../bzm/bzm_core/components/TBImage');
var TBListView = require('../bzm/bzm_core/components/TBListView');

var { requireNativeComponent } = React;
class TBHListView extends React.Component {
    render() {
        return <RCTTBHScrollView {...this.props} />;
    }
}
TBHListView.propTypes = {
    enableDragToRight: React.PropTypes.bool.isRequired,
    items: React.PropTypes.array,
};

var RCTTBHScrollView = requireNativeComponent('RCTTBHScrollView', TBHListView);

module.exports = TBHListView;

class HelloWorld extends React.Component {
    render() {
        // return <React.Text style={styles.text}>Hello World (Again)</React.Text>;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}/>
                <TBHListView enableDragToRight={true}
                             style={styles.listContainer} getIdentifierByIndex={()=>console.log('......!')}>
                    <Text style={styles.text}>Good luck</Text>
                </TBHListView>
            </View>);
    }
}

var styles = StyleSheet.create({
    text: {
        width: 120,
        height: 30,
    },
    container: {
        backgroundColor: '#ff0000',
        flex: 1,
        flexDirection: 'column'
    },
    topContainer: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#11ffee',
        height: 64,
    },
    listContainer: {
        marginLeft: 0,
        marginRight: 0,
        alignItems: 'center',
        backgroundColor: '#5f5f5f',
        flex: 1
    }
});

React.AppRegistry.registerComponent('UDealDemo', ()=> UDealDemo);
