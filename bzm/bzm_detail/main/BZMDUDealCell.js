/*
 * @providesModule BZMDUDealCell
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    Text,
} = React;

var BZMDUDealCell = React.createClass({
    render: function(){
      //1不是优品汇 2是
      if (this.props.datas.dealrecord.isYph == 1) {
        return( <View />);
      }

        return(
          <View style={styles.container}>
            <View style={styles.viewStyle}>
            <TBImage style={styles.iconImage}
                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_udelcell_icon.png")}/>
              <Text style={styles.textStyle}>97%超高好评率</Text>
            </View>

          </View>
        );
    }
});

var styles = StyleSheet.create({
  container: {
      height:35,
      backgroundColor:'#f6f6f6',
      justifyContent:'center',
  },
  viewStyle:{
    marginLeft:10,
    flexDirection:'row',
    alignItems:'center'
  },
  iconImage:{
    width:69,
    height:23,
    backgroundColor:'transparent'
  },
  textStyle:{
    marginLeft:10,
    fontSize:12,
    color:'#545C66'
  }
});


module.exports = BZMDUDealCell;
