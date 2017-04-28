/*
 * @providesModule BZMDGoodRating
 * @flow
 */
'use strict';
var React = require('react-native');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS,
} = React;
var TBAlert = require('../../bzm_core/components/TBAlert');
var TBFacade = require('TBFacade');
var BZMDComment = require('BZMDComment');
var BZMDBlank = require('./BZMDBlank');
var BZMDMobileLog = require('BZMDMobileLog');

var COMMENTLIST_API = 'http://th5.m.zhe800.com/h5/comment/list?';

var GOODRATING_API_URL = 'http://th5.m.zhe800.com/h5/api/managecomment';
//http://th5.m.zhe800.com/h5/api/managecomment?productId=ze150128160412000001&isYph=1&categoryId=1351 subjectId
var BZMDGoodRating = React.createClass({
  getInitialState: function() {
    return {
      loaded:false,
      datas:null,
      totalNum:0,
      goodCommentRate:0
    };
  },
  componentDidMount: function() {
    this.fetchGoodRatingData();
  },

  fetchGoodRatingData: function() {

    var url = GOODRATING_API_URL +'?productId=' + this.props.datas.prod.productId +
              '&isYph=' + '1'+'&categoryId='+this.props.datas.prod.product.subjectId;
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .catch((error) => {

      })
      .then((responseData) => {
        if (responseData!=null && responseData.commentStatistics!=null) {
          console.log('!!!!请求成功');
          this.setState({
            loaded: true,
            datas: responseData,
            totalNum:responseData.commentStatistics.totalNum,
            goodCommentRate:responseData.commentStatistics.goodCommentRate
          });
        }

      })
      .done();

  },
  renderLoadingView: function () {

      return (
          <View />
      );
  },
  renderNoCommentView: function () {

    return(
      <View>
        <View style={styles.container}>
          <View style={styles.peopleNumberView}>
            <Text style={styles.noCommentTextStyle}>暂无评价</Text>
          </View>
        </View>
        <BZMDBlank />
      </View>
    );
  },
  pressedButton: function(){
    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    var isYph = '1';
    //1 不是优品汇，2是
    if (this.props.datas.dealrecord.isYph == 1) {
      isYph = '1';
    }else {
      isYph = '2';
    }
    var urlPath = COMMENTLIST_API + 'zid=' + this.props.datas.prod.productId
                  +'&is_Yph=' + isYph +'&promise_id='
                  + this.props.datas.deal.id;
    var encodeurl = encodeURI(urlPath);
    TBFacade.forward(cTag,encodeurl);

    //页面流转打点
    if (this.props.datas && this.props.datas.deal.id) {
        var dealId = this.props.datas.deal.id;
        var modelVo = {
            "analysisId": "viewall",
            "analysisType": 'evaluate',
            "analysisIndex": 1,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }
  },
  renderCommentView: function (){
    return(
      <View>
      <BZMDComment datas={this.state.datas}
                   mainDatas={this.props.datas}/>
      <BZMDBlank />
      </View>
    );

  },
  renderGoodRatingView: function () {
    return(
      <View ref="containerView">
      <TouchableHighlight onPress={() => this.pressedButton()}>
      <View style={[styles.container,styles.sbu_borderBottom]}>
          <View style={styles.peopleNumberView}>
            <Text style={styles.textStyle}>共{this.state.totalNum}人参与评分</Text>
          </View>
          <View style={styles.ratingView}>
            <Text style={styles.textStyle}>
                  {'好评率:  '}
                  <Text style={styles.textRedStyle}>
                         {this.state.goodCommentRate}%
                  </Text>
            </Text>
          </View>
      </View>
      </TouchableHighlight>
      <BZMDComment datas={this.state.datas}
                   mainDatas={this.props.datas}/>
      <BZMDBlank />
      </View>
    );
  },

    render: function(){
      var commentData = this.state.datas;
      if (!this.state.loaded) {
        return this.renderLoadingView();
      }else{
        if (commentData.commentStatistics == undefined||
            commentData.commentStatistics == null ||
            commentData.commentStatistics.countWithContent <= 0) {
            return this.renderNoCommentView();
        }else{
            if (this.state.totalNum>=20) {
              //总评论大于20 显示好评率
                return this.renderGoodRatingView();
            }else {
              //展示优质评价
                return this.renderCommentView();
            }
        }
      }

        return(
          <View />
        );
    }
});

var styles = StyleSheet.create({
  container: {
      height:43,
      backgroundColor:'white',
      flexDirection:'row',
      flex:1
  },
  noCommentTextStyle:{
    fontSize:14,
    color:'#27272F'
  },
  peopleNumberView:{
    flexDirection:'row',
    alignItems: 'center',
    marginLeft:10,
    flex:1
  },
  textStyle:{
    fontSize:13,
    color:'#27272F'
  },
  textRedStyle:{
    fontSize:13,
    color:'#E30C26'
  },
  ratingView:{
    flexDirection:'row',
    alignItems: 'center',
    marginRight:10,
    justifyContent:'flex-end',
    flex:1
  },
  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  }
});


module.exports = BZMDGoodRating;
