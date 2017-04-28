'use strict';
var React = require('react-native');

var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  AlertIOS,
  View,
  ScrollView,
} = React;
var { UIManager, TBRefreshViewManager } = require('NativeModules');
var TBAlert = require('../bzm/bzm_core/components/TBAlert');
var TBRefreshView = require('../bzm/bzm_core/components/TBRefreshView');
var BZDealGridItem = require('./deallist/models/BZDealGridItem');
var BZDealGridCell = require('./deallist/views/BZDealGridCell');
var API_URL = 'http://m.api.zhe800.com/v5/deals?per_page=20&image_type=si3,si1&super=2&image_model=webp&user_role=1&user_type=0';
var resultsCache = [];
var previous_y = 0;
var DealListDemo = React.createClass({
  _urlForQueryAndPage: function(queryDict: object, pageNumber: number): string {
    return (
      API_URL + '&page=' + pageNumber
    );
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.setState({
      queryNumber: 1,
      loaded: false,
    });
    this.fetchData();
  },

  reloadItems: function(responseData) {
    if (responseData.meta) {
      this.state.hasMore = responseData.meta.has_next;
    }

    this.state.isLoading = false;
    var propDeals = [];
    for (var itemIndex in responseData.objects) {
      var item = responseData.objects[itemIndex];
      var gridItem = new BZDealGridItem();
      gridItem.id = item.id;
      gridItem.deal =item;

      if (itemIndex%2 ==0) {
        propDeals = [];
        resultsCache.push(propDeals);
      }
      propDeals.push(gridItem);
    }
    this._refreshAction('default');
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(resultsCache),
      loaded: true,
    });
  },

  fetchData: function() {
    if (this.state.isLoading) {
      return;
    }
    resultsCache = [];
    this.state.isLoading = true;
    fetch(this._urlForQueryAndPage(null, 1))
    .then((response) => response.json())
    .catch((error) => {
      this.state.isLoading = false;
      this._refreshAction('default');
      console.error(error);
      this.setState({
        loaded: false,
      });
    })
    .then((responseData) => {
      this.reloadItems(responseData);
    })
    .done();
  },
  _onScrollBeginDrag: function(e) {
    if (e.nativeEvent.contentOffset.y > previous_y) {
      previous_y = e.nativeEvent.contentOffset.y;
    } else {
      // previous_y = e.nativeEvent.contentOffset.y;
      return;
    }
    console.log("contentOffsetY: "+e.nativeEvent.contentOffset.y);
    if (!this.state.hasMore || this.state.isLoading) {
      // We're already fetching or have all the elements so noop
      return;
    }

    this.setState({
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: true,
    });
    this.state.isLoading = true;
    var page = this.state.queryNumber;
    fetch(this._urlForQueryAndPage(null, page))
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      this._refreshAction('default');
      this.state.isLoading = false;
      this.setState({
        loaded: false,
      });
    })
    .then((responseData) => {
      this.reloadItems(responseData);
    })
    .done();
  },

  render: function() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    } else if (this.state.dataSource.getRowCount()<1) {
      //无数据
    }

    return (
      <View style={styles.container}>
      <View style={styles.topContainer}  ></View>

      <ScrollView style={styles.scrollContainer} ref="scrollView"
      onTouchMove={this._onTouchMove}
      onScrollEndDrag={this._onScrollEndDrag}
      onScrollBeginDrag={this._onScrollBeginDrag}
      >

      <TBRefreshView ref="refreshView"
      style={styles.refreshContainer}
      onRefreshStart={this._onRefreshStart}
      ></TBRefreshView>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow}
      style={styles.listView}
      >
      </ListView>
      </ScrollView>
      </View>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
      <Text>
      Loading movies...
      </Text>
      </View>
    );
  },
  renderRow: function(
    deal: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    if (deal.length>1) {
      var item1 = deal[0];
      var item2 = deal[1];

      return (
        <View style={styles.row}>
        <BZDealGridCell style={styles.rowItem}
        key={item1.id}
        onSelect={() => this.selectDeal(item1)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        deal={item1}
        />
        <BZDealGridCell style={styles.rowItem}
        key={item2.id}
        onSelect={() => this.selectDeal(item2)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        deal={item2}
        />
        </View>
      );
    } else {
      var item1 = deal[0];
      return (
        <View style={styles.row}>
        <BZDealGridCell style={styles.rowItem}
        key={item1.id}
        onSelect={() => this.selectDeal(item1)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        deal={item1}
        />
        </View>
      );
    }


  },
  selectDeal: function(movie: Object) {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: movie.title,
        component: MovieScreen,
        passProps: {movie},
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: movie.title,
        name: 'movie',
        movie: movie,
      });
    }
  },

  _onRefreshStart: function() {
    console.log("_onRefreshStart");
    this.fetchData();
  },

  _refreshAction: function(flag) {
    if (this.state.isLoading) {
      return;
    }
    var scrollView =  this.refs["scrollView"];
    var refreshView = this.refs["refreshView"];
    if (scrollView == undefined || refreshView == undefined) {
      return;
    }
    console.log("scrollView:"+scrollView + " refreshView:"+refreshView);

    var scrollTag = React.findNodeHandle(scrollView);
    var refreshTag = React.findNodeHandle(refreshView);
    if (flag == 'endDrag') {
      TBRefreshViewManager.endDrag(scrollTag, refreshTag);
    } else if (flag == 'didScroll') {
      TBRefreshViewManager.didScroll(scrollTag, refreshTag);
    } else if (flag == 'default') {
      TBRefreshViewManager.resetToDefaultState(scrollTag, refreshTag);
    }

  },

  _onScrollEndDrag: function() {
    this._refreshAction('endDrag');
  },

  _onTouchMove: function() {
    this._refreshAction('didScroll');
  },
});
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var itemWidth = (screenWidth - 30)/2;
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor:'#eeeeee',
    justifyContent: 'flex-start',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  topContainer: {
    marginLeft:0,
    marginTop: 0,
    marginRight:0,
    backgroundColor:'#11ffee',
    height: 64,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  refreshContainer: {
    height: 60,
    width:screenWidth,
    position:'absolute',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 0,
    padding:10,
    height: 250,
  },
  rowItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#999999',
    width : itemWidth,
  },

  listView: {
    paddingTop: 10,
    backgroundColor: '#eeeeee',
  },
});

AppRegistry.registerComponent('DealListDemo', () => DealListDemo);
