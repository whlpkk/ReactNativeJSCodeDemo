/*
 * @providesModule BZMDProductParameterCell
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var {
  Image,
  StyleSheet,
  Text,
  View
} = React;

var BZMDProductParameterCell = React.createClass({
  render: function() {
    var item = this.props.deal;
    return (
        <View style={[styles.container,styles.sbu_borderBottom]}>
          <View style={styles.propertiesNameView}>
            <Text numberOfLines={2} style={styles.propertiesNameText}>{item.propertiesName}</Text>
          </View>
          <View style={styles.propertiesValueView}>
            <Text numberOfLines={2} style={styles.propertiesValueText}>{item.propertiesValue}</Text>
          </View>

        </View>
    );
  }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var firstCellWidth = 100;

var styles = StyleSheet.create({

  container:{
    flexDirection:'row',
    backgroundColor:'#F7F7F7',
    justifyContent:'center',
    alignItems:'stretch',
    height:32
  },
  propertiesNameView:{
    width:firstCellWidth,
    alignItems:'center',
    justifyContent:'center'
  },
  propertiesValueView:{
    width:screenWidth - firstCellWidth,
    backgroundColor:'white',
    justifyContent:'center',
    // alignSelf:'auto'
  },
  propertiesNameText: {
      fontSize: 12,
      width:60,
      textAlign: 'center',
      color:'#27272F'
    },
  propertiesValueText: {
      fontSize: 12,
      marginLeft:10,
      color:'#27272F'
    },
  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  }
});

module.exports = BZMDProductParameterCell;
