/*
 * @providesModule BZMUDealNavigationBar
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMUDealHeadItem = require('BZMUDealHeadItem');
var BZMCoreUtils = require('BZMCoreUtils');

var {
  Image,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var PropTypes = React.PropTypes;

var BZMUDealNavigationBar = React.createClass({
  propTypes: {
    onBack: PropTypes.func,
    title: PropTypes.string,
  },

  render: function() {
    return (
      <View style={styles.container}>
        <TBImage style={styles.background} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_bg.png'} />
        <View style={styles.bar}>
          <TouchableHighlight
            style={[styles.backButton]}
            underlayColor={'transparent'}
            onPress={this._onBack}>
            <View style={styles.backButton}>
              <TBImage style={styles.backArrow} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_goback.png'} />
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
    backgroundColor: '#f0f0f0',
    height: 64,
  },
  background: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  bar: {
    position: 'absolute',
    top: 20,
    width: screenWidth,
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
  },

  backButton: {
    width: 50,
    height: 40,
    // alignItems: 'center',
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

module.exports = BZMUDealNavigationBar;
