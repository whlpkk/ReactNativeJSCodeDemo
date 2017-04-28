'use strict';
var React = require('react-native');

var TBImage = require('../bzm/bzm_core/components/TBImage');
var TBLoading = require('../bzm/bzm_core/components/TBLoading');
var TBTip = require('../bzm/bzm_core/components/TBTip');
var TBScrollPageTopBar = require('../bzm/bzm_core/components/TBScrollPageTopBar');
var TBHSwapView = require('../bzm/bzm_core/components/TBHSwapView');

var TBSuperiorDealGridCell = require('./SuperiorProductsList/views/TBSuperiorDealGridCell');
var TBSuperiorDealVo = require('./SuperiorProductsList/models/TBSuperiorDealVo');
var TBSuperiorDealGridItem = require('./SuperiorProductsList/models/TBSuperiorDealGridItem');
var SuperiorProductsListModel = require('./SuperiorProductsList/models/SuperiorProductsListModel');

var TBHScrollViewManager = require('NativeModules').TBHScrollViewManager;

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableHighlight,
} = React;

var TAGLIST_API_URL = 'http://th5.m.zhe800.com/youpin/tags?user_role=1'
var DEALLIST_API_URL = 'http://th5.m.zhe800.com/youpin/deals?image_model=jpg' +
  '&image_type=big,si2&user_type=1&user_role=1&student=1' +
  '&per_page=20'

var SuperiorProductsList = React.createClass({
  getInitialState: function() {
    return {
      dataSource0: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      dataSource1: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      showPopupLoading: false,
      tagLoaded: false,
    };
  },

  componentWillMount: function() {
    this.model = {
      listModels: [], //二位数组 element  Array(SuperiorProductsListModel)
      tagItems: [],
      currentSelectTag: 0,
      currentListIndex: 0,
    };
  },

  componentDidMount: function() {
    this.fetchTagData();
  },

  render: function() {
    if (this.state.showPopupLoading || !this.state.tagLoaded) {
      TBLoading.popupLoading({
        "x": 0,
        "y": 0,
        "width": screenWidth,
        "height": screenHeight
      }, )
      return (<View />);
    }
    TBLoading.hidePopupLoading();

    return (
      <View style={styles.container}>
        <ScrollView
        ref = 'outerScrollView'
        automaticallyAdjustContentInsets={false}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}>
          {this.renderComment(new CommentItem())}
          {this.renderTheme(new ThemeItem())}
          {this.renderTagHeader()}
          {this.renderList()}
        </ScrollView>
      </View>
    );
  },

  renderComment: function(item) {
    var cells = [];
    for (var i in item.vos) {
      var cell = <View key={i} style={commentStyles.cell}>
        <TBImage urlPath={item.vos[i].imageUrl} style={commentStyles.image}/>
        <Text style={commentStyles.text}>{item.vos[i].text}</Text>
      </View>
      cells.push(cell);
    }
    return (<View style={commentStyles.container}>{cells}</View>);
  },

  renderTheme: function(item) {
    var cells = [];
    for (var i in item.vos) {
      var cell =
        <TouchableHighlight key={i} onPress={()=>{console.log('123');}}>
        <View style={themeStyles.cell}>
          <Text style={[themeStyles.text,{color:item.vos[i].textColor}]}>{item.vos[i].text}</Text>
          <TBImage urlPath={item.vos[i].imageUrl} style={themeStyles.image}/>
        </View>
      </TouchableHighlight>
      cells.push(cell);
    }
    return (<View style={themeStyles.back}>
        <View style={themeStyles.container}>{cells}</View>
      </View>);
  },

  renderTagHeader: function(sectionData, sectionId) {
      var items = [];
      for (var i in this.model.tagItems) {
        items.push(this.model.tagItems[i].category_name);
      }
      items.unshift('全部');

      return (<TBScrollPageTopBar
        ref= 'topBar'
        initialIndex = {0}
        style={styles.tagList}
        items={items}
        onItemChange={this._tagItemChange}
      />);
  },

  renderList: function() {
    var items = [];
    for (var i in this.model.tagItems) {
      items.push(this.model.tagItems[i].categoryName);
    }
    items.unshift('全部');

    return (<TBHSwapView
      ref="swapView"
      items={items}
      onPageLoad={this._onPageWillShow}
      onShowPage={this._onShowPage}
      enableDragToRight={false}
      style={styles.listView}
    >
      <View style={listStyles.container} ref='innerView0'>
        <ListView
          ref = 'innerListView0'
          dataSource={this.state.dataSource0}
          showsVerticalScrollIndicator={false}
          renderRow={this.renderDealRow}
          onScrollEndDrag={this._innerScrollViewEndDrag}
          onScrollBeginDrag={this._onInnerScrollBeginDrag}
          onChangeVisibleRows={this._onChangeVisibleRows}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
        />
        <TouchableHighlight style={listStyles.topButtonContainer} underlayColor={'clear'} activeOpacity={1} onPress={this._onTopButtonPress}>
          <View><TBImage urlPath={'bundle://common_scrolltotop_btn@2x.png'} style={listStyles.topButton} /></View>
        </TouchableHighlight>
      </View>
      <View style={listStyles.container2} ref='innerView1'>
        <ListView
          ref = 'innerListView1'
          dataSource={this.state.dataSource1}
          showsVerticalScrollIndicator={false}
          renderRow={this.renderDealRow}
          onScrollEndDrag={this._innerScrollViewEndDrag}
          onScrollBeginDrag={this._onInnerScrollBeginDrag}
          onChangeVisibleRows={this._onChangeVisibleRows}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
        />
        <TouchableHighlight style={listStyles.topButtonContainer} underlayColor={'clear'} activeOpacity={1} onPress={this._onTopButtonPress}>
          <View><TBImage urlPath={'bundle://common_scrolltotop_btn@2x.png'} style={listStyles.topButton} /></View>
        </TouchableHighlight>
      </View>
    </TBHSwapView>);
  },

  renderDealRow: function(item) {
    var cells = [];
    for (var index in item.vos) {
      var deal = item.vos[index];
      var cell = <TBSuperiorDealGridCell
        style={listStyles.rowItem}
        thumbnailStyle={listStyles.rowThumbnail}
        key={deal.id}
        onSelect={() => this.selectDeal(deal)}
        deal={deal}
      />;
      cells.push(cell);
    }
    return (
      <View style={listStyles.row}>
        {cells}
      </View>
    );
  },

  _innerScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    if (offset < -40) {
      this.refs.outerScrollView.getScrollResponder().scrollTo(0,0);
    }else if (offset > 10) {
      this.refs.outerScrollView.getScrollResponder().scrollTo(190,0);
    }

    // //曝光
    // var listModel = this._getListModel();
    // console.log('开始曝光');
    // listModel.checkExposureItems();
  },
  _onInnerScrollBeginDrag: function(e) {
    var listModel = this._getListModel();
    if (e.nativeEvent.contentOffset.y > listModel.previous_y) {
      listModel.previous_y = e.nativeEvent.contentOffset.y;
    } else {
      // previous_y = e.nativeEvent.contentOffset.y;
      return;
    }

    if (!listModel.hasNext || listModel.loading) {
      // We're already fetching or have all the elements so noop
      return;
    }
    listModel.pageNumber += 1;
    listModel.loading = true;
    this.fetchDealListData(this.model.currentSelectTag,this.model.currentListIndex);
  },
  _onChangeVisibleRows: function(visibleRows, changedRows) {
    // console.log(visibleRows);
    // console.log(changedRows);
    var listModel = this._getListModel();
    for (var index in changedRows.s1) {
      if (changedRows.s1[index]) {
        listModel.items[index].appearTime = new Date().getTime();
      }else {
        listModel.items[index].disAppearTime = new Date().getTime();
      }
    }
  },
  _onMomentumScrollEnd: function() {
    //曝光
    var listModel = this._getListModel();
    console.log('开始曝光');
    listModel.checkExposureItems();
  },

  _onPageWillShow: function(e) {
    //加载
    var {currentList,listIndex} = this._findListIndex(e.nativeEvent.pageTag);
    this._refreshListView(e.nativeEvent.pageIndex,listIndex);

    var listModel = this._getListModel(e.nativeEvent.pageIndex);
    currentList.getScrollResponder().scrollWithoutAnimationTo(listModel.offset,0);
  },

  _onShowPage: function(e) {
    var {otherList,listIndex} = this._findListIndex(e.nativeEvent.pageTag);

    var listModel = this._getListModel();
    listModel.offset = otherList.scrollProperties.offset;

    this.refs.topBar.selectIndex(e.nativeEvent.pageIndex);
    this.model.currentSelectTag = e.nativeEvent.pageIndex;
    this.model.currentListIndex = listIndex;
  },

  _tagItemChange: function(e){
    var swapViewRef = this.refs.swapView;
    var swapViewTag = React.findNodeHandle(swapViewRef);
    TBHScrollViewManager.scroll(swapViewTag, e.nativeEvent.index, true);
  },

  _onTopButtonPress: function(e) {
    var curretnList = this.refs['innerListView'+this.model.currentListIndex];
    curretnList.getScrollResponder().scrollTo(0,0);
  },

  selectDeal: function(deal: Object) {

  },

  fetchTagData: function() {
    // console.log('开始下载分类数据');
    fetch(TAGLIST_API_URL)
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      })
      .then((responseData) => {
        var items = responseData.map((item) => {
          return new TagItem(item);
        });
        this.model.tagItems.splice(0); //清空数组
        this.model.tagItems.push(...items);
        this.setState({
          tagLoaded: true,
          showPopupLoading: false,
        });

        this.fetchDealListData(0,0);
        this.fetchDealListData(1,1);
      })
      .done();
  },

  fetchDealListData: function(tagIndex,listIndex) {

    console.log('开始下载列表数据');
    var listModel = this._getListModel(tagIndex);
    listModel.tagUrlName = (tagIndex>0)? this.model.tagItems[tagIndex-1].url_name : 'all';

    var url = DEALLIST_API_URL + '&url_name='+ listModel.tagUrlName + '&page='+ listModel.pageNumber;

    fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        listModel.loading = false;
      })
      .then((responseData) => {

        listModel.loading = false;
        if (responseData.meta) {
          listModel.hasNext = responseData.meta.has_next;
        }
        var dealVos = responseData.objects.map((dealVo) => {
          return new TBSuperiorDealVo(dealVo);
        });
        var items = [];
        var item;
        for (var index in dealVos) {
          var dealVo = dealVos[index];
          if (index % 2 == 0) {
            item = new TBSuperiorDealGridItem();
            items.push(item);
          }
          item.vos.push(dealVo);
        }
        listModel.items.push(...items);
        this._refreshDataSource(listIndex,listModel.items);
      })
      .done();
  },

  _refreshListView: function(tagIndex,listIndex) {
    var listModel = this._getListModel(tagIndex);
    this._refreshDataSource(listIndex,listModel.items);
    if (!listModel.items.length) {
      this.fetchDealListData(tagIndex,listIndex);
      return;
    }
  },

  _refreshDataSource: function(listIndex,items) {
    if (listIndex === 0) {
      this.setState({
        dataSource0: this.state.dataSource0.cloneWithRows(items),
      });
    }else {
      this.setState({
        dataSource1: this.state.dataSource1.cloneWithRows(items),
      });
    }
  },

  _getListModel: function(tagIndex :?number): SuperiorProductsListModel {
    var index = (tagIndex===undefined ? this.model.currentSelectTag : tagIndex);
    var listModel = this.model.listModels[index];
    if (!listModel) {
      listModel = new SuperiorProductsListModel();
      this.model.listModels[tagIndex] = listModel;
    }
    return listModel;
  },

  _findListIndex: function(pageTag) {
    var listIndexInfo = {};
    if ( pageTag===React.findNodeHandle(this.refs.innerView0) ) {
      listIndexInfo.currentList = this.refs.innerListView0;
      listIndexInfo.otherList = this.refs.innerListView1;
      listIndexInfo.listIndex = 0;
    }else {
      listIndexInfo.currentList = this.refs.innerListView1;
      listIndexInfo.otherList = this.refs.innerListView0;
      listIndexInfo.listIndex = 1;
    }
    return listIndexInfo;
  },

});

var CommentVo = function(text, imageUrl, textColor) {
  this.text = text;
  this.imageUrl = imageUrl;
  this.textColor = textColor;
};
var CommentItem = function() {
  var vos = [];
  vos.push(new CommentVo('97%好评', '1'));
  vos.push(new CommentVo('24小时发货', '1'));
  vos.push(new CommentVo('精选爆款', '1'));
  this.vos = vos;
};
var ThemeItem = function() {
  var vos = [];
  vos.push(new CommentVo('最新上架', 'http://i0.tuanimg.com/ms/h5public/dist/img/youpinhui/order1.jpg', '#B7767D'));
  vos.push(new CommentVo('销量最高', 'http://i0.tuanimg.com/ms/h5public/dist/img/youpinhui/order2.jpg', '#00B68D'));
  vos.push(new CommentVo('明日预告', 'http://i0.tuanimg.com/ms/h5public/dist/img/youpinhui/order4.jpg', '#40557B'));
  this.vos = vos;
};
var TagItem = function(item) {
  this.id = item.id;
  this.tag_id = item.tag_id;
  this.parent_url_name = item.parent_url_name;
  this.category_name = item.category_name;
  this.url_name = item.url_name;
  this.category_desc = item.category_desc;
  this.query = item.query;
  this.pic = item.pic;
  this.now_count = item.now_count;
}

var itemWidth = (screenWidth - 1) / 2;
var tagHeight = 40;
var listHeight = screenHeight-tagHeight;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6F6F6',
  },

  tagList: {
    height: tagHeight,
  },

  listView: {
    width: screenWidth,
    height: listHeight,
    flexDirection: 'row',
  },
});

var kCommentCellHeight = 40;
var commentStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: kCommentCellHeight,
  },

  cell: {
    height: kCommentCellHeight,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  image: {
    width: 23,
    height: 23,
    borderWidth: 1,
    marginRight: 3,
  },

  text: {
    fontSize: 12,
  },
});


var themePadding = 5;
var cellWidth = (screenWidth - themePadding * 4) / 3;
var kThemeCellHeight = 150;

var themeStyles = StyleSheet.create({
  back: {
    backgroundColor: '#F6F6F6',
    height: kThemeCellHeight,
  },

  container: {
    flex: 1,
    height: 140,
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: themePadding,
    justifyContent: 'space-between',
  },

  cell: {
    width: cellWidth,
    height: 140,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  image: {
    marginTop: 15,
    width: cellWidth,
    height: cellWidth * (68 / 96),
  },

  text: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
  },
});


var kDealCellHeight = 260;
var topButtonWidth = 32;
var listStyles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
    width: screenWidth,
    height: listHeight,
    position: 'absolute',
  },
  container2: {
    backgroundColor: '#F6F6F6',
    left: screenWidth,
    width: screenWidth,
    height: listHeight,
    position: 'absolute',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 1,
    paddingHorizontal: 0,
    height: 260,
  },
  rowItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    width: itemWidth,
  },
  rowThumbnail: {
    width: itemWidth,
    height: itemWidth,
  },

  topButton:{
    width: topButtonWidth,
    height: topButtonWidth,
  },

  topButtonContainer: {
    position: 'absolute',
    top: listHeight-topButtonWidth-30,
    left: screenWidth-topButtonWidth-15,
    width: topButtonWidth,
    height: topButtonWidth,
  },

});

AppRegistry.registerComponent('SuperiorProductsList', () => SuperiorProductsList);
