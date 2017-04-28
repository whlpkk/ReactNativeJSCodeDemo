/*
 *
 * @providesModule BZMHomeTemplate6
 *
 * 横向滑动单品显示价格
 * -----------------
 * |   |   |   |   |   |   |
 * |   |   |   |   |   |   |
 * -----------------
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreUtils = require('BZMCoreUtils');
var TBFacade = require('TBFacade');
var TBExposureManager = require('TBExposureManager');
var {
    StyleSheet,
    TouchableHighlight,
    View,
    ListView,
    Text,
    } = React;
var imgValue = 206/2;
var tHeight;
var PropTypes = React.PropTypes;
var BZMHomeTemplate6 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        modelIndex: PropTypes.number,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func
    },

    _forwardToBrandDetail: function (item,rowId) {
        var brandId = item.id;
        var dealId = item.deals[0].id;
        var url = "zhe800://m.zhe800.com/deal/brand/detail?brand_id="+brandId+"&deal_ids="+dealId;


        //打点逻辑
        var modelVo = {
          analysisId: String(brandId),
          analysisType: "brandlist",
          analysisIndex: parseInt(rowId)+1,
          analysisSourceType: "3",
        };

        var pageId = "home";
        var pageName = "home";
        TBExposureManager.pushLogForPageName(pageName,pageId,this.props.modelIndex,modelVo);
        TBFacade.forward(1, url);
    },
    _forwardToBrandHome: function (rowId) {
        var url = "zhe800://m.zhe800.com/mid/home?tab=3";


        //打点逻辑
        var modelVo = {
          analysisId: "more",
          analysisType: "brandlist",
          analysisIndex: parseInt(rowId)+1,
          analysisSourceType: "3",
        };

        var pageId = "home";
        var pageName = "home";
        TBExposureManager.pushLogForPageName(pageName,pageId,this.props.modelIndex,modelVo);
        TBFacade.forward(1, url);
    },
    renderRow1: function (itemParam,sectionId,rowId) {

        if (itemParam.more) {
            return (

                <View style={[styles.bzm_template6_cell,{height:tHeight-10}]}>
                    <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                        style={styles.bzm_template6_cell_cm}
                                        onPress={() => this._forwardToBrandHome(rowId)}>
                        <View style={styles.bzm_template6_cell_cm}>
                            <Text style={styles.bzm_template6_title_m}> 。。。</Text>
                            <Text style={styles.bzm_template6_title_m2}>更多</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.bzm_template6_cell_2,{height:tHeight-10-imgValue}]}>
                    </View>
                </View>
            );
        } else {
            var item = itemParam.deals[0];
            return (
                <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                    style={[styles.bzm_template6_cell,{height:tHeight-10}]}
                                    onPress={() => this._forwardToBrandDetail(itemParam,rowId)}>
                    <View style={{height:tHeight}}>
                        <View style={styles.bzm_template6_big_img}>
                            <TBImage
                                urlPath={item.image_url.si2}
                                style={styles.bzm_template6_big_img}
                            />
                            <TBImage
                                urlPath={BZMCoreUtils.baseICONPath()+"/bzm_home_tp/tp6_bg_01.png"}
                                style={styles.bzm_template6_c}
                            />
                            <View style={styles.bzm_template6_d}>
                                <Text style={styles.d_price}>￥{BZMCoreUtils.fenToYuan(item.price)}</Text>
                            </View>
                        </View>
                        <View style={[styles.bzm_template6_cell_2,{height:tHeight-10-imgValue}]}>
                            <Text numberOfLines={1} style={styles.bzm_template6_title}>{item.short_title}</Text>
                        </View>
                    </View>
                </TouchableHighlight>

            );
        }

    },
    render: function () {
        var optData = this.props.optData[0];
        var d2 =  optData["objects"];
        var listData = d2.concat();
        var item = {more:"true"};
        listData.push(item);
        var dc1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        dc1 = dc1.cloneWithRows(listData);

        tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);
        return (
            <ListView
                showsHorizontalScrollIndicator={false}
                dataSource={dc1}
                removeClippedSubviews={false}
                renderRow={this.renderRow1.bind(this,tHeight)}
                style={[styles.bzm_template_c6_n,{height:tHeight}]}
                horizontal={true}
            />
        );
    }
});
var styles = StyleSheet.create({
    bzm_template6_cell: {
        marginTop: 10,
        marginLeft: 10,
    },
    bzm_template6_cell_cm: {
        height: imgValue,
        width: imgValue,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f0f0f0'
        backgroundColor:'transparent'
    },
    bzm_template6_title_m: {
        fontSize: 14,
        color: '#dddddd'
    },
    bzm_template6_title_m2: {
        fontSize: 14,
        color: '#dddddd',
        marginTop:5
    },
    bzm_template6_cell_2: {
        justifyContent: 'center',
        alignItems: 'center',
        width: imgValue,
        backgroundColor: 'transparent'
    },
    bzm_template6_c: {
        position: 'absolute',
        bottom: 0,
        width: imgValue,
        height:36,
        backgroundColor: 'transparent'
    },
    bzm_template6_d: {
        position: 'absolute',
        bottom: 3,
        width: imgValue,
        justifyContent: 'center',
        alignItems: 'center'
    },
    d_price: {
        fontSize: 14,
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    bzm_template6_big_img: {
        backgroundColor: 'transparent',
        width: imgValue,
        height: imgValue
    },
    bzm_template_c6_n: {
        backgroundColor: 'transparent',
    },
    bzm_template6_title: {
        fontSize: 14,
        color: '#333333'
    }
});

module.exports = BZMHomeTemplate6;
