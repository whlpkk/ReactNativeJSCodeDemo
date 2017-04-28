/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var TBFacade = require('../bzm/bzm_core/components/TBImage');
var TBTip = require('../bzm/bzm_core/components/TBTip');
var TBHSwapView = require('../bzm/bzm_core/components/TBHSwapView');

var {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    View,
    AlertIOS,
    TouchableHighlight,
    } = React;
var {TBHScrollViewManager } = require('NativeModules');
var HPageDemo = React.createClass({
    getInitialState: function () {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false
        };
    },

    componentDidMount: function () {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(["1", "1", "1", "1", "1", "1"]),
            loaded: true
        });
    },
    _scrollToIndex: function () {
        var swapViewRef = this.refs["swapView"];
        var swapViewTag = React.findNodeHandle(swapViewRef);
        TBHScrollViewManager.scroll(swapViewTag, 3, true);
    },
    _onSetPage: function (e) {
        //TBTip.show('index:'+e.nativeEvent.pageIndex + ", tag:"+e.nativeEvent.pageTag);
    },
    _onShowPage: function (e) {
        //TBTip.show('index:'+e.nativeEvent.pageIndex + ", tag:"+e.nativeEvent.pageTag);
    },
    render: function () {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        let arr = [];
        for (var i = 0; i < 30; i++) {
            arr.push("x" + i);
        }
        let dataSource2 = this.getHScrollState().dataSource.cloneWithRows(arr);

        return (
          <View style={styles.container}>
            <View style={styles.topContainer} >
               <View style={styles.titleContainer}>
                <Text style={styles.text}>横向滚动切换列表</Text>
               </View>
               <TouchableHighlight style={styles.touchableContainer} onPress={this._scrollToIndex}>
                 <Text style={styles.text} >ScrollTo3</Text>
               </TouchableHighlight>
            </View>
            <TBHSwapView
              ref="swapView"
              items={[1,2,3,4,5]}
              onPageLoad={this._onSetPage}
              onShowPage={this._onShowPage}
              enableDragToRight={false}
              style={styles.listView}
            >
            <ListView
            dataSource={dataSource2}
            renderRow={this.renderText2}
            style={styles.rowContainer}
            />
            <ListView
            dataSource={dataSource2}
            renderRow={this.renderText2}
            style={styles.rowContainer2}
            />
            </TBHSwapView>
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
    marginRight:0,
  },
  text: {
    color:'#333333',
    fontSize: 19,
    fontWeight: 'bold',
  },
  listView: {
    backgroundColor: '#F5FCFF',
    width:screenWidth,
    height:listHeight,
    flexDirection: 'row',
  },
  rowContainer: {
    position: 'absolute',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 0,
    backgroundColor: '#eeeeee',
    height: listHeight,
    width: screenWidth,
  },
  rowContainer2: {
    position: 'absolute',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 0,
    left: screenWidth,
    backgroundColor: '#eeeeee',
    height: listHeight,
    width: screenWidth,
  },
  topContainer: {
    marginLeft:0,
    marginTop: 0,
    marginRight:0,
    backgroundColor:'#11ffee',
    height: 64,
    flexDirection: 'row'
  },
  container: {
    backgroundColor:'#ff0000',
    flex: 1,
    flexDirection: 'column'
  },
  touchableContainer : {
    marginTop:20,
    marginLeft:10,
    justifyContent:"center",
    height: 44,
    width: 90,
    backgroundColor:'#777b7c',
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
    height:81,
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
});
AppRegistry.registerComponent('HPageDemo', () => HPageDemo);
