/*
 * @providesModule BZMDServerPromiseModel
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
} = React;

var BZMDServerPromiseModel = function(datas) {
  var ret = [];
  var supportNum = [];

  if ( datas.prod !=null &&  datas.prod.product!=null
      && datas.prod.product.sellerSendtime !=null) {
    //发货时间
    var sendOutTime =  datas.prod.product.sellerSendtime;
    if (sendOutTime <= 72) {
      sendOutTime = sendOutTime + '小时';
    }else {
      sendOutTime =parseInt(sendOutTime/24) + '天';
    }
    var sendOutTimeView = <View style={styles.textView} key={1}>
                    <TBImage style={styles.image}
                           urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_serverpromise.png")}/>

                  <Text style={styles.textStyle}>{sendOutTime}发货</Text>
                  </View>
      ret.push(sendOutTimeView);
      supportNum.push(1);
      this.sendOutTimeStr = sendOutTime;
  }

  if( datas.dealrecord.isLightAudit !=null &&  datas.dealrecord.isLightAudit != 1){
    //轻审核不支持人工质检
    //人工质检
    var checkView = <View style={styles.textView} key={2}>
                  <TBImage style={styles.image}
                           urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_serverpromise.png")}/>

                  <Text style={styles.textStyle}>人工质检</Text>
                  </View>
     ret.push(checkView);
     supportNum.push(2);
  }

  if ( datas.prod!=null &&  datas.prod.product != null
      &&  datas.prod.product.conditionalReturn!=null) {
      if ( datas.prod.product.conditionalReturn == 0) {//0支持 1不支持
        //8天包退
       var eightDayBackView  = <View style={styles.textView} key={3}>
                           <TBImage style={styles.image}
                                    urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_serverpromise.png")}/>
                             <Text style={styles.textStyle}>8天包退</Text>
                           </View>
           ret.push(eightDayBackView);
           supportNum.push(3);
         //运费补贴
       var primageView = <View style={styles.textView} key={4}>
                         <TBImage style={styles.image}
                                  urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_serverpromise.png")}/>
                           <Text style={styles.textStyle}>运费补贴</Text>
                         </View>
       ret.push(primageView);
       supportNum.push(4);
      }
  }

  //先行赔付
var payView = <View style={styles.textView} key={5}>
                  <TBImage style={styles.image}
                           urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_serverpromise.png")}/>
                    <Text style={styles.textStyle}>先行赔付</Text>
                  </View>
 ret.push(payView);
 supportNum.push(5);

 if (ret.length == 5) {
   ret.splice(4,1);
 }
this.ret = ret;
this.supportNumArray = supportNum;
};
var styles = StyleSheet.create({
  container: {
      height:36,
      backgroundColor:'#f6f6f6',
  },
  contentView:{
    flex:1,
    marginLeft:10,
    marginRight:10,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  textView:{
    flexDirection:'row',
    alignItems: 'center',
  },
  textStyle:{
    fontSize:11,
    color:'#525759'
  },
  image:{
    width:14,
    height:14,
    backgroundColor:'transparent'
  },
  arrowsImage:{
    width:8,
    height:14,
    backgroundColor:'transparent'
  },
  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  }
});

module.exports = BZMDServerPromiseModel;
