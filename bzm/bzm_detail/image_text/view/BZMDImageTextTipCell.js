/*
 * @providesModule BZMDImageTextTipCell
 * @flow
 */
'use strict';

var React = require('react-native');
var BZMCoreStyle = require('BZMCoreStyle');

var {
  Image,
  StyleSheet,
  Text,
  View
} = React;

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var PropTypes = React.PropTypes;
var BZMDImageTextTipCell = React.createClass({
  propTypes: {
    tipStr:PropTypes.string.isRequired,
    height:PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      tipStr:'为你推荐',
      height:24
    };
  },
  render: function() {
    var containerStyle = [styles.recommendContainer];
    containerStyle.push({height:this.props.height});
        return(
          <View style={containerStyle}>
            <View style={styles.recommendView}>
              <View style={styles.lineCirclePointContainer}>
                <View style={styles.line} />
                <View style={styles.circlePointView} />
              </View>
              <Text style={styles.recommendTextStyle}>{this.props.tipStr}</Text>
              <View style={styles.lineCirclePointContainer}>
                <View style={styles.circlePointView} />
                <View style={styles.line} />
              </View>
            </View>
          </View>
        );
    }
});


var styles = StyleSheet.create({
  recommendContainer:{
    backgroundColor:'#f6f6f6'
  },
  recommendView:{
    flex:1,
    marginLeft:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    marginRight:BZMCoreStyle.RIGHT_ARROW_MARGIN,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',

  },
  lineCirclePointContainer:{
    flexDirection:'row',
    alignItems:'center',
  },
  line:{
    height:0.5,
    backgroundColor:'#d5d5d5',
    width:(screenWidth - 120 -BZMCoreStyle.RIGHT_ARROW_MARGIN*2)/2
  },
  circlePointView:{
    width:6,
    height:6,
    borderRadius:6/2,
    backgroundColor:'#d5d5d5'
  },
  recommendTextStyle:{
    fontSize:13,
    // color:'#d5d5d5'
  }
});

module.exports = BZMDImageTextTipCell;
