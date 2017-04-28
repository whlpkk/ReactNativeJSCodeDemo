/*
 * @providesModule BZMDComment
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreUtils = require('BZMCoreUtils');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} = React;
var BZMDCommentItem = require('BZMDCommentItem');
var BZMDCommentCell = require('BZMDCommentCell');
var BZMDMore = require('BZMDMore');
var TBFacade = require('TBFacade');
var BZMDMobileLog = require('BZMDMobileLog');

var COMMENTLIST_API = 'http://th5.m.zhe800.com/h5/comment/list?';

// 'http://i0.tuanimg.com/cs/zhe800rapp/2405ad8f7d4c7838bf6d6a526bc2482a.BZMDCommentList.bundle'

var PropTypes = React.PropTypes;
var BZMDComment = React.createClass({
  propTypes: {
      mainDatas: PropTypes.object.isRequired,
      datas:PropTypes.object.isRequired
  },

  pressedButton: function(){

    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    // zid=ze150922174155000685&is_Yph=2&promise_id=1837268
    var isYph = '1';
    if (this.props.mainDatas.dealrecord.isYph == 2) {
      isYph = '2';
    }else {
      isYph = '1';
    }
    var urlPath = COMMENTLIST_API + 'zid=' + this.props.mainDatas.prod.productId
                  +'&is_Yph=' + isYph + '&promise_id='
                  + this.props.mainDatas.deal.id;
    var encodeurl = encodeURI(urlPath);
    TBFacade.forward(cTag,encodeurl);

    //页面流转打点
    if (this.props.mainDatas && this.props.mainDatas.deal.id) {
        var dealId = this.props.mainDatas.deal.id;
        var modelVo = {
            "analysisId": "viewall",
            "analysisType": 'evaluate',
            "analysisIndex": 1,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }
  },

    render: function(){
      var commentData = this.props.datas;
      if (commentData.commentInfo==null || commentData.commentInfo.length==0) {
        return(
          <TouchableHighlight ref="containerView" onPress={() => this.pressedButton()}>
          <View style={styles.container}>

              <View style={styles.noCommentView}>
                  <Text style={styles.noCommentTextStyle}>用户评价</Text>
                  <TBImage style={styles.arrowsImage}
                           urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>
              </View>
          </View>
          </TouchableHighlight>
        );
      }
      var item = new  BZMDCommentItem(commentData.commentInfo);

      return(
        <View ref="containerView">
        <BZMDCommentCell item={item} hiddenLine={true}/>
        <BZMDMore buttonTitle={'查看更多评价'}
        onPress={this.pressedButton}/>
        </View>
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
  noCommentView:{
    flexDirection:'row',
    alignItems: 'center',
    marginLeft:10,
    marginRight:10,
    flex:1,
    justifyContent:'space-between'
  },
  arrowsImage:{
    width:8,
    height:14,
    backgroundColor:'transparent'
  }
});


module.exports = BZMDComment;
