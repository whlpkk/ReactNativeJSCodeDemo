/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');

var TBImage = require('../bzm/bzm_core/components/TBImage');
var TBTip = require('../bzm/bzm_core/components/TBTip');
var {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    View,
    AlertIOS,
    TouchableHighlight,
    } = React;

var HScrollDemo = React.createClass({
    getInitialState: function () {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
        };
    },

    componentDidMount: function () {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(["1", "1", "1", "1", "1", "1"]),
            loaded: true,
        });
    },

    render: function () {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.text}>横向滚动切换列表</Text>
                    </View>

                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderMovie}
                    style={styles.listView}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    },

    renderLoadingView: function () {
        return (
            <View style={styles.container}>
                <Text>
                    Loading movies...
                </Text>
            </View>
        );
    },
    getHScrollState: function () {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
        };
    },
    renderMovie: function (movie) {
        let arr = [];
        for (var i = 0; i < 30; i++) {
            arr.push("x" + i);
        }
        let dataSource2 = this.getHScrollState().dataSource.cloneWithRows(arr);
        return (
            <ListView
                dataSource={dataSource2}
                renderRow={this.renderText2}
                style={styles.rowContainer}
            />
        );
    },

    renderText2: function (movie) {
        return (
            <TouchableHighlight style={styles.touchContainer} onPress={() => TBTip.show(
        '成功提示',
        'success'
      )}>
                <View style={listStyle.container}>
                    <TBImage
                        urlPath={"bundle://alert_headg@2x.png"}
                        style={listStyle.thumbnail}
                    />
                    <View style={listStyle.rightContainer}>
                        <Text style={listStyle.title}>{"fffff"}</Text>
                        <Text style={listStyle.year}>{"1942"}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
});
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var listHeight = Dimensions.get('window').height - 64;
var styles = StyleSheet.create({
    titleContainer: {
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        marginRight: 0,
    },
    text: {
        color: '#333333',
        fontSize: 19,
        fontWeight: 'bold',
    },
    rowContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 0,
        backgroundColor: '#eeeeee',
        height: listHeight,
        width: screenWidth,
    },
    topContainer: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#11ffee',
        height: 64,
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#ff0000',
        flex: 1,
        flexDirection: 'column'
    },
});

var listStyle = StyleSheet.create({
    touchContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingVertical: 5
    },
    rightContainer: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        height: 81,
        backgroundColor: '#99F090',
    },
    title: {
        paddingTop: 0,
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'left',
    },
    year: {
        color: '#9900ff',
        textAlign: 'left',
    },
    thumbnail: {
        width: 80,
        height: 80,
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
});
AppRegistry.registerComponent('HScrollDemo', () => HScrollDemo);
