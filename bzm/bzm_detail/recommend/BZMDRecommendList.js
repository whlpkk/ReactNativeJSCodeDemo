/*
 * @providesModule BZMDRecommendList
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var BZMUDealGridItem = require('BZMUDealGridItem');
var BZMDRecommendCell = require('BZMDRecommendCell');
var TBExposureManager = require('TBExposureManager')


var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ListView,
} = React;




var PropTypes = React.PropTypes;
var BZMDRecommendList = React.createClass({
  propTypes: {
    items: PropTypes.arrayOf(PropTypes.instanceOf(BZMUDealGridItem)).isRequired,
    pageName: PropTypes.string,
    pageId: PropTypes.string,
    analysisType: PropTypes.string,
    startAnalysisIndex: PropTypes.number,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    onScrollEndDrag: PropTypes.func,
  },

  containerViewResponderCapture(evt) {
    return this.props.tbNativeMoving;
  },

  componentWillMount: function() {
    var items = this._deepCloneObject(this.props.items);
    this.model = {
      items: items,
      pageName: this.props.pageName,
      pageId: this.props.pageId,
      analysisType: this.props.analysisType,
      startAnalysisIndex: this.props.startAnalysisIndex || 0
    };
  },

  render: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    dataSource = dataSource.cloneWithRows(this.model.items);

    return (
      <View style={styles.container}
        ref="containerView"
        onStartShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)}
        onMoveShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)} >
        <ListView
          dataSource={dataSource}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          renderRow={this.renderRow}
          renderHeader={this.props.renderHeader}
          renderFooter={this.props.renderFooter}
          onScrollEndDrag={this._onScrollViewEndDrag}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onChangeVisibleRows={this._onChangeVisibleRows}
        />
      </View>
    );
  },

  renderRow: function(item,sectionId,rowId) {

    var cells = [];
    for (var index in item.vos) {
      var deal = item.vos[index];
      var cell = <BZMDRecommendCell
        style={styles.rowItem}
        thumbnailStyle={styles.rowThumbnail}
        key={deal.id}
        onSelect={this._selectDeal.bind(this,deal,rowId,index)}
        deal={deal}
      />;
      cells.push(cell);
    }
    return (
      <View style={styles.row}>
        {cells}
      </View>
    );
  },

  _selectDeal: function(deal :BZMUDealVo, rowId :String, index:String) {
    //添加页面流转打点
    var pageName = this.model.pageName;
    var pageId = this.model.pageId;
    var analysisType = this.model.analysisType;
    if (pageName && pageId && analysisType) {
      var sortId = Number(rowId)*2+Number(index)+1+this.model.startAnalysisIndex;
      var modelVo = {
        analysisId: deal.id,
        analysisType: analysisType,
        analysisIndex: sortId,
        analysisSourceType: 2,
      };
      TBExposureManager.pushLogForPageName(pageName,pageId,0,modelVo);
    }

    //跳转
    var url = "zhe800://m.zhe800.com/mid/zdetail?zid="+deal.zid+"&dealid="+deal.id;
    TBFacade.forward(1, url);
  },

  _onChangeVisibleRows: function(visibleRows, changedRows) {
    for (var index in changedRows.s1) {
      var dealItem = this.model.items[index];
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

  _onScrollViewEndDrag: function(e){
    //曝光逻辑
    this._checkExposureItems();

    this.props.onScrollEndDrag && this.props.onScrollEndDrag(e);
  },

  _onMomentumScrollEnd: function(e) {
    //曝光逻辑
    this._checkExposureItems();
  },

  _checkExposureItems: function() {

    if (!this.model.pageId) {
      return;
    }

    console.log('开始曝光');

    // 进入曝光
    var pageName = this.model.pageName;
    var pageId = this.model.pageId;
    var analysisType = this.model.analysisType;

    if (!(pageName && pageId && analysisType)) {
        return;
    }
    for (var index in this.model.items) {
      if (this.model.items[index].appearTime===0) {
        continue;
      }
      var appearTime = this.model.items[index].appearTime;
      var disAppearTime = this.model.items[index].disAppearTime;
      var tt = disAppearTime - appearTime;

      if(tt > 1000 || tt<0) {
        //需要曝光的item
        var item = this.model.items[index];

        item.vos.forEach(function(value, i, array) {
          var sortId = index*2+i+1+this.model.startAnalysisIndex;

          var model = {
            analysisId: String(value.id),
            analysisType: analysisType,
            analysisIndex: sortId,
            analysisSourceType: '2',
          };
          TBExposureManager.exposureItems(model, Math.floor(appearTime/1000), pageId, pageName);
        }.bind(this));

        this.model.items[index].appearTime = 0;
        this.model.items[index].disAppearTime = 0;
      }
    }
  },

  _deepCloneObject: function(obj) {
    if (typeof obj != 'object' || obj == null) {return obj};
	var Constructor = obj.constructor;
    var newObj = new Constructor();
	for(var i in obj){
		newObj[i] = this._deepCloneObject(obj[i]);
	}
	return newObj;
  },

});

var paddingHorizontal = 8;
var middlePadding = 8;
var itemWidth = (screenWidth-(paddingHorizontal*2) - middlePadding) / 2;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: middlePadding,
    paddingHorizontal: paddingHorizontal,
    height: 265,
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
});



module.exports = BZMDRecommendList;
