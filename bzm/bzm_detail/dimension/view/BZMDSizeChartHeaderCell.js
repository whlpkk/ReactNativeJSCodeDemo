/*
 * @providesModule BZMDSizeChartHeaderCell
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

var BZMDSizeChartHeaderCell = React.createClass({


  render: function() {
    // var item = this.props.deal;
    // console.log(item.sizeChartValue);
    var deal = this.props.deal;

    return (
      <View style={[styles.container,styles.sbu_borderRight]}>
        <View style={[styles.contentView,styles.sbu_borderBottom]}>
          <Text style={styles.sizeChartValueText}>{deal.sizeChartValue}</Text>

          </View>
      </View>
    );
  }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var cellWidth = 100;

var styles = StyleSheet.create({
  container:{
    alignItems:'center',
    justifyContent:'center',
    width:cellWidth,
    backgroundColor:'#F7F7F7'
  },
  contentView:{
    justifyContent:'center',
    alignItems:'center',
    height:32,
    width:cellWidth,
  },
  sizeChartValueText: {
      fontSize: 12,
      textAlign: 'center',
      color:'#27272F',
      alignItems:'center',
      justifyContent:'center',
    },

  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  },
  sbu_borderRight:{
    borderColor:'#d5d5d5',
    borderRightWidth:0.5
  }
});

module.exports = BZMDSizeChartHeaderCell;
