/*
 * @providesModule BZMDTimerView
 * @flow
 */
'use strict';
var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    Text
} = React;
//bzmd_timerview_icon
var time =0;
var BZMDTimerView = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      days: 0,
      hours:0,
      minutes: 0,
      seconds: 0,
      first:true,
      time:0
    };
  },

  componentDidMount: function() {
    // this.countTime();
  },
  //比较时间
   comptime: function(paramTime) {

     var paramTimesArray = paramTime.substring(0, 10).split('-');
     var currentTimesArray = this.props.nowTime.substring(0, 10).split('-');

     var currentTimes = currentTimesArray[1] + '/' + currentTimesArray[2] + '/' + currentTimesArray[0] + ' ' + this.props.nowTime.substring(10, 19);
     var paramTimes = paramTimesArray[1] + '/' + paramTimesArray[2] + '/' + paramTimesArray[0] + ' ' + paramTime.substring(10, 19);
     //比较天数
     var day = (Date.parse(paramTimes) - Date.parse(currentTimes)) /86400000;
     return day;
},
componentWillMount: function() {

  if (!this.props.endTime  || !this.props.beginTime || !this.props.nowTime) {

  }else {
    this.timer = this.setInterval(this._getRTime,1000);
  }

},
componentWillUnmount() {
  // 如果存在this.timer，则使用clearTimeout清空。
  // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
  this.timer && clearTimeout(this.timer);
},
_getRTime: function(){
  // 把 "2016-01-27 10:25:05" 替换成 "2016/01/27 10:25:05"

  if (this.state.first) {

    var time = this.props.endTime.replace(/-/g,'/');
    var EndTime= new Date(time);

    var time2 = this.props.nowTime.replace(/-/g,'/');
    var NowTime = new Date(time2);
    var t =EndTime.getTime() - NowTime.getTime();

    if (t <= 0) {
      this.clearInterval(this.timer);
      this.setState({
        time: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          time:0,
          first:false
        },
      });
      return;
    }
    var d=Math.floor(t/1000/60/60/24);
    var h=Math.floor(t/1000/60/60%24);
    var m=Math.floor(t/1000/60%60);
    var s=Math.floor(t/1000%60);

    this.setState({
      days: d,
      hours: h,
      minutes: m,
      seconds: s,
      time:t,
      first:false
    });
  }else {
    var t2 = this.state.time;

    if (t2 <= 0) {
      this.clearInterval(this.timer);
      this.setState({
        time: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          time:0,
          first:false
        },
      });
      return;
    }
    t2 = t2-1000;
    var d2=Math.floor(t2/1000/60/60/24);
    var h2=Math.floor(t2/1000/60/60%24);
    var m2=Math.floor(t2/1000/60%60);
    var s2=Math.floor(t2/1000%60);

    this.setState({
      days: d2,
      hours: h2,
      minutes: m2,
      seconds: s2,
      time:t2,
      first:false
    });

  }

},
componentWillReceiveProps: function(nextProps){
  if (this.props.endTime != nextProps.endTime &&this.props.beginTime != nextProps.beginTime &&
      this.props.nowTime != nextProps.nowTime) {

  }
},
  renderTimeView: function(){
    if (this.props.endTime=='' || this.props.endTime ==null
        ||this.props.beginTime=='' || this.props.beginTime==null
        ||this.props.nowTime=='' || this.props.nowTime==null) {
        return(
          <View />
        );
    }

    //活动结束时间－当前时间 <= 15
    var day1 = this.comptime(this.props.endTime);
    //活动开始时间－当前时间 > 0
    var day2 = this.comptime(this.props.beginTime);

    if (day1 <= 15 && day2 < 0) {
      return(
        <View style={styles.container}>
        <TBImage style={styles.opacityView}
                 urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_imageslider_blackbg.png")}/>

        <View style={styles.timeStyle}>
        <TBImage style={styles.iconImage}
                 urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_timerview_icon.png")}/>
          <Text style={styles.textStyle}>
          {'剩'+this.state.days+'天 '+this.state.hours+'小时 '+this.state.minutes+'分钟 '+this.state.seconds+'秒'}
          </Text>
        </View>
        </View>

      );
    }else {
      return(
        <View />
      );
    }
  },
  getRTime: function(){
    // 把 "2016-01-27 10:25:05" 替换成 "2016/01/27 10:25:05"

    if (this.state.first) {
      var time = this.props.endTime.replace(/-/g,'/');
      var EndTime= new Date(time);

      var time2 = this.props.nowTime.replace(/-/g,'/');
      var NowTime = new Date();
      var t =EndTime.getTime() - NowTime.getTime();

      var d=Math.floor(t/1000/60/60/24);
      var h=Math.floor(t/1000/60/60%24);
      var m=Math.floor(t/1000/60%60);
      var s=Math.floor(t/1000%60);

      this.setState({
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
        time:t,
        first:false
      });

      console.log('time first='+t);
      // console.log('秒＝'+s);
    }else {
      var t2 = this.state.time;

      t2 = t2-1000;
      var d2=Math.floor(t2/1000/60/60/24);
      var h2=Math.floor(t2/1000/60/60%24);
      var m2=Math.floor(t2/1000/60%60);
      var s2=Math.floor(t2/1000%60);

      console.log('time second='+t2);
      console.log('time 秒='+s2);
      this.setState({
        days: d2,
        hours: h2,
        minutes: m2,
        seconds: s2,
        time:t2,
        first:false
      });
      console.log('this.state.time ='+this.state.time);
    }

  },
    render: function(){
        return(
          <View>
            {this.renderTimeView()}
          </View>
        );
    }
});


var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
    textStyle: {
      color:'#FEFEFE',
      fontSize:11,
      marginLeft:7
    },
    container:{
      position: 'absolute',
      bottom: 0,
      left:0,
      width:screenWidth,
      backgroundColor:'transparent'
    },
    timeStyle:{
      position: 'absolute',
      bottom: 0,
      left:0,
      width:screenWidth,
      backgroundColor:'transparent',
      alignItems:'center',
      height:20,
      flexDirection:'row'
    },
    opacityView:{
      position: 'absolute',
      bottom: 0,
      left:0,
      width:screenWidth,
      height:20,
      backgroundColor:'transparent',
      opacity:0.6
    },
    iconImage:{
      width:14,
      height:14,
      marginLeft:10,
      backgroundColor:'transparent'
    },
});

module.exports = BZMDTimerView;
