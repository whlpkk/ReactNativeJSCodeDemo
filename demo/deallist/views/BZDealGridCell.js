/**
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('../../../bzm/bzm_core/components/TBImage');
var {
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = React;

var BZDealGridCell = React.createClass({
  render: function() {
    var item = this.props.deal;
    var deal = item.deal;
    var TouchableElement = TouchableHighlight;
    return (
      <TouchableElement
       onPress={this.props.onSelect}
       onShowUnderlay={this.props.onHighlight}
       onHideUnderlay={this.props.onUnhighlight}>
          <View style={this.props.style}  >
          <TBImage
          urlPath={deal.image_url.si3}
          style={styles.thumbnail}
          />
            <Text style={styles.title}>{deal.title}</Text>
          </View>
      </TouchableElement>
    );
  }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var imgWidth = (screenWidth - 30)/2;

var styles = StyleSheet.create({

  title: {
      fontSize: 14,
      marginBottom: 8,
      marginLeft: 5,
    },
    thumbnail: {
      width: imgWidth,
      height: imgWidth,
    },
});

module.exports = BZDealGridCell;
