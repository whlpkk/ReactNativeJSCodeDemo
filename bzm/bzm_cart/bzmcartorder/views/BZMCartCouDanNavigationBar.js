/*
 * @providesModule BZMCartCouDanNavigationBar
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMCartUtils = require('BZMCartUtils');

var {
  Image,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var PropTypes = React.PropTypes;

var BZMCartCouDanNavigationBar = React.createClass({
  propTypes: {
    onBack: PropTypes.func,
    title: PropTypes.string,
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.bar}>
          <TouchableHighlight
            style={[styles.backButton]}
            underlayColor={'transparent'}
            onPress={this._onBack}>
            <View style={styles.backButton}>
              <TBImage
                urlPath={BZMCartUtils.iconURL("bzm_cart_back_down.png")}
                style={styles.backArrow}
              />
            </View>
          </TouchableHighlight>
          <Text style={styles.titleView}>{this.props.title}</Text>
        </View>
      </View>
    );
  },

  _onBack: function() {
    this.props.onBack && this.props.onBack();
  },

});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    height: 65,
  },
  background: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  bar: {
    position: 'absolute',

    width: screenWidth,
    height: 65,
    alignItems: 'center',
    flexDirection: 'row',
  },

  backButton: {
    width: 50,
    height: 65,
    justifyContent: 'center',
  },

  backArrow: {
    marginLeft: 13,
    width: 12,
    height: 22,
    backgroundColor: 'transparent',
  },

  titleView: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10+47,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '400',
    color: '#27272f',
  },
});

module.exports = BZMCartCouDanNavigationBar;
