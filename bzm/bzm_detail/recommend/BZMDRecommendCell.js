/*
 * @providesModule BZMDRecommendCell
 * @flow
 */
 'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMUDealVo = require('BZMUDealVo');

var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var PropTypes = React.PropTypes;
var BZMDRecommendCell = React.createClass({
  propTypes: {
    deal: PropTypes.instanceOf(BZMUDealVo).isRequired,
    onSelect: PropTypes.func,
    onHighlight: PropTypes.func,
    onUnhighlight: PropTypes.func,
  },

  render: function() {
    var deal = this.props.deal;

    if(deal.deal_type == 1){
      var dealSource = "品牌特卖";
    }else if (deal.deal_type == 2){
      var dealSource = "主题馆";
    }else{
      if (deal.source_type == 1) {
        var dealSource = "特卖商城";
      }else{
        switch (deal.shop_type) {
          case 1:
            var dealSource = "去天猫";
            break;
          case 0:
            var dealSource = "去淘宝";
            break;
          default:
            var dealSource = "";
            break;
        }
      }
    }

    var imageUrl = '';
    if (deal.image_url.si3) {
      imageUrl = deal.image_url.si3;
    }else {
      if (deal.image_url.si2) {
        imageUrl = deal.image_url.si2;
      }else {
        imageUrl = '';
      }
    }

    return (
      <TouchableHighlight
      onPress={this.props.onSelect}
      onShowUnderlay={this.props.onHighlight}
      onHideUnderlay={this.props.onUnhighlight}>
        <View style={this.props.style} >
          <TBImage urlPath={imageUrl} style={this.props.thumbnailStyle} />
          <Text style={styles.title} numberOfLines={2}>{deal.short_title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price} numberOfLines={1} >{'￥'+deal.price/100}</Text>
            <Text style={styles.listPrice} numberOfLines={1} >{'￥'+deal.list_price/100}</Text>
          </View>
          <View style={styles.bottomContainer}>
            {deal.baoyou? <Text style={styles.baoyou}>{'包邮'}</Text> : <View />}
            <Text style={styles.saleCount}>
              <Text>已售</Text>
              <Text style={styles.baoyou} >{deal.sales_count}</Text>
              <Text>件</Text>
            </Text>
            <Text style={[styles.saleCount]}>{dealSource}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  title: {
    fontSize: 13,
    marginTop: 5,
    marginHorizontal: 5,
  },

  priceContainer:{
    position: 'absolute',
    bottom: 24,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  price: {
    fontSize: 16,
    color: '#d32d2a',
    marginRight: 5,
  },

  listPrice: {
    fontSize: 11,
    color: '#c0c0c0',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  bottomContainer:{
    position: 'absolute',
    left:5,
    right:5,
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  baoyou: {
    fontSize: 12,
    color: '#ee7d38',
  },

  saleCount: {
    fontSize: 12,
    color: '#c0c0c0',
  },
});

module.exports = BZMDRecommendCell;
