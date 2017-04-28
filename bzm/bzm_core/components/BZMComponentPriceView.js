/*
 *
 * @providesModule BZMComponentPriceView
 */
'use strict';

var React = require('react-native');
var BZMCoreStyle = require('BZMCoreStyle');
var {
    Text,
    View,
    } = React;

var PropTypes = React.PropTypes;

var BZMComponentPriceView = React.createClass({
    propTypes: {
        price: PropTypes.string.isRequired,
        symbolStyle: PropTypes.object,
        prefixStyle: PropTypes.object,
        suffixStyle: PropTypes.object
    },

    render: function () {
        var priceText = this.props.price;
        var inx = priceText.indexOf(".");
        var suffixText = "";
        var prefix = priceText;
        if (inx > 0) {
            var arr = priceText.split(".");
            prefix = arr[0] + ".";
            suffixText =arr[1];
        }
        var symbolStyle = this.props.symbolStyle;
        var prefixStyle = this.props.prefixStyle;
        var suffixStyle = this.props.suffixStyle;

        var rowStyle = {flexDirection:'row', alignItems:'flex-end'};
        if (symbolStyle == undefined) {
            symbolStyle = {color:'#E30C26',marginBottom:2.5,  fontSize:10  };
        }
        if (prefixStyle == undefined) {
            prefixStyle = {color:'#E30C26', fontSize:14};
        }
        if (suffixStyle == undefined) {
            suffixStyle = {color:'#E30C26', marginBottom:0.5,  fontSize:11  };
        }
        return (
            <View style={rowStyle}>
                <Text style={symbolStyle}>￥</Text>
                <Text style={prefixStyle}>{prefix}</Text>
                <Text style={suffixStyle}>{suffixText}</Text>
            </View>
        );
    }

});

module.exports = BZMComponentPriceView;
