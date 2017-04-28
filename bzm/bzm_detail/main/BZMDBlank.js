/*
 * @providesModule BZMDBlank
 * @flow
 */
'use strict';
var React = require('react-native');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
} = React;

var BZMDBlank = React.createClass({
    render: function(){
        return(
          <View style={styles.container}></View>
        );
    }
});

var styles = StyleSheet.create({
  container: {
      height:10,
      backgroundColor:'#f6f6f6'
  }
});


module.exports = BZMDBlank;
