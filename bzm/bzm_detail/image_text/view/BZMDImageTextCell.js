/*
 * @providesModule BZMDImageTextCell
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreStyle = require('BZMCoreStyle');
var BZMUDealVo = require('BZMUDealVo');
var BZMUDealGridItem = require('BZMUDealGridItem');
var BZMDImageTextTipCell = require('BZMDImageTextTipCell');
var TBAnimation = require('TBAnimation');

var {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var IMAGE_BASE_URL = "http://z11.tuanimg.com";
var PropTypes = React.PropTypes;
var BZMDImageTextCell = React.createClass({
  propTypes: {
    // imageTextStr:PropTypes.string.isRequired
    cellType:PropTypes.string.isRequired, //iamge: 图片 text: 文字 recommendDeal: 为你推荐(宫格列表)
    imageIndexs:PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      height: 0,
      width:0,
      pictureHeight:0,
      first: true,
    };
  },

  onLoadImage: function(event) {
      if (event.nativeEvent.code == 0 &&
        this.state.pictureHeight !== event.nativeEvent.height &&
        this.state.first) {
          // console.log("width: "+e.nativeEvent.width+", height: "+e.nativeEvent.height);
          var picHeight = (screenWidth-BZMCoreStyle.RIGHT_ARROW_MARGIN*2)*event.nativeEvent.height/event.nativeEvent.width;
          this.setState({
            width: screenWidth-BZMCoreStyle.RIGHT_ARROW_MARGIN*2,
            height: picHeight,
            pictureHeight: event.nativeEvent.height,
            first: false,
          });
      }
  },
  onImageViewer: function(imageTagRef, pIndex) {
      var pView = this.refs[imageTagRef];
      var reactTag = React.findNodeHandle(pView);

      var items = [];
      var imageArry = this.props.imageArrays;
      for (var inx in imageArry) {
        imageArry[inx] = imageArry[inx].replace('.400x.','.700x.');
        var item = IMAGE_BASE_URL + imageArry[inx];

        if (imageArry[inx].substring(0,7)=='http://') {
            item = imageArry[inx];
        }

          items.push({title: "", image: item});
      }
      var index2 = parseInt(pIndex);
      TBAnimation.imageViewer(reactTag, items, index2);
  },
  render: function() {

    var imageTextStr = this.props.imageTextStr;
    if (imageTextStr.length <0 ||imageTextStr==null) {
      return(<View />);
    }
    switch (this.props.cellType) {
      case 'image':
        var imgRef = 'TBImage_' + this.props.imageIndexs;
        var imageUrl = IMAGE_BASE_URL + imageTextStr;
        if (imageTextStr.substring(0,7)=='http://') {
            imageUrl = imageTextStr;
        }

        var style = [styles.defaultStyle];
        if (this.state.height !== 0) {
          style=[];
          style.push({width:this.state.width,
                    height:this.state.height,
                    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
                    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
                    backgroundColor:'transparent'});
        }
        return(
           <TouchableHighlight
            onPress={this.onImageViewer.bind(this, imgRef, this.props.imageIndexs)}>
                          <View>
                          <TBImage style={style}
                                   onLoadImage={this.onLoadImage}
                                   urlPath= {imageUrl}
                                   ref={imgRef}
                                   defaultPath={'bundle://lockImg_default@2x.png'}/>
                          </View>
            </TouchableHighlight>
        );
        break;
      case 'text':
        return(
          <Text style={styles.textStyle}>
            {imageTextStr}
          </Text>
        );
        break;
      case '为你推荐':
      //为你推荐下方的宫格列表自带10像素空格，所以这里加了个<View style={styles.blankCell} />
          return(
            <View>
              <View style={styles.blankCell} />
              <BZMDImageTextTipCell tipStr={'为你推荐'} height={24}/>
            </View>
          );

        break;
      default:
        return null;
    }
  }
});


var styles = StyleSheet.create({
  textStyle:{
    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    fontSize:13,
    fontWeight:'bold'
  },
  blankCell:{
    height:10,
    backgroundColor:'#f6f6f6'
  },
  defaultStyle:{
    width:screenWidth - BZMCoreStyle.RIGHT_ARROW_MARGIN*2,
    height:screenWidth - BZMCoreStyle.RIGHT_ARROW_MARGIN*2,
    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    backgroundColor:'transparent'
  }
});

module.exports = BZMDImageTextCell;
