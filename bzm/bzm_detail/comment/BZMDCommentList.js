/*
 * @providesModule BZMDCommentList
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var TBLoading = require('TBLoading');
var TBFacade = require('TBFacade');

var BZMUDealNavigationBar = require('BZMUDealNavigationBar');
var BZMDCommentHeadView = require('BZMDCommentHeadView');
var BZMDCommentCell = require('BZMDCommentCell');
var BZMDCommentItem = require('BZMDCommentItem');
var BZMCoreModel = require('BZMCoreModel');
var TBPageError = require('TBPageError');
var BZMCoreModel = require('BZMCoreModel');

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ListView,
} = React;

var API_URL = 'http://th5.m.zhe800.com/h5/api/getprodcommentlist'

var PropTypes = React.PropTypes;
var BZMDCommentList = React.createClass({
  propTypes: {
    zid: PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      error: undefined,
    };
  },

  componentWillMount: function() {
    this.model = {
      hasNext : true,
      loading : false,
      items : [],
      headItem: undefined,
      currentSelectIndex: 0,

      pageNumber : 1,
      pageSize : 20,
      previous_y : 0,
    };
  },

  componentDidMount: function() {
    this.fetchData(this.model.currentSelectIndex);
  },

  containerViewResponderCapture(evt) {
    return this.props.tbNativeMoving;
  },

  _listViewTipPress: function() {
    this.fetchData(this.model.currentSelectIndex);
  },

  render: function() {

    return (
      <View style={styles.container}
        ref="containerView"
        onStartShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)}
        onMoveShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)} >
        <BZMUDealNavigationBar title={'用户评价'} onBack={this._goBack} />
        <View ref='contentView' style={styles.flex_1}>
            <TBPageError
                style={this.state.error? styles.flex_1:styles.height_0}
                title={this.state.error? this.state.error.errorMessage:''}
                imagePath={this.state.error? this.state.error.imageUrl:''}
                onTap={this._listViewTipPress} />
            <View style={this.state.error? styles.height_0:styles.flex_1} >
                <ListView
                    dataSource={this.state.dataSource}
                    showsVerticalScrollIndicator={false}
                    renderHeader={this.renderHeader}
                    renderRow={this.renderRow}
                    onScrollBeginDrag={this._onScrollBeginDrag} />
            </View>
        </View>
      </View>
    );
  },

  renderHeader: function() {
    var item = this.model.headItem;
    if (!item) {
      return <View />;
    }
    return <BZMDCommentHeadView item={item} onSelectChange={this._onSelectChange} />;
  },

  renderRow: function(item) {
    return <BZMDCommentCell item={item}/>;
  },

  _onSelectChange: function(index) {
    this.model.currentSelectIndex = index;
    this._resetModel();
    this.fetchData(this.model.currentSelectIndex);
  },

  _resetModel: function() {
    this.model.hasNext = false;
    this.model.loading = false;
    this.model.items = [];
    this.model.pageNumber = 1;
    this.model.pageSize = 20;
    this.model.previous_y = 0;
  },

  fetchData: function(index) {

    if (!this.props.zid) {
      return;
    }

    var url = API_URL +'?productId='+this.props.zid+
      '&count='+this.model.pageSize+'&curPage='+this.model.pageNumber;

    // var url = API_URL +'?productId=ze150410161927000610'+ '&count='+this.model.pageSize+'&curPage='+this.model.pageNumber;

    switch (index) {
      case 0:
        var parameters = {
          image:0,
          queryType:0
        };
        break;
      case 1:
        var parameters = {
          image:1,
          queryType:0
        };
        break;
      case 2:
        var parameters = {
          image:0,
          queryType:3
        };
        break;
      default:
    }

    for (var key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        url += ('&'+key+'='+parameters[key]);
      }
    }

    // loadding框
    if (this.model.items.length == 0) {
      var listContainerView = this.refs['contentView'];
      var cTag = React.findNodeHandle(listContainerView);
      if (cTag) {
        TBLoading.hidePageLoading(cTag, {});
        TBLoading.pageLoading(cTag,{"x": 0,"y": 0,"width": screenWidth,"height": screenHeight-64});
      }
    }

    this.model.loading = true;
    fetch(url)
        .then((response) => {
            if(index !== this.model.currentSelectIndex) {
                return;
            }
            if (cTag) {
                TBLoading.hidePageLoading(cTag, {});
            }

            if (!response.ok) {
              var status = response.status;
              var tipObject = BZMCoreUtils.tipType(status)
              this.setState({
                error: tipObject,
              });
              return;
            }
            this.setState({
              error: undefined,
            });
            return response.json();
        })
        .catch((error) => {
            if(index !== this.model.currentSelectIndex) {
                return;
            }
            if (cTag) {
                TBLoading.hidePageLoading(cTag, {});
            }

            this.model.loading = false;
            var tipObject = {
              errorMessage : "当前处于无网络状态，请检查设置",
              imageUrl : 'bundle://message_network_not_reachable@2x.png'};
            this.setState({
              error: tipObject,
            });
        })
        .then((responseData) => {
            if (!responseData || responseData.result.code !== 0) {
                return;
            }

            this.model.loading = false;

            if (!responseData.commentInfoPaginate) {
                var tipObject = {
                  errorMessage : "暂无数据",
                  imageUrl : 'bundle://message_nodata@2x.png'};
                this.setState({
                  error: tipObject,
                });
                return;
            }

            this.model.hasNext = (responseData.commentInfoPaginate.page < responseData.commentInfoPaginate.pageCount);

            this.model.headItem = new BZMDCommentHeadView.Item(responseData.commentStatistics);
            var items = responseData.commentInfoPaginate.commentInfos.map((commentDict) => {
              return new BZMDCommentItem(commentDict);
            });
            this.model.items.push(...items);
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(this.model.items),
            });

        })
        .done();
  },

  _goBack: function() {
    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    TBFacade.goBack(cTag);
  },

  _onScrollBeginDrag: function(e) {
    var model = this.model;
    if (e.nativeEvent.contentOffset.y > model.previous_y) {
      model.previous_y = e.nativeEvent.contentOffset.y;
    } else {
      return;
    }

    if (!model.hasNext || model.loading) {
      // We're already fetching or have all the elements so noop
      return;
    }
    model.pageNumber += 1;
    this.fetchData(this.model.currentSelectIndex);
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6F6F6',
  },

  title: {
    fontSize: 13,
    marginTop: 2,
    marginHorizontal: 5,
    textAlign: 'center',
  },

  flex_1: {
    flex: 1,
  },

  height_0: {
    height: 0,
  },

});

// AppRegistry.registerComponent('BZMDCommentList', () => BZMDCommentList);
module.exports = BZMDCommentList;
