/*
 *
 * @providesModule BZMHomeTemplate7
 *
 * 横向滑动单品显示好评
 * -----------------
 * |   |   |   |   |   |   |
 * |   |   |   |   |   |   |
 * -----------------
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');
var BZMCoreUtils = require('BZMCoreUtils');
var TBExposureManager = require('TBExposureManager');

var {
    StyleSheet,
    TouchableHighlight,
    View,
    ListView,
    Text,
    AsyncStorage
    } = React;

var tHeight;
var PropTypes = React.PropTypes;
var startIndex = 0;
var imgValue = 206 / 2;
var BZMHomeTemplate7 = React.createClass({
    propTypes: {
        optData: PropTypes.array.isRequired,
        startIndex: PropTypes.number.isRequired,
        modelIndex: PropTypes.number,
        onSelect: PropTypes.func,
        onHighlight: PropTypes.func,
        onUnhighlight: PropTypes.func
    },
    componentDidMount: function () {
        //每次只需显示5条

    },
    _forwardToDeal: function (item,rowId) {
        var zid = item.zid;
        var promotionId = item.id;
        var url = "zhe800://m.zhe800.com/mid/zdetail?zid="+zid+"&dealid="+promotionId;


        //打点逻辑
        var modelVo = {
          analysisId: String(promotionId),
          analysisType: "youphdeal",
          analysisIndex: parseInt(rowId)+1,
          analysisSourceType: "2",
        };

        var pageId = "home";
        var pageName = "home";
        TBExposureManager.pushLogForPageName(pageName,pageId,this.props.modelIndex,modelVo);
        TBFacade.forward(1, url);
    },
    _forwardToYoupin: function(rowId) {
        var url ="http://th5.m.zhe800.com/h5public/youpinhui?pub_page_from=zhe800client&p_refer=&dcurlid=1";


        //打点逻辑
        var modelVo = {
          analysisId: "more",
          analysisType: "youphdeal",
          analysisIndex: parseInt(rowId)+1,
          analysisSourceType: "2",
        };

        var pageId = "home";
        var pageName = "home";
        TBExposureManager.pushLogForPageName(pageName,pageId,this.props.modelIndex,modelVo);
        TBFacade.forward(1, url);
    },
    renderRow1: function (item,sectionId,rowId) {

        if (item.more) {
            return (
                <View style={[styles.bzm_template7_cell,{height:tHeight-10}]}>
                    <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                        style={styles.bzm_template7_cell_cm}
                                        onPress={() => this._forwardToYoupin(rowId)}>
                        <View style={styles.bzm_template7_cell_cm}>
                            <Text style={styles.bzm_template7_title_m}> 。。。</Text>
                            <Text style={styles.bzm_template7_title_m2}>全部{item.count}款优品</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.bzm_template7_cell_2}>
                    </View>
                </View>
            );
        } else {
            return (
                <TouchableHighlight underlayColor={'transparent'} activeOpacity={1}
                                    style={[styles.bzm_template7_cell,{height:tHeight-10}]}
                                    onPress={() => this._forwardToDeal(item,rowId)}>
                    <View style={{height:tHeight}}>
                        <View style={styles.bzm_template7_big_img}>
                            <TBImage
                                urlPath={item.image_url.si2}
                                style={styles.bzm_template7_big_img}
                            />
                        </View>
                    <View style={styles.bzm_template7_cell_3}>
                        <Text style={styles.bzm_template7_cell_2}>
                            <Text style={styles.bzm_template7_title}>好评</Text>
                            <Text style={styles.bzm_template7_title2}>{item.good_comment_rate}%</Text>
                        </Text>
                   </View>
                    </View>
                </TouchableHighlight>

            );
        }
    },
    render: function () {
        var optData = this.props.optData[0];
        startIndex = this.props.startIndex;
        var listData =  optData.objects.concat();

        if (listData.length<5) {
            return (<View />);
        }
        var nextIndex = startIndex+5;
        if (startIndex>listData.length-5) {
            startIndex = 0;
        }
        if (nextIndex>listData.length-5) {
            nextIndex = 0;
        }

        AsyncStorage.setItem(BZMCoreUtils.HOME_YOUPIN_LOPP_KEY, nextIndex+"")
            .then(() => {})
            .catch((error) => {})
            .done();

        listData = listData.slice(startIndex, startIndex+5);

        var item = {more:"true", count:optData.meta.count};
        listData.push(item);
        var dc1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        dc1 = dc1.cloneWithRows(listData);

        tHeight = BZMCoreUtils.calculateHeight(this.props.height, 750);
        return (
            <ListView
                dataSource={dc1}
                renderRow={this.renderRow1}
                removeClippedSubviews={false}
                style={[styles.bzm_template_c7_n,{height:tHeight}]}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        );
    }
});

var styles = StyleSheet.create({
    bzm_template7_cell: {
        marginTop: 10,
        marginLeft: 10,
        backgroundColor:'transparent'
    },
    bzm_template7_cell_cm: {
        height: imgValue,
        width: imgValue,
        justifyContent: 'center',
        // backgroundColor: '#f0f0f0',
        backgroundColor:'transparent',
        marginRight:10,
    },
    bzm_template7_title_m: {
        textAlign: "center",
        fontSize: 14,
        color: '#dddddd'
    },
    bzm_template7_title_m2: {
        fontSize: 14,
        color: '#dddddd',
        marginTop: 5
    },
    bzm_template7_cell_2: {
        textAlign: "center",
        width: imgValue
    },
    bzm_template7_cell_3:{
        justifyContent: 'center',
        width: imgValue,
        // backgroundColor: '#ffffff'
        backgroundColor:'transparent'

    },

    bzm_template7_big_img: {
        // backgroundColor: '#ffffff',
        backgroundColor:'transparent',
        width: imgValue,
        height: imgValue
    },
    bzm_template_c7_n: {
        // backgroundColor: '#ffffff',
        backgroundColor:'transparent'
    },
    bzm_template7_title: {
        fontSize: 14,
        color: '#333333'
    },
    bzm_template7_title2: {
        fontSize: 14,
        textAlign: 'center',
        color: '#ff0000'
    }
});

module.exports = BZMHomeTemplate7;
