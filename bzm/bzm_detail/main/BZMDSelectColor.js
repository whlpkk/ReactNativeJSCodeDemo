/*
 * @providesModule BZMDSelectColor
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
    TouchableHighlight,
    AlertIOS,
    Image,
} = React;
var TBAlert = require('../../bzm_core/components/TBAlert');
var TBImage = require('TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var skuText = '';

var BZMDSelectColor = React.createClass({

    onPressSKU: function() {
        if (this.props.onPressSKU) {
            this.props.onPressSKU(skuText);
        }
    },
    render: function(){

    var arrows =  <View style={styles.arrowsView}>
                  <TBImage style={styles.arrowsImage}
                           urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>
                  </View>
    if (this.props.skuText == undefined || this.props.skuText =='加载商品属性失败') {
      arrows = <View />
      skuText = '加载商品属性失败';
    }else {
      skuText = this.props.skuText;
    }

        return(
          <TouchableHighlight onPress={this.onPressSKU}>
          <View style={[styles.container,styles.sbu_borderBottom]}>
              <View style={styles.textView}>
                <Text style={styles.textStyle}>{skuText}</Text>
              </View>

              {arrows}

          </View>
          </TouchableHighlight>
        );
    }
});

var styles = StyleSheet.create({
  container: {
      flex: 1,
      height:44,
      backgroundColor:'white',
      flexDirection:'row',
      justifyContent:'space-between'
  },
  textView:{
    justifyContent:'center',
    alignItems: 'center',
    marginLeft:10
  },
  textStyle:{
    fontSize:14,
    color:'#27272F'
  },
  arrowsView:{
    alignItems: 'center',
    marginRight:10,
    justifyContent:'center'
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


module.exports = BZMDSelectColor;
