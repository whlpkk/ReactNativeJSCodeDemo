/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @providesModule BZMCartCouDan
 */
'use strict';
var React = require('react-native');


var {
    AppRegistry,
    ListView,
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    ScrollView,
    AsyncStorage,
    Platform,
} = React;

var BZMDSKUView = require('BZMDSKUView');
var TBImage = require('TBImage');
var TBLoading = require('TBLoading');
var TBTip = require('TBTip');
var TBExposureManager = require('TBExposureManager');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var TBFacade = require('TBFacade');
var BZMDSKUModel = require('BZMDSKUModel');
var TBAnimation = require('TBAnimation');
var TBAlert = require('TBAlert');
var BZMCoreModel = require('BZMCoreModel');
var BZMCartNavigationBar = require('BZMCartNavigationBar');
var BZMCartCouDanBottomBar = require('BZMCartCouDanBottomBar');
var BZMCartCouDanDealItem = require('BZMCartCouDanDealItem');
var BZMCartUtils = require('BZMCartUtils');
var Dimensions = require('Dimensions');


var REQUEST_GetShopNameURL = 'http://th5.m.zhe800.com/h5/api/getprodlistbysellerid?sellerId=';
var REQUEST_GetShopDealsURL = 'http://th5.m.zhe800.com/h5/api/getshopdeals?shop_id='//908229
var REQUEST_CutURL = 'http://th5.m.zhe800.com/h5/api/discount?seller_id=';
var REQUEST_CartURL = 'http://th5.m.zhe800.com/h5/api/cart/count';
var REQUEST_DisCount = 'http://th5.m.zhe800.com/h5/api/getdiscounttotal';
var REQUEST_Pag = '&page=';


var PropTypes = React.PropTypes;
var BZMCartCouDan = React.createClass({

    propTypes: {
      sellerId: PropTypes.string.isRequired,
      nickName: PropTypes.string,
    },
    getInitialState: function () {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
            shopname: this.props.nickName,
            cartnumber : 0,
            totalprice : undefined,
            discountprice: undefined,
            cartnumberdown : undefined,
        };
    },
    _goBack: function () {
        TBFacade.goBack(0);
    },
    componentWillMount: function() {
        this.pageNumber = 1;
        this.isLoading = false;
        this.resultsCache = [];
        this.shopcutInfo = "";
        this.productupload = [{"sellerId": 0, "prodList": []}];
        this.hasNext = undefined;
        this.skuLoading = false;
        this.didLoadSKU = false;
        this.didLoadStock = false;
        this.sku = null;
        this.skuModel = null;
        this.stock = null;
        this.jkString = "";
    },
    componentDidMount: function () {
        this._loadJK();
        this.fetchData();
    },

    _loadJK: function () {
        TBExposureManager.appendOutUrl("http://out.zhe800.com/native/jump?jump_source=2", "", (urlString)=> {
            fetch(urlString).then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    return null;
                }
            }, (e) => {

            }).then((obj) => {
                this.jkString = obj;
                this.jkString = BZMCoreUtils.trimRight(this.jkString);
            });
        });
    },

    setShopCutInfo: function (responseData) {
        if (responseData != null && responseData.discountInfo != null) {
            var youhui_type = responseData.discountInfo.type; //满减优惠类型
            var youhui_rule = responseData.discountInfo.rule; //满减优惠数据
            // [100-10,200-20,300-30]    满多少元，减多少元
            // [100-10]          满多少元，减多少元，上不封顶
            // [2-9,3-8,4-7]         满多少件，打多少折
            // [2]                    满多少件－免邮，
            // [200]              满多少元－免邮
            var sh_html;
            var youhui_flag = true;
            switch (youhui_type) {
                case 1:
                    var t2_arr = youhui_rule.split(",");
                    var t2_100 = [],
                        t2_10 = [];
                    for (var i = 0; i < t2_arr.length; i++) {
                        var t2_arr_arr = t2_arr[i].split("-");
                        t2_100.push(t2_arr_arr[0]);
                        t2_10.push(t2_arr_arr[1]);
                    }
                    for (var j = 0; j < t2_100.length; j++) {
                        sh_html = "满" + t2_100[j] + "元减" + t2_10[j] + "元，";
                    }
                    sh_html = sh_html.substring(0, sh_html.length - 1);
                    // sh_html = sh_html + "最多减" + t2_10[t2_10.length - 1] + "元";
                    break;
                case 2:
                    var t1_100_10 = youhui_rule.split("-");
                    var t1_100 = parseFloat(t1_100_10[0]);
                    var t1_10 = parseFloat(t1_100_10[1]);
                    sh_html = "满" + t1_100 + "元减" + t1_10 + "元，上不封顶";
                    break;
                case 3:
                    var t2_arr = youhui_rule.split(",");
                    var t2_100 = [],
                        t2_10 = [];
                    for (var i = 0; i < t2_arr.length; i++) {
                        var t2_arr_arr = t2_arr[i].split("-");
                        t2_100.push(t2_arr_arr[0]);
                        t2_10.push(t2_arr_arr[1]);
                    }
                      sh_html="";
                    for (var j = 0; j < t2_100.length; j++) {
                        sh_html = sh_html+"满" + t2_100[j] + "件打" + t2_10[j] + "折，";
                    }
                    sh_html = sh_html.substring(0, sh_html.length - 1);
                    break;
                case 4:
                    sh_html = "满" + youhui_rule + "件免邮";
                    break;
                case 5:
                    sh_html = "满" + youhui_rule + "元免邮";
                    break;
                default:
                    youhui_flag = false;
            }
        }
        this.shopcutInfo = sh_html;
    },

    setShopInfo: function (responseData) {
        if (responseData == null
            || responseData == undefined
            || !responseData.hasOwnProperty("itemList")
            || responseData.itemList == null) {
            return;
        }
        if (responseData.itemList.length < 1) {
            return;
        }
        var itemsList = responseData.itemList[0];
        this.setState({
            shopname: itemsList.sellerInfo.nickName
        });

        this.productupload[0]["sellerId"] = itemsList.sellerInfo.sellerId;
        this.productupload[0]["prodList"].splice(0);
        for (var itemIndex in itemsList.itemDetailList) {
            var item = itemsList.itemDetailList[itemIndex];
            var productitem = {"count": 0, "productId": "", "skuNum": ""};
            productitem.count = item.product.count;
            productitem.productId = item.product.productId;
            this.productupload[0]["prodList"].push(productitem);
        }

        fetch(REQUEST_DisCount, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.productupload)
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error(error);
                this.state.isloading = false;
            })
            .then((responseData) => {
                this.setDisCountInfo(responseData);
            }).done();
    },

    setCartInfo: function (responseData) {
        if (responseData == null)
            return;

        this.setState({
            cartnumber: responseData.value,
        });
    },

    setDisCountInfo: function (responseData) {
        if (responseData == null)
            return;

        this.setState({
            totalprice: responseData.discountTotal.totalPrice,
            discountprice: responseData.discountTotal.discountPrice,
            cartnumberdown:responseData.discountTotal.count,
        });
    },
    reloadItems: function (responseData) {
        if (responseData == null || responseData.response == undefined || responseData.response.docs == undefined)
            return;
        var dealItem = new BZMCartCouDanDealItem();
        dealItem.id = 1000;
        if (this.resultsCache.length == 0)
            this.resultsCache.push(dealItem);

        this.hasNext = responseData.hasNext;
        this.pageNumber += 1;
        for (var itemIndex in responseData.response.docs) {
            var item = responseData.response.docs[itemIndex];

            var dealItem = new BZMCartCouDanDealItem();
            dealItem.id = item.zid;
            dealItem.deal = item;
            if(item.special_deal_type==0)
                this.resultsCache.push(dealItem);
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.resultsCache),
            loaded: true,
        });
    },
    fetchListData: function (pagen) {
        if (this.isLoading || !this.hasNext) {
            return;
        }
        this.isLoading = true;

        fetch(REQUEST_GetShopDealsURL + this.props.sellerId + REQUEST_Pag + pagen)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((responseData) => {
                this.reloadItems(responseData);
                this.isLoading = false;
            })
            .catch((error)=>{
                this.isLoading = false;
            })
            .done();
    },
    fetchData: function () {
        var containerView = this.refs["containerView"];
        var screenHeight = Dimensions.get('window').height;
        var cTag = React.findNodeHandle(containerView);
        var detaHeight = BZMCoreStyle.navigationBarHeight();
        TBLoading.pageLoading(cTag,
            {"x": 0, "y": detaHeight,
                "width": screenWidth, "height": screenHeight - detaHeight}
        );

        this.isLoading = true;
        fetch(REQUEST_GetShopDealsURL + this.props.sellerId + REQUEST_Pag + this.pageNumber)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((responseData) => {
                this.reloadItems(responseData);
                TBLoading.hidePageLoading(cTag, {});
                this.isLoading = false;
            })
            .catch((error)=>{
                TBLoading.hidePageLoading(cTag, {});
                this.isLoading = false;
            })
            .done();

        fetch(REQUEST_CutURL + this.props.sellerId)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((responseData) => {
                this.setShopCutInfo(responseData);
            })
            .catch((error)=>{})
            .done();


        this._loadShopCount();
        this._loadCartCount();
    },

    _loadShopCount: function() {
        fetch(REQUEST_GetShopNameURL + this.props.sellerId)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((responseData) => {
                this.setShopInfo(responseData);
            })
            .catch((error)=>{})
            .done();
    },

    _loadCartCount:function() {
        fetch(REQUEST_CartURL)
            .then((response) => response.json())
            .then((responseData) => {
                this.setCartInfo(responseData);
            })
            .catch((error)=>{})
            .done();
    },

    _onPressFinishBtn: function () {
        var url = 'http://th5.m.zhe800.com/h5/coudan/list?sellerId=' + this.props.sellerId;
        TBFacade.forward(1, url);
    },

    _onPressCart: function (item) {
        if (this.skuLoading) {
            return;
        }
        this.didLoadSKU = false;
        this.didLoadStock = false;
        this.sku = null;
        this.stock = null;
        this.skuLoading = true;
        var zid = item.zid;
        var skuUrl = BZMCoreUtils.REQUEST_BASE_URL + "/tradeapi/cach/product/v1/" + zid;
        fetch(skuUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            this.didLoadSKU = true;
            if (response.ok) {
                return response.json();
            } else {
                console.log("response!", response.status);
                return {};
            }
        }, (e) => {
            this.didLoadSKU = true;
            console.log("请求失败!", e);
            this._openSku(item);
        }).then((skuObject) => {
            this.didLoadSKU = true;
            this.sku = skuObject;

            this._openSku(item);
        });

        var stockUrl = BZMCoreUtils.REQUEST_BASE_URL + "/h5new/real/prodstatus?zid=" + zid;
        fetch(stockUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            this.didLoadStock = true;
            if (response.ok) {
                return response.json();
            } else {
                console.log("response!", response.status);
                return {};
            }
        }, (e) => {
            this.didLoadStock = true;
            console.log("请求失败!", e);
            this._openSku(item);
        }).then((skuObject) => {
            this.didLoadStock = true;
            this.stock = skuObject["/h5/api/skunew"];

            this.stock = JSON.parse(this.stock);
            this._openSku(item);
        });
    },
    _onSelectSku(skuObject) {

    },
    _onPressSkuBuy(skuObject) {
        this._loadShopCount();
        this._loadCartCount();
        this._onPressClose();
    },
    _onPressClose() {
        var pView = this.refs["presentView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{});
    },
    containerResponderCapture: function (evt) {
        return this.props.tbNativeMoving;
    },
    render: function () {

        var view = <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            onEndReached={this.onEndReached}
            style={styles.listView} />
        return (
            <View style={styles.container}
                  ref="containerView"
                  onStartShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}
                  onMoveShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}
            >
                <BZMCartNavigationBar title={'凑单'} onBack={this._goBack}/>
                {view}

                <BZMCartCouDanBottomBar totalprice={this.state.totalprice}
                                        discountprice={this.state.discountprice}
                                        onPressFinishBtn={this._onPressFinishBtn}/>
		        <TouchableHighlight onPress={this._onPressFinishBtn}>
                    <View style={styles.bottomcircle}>
                        <Text style={styles.cartntitle1}>{this.state.cartnumberdown}</Text>
                        <Text style={styles.cartntitle2}>{"件"}</Text>
                    </View>
		        </TouchableHighlight>
                <View style={BZMCoreStyle.skuContainer()} ref="presentView">
                    <BZMDSKUView
                        skuModel={this.skuModel}
                        action="cart"
                        onSelectItem={this._onSelectSku}
                        onCart={this._onPressSkuBuy}
                        onPressClose={this._onPressClose}/>
                </View>
            </View>
        );
    },

    onEndReached: function () {
        this.fetchListData(this.pageNumber);
    },

    _openSku: function (deal) {
        if (this.didLoadSKU && this.didLoadStock) {
            this.skuLoading = false;
        }
        if (this.sku && this.stock) {
            if (this.sku.sku == null) {
                TBTip.show('商品属性加载失败');
                return;
            }

            this.skuModel = new BZMDSKUModel(this.sku.sku, this.stock, this.sku, this.jkString, 'cart', 'default');
            this.forceUpdate();

            var pView = this.refs["presentView"];
            var cView = this.refs["containerView"];
            var reactTag = React.findNodeHandle(pView);
            var cTag = React.findNodeHandle(cView);
            TBAnimation.presentView(reactTag, cTag);
        }
    },

    renderRow: function (dealitem:Object) {
        var item = dealitem;
        if (item.id == 1000) {
            return (
                <View style={styles.headContainer}>
                    <View style={styles.headBackGround}>
                        <TBImage urlPath={BZMCartUtils.iconURL("bzm_cart_seller_bg.png")}
                                 style={styles.seller_bg}/>
                        <TBImage
                            urlPath={BZMCartUtils.iconURL("bzm_cart_logo.png")}
                            style={styles.chatthumbnail}
                        />
                        <View style={styles.circle}>
                            <Text style={styles.cartntitle0}>{this.state.cartnumber}</Text>
                        </View>
                        <View style={styles.shopNameView}>
                            <TBImage
                                urlPath={BZMCartUtils.iconURL("bzm_cart_default_ico.png")}
                                style={styles.shopCartthum}
                            />
                            <Text style={styles.shopCart} numberOfLines={1}>{this.state.shopname}</Text>
                        </View>
                    </View>
                    <View style={styles.couponBox}>
                        <View style={styles.shopcontainer}>
                            <View style={styles.shoptitleButton}>
                                <Text style={styles.shoptitle}>{"店铺优惠"}</Text>
                            </View>
                            <Text style={styles.shopcut}>{this.shopcutInfo}</Text>
                        </View>
                        <View style={styles.bottomLine}/>
                    </View>
                </View>
            )
        }
        else {
            let curPriceStr = dealitem.deal.price;
            let orgPriceStr = dealitem.deal.list_price;
            var curPrice = parseFloat(curPriceStr);
            var orgPrice = parseFloat(orgPriceStr);
            curPrice = BZMCoreUtils.fenToYuan(curPrice);
            orgPrice = BZMCoreUtils.fenToYuan(orgPrice);
            return (

                <TouchableHighlight onPress={() => {
                    var zid = dealitem.deal.zid;
                    var promotionId = dealitem.deal.id;
                    var url = "zhe800://m.zhe800.com/mid/zdetail?zid="+zid+"&dealid="+promotionId;
                    TBFacade.forward(1, url);
                }}>
                    <View style={styles.touchContainer}>
                        <View style={styles.listcontainer}>

                            <TBImage
                                urlPath={dealitem.deal.square_image}
                                style={styles.listthumbnail}
                                defaultPath={"bundle://common_small_default@2x.png"}
                            />
                            <View style={styles.rightContainer}>
                                <Text style={styles.title}>{dealitem.deal.short_title}</Text>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>￥{curPrice}</Text>
                                    <View style={styles.priceTextWeakCon}>
                                        <Text style={styles.priceTextWeakSymbol}>￥</Text>
                                        <Text style={styles.priceTextWeak}>{orgPrice}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableHighlight onPress={() => this._onPressCart(dealitem.deal)}>
                                <View style={styles.listcartcontainer}>
                                    <View style={styles.listcartcircle}>
                                        <TBImage
                                            urlPath={BZMCartUtils.iconURL("bzm_cart.png")}
                                            style={styles.listcart}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>

                        <View style={styles.dealSepLine}/>
                    </View>
                </TouchableHighlight>

            );
        }
    },
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
    touchContainer: {},
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
    },
    shopcontainer: {
        flex: 1,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    couponBox: {
        height: 36,
        backgroundColor: '#FFFFFF'
    },
    bottomLine: {
        height: BZMCoreStyle.lineHeight(),
        backgroundColor: '#f0f1f2'
    },
    dealSepLine: {
        height: 3,
        backgroundColor: '#ffffff'
    },
    headContainer: {},
    headCartholder: {
        marginLeft: 300,
        height: 120,
        flex: 8,

    },
    headBackGroungImage: {
        left: 0,
        top: 0,
    },
    headBackGround: {
        flex: 1,
        // width: screenWidth,
        // height: screenWidth/750*328,
    },
    headCart: {
        height: 40,
        width: 40,
        color: '#27272f',
    },
    headShopholder: {
        top: 120,
        height: 120,
        flex: 8,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    shopNameView: {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: 10,
        right: 10,
        bottom: 7,
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopCartthum: {
        height: 55,
        width: 55,
        backgroundColor: 'transparent'
    },
    shopCart: {
        left: 5,
        width: screenWidth - 10 * 2 - 55 - 5,
        fontSize: 15,
        color: 'white',
        backgroundColor: 'transparent',
    },
    rightContainer: {
        height: 75,
        paddingLeft: 10,
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    title: {
        paddingTop: 0,
        marginBottom: 8,
        textAlign: 'left',
        fontSize: 14,
        color: '#27272F',
    },
    shoptitle: {
        paddingTop: 0,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 11,
        textAlign: 'left',
        color: '#f9f9f9',
    },
    shoptitleButton: {
        height: 18,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#ef4949',
    },
    shopcut: {
        marginLeft: 10,
        fontSize: 12,
        color: '#27272f',
        textAlign: 'left',
        backgroundColor: 'transparent',
    },
    price: {
        paddingLeft: 10,
        color: '#9900ff',
        textAlign: 'left',
    },
    listthumbnail: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        width: 75,
        height: 75,
        backgroundColor: '#f6f6f6',
    },
    listcartcircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ffffff',
    },
    listcart: {
        marginLeft: 6,
        marginTop: 8,
        width: 17,
        height: 16,
        backgroundColor: 'transparent',
    },
    listcartcontainer: {
        right: 10,
        position: 'absolute',
        backgroundColor: '#f6f6f6',
    },
    seller_bg: {
        width: screenWidth,
        height: screenWidth / 750 * 328,
    },
    chatthumbnail: {
        top: 20,
        right: 30,
        position: 'absolute',
        width: 30,
        height: 25,
        backgroundColor: 'transparent',
    },
    bottomcircle: {
        bottom: 20,
        left: 10,
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    cartntitle: {
        fontSize: 20,
        color: '#27272f',
        backgroundColor: 'transparent',
    },
    cartntitle0: {
        fontSize: 13,
        backgroundColor: 'transparent',
    },
    cartntitle1: {
        fontSize: 20,
        color: '#e30c26',
        backgroundColor: 'transparent',
    },
    cartntitle2: {
        fontSize: 10,
        color: '#545c66',
    },
    circle: {
        top: 15,
        right: 20,
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fefe03',
    },
    listView: {},
    listcontainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
    },
    priceContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    priceText: {
        fontSize: 13,
        color: '#E30C26',
        marginBottom: 0
    },
    priceTextWeakCon: {
        flexDirection: 'row',
        marginLeft: 4,
    },
    priceTextWeakSymbol: {
        fontSize: 10,
        color: '#BEBEBE'
    },
    priceTextWeak: {
        fontSize: 10,
        color: '#BEBEBE',
        textDecorationLine: 'line-through',
        marginBottom: 1
    },

    topCartBox: {}
});

// AppRegistry.registerComponent('BZMCartCouDan', () => BZMCartCouDan);
module.exports = BZMCartCouDan;
