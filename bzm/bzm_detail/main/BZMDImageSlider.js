/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 /*
  * @providesModule BZMDImageSlider
  * @flow
  */
 'use strict';
 var React = require('react-native');
 var Swiper = require('react-native-swiper');
 var TBImage = require('TBImage');
 var TimerMixin = require('react-timer-mixin');
 var TBFacade = require('TBFacade');
 var TBAnimation = require('TBAnimation');
 var TBTip = require('TBTip');

 var {
   AppRegistry,
   Component,
   StyleSheet,
   Text,
   View,
   ScrollView,
   AlertIOS,
   TouchableHighlight
 } = React;

var IMAGE_URL = 'http://z11.tuanimg.com/imagev2/trade/';

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var slideHeight = screenWidth;

var Slider = React.createClass({
  _onScrollToLookDealDetail:function(){
    this.props.onScrollToLookDealDetail && this.props.onScrollToLookDealDetail();
    // this.refs.outerScrollView.scrollTo(1);
  },
   onScrollEndDrag:function(e, state){
     if (state.index == state.total-1) {
       if ((e.nativeEvent.contentOffset.x - state.offset.x) > 10) {
         this._onScrollToLookDealDetail();
       }
     }
   },

   onImageViewer: function(imageTagRef, pIndex,imageArry) {
       var pView = this.refs[imageTagRef];
       var reactTag = React.findNodeHandle(pView);


       var items = [];
       for (var inx in imageArry) {
           var imageUrl = imageArry[inx].replace('.400x','.700x');
           var item = imageUrl;
           items.push({title: "", image: item});
       }
       var index2 = parseInt(pIndex);
       //TBAnimation.imageViewer(reactTag, items, index2);
       TBAnimation.imageViewerMore(reactTag, items, index2, "滑动查看图文详情", "释放查看图文详情", (pIndex)=>{
          //  TBTip.show('查看图文详情提示index=: '+pIndex, 'success');
          this._onScrollToLookDealDetail();
       });
   },

   renderImageView:function(imageArry){

     var cells = [];
     for (var i = 0; i < imageArry.length; i++) {
       var imageUrl = imageArry[i]+'.webp';
       var imgRef = 'TBImage_' + i;
       var cell = <View key={i} style={styles.slide}>
                     <TouchableHighlight key={i}
                                         style={styles.slide}
                                         onPress={this.onImageViewer.bind(this, imgRef, i,imageArry)}>
                        <View style={styles.image}>
                        <TBImage style={styles.image}
                               urlPath= {imageUrl}
                               ref={imgRef}
                               defaultPath={'bundle://lockImg_default@2x.png'}
                               />
                               </View>
                      </TouchableHighlight>
              </View>
       cells.push(cell);
     }
     return (  <Swiper style={styles.wrapper}
                        showsButtons={false}
                         loop={false}
                         autoplay={false}
                         height={slideHeight}
                         showsPagination={true}
                         renderPagination={this.renderPagination}
                         bounces={true}
                         automaticallyAdjustContentInsets = {true}
                         onScrollEndDrag = {this.onScrollEndDrag}
                         ref = 'outerScrollView'
                         >{cells}</Swiper>);

   },
    render: function(){
      if (!this.props.datas) {

      }
      var imageArry = new Array();
      imageArry = this.props.datas.deal.imgList;
      imageArry = imageArry.filter( (element)=>{return element.length>0} );
      return this.renderImageView(imageArry);
  },

  slideToScanDealDetail: function(index, total) {
    return(
      <View>
      <View style={{
        position: 'absolute',
        bottom: 25,
        right: 5,
        width:20,
        height:200
      }}>
        <Text style={{color:'#27272f'}}>滑动查看图文详情</Text>
      </View>

      <View>
        <View style={styles.circleStyle} />
        <View style={styles.pageNumberStyle}>
        <Text style={styles.textStyle1}>
          <Text style={styles.textStyle2}>
            {index + 1}
          </Text>
            /{total}
          </Text>
        </View>
      </View>

      </View>
      )

    },
  renderPagination: function (index, total, context) {
        if (index == total-1) {
          return this.slideToScanDealDetail(index, total)
        }
        return (
          <View>
            <View style={styles.circleStyle} />
            <View style={styles.pageNumberStyle}>
            <Text style={styles.textStyle1}>
              <Text style={styles.textStyle2}>
                {index + 1}
              </Text>
                /{total}
              </Text>
            </View>
          </View>

        )
      }

});

var PropTypes = React.PropTypes;

 var BZMDImageSlider = React.createClass({
   propTypes: {
     onScrollToLookDealDetail: PropTypes.func
   },
   mixins: [TimerMixin],
   getInitialState: function() {
     return {
       days: 0,
       hours:0,
       minutes: 0,
       seconds: 0
     };
   },
   componentWillMount: function(){
     this.model = {
       items:[],
       hasNext: false,
     };
   },

   _onScrollToLookDealDetail: function(){
     this.props.onScrollToLookDealDetail && this.props.onScrollToLookDealDetail();
   },
   //比较时间
    comptime: function(paramTime) {

      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      var currentMonth = currentDate.getMonth()+1;//获取当前月份(0-11,0代表1月)真是坑，所以要＋1
      var currentDay = currentDate.getDate();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var seconds = currentDate.getSeconds();
      var currentHHmmssStr = hours + ':' + minutes + ':' + seconds;

      var paramTimesArray = paramTime.substring(0, 10).split('-');

      var currentTimes = currentMonth + '/' + currentDay + '/' + currentYear + ' ' + currentHHmmssStr;
      var paramTimes = paramTimesArray[1] + '/' + paramTimesArray[2] + '/' + paramTimesArray[0] + ' ' + paramTime.substring(10, 19);
      //比较天数
      var day = (Date.parse(paramTimes) - Date.parse(currentTimes)) /86400000;
      return day;
},
   renderTimeView: function(){
     //活动结束时间－当前时间 <= 15
     var day1 = this.comptime(this.props.datas.product.promotionEdt);
     //活动开始时间－当前时间 > 0
     var day2 = this.comptime(this.props.datas.product.promotionSdt);
     if (day1 <= 1500000 && day2 < 0) {
       this.setTimeout(this.getRTime,1000);
       return(
         <View style={styles.textView}>
           <Text style={styles.textStyle}>
           {'剩'+this.state.days+'天'+this.state.hours+'小时'+this.state.minutes+'分钟'+this.state.seconds+'秒'}
           </Text>
         </View>
       );
     }else {
       return(
         <View />
       );
     }
   },
   getRTime: function(){
     var EndTime= new Date('2016/02/25 10:00:00');
     var NowTime = new Date();
     var t =EndTime.getTime() - NowTime.getTime();

     var d=Math.floor(t/1000/60/60/24);
     var h=Math.floor(t/1000/60/60%24);
     var m=Math.floor(t/1000/60%60);
     var s=Math.floor(t/1000%60);

     this.setState({
       days: d,
       hours:h,
       minutes: m,
       seconds: s
     });
   },
     render: function(){
       var datas = this.props.datas;
         return(
           <View style={[styles.container,styles.sbu_borderBottom]}>

             <Slider datas={datas}
             onScrollToLookDealDetail={this._onScrollToLookDealDetail}/>


           </View>
         );
     }
 });


 var styles = StyleSheet.create({
     container: {
         flex: 1
     },
     wrapper: {
       backgroundColor:'#f6f6f6'
     },
     circleStyle:{
       position: 'absolute',
       bottom: 8,
       right: 10,
       backgroundColor:'black',
       width: 31,
       height:31,
       borderRadius:15.5,
       alignItems:'center',
       justifyContent:'center',
       opacity:0.3
     },
     pageNumberStyle:{
       position: 'absolute',
       bottom: 8,
       right: 10,
       width: 31,
       height:31,
       alignItems:'center',
       justifyContent:'center',
     },
     textStyle1:{
      color:'white',
      fontSize:10
     },
     textStyle2:{
       fontSize: 16,
     },
     slide: {
       flex: 1,
       justifyContent: 'center',
       backgroundColor: 'transparent',
     },
     textStyle: {
       color:'#FEFEFE',
       fontSize:11,
       left:10
     },
     textView:{
       position: 'absolute',
       bottom: 0,
       left:0,
       width:screenWidth,
       backgroundColor:'black',
       opacity:0.4
     },
     image: {
       flex: 1,
       backgroundColor:'transparent'
     },
     sbu_borderBottom:{
       borderColor:'#d5d5d5',
       borderBottomWidth:0.5
     },
     touch_img: {
         marginLeft: 10,
         width: 90,
         height: 60,
         backgroundColor: '#eeeeee'
     },
 });

module.exports = BZMDImageSlider;
