/*
 * @providesModule BZMDScrollToLookMoreTip
 * @flow
 */
'use strict';
var React = require('react-native');
var BZMCoreStyle = require('BZMCoreStyle');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    Text
} = React;

var PropTypes = React.PropTypes;
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var BZMDScrollToLookMoreTip = React.createClass({
    render: function(){
      return(
        <View style={styles.container}>
            <View style={styles.contentView}>
              <View style={styles.line} />
              <Text style={styles.textStyle}>继续拖动，查看图文详情</Text>
              <View style={styles.line} />
            </View>
        </View>
      );
    }
})

var styles = StyleSheet.create({
  container: {
      height:44,
      backgroundColor:'#f6f6f6'
  },
  contentView:{
    flex:1,
    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',

  },
  line:{
    height:0.5,
    backgroundColor:'#d5d5d5',
    width:(screenWidth - 180 -BZMCoreStyle.RIGHT_ARROW_MARGIN*2)/2
  },
  textStyle:{
    fontSize:13
  }
});


module.exports = BZMDScrollToLookMoreTip;
