/*
 * @providesModule BZMUMain
 * @flow
 */
'use strict';

var React = require('react-native');

var TBImage = require('TBImage');
var TBLoading = require('TBLoading');
var TBTip = require('TBTip');
var TBScrollPageTopBar = require('TBScrollPageTopBar');
var TBHSwapView = require('TBHSwapView');
var TBHScrollViewManager = require('NativeModules').TBHScrollViewManager;
var TBFacade = require('TBFacade');
var TBExposureManager = require('TBExposureManager')
var TBPageError = require('TBPageError');
var BZMCoreUtils = require('BZMCoreUtils')

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var BZMUDealVo = require('../list/models/BZMUDealVo');
var BZMUDealListModel = require('BZMUDealListModel');
var BZMUDealTagItem = require('BZMUDealTagItem');

var BZMUDealGridCell = require('BZMUDealGridCell');
var BZMUDealGridItem = require('BZMUDealGridItem');
var BZMUDealHeadView = require('BZMUDealHeadView');
var BZMUDealHeadItem = require('BZMUDealHeadItem');
var BZMUDealThemeView = require('BZMUDealThemeView');
var BZMUDealThemeItem = require('BZMUDealThemeItem');
var BZMUDealBannerView = require('BZMUDealBannerView');

var BZMUDealNavigationBar = require('BZMUDealNavigationBar');
var BZMUDealBottomView = require('BZMUDealBottomView');

var BZMCoreModel = require('BZMCoreModel');

var {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  StatusBar,
  TouchableHighlight,
} = React;

var TAGLIST_API_URL = 'http://th5.m.zhe800.com/youpin/tags';
var DEALLIST_API_URL = 'http://th5.m.zhe800.com/youpin/deals?image_model=jpg&image_type=big,si2';

var BZMUMain = React.createClass({
  getInitialState: function() {
    return {
      dataSource0: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      dataSource1: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      youpinJiaData: null,
      tagItems: [],
      tagError: undefined,

      leftListError: undefined,
      rightListError: undefined,

      leftListShowTheme: true,
      rightListShowTheme: false,

      leftListScrollLater: false,
      rightListScrollLater: false,
    };
  },

  componentWillMount: function() {
    this.model = {
      listModels: [], //二位数组 element  Array(BZMUDealListModel)
      tagItems: [],
      currentSelectTag: 0,
      willSelectTag: 1,
      currentListIndex: 0,
    };
    this.themeItem = new BZMUDealThemeItem();
  },

  componentDidMount: function() {
    this.fetchTagData();
  },

  containerViewResponderCapture(evt) {
      return this.props.tbNativeMoving;
  },
  listViewResponderCapture(evt) {
    return this.swapNativeMoving;
  },
  _onSwapScroll(evt) {
    this.swapNativeMoving = true;
  },
  _onSwapScrollEnd(evt) {
    this.swapNativeMoving = false;
  },

  _tagTipPress: function() {
    this.fetchTagData();
  },
  _listViewTipPress: function(listIndex) {
    this.fetchDealListData(this.model.currentSelectTag,listIndex);
  },

  render: function() {

    if (this.state.tagError) {
      var view = <TBPageError
      style={{backgroundColor: '#ffffff',flex: 1}}
      title={this.state.tagError.errorMessage}
      imagePath={this.state.tagError.imageUrl}
      onTap={this._tagTipPress} />
    }else {
      var view = <View>
        <BZMUDealHeadView item={new BZMUDealHeadItem()} />
        {this.renderTagHeader()}
        {this.renderList()}
      </View>
    }
    return (
      <View style={styles.container}
        ref="containerView"
        onStartShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)}
        onMoveShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)}>
        <StatusBar barStyle="default"/>
        <BZMUDealNavigationBar title={'优品汇'} onBack={this._goBack} />
        {view}
      </View>
    );
  },


  renderTagHeader: function(sectionData, sectionId) {
      var items = [];
      for (var i in this.state.tagItems) {
        items.push(this.state.tagItems[i].category_name);
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

    var leftView = (
      <View style={styles.flex_1}>
        <TBPageError
          style={this.state.leftListError?styles.flex_1:styles.height_0}
          title={this.state.leftListError? this.state.leftListError.errorMessage:''}
          imagePath={this.state.leftListError? this.state.leftListError.imageUrl:''}
          onTap={this._listViewTipPress.bind(this,0)} />
        <View style={this.state.leftListError? styles.height_0:styles.flex_1}>
          <ListView
            ref = 'innerListView0'
            onStartShouldSetResponderCapture={(evt)=>this.listViewResponderCapture(evt)}
            onMoveShouldSetResponderCapture={(evt)=>this.listViewResponderCapture(evt)}
            dataSource={this.state.dataSource0}
            showsVerticalScrollIndicator={false}
            renderHeader={this.renderListHeader.bind(this,0)}
            renderFooter={this.renderListFooter.bind(this,0)}
            renderRow={this.renderDealRow}
            onScroll={this._onInnerScroll.bind(this,0)}
            scrollEventThrottle={200}
            onScrollEndDrag={this._onInnerScrollViewEndDrag}
            onScrollBeginDrag={this._onInnerScrollBeginDrag}
            onChangeVisibleRows={this._onChangeVisibleRows.bind(this,0)}
            onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this,0)}
          />
          {this.renderTopButton(0)}
          {this.renderBottomBar(0)}
        </View>
      </View>
    );

    var rightView = (
      <View style={styles.flex_1}>
        <TBPageError
          style={this.state.rightListError? styles.flex_1:styles.height_0}
          title={this.state.rightListError? this.state.rightListError.errorMessage:''}
          imagePath={this.state.rightListError? this.state.rightListError.imageUrl:''}
          onTap={this._listViewTipPress.bind(this,1)} />
        <View style={this.state.rightListError? styles.height_0:styles.flex_1}>
          <ListView
            ref = 'innerListView1'
            onStartShouldSetResponderCapture={(evt)=>this.listViewResponderCapture(evt)}
            onMoveShouldSetResponderCapture={(evt)=>this.listViewResponderCapture(evt)}
            dataSource={this.state.dataSource1}
            showsVerticalScrollIndicator={false}
            renderHeader={this.renderListHeader.bind(this,1)}
            renderFooter={this.renderListFooter.bind(this,1)}
            renderRow={this.renderDealRow}
            onScroll={this._onInnerScroll.bind(this,1)}
            scrollEventThrottle={200}
            onScrollEndDrag={this._onInnerScrollViewEndDrag}
            onScrollBeginDrag={this._onInnerScrollBeginDrag}
            onChangeVisibleRows={this._onChangeVisibleRows.bind(this,1)}
            onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this,1)}
          />
          {this.renderTopButton(1)}
          {this.renderBottomBar(1)}
        </View>
      </View>
    );

    return (<TBHSwapView
      ref="swapView"
      style={styles.listView}
      items={items}
      onPageLoad={this._onPageWillShow}
      onShowPage={this._onShowPage}
      onSwapScroll={this._onSwapScroll}
      onSwapScrollEnd={this._onSwapScrollEnd}
      enableDragToRight={false}>
      <View
        ref='innerView0'
        style={listStyles.container} >
        {leftView}
      </View>
      <View
        ref='innerView1'
        style={listStyles.container2} >
        {rightView}
      </View>
    </TBHSwapView>);
  },

  renderDealRow: function(item,sectionId,rowId) {
    var cells = [];
    for (var index in item.vos) {
      var deal = item.vos[index];
      var cell = <BZMUDealGridCell
        style={listStyles.rowItem}
        thumbnailStyle={listStyles.rowThumbnail}
        key={deal.id}
        onSelect={this._selectDeal.bind(this,deal,rowId,index)}
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



  renderListHeader: function(listIndex) {
    if (this.state.leftListShowTheme && listIndex==0) {
      return (
        <View>
          <BZMUDealBannerView
            datas={this.state.youpinJiaData}
            onResponseData={this._onYoupinJiaResponse}
            onPress={this._onYoupinJiaPress} />
          <BZMUDealThemeView item={this.themeItem} onSelected={this._onThemeSelected.bind(this,1)} />
        </View>
      );
    }
    if (this.state.rightListShowTheme && listIndex==1) {
      return (
        <View>
          <BZMUDealBannerView
            datas={this.state.youpinJiaData}
            onResponseData={this._onYoupinJiaResponse}
            onPress={this._onYoupinJiaPress} />
          <BZMUDealThemeView item={this.themeItem} onSelected={this._onThemeSelected.bind(this,1)} />
        </View>
      );
    }
    return null;
  },
  renderListFooter: function(listIndex) {
    if (this.state.leftListShowTheme && listIndex==0) {
      return (<View style={{height:50}}/>);
    }
    if (this.state.rightListShowTheme && listIndex==1) {
      return (<View style={{height:50}}/>);
    }
    return null;
  },
  renderBottomBar: function(listIndex) {
    var item = new BZMUDealThemeItem();
    if (this.state.youpinJiaData) {
        var themeVo = new BZMUDealThemeItem.ThemeVo('优品+', '',
          '#B7767D', BZMCoreUtils.iconURL('bzm_udeal/bzm_udeal_bottom_plus.png'));
        themeVo.url = this.state.youpinJiaData.url;
        item.vos.unshift(themeVo);
    }
    if (this.state.leftListShowTheme && listIndex==0 && this.state.leftListScrollLater) {
      return (
        <BZMUDealBottomView
          style={styles.bottomBar}
          item={item}
          onSelected={this._onThemeSelected.bind(this,2)} />
      );
    }
    if (this.state.rightListShowTheme && listIndex==1 && this.state.rightListScrollLater) {
      return (
        <BZMUDealBottomView
          style={styles.bottomBar}
          item={item}
          onSelected={this._onThemeSelected.bind(this,2)} />
      );
    }
    return null;
  },
  renderTopButton: function(listIndex) {
    var button = (<TouchableHighlight
      style={listStyles.topButtonContainer}
      activeOpacity={0.9}
      onPress={this._onTopButtonPress}>
      <View>
        <TBImage
          urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_btn_top.png'}
          style={listStyles.topButton} />
      </View>
    </TouchableHighlight>);

    if (this.state.leftListScrollLater && listIndex==0) {
      return button;
    }
    if (this.state.rightListScrollLater && listIndex==1) {
      return button;
    }
    return null;
  },



  _goBack: function() {
      var cView = this.refs["containerView"];
      var cTag = React.findNodeHandle(cView);
      TBFacade.goBack(cTag);
  },

  _onThemeSelected: function(modelIndex,vo) {
    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);

    //页面流转打点
    switch (vo.text) {
      case '优品+':
        var order = 'tab';
        var sortId = 0;
        var analysisType = 'youpinplus';
        modelIndex = 0;
        break;
      case '最新上架':
        var order = 'publishTime';
        var sortId = 1;
        break;
      case '销量最高':
        var order = 'saled';
        var sortId = 2;
        break;
      case '明日预告':
        var order = 'tomorrow';
        var sortId = 3;
        break;
      default:
    }
    var modelVo = {
      analysisId: order,
      analysisType: analysisType||'order',
      analysisIndex: sortId,
    };
    var listModel = this._getListModel();
    var pageId = listModel.pageName+'_'+listModel.tagUrlName;
    var pageName = listModel.pageName;
    TBExposureManager.pushLogForPageName(pageName,pageId,modelIndex,modelVo)

    if (vo.text === '优品+') {
        TBFacade.forward(1, vo.url);
        return;
    }

    //跳转逻辑
    TBFacade.nativeInfo(function(vo,cTag,dm){
      var userType = dm.usertype;
      var userRole = dm.userrole;
      var student = dm.school;

      switch (vo.text) {
        case '最新上架':
          var order = 'publishTime';
          break;
        case '销量最高':
          var order = 'saled';
          break;
        case '明日预告':
          var order = 'tomorrow';
          break;
        default:

      }

      var url = 'http://th5.m.zhe800.com/h5public/youpinhui/rank?pub_page_from=zheclient'
        +'&userType='+ userType+'&userRole='+userRole+'&student='+student+'&title='+encodeURIComponent(vo.text)+'&order='+order;
      TBFacade.forward(cTag, url);
    }.bind(this, vo, cTag));

  },

  _onYoupinJiaPress: function(url) {
    TBFacade.forward(1, url);

    //页面流转打点
    var modelVo = {
      analysisId: 'banner',
      analysisType: 'youpinplus',
      analysisIndex: 0,
    };
    var listModel = this._getListModel();
    var pageId = listModel.pageName+'_'+listModel.tagUrlName;
    var pageName = listModel.pageName;
    TBExposureManager.pushLogForPageName(pageName,pageId,0,modelVo)
  },

  _onYoupinJiaResponse: function(responseData) {
    if (responseData === this.state.youpinJiaData) {
        return;
    }
    this.setState({
        youpinJiaData: responseData,
    });
  },

  _onInnerScroll: function(listIndex,e){
    this._refreshBottomBarWithContentOffset(listIndex,e.nativeEvent.contentOffset.y);
  },

  //拖拽结束
  _onInnerScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    var contentSizeHeight = e.nativeEvent.contentSize.height;
    var distance = offset + e.nativeEvent.layoutMeasurement.height - contentSizeHeight;
    if (distance > 60) {
      //加载更多
      this._loadMore();
    }

    //曝光
    this._exposureItems();
  },
  _onInnerScrollBeginDrag: function(e) {
    var listModel = this._getListModel();
    if (e.nativeEvent.contentOffset.y > listModel.previous_y) {
      listModel.previous_y = e.nativeEvent.contentOffset.y;
      //加载更多
      this._loadMore();
    }
  },

  _onChangeVisibleRows: function(index, visibleRows, changedRows) {
    if (index !== this.model.currentListIndex) {
      return;
    }
    var listModel = this._getListModel();
    for (var index in changedRows.s1) {
      var dealItem = listModel.items[index];
      if (dealItem == undefined) {
        return;
      }
      if (changedRows.s1[index]) {
        dealItem.appearTime = new Date().getTime();
      }else {
        dealItem.disAppearTime = new Date().getTime();
      }
    }
  },

  _onMomentumScrollEnd: function(listIndex,e) {
    // onScrollAnimationEnd={this._onInnerScrollAnimationEnd.bind(this,0)}
    //刷新topButton及bottomBar，因为onScroll每0.2s触发一次，所以如果点击topbar返回顶部时，列表滑动太快，可能造成已经到顶部了，但是topButton和bottomBar依然还在，所以需要在此处再刷新一次。
    //本来最好写在onScrollAnimationEnd这个回调中，但是原来库文件中似乎有bug，animationEnd并不会触发这个回调，而是触发onMomentumScrollEnd这个回调，具体库文件中bug语句如下：
    //RCT_SCROLL_EVENT_HANDLER(scrollViewDidEndScrollingAnimation, RCTScrollEventTypeEndDeceleration)，这里的RCTScrollEventTypeEndDeceleration我认为是写错了，应该是RCTScrollEventTypeEndAnimation。
    this._refreshBottomBarWithContentOffset(listIndex,e.nativeEvent.contentOffset.y);

    //曝光逻辑
    this._exposureItems();
  },

  _onPageWillShow: function(e) {
    //加载页面
    //e.nativeEvent.pageTag 目标列表的tag
    //e.nativeEvent.pageIndex 目标列表对应的index
    //currentList,listIndex 均为目标列表
    var {currentList,listIndex} = this._findListIndex(e.nativeEvent.pageTag);
    var tagIndex = e.nativeEvent.pageIndex

    this.model.willSelectTag = tagIndex;
    //刷新列表对应的tag，如果无数据，则加载
    var listModel = this._getListModel(tagIndex);
    this._setListError(listIndex,undefined);
    this._refreshDataSource(listIndex,listModel,tagIndex);
    this._refreshBottomBarWithContentOffset(listIndex,listModel.offset);
    if (listModel.items.length == 0) {
      //如果页面数据为空，则加载数据。
      this.fetchDealListData(tagIndex,listIndex);
    }else {
      var listContainerView = this.refs['innerView'+listIndex];
      var cTag = React.findNodeHandle(listContainerView);
      if (cTag) {
        TBLoading.hidePageLoading(cTag, {});
      }
    }
    if (currentList) {
      currentList.getScrollResponder().scrollTo({x:0,y:listModel.offset,animated:false});
    }
  },

  _onShowPage: function(e) {
    //页面显示
    var {otherList,listIndex} = this._findListIndex(e.nativeEvent.pageTag);

    //注意这里顺序不能乱，不能先设置currentListIndex，否则找不到消失页面的listModel
    var lastListModel = this._getListModel();
    if (otherList) {
      lastListModel.offset = otherList.scrollProperties.offset;
    }

    //修改currentSelectTag及currentListIndex，滚动topBar
    this.refs.topBar.selectIndex(e.nativeEvent.pageIndex);
    this.model.currentSelectTag = e.nativeEvent.pageIndex;
    this.model.currentListIndex = listIndex;

    //tab打点逻辑
    var listModel = this._getListModel();
    var sortId = Number(e.nativeEvent.pageIndex)+1;
    var modelVo = {
      analysisId: listModel.tagUrlName,
      analysisType: 'tab',
      analysisIndex: sortId,
    };
    var listModel = this._getListModel();
    var pageId = listModel.pageName+'_'+listModel.tagUrlName;
    var pageName = listModel.pageName;

    TBExposureManager.tapPageName(pageName,pageId,0,modelVo)
  },

  _tagItemChange: function(e){
    var swapViewRef = this.refs.swapView;
    var swapViewTag = React.findNodeHandle(swapViewRef);
    TBHScrollViewManager.scroll(swapViewTag, e.nativeEvent.index, true);
  },

  _onTopButtonPress: function(e) {
    var currentList = this.refs['innerListView'+this.model.currentListIndex];
    if (currentList) {
      currentList.getScrollResponder().scrollTo({x:0,y:0,animated:true});
    }
  },

  _selectDeal: function(deal :BZMUDealVo, rowId :String, index:String) {
    var url = "zhe800://m.zhe800.com/mid/zdetail?zid="+deal.zid+"&dealid="+deal.id;
    TBFacade.forward(1, url);

    //页面流转打点
    var sortId = Number(rowId)*2+Number(index)+1;
    var modelVo = {
      analysisId: deal.id,
      analysisType: 'deallist',
      analysisIndex: sortId,
      analysisSourceType: 2,
    };
    var listModel = this._getListModel();
    var pageId = listModel.pageName+'_'+listModel.tagUrlName;
    var pageName = listModel.pageName;

    TBExposureManager.pushLogForPageName(pageName,pageId,0,modelVo);
  },

  fetchTagData: function() {
    TBFacade.nativeInfo(function(dm){

      var contentView =  this.refs["containerView"];
      var cTag = React.findNodeHandle(contentView);
      TBLoading.pageLoading(cTag, {"x": 0,"y": 64,"width": screenWidth,"height": screenHeight-64});

      var url = TAGLIST_API_URL+ '?user_role='+dm.userrole;
      fetch(url)
        .then((response) => {
          if (cTag) {TBLoading.hidePageLoading(cTag, {});}
          if (!response.ok) {
            var status = response.status;
            var tipObject = BZMCoreUtils.tipType(status)
            this.setState({
              tagError: tipObject,
            });
            return;
          }
          this.setState({
            tagError: undefined,
          });
          return response.json()
        })
        .catch((error) => {
          // console.log(error);
          // 网络连接错误
          if (cTag) {TBLoading.hidePageLoading(cTag, {});}
          var tipObject = {
            errorMessage : "当前处于无网络状态，请检查设置",
            imageUrl : 'bundle://message_network_not_reachable@2x.png'};
          this.setState({
            tagError: tipObject,
          });
        })
        .then((responseData) => {
          if (!responseData) {
            return;
          }

          var items = responseData.map((item) => {
            return new BZMUDealTagItem(item);
          });
          this.model.tagItems.splice(0); //清空数组
          this.model.tagItems.push(...items);

          this.setState({
            tagItems: this.model.tagItems,
          });

          this.fetchDealListData(0,0);
          if (this.model.tagItems.length > 0) {
            this.fetchDealListData(1,1);
          }
        })
        .done();
    }.bind(this));

  },

  fetchDealListData: function(tagIndex,listIndex) {

    //这里的TBFacade回调是异步调用，所以要把loadding写在外面。
    var listModel = this._getListModel(tagIndex);
    listModel.loading = true;

    //开始下载书籍
    TBFacade.nativeInfo(function(tagIndex,listIndex,listModel,dm){
      var userType = dm.usertype;
      var userRole = dm.userrole;
      var student = dm.school;

      listModel.tagUrlName = (tagIndex>0)? this.model.tagItems[tagIndex-1].url_name : 'all';

      var url = DEALLIST_API_URL + '&url_name='+listModel.tagUrlName+ '&page='+listModel.pageNumber+
        '&per_page='+listModel.pageSize+ '&user_type='+userType+ '&user_role='+userRole+ '&student='+student;
      // var url = 'http://th5.m.zhe800.com/youpin/dels?image_model=jpg&image_type=big,si2';

      if (listModel.items.length == 0) {
        // console.log('加载框');
        var height = screenHeight-(64+BZMUDealHeadView.height+tagHeight);
        var listContainerView = this.refs['innerView'+listIndex];
        var cTag = React.findNodeHandle(listContainerView);
        if (cTag) {
          TBLoading.hidePageLoading(cTag, {});
          TBLoading.pageLoading(cTag, {"x": 0,"y": 0,"width": screenWidth,"height": height});
        }
      }

      fetch(url)
        .then((response) => {
          // Response
          listModel.loading = false;

          if ((tagIndex == this.model.currentSelectTag || tagIndex == this.model.willSelectTag) && cTag) {
            TBLoading.hidePageLoading(cTag, {});

            if (!response.ok) {
              var status = response.status;
              var tipObject = BZMCoreUtils.tipType(status);
              this._setListError(listIndex,tipObject);
              return;
            }
            this._setListError(listIndex,undefined);
          }

          if (!response.ok) {
            //如果请求失败且不是第一页，则pageNumber--
            if (listModel.pageNumber>1) {
              listModel.pageNumber--;
            }
            return;
          }
          return response.json()
        })
        .catch((error) => {
          //网络错误
          listModel.loading = false;
          //如果请求失败且不是第一页，则pageNumber--
          if (listModel.pageNumber>1) {
            listModel.pageNumber--;
          }

          if ((tagIndex == this.model.currentSelectTag || tagIndex == this.model.willSelectTag) && cTag) {
            // console.log('123');
            TBLoading.hidePageLoading(cTag, {});
            var tipObject = {
              errorMessage : "当前处于无网络状态，请检查设置",
              imageUrl : 'bundle://message_network_not_reachable@2x.png'};
            this._setListError(listIndex,tipObject);
          }

        })
        .then((responseData) => {
          //下载完成
          // console.log(responseData);
          if (!responseData) {
            return;
          }

          if (responseData.meta) {
            listModel.hasNext = responseData.meta.has_next;
          }
          var dealVos = responseData.objects.map((dealVo) => {
            return new BZMUDealVo(dealVo);
          });
          var items = [];
          var item;
          var i=0;
          var vos = listModel.vos;
          for (var index in dealVos) {
            var dealVo = dealVos[index];

            if (this._dealVoDidAdd(dealVo.id,vos)) { //去重
              continue;
            }
            if (i % 2 == 0) {
              item = new BZMUDealGridItem();
              items.push(item);
            }
            item.vos.push(dealVo);
            listModel.vos.push(dealVo);
            i++;
          }
          listModel.items.push(...items);

          if (tagIndex !== this.model.currentSelectTag && tagIndex !== this.model.willSelectTag) {
            //加载的不是当前页，也不是将要加载的页,则不做任何操作
            return;
          }

          //当数组为空，显示nodata
          if (listModel.items.length == 0) {
            var tipObject = {
              errorMessage : "暂无数据",
              imageUrl : 'bundle://message_nodata@2x.png'};
            this._setListError(listIndex,tipObject);
          }

          //刷新
          if (cTag) {
            TBLoading.hidePageLoading(cTag, {});
          }
          this._refreshDataSource(listIndex,listModel,tagIndex);
        })
        .done();
    }.bind(this, tagIndex,listIndex,listModel));
  },

  _dealVoDidAdd: function(dealId,vos) {
    for (var index in vos) {
      var dealVo = vos[index];
      if (dealVo.id === dealId) {
        return true;
      }
    }
    return false;
  },

  //加载更多
  _loadMore: function() {
    var listModel = this._getListModel();
    if (!listModel.hasNext || listModel.loading) {
      return;
    }
    listModel.pageNumber += 1;
    this.fetchDealListData(this.model.currentSelectTag,this.model.currentListIndex);
  },

  _setListError: function(listIndex,tipObject) {
    // console.log('asd');
    if (listIndex === 0) {
      this.setState({leftListError: tipObject});
    }else {
      this.setState({rightListError: tipObject});
    }
  },

  //曝光函数
  _exposureItems: function() {
    var listModel = this._getListModel();
    // 开始曝光
    console.log('开始曝光');
    listModel.checkExposureItems();
  },


  _refreshDataSource: function(listIndex,listModel,tagIndex) {
    if (listIndex === 0) {
      this.setState({
        dataSource0: this.state.dataSource0.cloneWithRows(listModel.items),
        leftListShowTheme: (tagIndex===0),
      });
    }else {
      this.setState({
        dataSource1: this.state.dataSource1.cloneWithRows(listModel.items),
        rightListShowTheme: (tagIndex===0),
      });
    }
  },

  _refreshBottomBarWithContentOffset: function(listIndex,offset) {
    var farOffset = 400;
    if (listIndex === 0) {
      if (offset > farOffset && !this.state.leftListScrollLater) {
        this.setState({leftListScrollLater:true});
      }else if (offset <= farOffset && this.state.leftListScrollLater) {
        this.setState({leftListScrollLater:false});
      }
    }else {
      if (offset > farOffset && !this.state.rightListScrollLater) {
        this.setState({rightListScrollLater:true});
      }else if (offset <= farOffset && this.state.rightListScrollLater) {
        this.setState({rightListScrollLater:false});
      }
    }
  },


  _getListModel: function(tagIndex :?number): BZMUDealListModel {
    var index = (tagIndex===undefined ? this.model.currentSelectTag : tagIndex);
    var listModel = this.model.listModels[index];
    if (!listModel) {
      listModel = new BZMUDealListModel();
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


var itemWidth = (screenWidth - 1) / 2;
var tagHeight = 40;
var listHeight = screenHeight-64-BZMUDealHeadView.height-tagHeight;

var minListHeight = screenHeight-64-BZMUDealHeadView.height-tagHeight;
var maxListHeight = screenHeight-64-tagHeight;
var minHeadHeight = 0;
var maxHeadHeight = BZMUDealHeadView.height;


var styles = StyleSheet.create({
  container: {
    flex: 1,
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

  bottomBar: {
    position: 'absolute',
    bottom: 0,
  },

  flex_1: {
    flex: 1,
  },

  height_0: {
    height: 0,
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
    overflow: 'hidden',
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
    backgroundColor: 'white',
  },

  topButton:{
    width: topButtonWidth,
    height: topButtonWidth,
    backgroundColor: 'transparent',
  },

  topButtonContainer: {
    position: 'absolute',
    top: listHeight-topButtonWidth-50-30,
    left: screenWidth-topButtonWidth-15,
    width: topButtonWidth,
    height: topButtonWidth,
    borderRadius: topButtonWidth/2,
  },

});

// AppRegistry.registerComponent('BZMUMain', () => BZMUMain);
module.exports = BZMUMain;
