/*
 * @providesModule BZMDMore
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

var PropTypes = React.PropTypes;
var BZMDMore = React.createClass({
  propTypes: {
    buttonTitle: PropTypes.string,
    onPress: PropTypes.func
  },
    render: function(){
        return(

        <View style={[styles.container,styles.sbu_borderBottom]}>
          <TouchableHighlight style={styles.touchAreaView} onPress={() =>this.props.onPress()}>
              <View style={styles.saunterStoreView}>
                <Text style={styles.saunterStoreText}>{this.props.buttonTitle}</Text>
              </View>
          </TouchableHighlight>

        </View>

        );
    }
});
// <View style={styles.rateView}>
//     <Text>满16减1元＊满22元减2元</Text>
// </View>

var touchAreaViewWidth = 110;
var touchAreaViewHeight = 31;
var styles = StyleSheet.create({
  container: {
      flex: 1,
      height:61,
      backgroundColor:'white',
      alignItems: 'center',
      justifyContent:'center'
  },
  saunterStoreView:{
    width:touchAreaViewWidth,
    height:touchAreaViewHeight,
    borderColor:'#EF4949',
    borderWidth:1,
    borderRadius:3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  touchAreaView:{
    width:touchAreaViewWidth,
    height:touchAreaViewHeight,
  },
  saunterStoreText:{
    color:'#EF4949',
    fontSize:13
  },
  rateView:{
    marginTop:14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateText:{
    color:'black',
    fontWeight:'bold',
    fontSize:15
  },
  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  }
});


module.exports = BZMDMore;
