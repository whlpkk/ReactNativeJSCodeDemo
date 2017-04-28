/*
 * @providesModule BZMDImageText
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreStyle = require('BZMCoreStyle');
var BZMDImageTextCell = require('BZMDImageTextCell');
var BZMDRecommendList = require('BZMDRecommendList');
var BZMDImageTextTipCell = require('BZMDImageTextTipCell');
var BZMDServerPromiseModel = require('BZMDServerPromiseModel');
var BZMCoreUtils = require('BZMCoreUtils');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    ScrollView,
    ListView,
    Text
} = React;

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;


var BZMDFLAG = "@#ReacT-NaTivE-Tuan800-BZMDdetail#@";
var IMAGE_TEXT_ARRAY = [];
var imageIndex = 0;
var imageArray = [];
var PROMISE_TEXT = '郑重承诺:该商品由折800与中国人保(PICC)联合承保';

var PropTypes = React.PropTypes;
var BZMDImageText = React.createClass({
  propTypes: {
    onScrollToOrigin: PropTypes.func,
    datas:PropTypes.object.isRequired,
    shopNoticeStr:PropTypes.string
  },

  getDefaultProps: function() {
    return {
      datas:[],
      shopNoticeStr:''
    };
  },

  componentWillMount: function(){
    // var str = "\u003cp\u003e\u003cspan style=\"font-size: 36pt;\"\u003e由于春节临近，快递公司放假通知，2016年1月27号开始只接单，不发货，拍下的订单全部默认春节后2月15号（正月初八）发出，如有不便尽请谅解！！ 放假期间有什么问题请先留言，我们上班后会第一时间给亲们回复的哦！\u003c/span\u003e\u003c/p\u003e \n\u003cp\u003e\u003cimg id=\"790x892.f1f505df9d37a64e129f9a01cb26ef88.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x892.f1f505df9d37a64e129f9a01cb26ef88.jpg\"\u003e\u003cimg id=\"790x1064.ebe9d8a3127ae05ab4a027fe0f1ce484.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x1064.ebe9d8a3127ae05ab4a027fe0f1ce484.jpg\"\u003e\u003cimg id=\"790x866.f0aa227ec0f21001897d56708b9149a5.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x866.f0aa227ec0f21001897d56708b9149a5.jpg\"\u003e\u003cimg id=\"790x1040.e9eea6c0696f48aa4c18305c95e31591.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x1040.e9eea6c0696f48aa4c18305c95e31591.jpg\"\u003e\u003cimg id=\"790x935.c8091c5dd5484386879ff56e457b9104.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x935.c8091c5dd5484386879ff56e457b9104.jpg\"\u003e\u003cimg id=\"790x1841.4ae29cfcc5d405d5ba39129c58499a64.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x1841.4ae29cfcc5d405d5ba39129c58499a64.jpg\"\u003e\u003cimg id=\"790x2447.250c79144902d2fe174b52012d60f65d.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x2447.250c79144902d2fe174b52012d60f65d.jpg\"\u003e\u003cimg id=\"790x1672.7db76745b8a5fd69410982eca01429dc.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x1672.7db76745b8a5fd69410982eca01429dc.jpg\"\u003e\u003cimg id=\"790x1943.39177946423a5b65cd78bdfa0ac009bf.jpg\" src=\"http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png\" alt=\"\" data-url=\"/imagev2/trade/790x1943.39177946423a5b65cd78bdfa0ac009bf.jpg\"\u003e\u003c/p\u003e";
    var str = '';
    if (this.props.datas.deal!=null && this.props.datas.deal.desc!=null) {
      str = this.props.datas.deal.desc;
    }
    if (str === '') {
      return;
    }
    // console.log(str);
    //去掉占位符
    var deletBbspRegx = /&nbsp;/gm;
    str = str.replace(deletBbspRegx,"");
    //去换行
    var deletBreakRegx = /\n/gm;
    str = str.replace(deletBreakRegx,"");
    //去掉所有空格
    var deletBlankRegx = /( )/g;
    str = str.replace(deletBlankRegx,"");


    var replaceRegxRule = BZMDFLAG + "$1" +BZMDFLAG;
    //替换<img id="790x1064.ebe9d8a3127ae05ab4a027fe0f1ce484.jpg"
    // src="http://i0.tuanimg.com/ms/zhe800m/dist/img/img_placehd2.png"
    // alt="" data-url="/imagev2/trade/790x1064.ebe9d8a3127ae05ab4a027fe0f1ce484.jpg">
    // 成 /imagev2/trade/790x1064.ebe9d8a3127ae05ab4a027fe0f1ce484.jpg
    var replacedStr = str.replace(/<img[^>]+?data-url="([^>]+?)"\s*>/g,replaceRegxRule);
    //去除<>这些html标签
    var deletHtmlRegx=/<[^>]*>|<\/[^>]*>/gm;
    var resultStr=replacedStr.replace(deletHtmlRegx,"");

    IMAGE_TEXT_ARRAY = resultStr.split(BZMDFLAG);

    for(var i = 0 ;i<IMAGE_TEXT_ARRAY.length;i++){
       if(IMAGE_TEXT_ARRAY[i] == "" || typeof(IMAGE_TEXT_ARRAY[i]) == "undefined"
        ||IMAGE_TEXT_ARRAY[i] == " " ){
          IMAGE_TEXT_ARRAY.splice(i,1);
          i= i-1;
       }
   }
  //  console.log(IMAGE_TEXT_ARRAY);
    this.getImageArray(IMAGE_TEXT_ARRAY);
  },
  getImageArray: function(array){
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    for (var i = 0; i < array.length; i++) {
    　if(!reg.test(array[i])){
        if (array[i].indexOf(".jpg") != -1) {
          array[i] = array[i].replace(".jpg",".400x.jpg") + '.webp';
        }else if (array[i].indexOf(".png") != -1) {
          array[i] = array[i].replace(".png",".400x.png") + '.webp';
        }
        imageArray.push(array[i]);//没找中文字符，认为是图片
      }
    }
    // console.log(IMAGE_TEXT_ARRAY);
    // console.log(imageArray);
  },
  _onScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    if (offset < -60) {
      this.props.onScrollToOrigin && this.props.onScrollToOrigin();
    }
  },
  renderRow:function(imageTextStr){
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    var type = 'image';
    //<div style="color: white;">........ </div>
  　if(!reg.test(imageTextStr)
      && (imageTextStr.substring(0,7)=='http://' || imageTextStr.substring(0,6) == '/image')){
      type='image';
    }else {
      if (imageTextStr == '为你推荐') {
        type = '为你推荐';
      }else {
        type='text';
      }
    }

    for (var i = 0; i < imageArray.length; i++) {
      if (imageArray[i] === imageTextStr) {
        imageIndex = i;
      }
    }

    return(
      <BZMDImageTextCell imageTextStr={imageTextStr}
                          cellType={type}
                          imageIndexs={imageIndex}
                          imageArrays={imageArray}/>
    );
},
  _ScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    if (offset < -60) {
      this.props.onScrollToOrigin && this.props.onScrollToOrigin();
    }
  },
  renderListHeader: function(){
    var serverPromiseModel = new BZMDServerPromiseModel(this.props.datas);
    var timeStr = serverPromiseModel.sendOutTimeStr;
    var sendOutTimeDescribeStr ='';
    var datas = null;
    if (this.props.datas!=null) {
      datas = this.props.datas;
    }
    if (datas !=null && datas.prod !=null
      && datas.prod.product != null && datas.prod.product.deliverDesc!=null) {
      sendOutTimeDescribeStr = datas.prod.product.deliverDesc;
      sendOutTimeDescribeStr = sendOutTimeDescribeStr.replace(/[\r\n]/g,"");
    }
    var shopNoticeCell = null;//店铺公告
    var shopNoticeStr = this.props.shopNoticeStr;
    if (shopNoticeStr && shopNoticeStr!='') {
        shopNoticeCell = <View style={styles.shopNoticeView}>
                            <Text style={[styles.shopNitceText,{fontWeight:'bold'}]} letterSpacing={100}>
                              店铺公告：
                              <Text style={[styles.shopNitceText,{fontWeight:'normal'}]} letterSpacing={100}>
                                {shopNoticeStr}
                              </Text>
                            </Text>
                          </View>;
    }

    var sendOutTimeCell = null;//发货说明
    if (timeStr!=null && timeStr!=''
        && sendOutTimeDescribeStr!=null && sendOutTimeDescribeStr !='') {
      sendOutTimeCell = <Text style={styles.sendOutTimeViewContainer}>

                            <Text style={styles.sendOutTimeText}>
                              {" "}{timeStr}发货{" "}
                            </Text>

                            <Text style={styles.sendOutTimeDescribeText}>
                              {" "}{sendOutTimeDescribeStr}
                            </Text>
                        </Text>;
    }

    var promiseCell = null;//联合承保
    var subject_id = 54444944;
    if (datas !=null && datas.prod !=null && datas.prod.product != null
        && datas.prod.product.subjectId!=null) {
      subject_id = datas.prod.product.subjectId;
    }
    //除喂养用品、净水器、安全防护、卫浴五金四个三级分类的商品外，其余商品发货说明下方显示picc承保文案
    if (subject_id == 1806 || subject_id == 1809
      || subject_id == 1467 || subject_id == 1542){
        promiseCell =null;
      }else {
        promiseCell = <View style={styles.promiseContainer}>
                        <TBImage style={styles.promiseImage}
                                urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_imagetext_promise.png")}/>
                        <Text style={styles.promiseText}>
                          {PROMISE_TEXT}
                        </Text>
                      </View>
      }

    //店铺公告 ＋ 发货说明 ＋ 联合承保
    return(
      <View style={styles.headerView}>
        {shopNoticeCell}
        {sendOutTimeCell}
        {promiseCell}
      </View>
    );
  },
  renderRecommendListFooter: function(){
    return(
      <BZMDImageTextTipCell tipStr={'已经看到最后了'} height={44}/>
    );
  },
  renderRecommendListHeader: function(){
    var dataSource = new ListView.DataSource({
      rowHasChanged:(row1,row2)=>row1 !== row2,
    });

    if (this.props.items && this.props.items.length>0
        && IMAGE_TEXT_ARRAY.indexOf('为你推荐') == -1) {
      IMAGE_TEXT_ARRAY.push('为你推荐');
    }

    // console.log('!!!!'+IMAGE_TEXT_ARRAY);
    dataSource = dataSource.cloneWithRows(IMAGE_TEXT_ARRAY);
    return(
          <ListView
                  dataSource={dataSource}
                  renderHeader={this.renderListHeader}
                  renderRow={this.renderRow}
                  onScrollEndDrag={this._ScrollViewEndDrag}
          />
    );
  },
  render: function(){
    var dealId = this.props.datas.deal.id;

    var index = 0;
    if (!this.props.recommendDealData) {
      index = 0;
    }else {
      var recommendDealData = BZMCoreUtils.jsonParse(this.props.recommendDealData["/h5/api/getshopdealsfordetail"]);
      if (!recommendDealData || recommendDealData.response.docs==undefined ||
        recommendDealData.response.docs.length < 5  ) {
          index = 0;
      }else {
        index = 3;
      }
    }

    //适配曝光逻辑，改成主cell 为BZMDRecommendList
    return(
      <View style={styles.container}>
        <BZMDRecommendList
          onScrollEndDrag = {this._ScrollViewEndDrag}
          pageId = {"detai_"+String(dealId)}
          pageName = "detai"
          analysisType = "deallist_button"
          startAnalysisIndex = {index}
          items = {this.props.items}
          renderHeader = {this.renderRecommendListHeader}
          renderFooter = {this.renderRecommendListFooter}/>
      </View>
    );

  }
});

var styles = StyleSheet.create({
  container: {
      height:screenHeight - 51 - 44-64,
  },
  headerView:{

  },
  //店铺公告
  shopNoticeView:{
    backgroundColor:'#f6f6f6',
    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginTop:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    paddingBottom:5
  },
  shopNitceText:{
    marginTop:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    color:'#ff9333',
    fontSize:13,
    textAlign:'left'
  },

  //发货时间
  sendOutTimeViewContainer:{
    alignItems:'center',
    backgroundColor:'#f6f6f6',
    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    paddingBottom:10
  },

  sendOutTimeText:{
    textAlign:'center',
    fontSize:11,
    color:'white',
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:'#3eea03',
  },
  sendOutTimeDescribeText:{
    marginLeft:5,
    fontSize:13,
    color:'#27272f',
  },

  //郑重承若
  promiseContainer:{
    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginTop:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginBottom:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    flexDirection:'row',
    backgroundColor:'#ffaaaa',
    alignItems:'center'
  },
  promiseImage:{
    marginLeft:5,
    width:17,
    height:17,
    backgroundColor:'transparent'
  },
  promiseText:{
    color:'white',
    fontSize:13,
    marginLeft:5,
    marginTop:5,
    marginRight:5,
    marginBottom:5,
    flex:1
  },

});

module.exports = BZMDImageText;
