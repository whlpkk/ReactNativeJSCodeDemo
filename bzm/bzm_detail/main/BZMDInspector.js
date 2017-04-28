/*
 * @providesModule BZMDInspector
 * @flow
 */
'use strict';
var React = require('react-native');
var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} = React;
var TBImage = require('TBImage');
var BZMCoreUtils = require('BZMCoreUtils');
var TBFacade = require('TBFacade');
var TBAnimation = require('TBAnimation');
var BZMDBlank = require('BZMDBlank');
var BZMCoreUtils = require('BZMCoreUtils');
var TBTip = require('TBTip');
var imageWidth = 43;

var imagelist =[
      // "http://z11.tuanimg.com/imagev2/trade/800x800.c86c03b25120c964d71e6c952c1284b4.400x.jpg",
      // "http://z11.tuanimg.com/imagev2/trade/800x800.728e9d28e9ff42c463b73d3af47f74c3.400x.jpg",
      // "http://z11.tuanimg.com/imagev2/trade/800x800.ba5eab7b035247f99e48b693d8d859fc.400x.jpg",
      // "http://z11.tuanimg.com/imagev2/trade/800x800.061b97a4b58cade8e9b21d2b1e67ae84.400x.jpg",
      ];
var BZMDInspector = React.createClass({

  renderLoadingView: function () {

      return (
          <View />
      );
  },
  onImageViewer: function(imageTagRef, pIndex,imageArry) {
      var pView = this.refs[imageTagRef];
      var reactTag = React.findNodeHandle(pView);


      var items = [];
      for (var inx in imageArry) {
          var item = imageArry[inx];
          if (item.indexOf(".100x.")) {
            item = item.replace(".100x.",".700x.");
          }
          items.push({title: "", image: item});
      }
      var index2 = parseInt(pIndex);
      TBAnimation.imageViewer(reactTag, items, index2);
  },
  renderPictureView: function(){
    var ret = [];
    for (var i = 0; i < imagelist.length; i++) {
      var imageUrl = imagelist[i];
      var imgRef = 'TBImage_' + i;
      var cell =  <TouchableHighlight key={i}
                                  onPress={this.onImageViewer.bind(this, imgRef, i,imagelist)}>
                     <View style={styles.pictureStyle}>
                     <TBImage style={styles.pictureStyle}
                            urlPath= {imageUrl}
                            ref={imgRef}
                            defaultPath={'bundle://lockImg_default@2x.png'}/>
                            </View>
                   </TouchableHighlight>

      ret.push(cell);
    }
    return ret;
  },
    render: function(){

      var prodRuleData = this.props.prodRuleData;

      if (prodRuleData == null) {
        return this.renderLoadingView();
      }

      var inspectorData = BZMCoreUtils.jsonParse(prodRuleData["/h5/api/getreliablepicpath"]);
      if (inspectorData == null || inspectorData.result.code == -1) {
        return this.renderLoadingView();
      }
      if (inspectorData.reliablePics != null) {
        for (var j = 0; j < inspectorData.reliablePics.length; j++) {
          if (imagelist.length < 4) {
            var imageUrl = 'http://z4.tuanimg.com/imagev2/zhaoshang/' + inspectorData.reliablePics[j];

            if (imageUrl.indexOf(".jpg") != -1) {
              imageUrl = imageUrl.replace(".jpg",".100x.jpg") + '.webp';
            }else if (imageUrl.indexOf(".png") != -1) {
              imageUrl = imageUrl.replace(".png",".100x.png") + '.webp';
            }

            imagelist.push(imageUrl);
            // htmlstr += '<span><img src="' + $.zheui.protocol + '//z4.tuanimg.com/imagev2/zhaoshang/' + $.zheui.change_img_size(data.reliablePics[j], "100x") + '" /></span>';
          }
        }
      }


      var advantagesStr = '';
      var disadvantagesStr = '';
      if (this.props.datas && this.props.datas.dealrecord
          &&this.props.datas.dealrecord.editorGoodWord
          &&this.props.datas.dealrecord.editorBadWord) {

          advantagesStr = this.props.datas.dealrecord.editorGoodWord;
          disadvantagesStr = this.props.datas.dealrecord.editorBadWord;
      }
      // advantagesStr='就是好就好';
      // disadvantagesStr = '就是差就是差就是差就是就是差就是差就是差就是差就是差就是差就是差就是差就是差就是差就是差就是差就是差';
      if (advantagesStr=='' && disadvantagesStr=='') {
        var describeView = <Text style={[styles.contentTextStyle,{marginTop:imageWidth/2-7}]}>{inspectorData.recommendReason}</Text>
        var advantagesView = null;
        var disadvantagesView = null;
      }else {
        var advantagesView =  <Text style={styles.advantagesTextStyle}
                                    numberOfLines={3}>
                                {'优点：'}
                                <Text style={styles.contentTextStyle}>
                                      {advantagesStr}
                                </Text>
                              </Text>

        var disadvantagesView =  <Text style={styles.weakTextStyle}
                                        numberOfLines={3}>
                                {'小贴士：'}
                                <Text style={styles.contentTextStyle}>
                                      {disadvantagesStr}
                                </Text>
                              </Text>
        var describeView = null;
      }

      var pictureView = null;
      if (imagelist && imagelist.length) {
      var pictureView =  <View style={styles.pictureContainer}>
                            <View style={styles.pictureSubContainer}>
                                {this.renderPictureView()}
                            </View>
                         </View>
      }
        return(
          <View>
          <View style={styles.sbu_borderBottom}>
            <View style={styles.container}>
                <View style={styles.subContainer}>

                  <View style={styles.facePictureView}>
                    <TBImage style={styles.faceImage}
                             urlPath={inspectorData.headpic.image}
                             clipsToBounds={true}/>
                   <Text style={styles.nickNameTextStyle}>{inspectorData.headpic.name}</Text>
                  </View>

                  <View style={styles.textView}>
                    {advantagesView}
                    {disadvantagesView}
                    {describeView}
                  </View>
                </View>
                <TBImage style={styles.iconImageStyle}
                         urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_inspector_icon.png")}/>
            </View>
            {pictureView}
          </View>
          <BZMDBlank />
          </View>
        );
    }
});

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;


var leftMargin = 9;
var rightMargin = 9;
var topMargin = 15;

var styles = StyleSheet.create({
  container: {
      flex: 1,
      // height:89,
      flexDirection:'row',
      backgroundColor:'white',
      justifyContent:'center'
  },
  subContainer:{
    flex:1,
    marginLeft:leftMargin,
    marginTop:topMargin,
    marginRight:rightMargin,
    marginBottom:topMargin,
    flexDirection:'row'
  },
  facePictureView:{
    width:imageWidth
  },
  textView:{
    marginLeft:6,
    marginRight:16,
    width: screenWidth - leftMargin*2 - imageWidth - 6 -16,
    justifyContent:'space-between'
  },

  faceImage:{
    width:imageWidth,
    height:imageWidth,
    borderRadius:imageWidth/2,
    backgroundColor:'transparent'
  },
  nickNameTextStyle:{
    color:'#9D9D9D',
    fontSize:10,
    marginTop:5,
    textAlign:'center'
  },

  advantagesTextStyle:{
    color:'#EF4949',
    fontSize:14
  },
  contentTextStyle:{
    color:'#666666',
    fontSize:14
  },

  weakTextStyle:{
    color:'#EF4949',
    fontSize:14,
    marginTop:10
  },

  pictureContainer:{
    height:87
  },
  pictureSubContainer:{
    height:71,
    marginLeft:(screenWidth-71*4)/5,
    marginRight:(screenWidth-71*4)/5,
    marginBottom:16,
    justifyContent:'space-between',
    flexDirection:'row'
  },
  pictureStyle:{
    width:71,
    height:71,
    backgroundColor:'transparent'
  },
  iconImageStyle:{
    width:50,
    height:42,
    position:'absolute',
    right:0,
    top:0,
    backgroundColor:'transparent'
  },
  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  }

});

module.exports = BZMDInspector;
