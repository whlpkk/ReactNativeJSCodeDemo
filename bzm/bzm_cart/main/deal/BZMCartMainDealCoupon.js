/*
 *
 * @providesModule BZMCartMainDealCoupon
 */
'use strict';

var React = require('react-native');
var BZMCoreUtils = require('BZMCoreUtils');
var TBTagFlow = require('TBTagFlow');
var TBImage = require('TBImage');
var BZMCartUtils = require('BZMCartUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var {
    StyleSheet,
    Text,
    ListView,
    View,
    Image
    } = React;

var PropTypes = React.PropTypes;
var skuDataSource = new ListView.DataSource({
    rowHasChanged: function (row1, row2) {
        //响应每次刷新
        //return row1.id !== row2.id;
        return true;
    }
});
var BZMCartMainDealCoupon = React.createClass({
    propTypes: {
        sellerRule: PropTypes.object.isRequired
    },
    render: function () {
        var ruleItem = this.props.sellerRule;
        var arr = ruleItem.rule.split(",");
        var dc = [];
        for (var inx in arr) {
            var item = arr[inx];
            var obj = {};
            obj.text = item;
            obj.type = ruleItem.type;
            dc.push(obj);
        }
        skuDataSource = skuDataSource.cloneWithRows(dc);
        return (
            <View style={styles.container}>
                <TBTagFlow style={styles.sinContainer}
                           dataSource={skuDataSource}
                           renderItem={this.renderSKURow}/>
            </View>
        );
    },
    renderSKURow: function (rowItem) {
        var arr = rowItem.text.split("-");
        var text = "";
        switch (rowItem.type) {
            case 1:
                text = "满" + arr[0] + "元减" + arr[1] + "元";
                break; //满减
            case 2:
                text = "满" + arr[0] + "元减" + arr[1] + "元,上不封顶";
                break; //满减，上不封顶
            case 3:
                text = "满" + arr[0] + "件打" + arr[1] + "折";
                break; //满折
            case 4:
                text = "满" + arr[0] + "件包邮";
                break; //满多少件包邮
            case 5:
                text = "满" + arr[0] + "元包邮";
                break; //满多少钱包邮
        }
        return (
            <View style={styles.couponBox}>
                <TBImage style={styles.stImage}
                         urlPath={"bundle://bzm_cart_satisfy1@2x.png"}
                         capInsets={{top:6, left:14, bottom:6, right:2}}
                />
                <View style={styles.titleBox}>
                    <Text style={styles.title}>{text}</Text>
                </View>
            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingRight: 10,
        paddingBottom: 10
    },
    sinContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    stImage: {
        left:0,
        right:0,
        height: 22,
        backgroundColor: '#ffffff',
        position:"absolute"
    },
    couponBox: {
        marginTop: 10,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },
    titleBox: {
        marginLeft:12,
        justifyContent: 'center',
        height: 22
    },
    title: {
        color: '#F96A41',
        fontSize: 10,
        marginLeft: 2,
        marginRight: 5
    }
});

module.exports = BZMCartMainDealCoupon;
