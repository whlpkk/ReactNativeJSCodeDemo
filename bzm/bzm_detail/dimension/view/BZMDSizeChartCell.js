/*
 * @providesModule BZMDSizeChartCell
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

var BZMDSizeChartCell = React.createClass({
  getInitialState: function() {
    return {
      width: 0,
      first: true,
    };
  },

  renderCell: function(itemArray){
    var ret =[];


    for (var i = 0; i < itemArray.length; i++) {

      var style = [styles.contentView,styles.sbu_borderBottom];
      if (this.state.width !== 0) {
        style.push({width:this.state.width});
      }
      if (i==0) {
        style.push({backgroundColor:'#F7F7F7'});
      }
      var item = itemArray[i];
      var cell = <View style={style}
                        key={i}>
                  <Text  style={styles.sizeChartValueText}>{item.sizeChartValue}</Text>

              </View>
      ret.push(cell);
    }
    return ret;
  },
  onLayout: function(event) {
    // console.log(event.nativeEvent);
    if (this.state.width !== event.nativeEvent.layout.width && this.state.first) {
      this.setState({
        width:event.nativeEvent.layout.width+15,
        first: false,
      });
    }
  },

  render: function() {
    // var item = this.props.deal;
    // console.log(item.sizeChartValue);
    var itemArray = this.props.deal;
    if (itemArray.length <0 ||itemArray==null) {
      return(<View />);
    }
    return (
      <View style={[styles.container,styles.sbu_borderRight]} onLayout={this.onLayout}>
        {this.renderCell(itemArray)}
      </View>
    );
  }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  container:{
    alignItems:'stretch',
    justifyContent:'center'
  },
  contentView:{
    justifyContent:'center',
    alignItems:'center',
    height:32
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

module.exports = BZMDSizeChartCell;
