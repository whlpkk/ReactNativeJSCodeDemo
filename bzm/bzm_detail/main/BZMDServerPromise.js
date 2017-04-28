/*
 * @providesModule BZMDServerPromise
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
} = React;
var TBAlert = require('../../bzm_core/components/TBAlert');
var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var BZMDServerPromiseModel = require('BZMDServerPromiseModel');

var PropTypes = React.PropTypes;
var BZMDServerPromise = React.createClass({
  propTypes: {
    onPressedButton: PropTypes.func
  },

    render: function(){
      var serverPromiseModel = new BZMDServerPromiseModel(this.props.datas);
      var ret = serverPromiseModel.ret;
        return(
          <TouchableHighlight onPress={() =>this.props.onPressedButton()}>
          <View style={styles.container}>
              <View style={[styles.contentView,styles.sbu_borderBottom]}>
                {ret}

                <View style={styles.textView}>
                <TBImage style={styles.arrowsImage}
                         urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>
                </View>
              </View>
          </View>
          </TouchableHighlight>
        );
    }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

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

module.exports = BZMDServerPromise;
