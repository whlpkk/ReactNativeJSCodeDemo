/*
 * @providesModule BZMUDealGridCell
 * @flow
 */
 'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMUDealVo = require('BZMUDealVo');
var BZMCoreUtils = require('BZMCoreUtils');


var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var PropTypes = React.PropTypes;
var BZMUDealGridCell = React.createClass({
  propTypes: {
    deal: PropTypes.instanceOf(BZMUDealVo).isRequired,
    onSelect: PropTypes.func,
    onHighlight: PropTypes.func,
    onUnhighlight: PropTypes.func,
  },

  render: function() {
    // console.log(this.props.style);
    var deal = this.props.deal;
    var tagView;
    if (deal.is_star) { //同时有 今日上新和明星商品，显示明星商品
      tagView = <TBImage urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_icon_star.png'} style={styles.tagImage} />
    }else if (deal.today) {
      tagView = <TBImage urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_icon_new.png'} style={styles.tagImage} />
    }
    return (
      <TouchableHighlight
      onPress={this.props.onSelect}
      onShowUnderlay={this.props.onHighlight}
      onHideUnderlay={this.props.onUnhighlight}>
        <View style={this.props.style} >
          <TBImage urlPath={deal.image_url.si2} style={this.props.thumbnailStyle} />
          {tagView}

          <Text style={styles.title} numberOfLines={1}>{deal.short_title}</Text>
          <Text style={styles.priceContainer}>
            <Text style={styles.price}>{deal.price/100+'元'}</Text>
            <Text style={styles.standard}>{'/'+deal.standard}</Text>
          </Text>
          <View style={styles.bottomContainer}>
            <Text style={styles.saleCount}>{'已售'+deal.sales_count+deal.standard}</Text>
            <Text style={styles.saleCount}>
              <Text>好评</Text>
              <Text style={{color:'red'}}>{deal.good_comment_rate+'%'}</Text>
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  title: {
    fontSize: 13,
    marginTop: 2,
    marginHorizontal: 5,
    textAlign: 'center',
  },

  tagImage:{
    position: 'absolute',
    left: 6,
    top: 0,
    width: 26,
    height: 26,
    backgroundColor: 'transparent',
  },

  priceContainer:{
    marginTop: 3,
    marginHorizontal: 5,
    textAlign: 'center',
  },

  price: {
    fontSize: 15,
    color: 'red',
  },

  standard: {
    fontSize: 11,
  },

  bottomContainer:{
    flex:1,
    marginHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  saleCount: {
    fontSize: 11,
  },

});

module.exports = BZMUDealGridCell;
