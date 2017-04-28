/*
 * @providesModule BZMDCommentCell
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var BZMDCommentItem = require('BZMDCommentItem');
var BZMCoreUtils = require('BZMCoreUtils');


var {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
} = React;

var PropTypes = React.PropTypes;
var BZMDCommentCell = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(BZMDCommentItem).isRequired,
    thumbnailOnPress: PropTypes.func,
    hiddenLine: PropTypes.bool,
  },

  render: function() {
    var item = this.props.item;

    //处理评论等级
    switch (item.level) {
      case 3:
        var levelText = '好评';
        var levelIcon = BZMCoreUtils.baseICONPath()+'/bzm_detail/bzmd_comment_good.png';
        var textColor = '#ed7170';
        var applyText = '[商家回复]';
        break;
      case 2:
        var levelText = '中评';
        var levelIcon = BZMCoreUtils.baseICONPath()+'/bzm_detail/bzmd_comment_middle.png';
        var textColor = '#f5c04f';
        var applyText = '[商家解释]';
        break;
      case 1:
        var levelText = '差评';
        var levelIcon = BZMCoreUtils.baseICONPath()+'/bzm_detail/bzmd_comment_negative.png';
        var textColor = '#c6c6c6';
        var applyText = '[商家解释]';
        break;
      default:
    }
    //处理日期字符串
    var str = item.createTime.replace(/-/g,"/");
    var date = new Date(str);

    //处理sku描述字符串
    var skuDesc = item.skuDesc;
    if(skuDesc.indexOf("<br/>")>0){
      var skuDesc_arr = skuDesc.split("<br/>");
    }else{
      var skuDesc_arr = skuDesc.split("<br>");
    }
    skuDesc = skuDesc_arr.join('  ');
    if (skuDesc) {
      var skuView = <Text style={styles.skuDesc} numberOfLines={1} >{skuDesc}</Text>
    }

    // firstEvidence
    if (item.firstEvidence != undefined &&item.firstEvidence.length>0) {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var urlList = item.firstEvidence.split(",");
      var imageListView = <ListView
        style = {styles.imageList}
        alwaysBounceHorizontal = {false}
        showsHorizontalScrollIndicator = {false}
        horizontal = {true}
        dataSource = {ds.cloneWithRows(urlList)}
        renderRow={this.renderThumbnail}
      />
    }
    if (item.appendEvidence != undefined && item.appendEvidence.length>0) {
      var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var urlList2 = item.appendEvidence.split(",");
      var imageListView2 = <ListView
        style = {styles.imageList}
        alwaysBounceHorizontal = {false}
        showsHorizontalScrollIndicator = {false}
        horizontal = {true}
        dataSource = {ds2.cloneWithRows(urlList2)}
        renderRow={this.renderThumbnail}
      />
    }

    if (item.commentReplyContent != undefined &&item.commentReplyContent.length>0) {
      var commentReplyStr = applyText+item.commentReplyContent;
      var commentReplyView = <Text style={styles.comment} >{commentReplyStr}</Text>
    }
    if (item.appendReplyContent != undefined &&item.appendReplyContent.length>0) {
      var appendReplyStr = applyText+item.appendReplyContent;
      var appendReplyView = <Text style={styles.comment} >{appendReplyStr}</Text>
    }

    if (item.append != undefined && item.append.length>0) {
      var dates = this._dateDiff(item.createTime,item.completeTime);
      if (dates === 0) {
        var appendStr = '[当天追加]'+item.append;
      }else {
        var appendStr = '[' +dates+ '天后追加]'+item.append;
      }
      var appendView = <Text style={styles.comment} >{appendStr}</Text>
    }

    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TBImage style={styles.iconImage} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_detail/bzmd_comment_icon.png'} />
          <Text style={styles.phoneNumber}>{item.userNickname}</Text>
          <Text style={styles.date}>{date.Format("yyyy.MM.dd")}</Text>
          <View style={styles.levelContainer}>
            <TBImage style={styles.levelIcon} urlPath={levelIcon} />
            <Text style={[styles.levelText,{color:textColor}]}>{levelText}</Text>
          </View>
        </View>
        <Text style={styles.comment}>{item.content||'好评'}</Text>
        {skuView}
        {imageListView}
        {commentReplyView}
        {appendView}
        {imageListView2}
        {appendReplyView}
        {this.props.hiddenLine? <View />: <View style={styles.bottomLine}/>}
      </View>
    );
  },

  renderThumbnail: function(url,sectionId,rowId) {
    var thumbnail_arr = url.split(".");
    if (thumbnail_arr.length>1) {
      thumbnail_arr.splice(-1,0,'100x');
    }
    var thumbnailUrl = thumbnail_arr.join('.');

    return (
      <TouchableHighlight
        style={[styles.thumbnail,{marginRight:10}]}
        underlayColor={'transparent'}
        activeOpacity={1}
        onPress={this._thumbnailOnPress.bind(this,rowId)}>
        <View>
          <TBImage style={styles.thumbnail} urlPath={'http://z11.tuanimg.com/imagev2/trade/'+thumbnailUrl}/>
        </View>
      </TouchableHighlight>
    );
  },

  _thumbnailOnPress: function(rowId) {
    this.props.thumbnailOnPress && this.props.thumbnailOnPress();
  },

  _dateDiff: function(dateStr1,dateStr2) :Number {
    var date1 = this._getShortDate(dateStr1);
    var date2 = this._getShortDate(dateStr2);

    var startTime = date1.getTime();
    var endTime = date2.getTime();

    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
    return  dates;
  },

  _getShortDate: function(dateStr) :Date {
    var str = dateStr.replace(/-/g,"/");
    var date1 = new Date(str);
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    return date1;
  },

});

var styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    overflow: 'hidden',
  },

  header: {
    height: 35,
    marginHorizontal: 10,
    flexDirection:'row',
    alignItems: 'center',
    marginTop: 5,
    // borderWidth: 1,
  },

  iconImage:{
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },

  phoneNumber:{
    marginLeft: 10,
    fontSize: 12,
  },

  date:{
    marginLeft: 10,
    fontSize: 10,
    color: 'gray',
  },

  levelContainer: {
    height: 25,
    flex :1,
    flexDirection:'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  levelIcon: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
    marginRight: 3,
  },

  levelText: {
    fontSize: 12,
  },

  comment:{
    fontSize: 12,
    color: '#454545',
    lineHeight: 18,
    marginLeft: 40,
    marginRight: 10,
    marginBottom: 10,
  },

  skuDesc: {
    fontSize: 10,
    color: 'gray',
    marginLeft: 40,
    marginRight: 10,
    marginBottom: 10,
  },

  imageList: {
    marginLeft: 40,
    marginRight: 10,
    marginBottom: 10,
  },

  thumbnail: {
    width: 90,
    height: 90,
    backgroundColor: 'transparent',
  },

  bottomLine: {
    backgroundColor: '#ebebeb',
    height:1,
    marginLeft:10,
    marginTop:5,
  },

});




module.exports = BZMDCommentCell;
