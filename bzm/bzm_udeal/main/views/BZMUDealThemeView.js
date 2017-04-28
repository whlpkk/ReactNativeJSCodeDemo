/*
 * @providesModule BZMUDealThemeView
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMUDealThemeItem = require('BZMUDealThemeItem');

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var PropTypes = React.PropTypes;

var BZMUDealThemeView = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(BZMUDealThemeItem).isRequired,
    onSelected: PropTypes.func,
  },

  render: function() {
    var cells = [];
    var item = this.props.item;
    for (var i in item.vos) {
      var cell =
        <TouchableHighlight key={i} onPress={this._onPress.bind(this,i)}>
        <View style={themeStyles.cell}>
          <Text style={[themeStyles.text,{color:item.vos[i].textColor}]}>{item.vos[i].text}</Text>
          <TBImage urlPath={item.vos[i].imageUrl} style={themeStyles.image}/>
        </View>
      </TouchableHighlight>
      cells.push(cell);
    }
    return (<View style={themeStyles.back}>
        <View style={themeStyles.container}>{cells}</View>
      </View>);
  },

  _onPress: function(i) {
    this.props.onSelected && this.props.onSelected(this.props.item.vos[i]);
  },

});

var themePadding = 5;
var cellWidth = (screenWidth - themePadding * 4) / 3;
var kThemeCellHeight = 150;

var themeStyles = StyleSheet.create({
  back: {
    backgroundColor: '#F6F6F6',
    height: kThemeCellHeight,
  },

  container: {
    flex: 1,
    height: 140,
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: themePadding,
    justifyContent: 'space-between',
  },

  cell: {
    width: cellWidth,
    height: 140,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  image: {
    marginTop: 15,
    width: cellWidth,
    height: cellWidth * (68 / 96),
    backgroundColor: 'transparent',
  },

  text: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
  },
});

module.exports = BZMUDealThemeView;
