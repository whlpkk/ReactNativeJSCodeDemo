/*
 * @providesModule BZMDDimension
 * @flow
 */
'use strict';
var React = require('react-native');
var BZMDProductParameterItem = require('BZMDProductParameterItem');
var BZMDProductParameterCell = require('BZMDProductParameterCell');
var BZMDSizeChartItem = require('BZMDSizeChartItem');
var BZMDSizeChartCell = require('BZMDSizeChartCell');
var BZMDSizeChartHeaderCell = require('BZMDSizeChartHeaderCell');
var BZMCoreUtils = require('BZMCoreUtils');

var {
    AppRegistry,
    StyleSheet,
    View,
    ScrollView,
    ListView,
    Text
} = React;

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;
var resultsCache = [];
var chartDescripeStr = '';

var PropTypes = React.PropTypes;
var dataDict = {};

var BZMDDimension = React.createClass({
  propTypes: {
    onScrollToOrigin: PropTypes.func
  },
  _ScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    if (offset < -60) {
      this.props.onScrollToOrigin && this.props.onScrollToOrigin();
    }
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded:false,

      items:undefined,
      loadedSizeChart:false,

      sizeInfoItem: undefined,
      loadedSizeInfo: false,

      bustItem: undefined,
      loadedBustInfo: false,

      womenShoesItem: undefined,
      loadedWomenShoesItem: false,

      manShoesItem: undefined,
      loadedManShoesItem: false,

      feelItem: undefined,
      loadedFeelItem: false,

      newSizeXXItems: undefined,
      newSizeXXTitle:'',
      loadedNewSizeXXItems: false,


      newFellItems: undefined,
      loadedNewFellItems: false,
      newFellTitle: ''
    };
  },
  componentDidMount: function() {
    // this.setState({
    //   loaded: false,
    // });
    // this.fetchData();
    //封装产品参数items
    this.wrapperProductParameterItem(this.props.datas.prod.properties);

    dataDict = BZMCoreUtils.jsonParse(this.props.datas.deal.attributes);
    if (dataDict == null) {
      return;
    }

    if (this.isNewChartData()) {
      //新版尺码表
      for (var item in dataDict) {
          //因展示顺序有要求固身高体重表和试穿感受表另作处理
          if (dataDict[item].type.indexOf('_') > 0) {
              if (dataDict[item].comment && dataDict[item].comment !== "") {
                  chartDescripeStr = '尺码说明：' + dataDict[item].comment;
              }
               //获取size_XX表的dom
              this.wrapperNewSizeXXItem(dataDict[item]);

          }
      }
      this.wrapperNewStItem(dataDict);// 身高体重

      //试穿感受
      if (dataDict.feel) {
        this.wrapperNewFellItem(dataDict.feel);// 身高体重
      }

    }else {
      //老版尺码表
          this.wrapperSizeChartItem(dataDict);
          this.wrapperSizeInfoItem(dataDict);
          this.wrapperBustItem(dataDict);
          // this.wrapperShoesItem(dataDict);
          this.wrapperFellItem(dataDict);
    }

  },
  wrapperNewStItem: function(tbdata){
    if (tbdata.st) {
      var array = tbdata.st.values;
      var items = [];

      for (var i = 0; i < array[0].length; i++) {
          var valueArr = [];

          for (var j = 0; j < array.length; j++) {
            var sizeChartItem = new BZMDSizeChartItem();
            sizeChartItem.sizeChartValue = array[j][i].value;
            valueArr.push(sizeChartItem);
          }
          items.push(valueArr);
      }

      this.setState(
        {
          items: items,
          loadedSizeChart: true
        }
      );

    }
  },
  wrapperNewSizeXXItem: function(tbdata){

    var array = tbdata.values;
    var items = [];

    for (var i = 0; i < array[0].length; i++) {
        var valueArr = [];

        for (var j = 0; j < array.length; j++) {
          var sizeChartItem = new BZMDSizeChartItem();
          sizeChartItem.sizeChartValue = array[j][i].value;
          valueArr.push(sizeChartItem);
        }
        items.push(valueArr);
    }

    this.setState(
      {
        newSizeXXItems: items,
        loadedNewSizeXXItems: true,
        newSizeXXTitle:tbdata.title
      }
    );
  },
  wrapperNewFellItem: function(tbdata){

    var array = tbdata.values;
    var items = [];

    for (var i = 0; i < array[0].length; i++) {
        var valueArr = [];

        for (var j = 0; j < array.length; j++) {
          var sizeChartItem = new BZMDSizeChartItem();
          sizeChartItem.sizeChartValue = array[j][i].value;
          valueArr.push(sizeChartItem);
        }
        items.push(valueArr);
    }

    this.setState(
      {
        newFellItems: items,
        loadedNewFellItems: true,
        newFellTitle:tbdata.title
      }
    );
  },

  wrapperProductParameterItem: function(productParameterArr) {
    var propDeals = [];
    for (var itemIndex in productParameterArr) {
      var item = productParameterArr[itemIndex];
      var ppItem = new BZMDProductParameterItem();
      ppItem.propertiesName = item.propertiesName;
      ppItem.propertiesValue =item.propertiesValue;
      propDeals.push(ppItem);
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(propDeals),
      loaded: true,
    });
  },
  wrapperSizeChartItem: function(tbdata){

    if (tbdata.st!=null && tbdata.st.colhead.length > 0 && tbdata.st.rowhead.length > 0) {
      this.wrapperItem(tbdata.st,'st');
    }
  },
  wrapperSizeInfoItem: function(tbdata){
    if (tbdata.size!=null && tbdata.size.colhead.length > 0 && tbdata.size.rowhead.length > 0) {
        this.wrapperItem(tbdata.size,'size');
      }
  },
  wrapperBustItem: function(tbdata){
    if (tbdata.xx!=null && tbdata.xx.colhead.length > 0 && tbdata.xx.rowhead.length > 0) {
      var temdata = tbdata.xx;
      var valueArr = temdata.values;

      var items=[];
      var value = [];
      var firstValue = new BZMDSizeChartItem();
      firstValue.sizeChartValue = "下胸围、上胸围、差";
      value.push(firstValue);

      for (var itemIndex in temdata.rowhead) {
        var sizeChartItem = new BZMDSizeChartItem();
        sizeChartItem.sizeChartValue = temdata.rowhead[itemIndex];
        value.push(sizeChartItem);
      }
      items.push(value);


      for (var index in temdata.colhead) {
        var colheadValueArr = [];
        var firstValue = new BZMDSizeChartItem();
        firstValue.sizeChartValue = temdata.colhead[index];
        colheadValueArr.push(firstValue);

        for (var i = 0; i < valueArr.length; i++) {

          if (valueArr[i].colhead == temdata.colhead[index]) {
            var sizeChartItem2 = new BZMDSizeChartItem();
            sizeChartItem2.sizeChartValue = valueArr[i].value;
            colheadValueArr.push(sizeChartItem2);
          }

        }
        items.push(colheadValueArr);
      }

        this.setState({
          bustItem: items,
          loadedBustInfo: true
        });
    }

},
wrapperShoesItem: function(tbdata){
  if (tbdata.mx!=null && tbdata.mx.length > 0) {
      var items = [];
      var temdata = tbdata.mx;

      var array = temdata[0].split(":");

      for (var i = 0; i < temdata.length; i++) {
        var valueArr = [];
        for (var j = 0; j < array.length; j++) {
          var sizeChartItem = new BZMDSizeChartItem();
          sizeChartItem.sizeChartValue = temdata[i].split(":")[j];
          valueArr.push(sizeChartItem);
        }
        items.push(valueArr);
      }

      this.setState(
        {
          manShoesItem: items,
          loadedManShoesItem: true
        }
      );
    }

    if (tbdata.wx!=null && tbdata.wx.length > 0) {
        var items = [];
        var temdata = tbdata.mx;

        var array = temdata[0].split(":");

        for (var i = 0; i < temdata.length; i++) {
          var valueArr = [];
          for (var j = 0; j < array.length; j++) {
            var sizeChartItem = new BZMDSizeChartItem();
            sizeChartItem.sizeChartValue = temdata[i].split(":")[j];
            valueArr.push(sizeChartItem);
          }
          items.push(valueArr);
        }

        this.setState(
          {
            womenShoesItem: items,
            loadedWomenShoesItem: true
          }
        );
      }
},
wrapperFellItem: function(tbdata){
  if (tbdata.feel!=null && tbdata.feel.length > 0) {
      var items = [];
      var temdata = tbdata.feel;
      var rlen = temdata[0].split(":");

      for (var i = 0; i < rlen.length; i++) {
        var valueArr = [];
        for (var j = 0; j < temdata.length; j++) {

            var sizeChartItem = new BZMDSizeChartItem();
            sizeChartItem.sizeChartValue = temdata[j].split(":")[i];
            valueArr.push(sizeChartItem);
        }
        items.push(valueArr);
      }
      // console.log(items);

      this.setState(
        {
          feelItem: items,
          loadedFeelItem: true
        }
      );

    }
},

wrapperItem :function(temdata,key){

  var title='';
  switch (key) {
    case 'st':
      title = '身高、体重';
      break;
    case 'size':
      title = '尺码';
      break;
    default:

  }
  var valueArr = [];
  var _index = 0;
  for (var i = 0; i < temdata.values.length; i++) {
      if (temdata.values[i].length < temdata.colhead.length) {
          temdata.rowhead.splice((parseInt(i) - parseInt(_index)), 1);
          _index++;
      } else {
          valueArr.push(temdata.values[i]);
      }
  }

  var items=[];
  var value = [];
  var firstValue = new BZMDSizeChartItem();
  firstValue.sizeChartValue = title;
  value.push(firstValue);

  for (var itemIndex in temdata.rowhead) {
    var sizeChartItem = new BZMDSizeChartItem();
    sizeChartItem.sizeChartValue = temdata.rowhead[itemIndex];
    value.push(sizeChartItem);
  }
  items.push(value);

  for (var index in temdata.colhead) {
    var colheadValueArr = [];
    var firstValue = new BZMDSizeChartItem();
    firstValue.sizeChartValue = temdata.colhead[index];
    colheadValueArr.push(firstValue);

    for (var i = 0; i < valueArr.length; i++) {
      for (var index2 in valueArr[i]) {

        if (valueArr[i][index2].colhead == temdata.colhead[index]) {
          var sizeChartItem2 = new BZMDSizeChartItem();
          sizeChartItem2.sizeChartValue = valueArr[i][index2].value;
          colheadValueArr.push(sizeChartItem2);
        }
      }
    }
    items.push(colheadValueArr);
}
  switch (key) {
    case 'st':
      this.setState({
        items: items,
        loadedSizeChart: true
      });
      break;
    case 'size':
      this.setState({
        sizeInfoItem: items,
        loadedSizeInfo: true
      });
      break;

    default:

  }

},
  renderRow: function(BZMDProductParameterItem){
    return(
      <BZMDProductParameterCell deal={BZMDProductParameterItem}/>
    );
  },
  renderRow2: function(dataArry){
    return(
      <BZMDSizeChartCell deal={dataArry}/>
    );
  },
  renderRow1: function(deal){
    return(
      <BZMDSizeChartHeaderCell deal={deal} />
    );
  },

  renderListView: function(type){

    var dataSource1 = new ListView.DataSource({
      rowHasChanged:(row1,row2)=>row1 !== row2,
    });
    var dataSource2 = new ListView.DataSource({
      rowHasChanged:(row1,row2)=>row1 !== row2,
    });

    var title='';
    switch (type) {
      case 'st':
        title = '身高尺码对照表';
        var items1 = this.state.items[0];

        dataSource1 = dataSource1.cloneWithRows(items1);

        var items2 = [];
        for (var i = 1; i <this.state.items.length; i++) {
          items2.push(this.state.items[i]);
        }
        dataSource2 = dataSource2.cloneWithRows(items2);
        break;
      case 'size':
          title = '尺码信息';
          var items1 = this.state.sizeInfoItem[0];

          dataSource1 = dataSource1.cloneWithRows(items1);

          var items2 = [];
          for (var i = 1; i <this.state.sizeInfoItem.length; i++) {
            items2.push(this.state.sizeInfoItem[i]);
          }
          dataSource2 = dataSource2.cloneWithRows(items2);
        break;
        case 'xx':
            title = '胸围对照表';
            var items1 = this.state.bustItem[0];

            dataSource1 = dataSource1.cloneWithRows(items1);

            var items2 = [];
            for (var i = 1; i <this.state.bustItem.length; i++) {
              items2.push(this.state.bustItem[i]);
            }
            dataSource2 = dataSource2.cloneWithRows(items2);
          break;

        case 'mx':
            title = '鞋码对照表';
            var items1 = this.state.manShoesItem[0];

            dataSource1 = dataSource1.cloneWithRows(items1);

            var items2 = [];
            for (var i = 1; i <this.state.manShoesItem.length; i++) {
              items2.push(this.state.manShoesItem[i]);
            }
            dataSource2 = dataSource2.cloneWithRows(items2);
          break;
          case 'wx':
              title = '鞋码对照表';
              var items1 = this.state.womenShoesItem[0];

              dataSource1 = dataSource1.cloneWithRows(items1);

              var items2 = [];
              for (var i = 1; i <this.state.womenShoesItem.length; i++) {
                items2.push(this.state.womenShoesItem[i]);
              }
              dataSource2 = dataSource2.cloneWithRows(items2);
            break;
            case 'feel':
                title = '试穿感受';
                var items1 = this.state.feelItem[0];

                dataSource1 = dataSource1.cloneWithRows(items1);

                var items2 = [];
                for (var i = 1; i <this.state.feelItem.length; i++) {
                  items2.push(this.state.feelItem[i]);
                }
                dataSource2 = dataSource2.cloneWithRows(items2);
              break;

            //新版尺码表
            case 'newSizeXX':
                title = this.state.newSizeXXTitle;
                var items1 = this.state.newSizeXXItems[0];

                dataSource1 = dataSource1.cloneWithRows(items1);

                var items2 = [];
                for (var i = 1; i <this.state.newSizeXXItems.length; i++) {
                  items2.push(this.state.newSizeXXItems[i]);
                }
                dataSource2 = dataSource2.cloneWithRows(items2);
              break;

            case 'newFell':
                title = this.state.newFellTitle;
                var items1 = this.state.newFellItems[0];

                dataSource1 = dataSource1.cloneWithRows(items1);

                var items2 = [];
                for (var i = 1; i <this.state.newFellItems.length; i++) {
                  items2.push(this.state.newFellItems[i]);
                }
                dataSource2 = dataSource2.cloneWithRows(items2);
              break;
      default:

    }
  return(
    <View>
    <View style={styles.headView}>
      <View style={styles.redView} />
      <Text style={styles.headTitle}>{title}</Text>
    </View>
    <View style={{flexDirection:'row'}}>
      <View>
      <ListView
              dataSource={dataSource1}
              renderRow={this.renderRow1}
              scrollEnabled={false}
      />
      </View>
      <ListView
              dataSource={dataSource2}
              renderRow={this.renderRow2}
              horizontal={true}
              bounces ={false}
              showsHorizontalScrollIndicator={false}
      />

    </View>
    </View>
  );

  },
  renderSizeChartListView: function(){
    if (!this.state.loadedSizeChart || this.state.items==undefined || this.state.items.length<=0) {
      return <View />;
    }
    return this.renderListView('st');
  },
  renderSizeInfoListView: function(){

    if (!this.state.loadedSizeInfo || this.state.sizeInfoItem==undefined || this.state.sizeInfoItem.length<=0) {
      return <View />;
    }
    return this.renderListView('size');
  },
  renderBustListView: function(){

    if (!this.state.loadedBustInfo || this.state.bustItem==undefined || this.state.bustItem.length<=0) {
      return <View />;
    }
    return this.renderListView('xx');
  },
  renderManShoesListView: function(){
    if (!this.state.loadedManShoesItem || this.state.manShoesItem==undefined || this.state.manShoesItem.length<=0) {
      return <View />;
    }
    return this.renderListView('mx');
  },

  renderWomenShoesListView: function(){
    if (!this.state.loadedWomenShoesItem || this.state.womenShoesItem==undefined || this.state.womenShoesItem.length<=0) {
      return <View />;
    }
    return this.renderListView('wx');
  },


  renderFeelListView: function(){
    if (!this.state.loadedFeelItem || this.state.feelItem==undefined || this.state.feelItem.length<=0) {
      return <View />;
    }
    return this.renderListView('feel');
  },
//新版尺码表
  renderNewSizeXXListView: function(){
    if (!this.state.loadedNewSizeXXItems || this.state.newSizeXXItems==undefined || this.state.newSizeXXItems.length<=0) {
      return <View />;
    }
    return this.renderListView('newSizeXX');
  },
  renderNewFellListView: function(){
    if (!this.state.loadedNewFellItems || this.state.newFellItems==undefined || this.state.newFellItems.length<=0) {
      return <View />;
    }
    return this.renderListView('newFell');
  },

  rederProductParameterView: function(){

    return(
      <View>
        <View style={[styles.headView,styles.sbu_borderBottom]}>
          <View style={styles.redView} />
          <Text style={styles.headTitle}>商品参数</Text>
        </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            scrollEnabled={false}
          />

      </View>
    );
  },
  renderExplainView: function(){

    if (this.isNewChartData()){

      if (chartDescripeStr !=null && chartDescripeStr != "") {
        return(
          <View>
            <Text style={styles.explainTextStyle}>{chartDescripeStr}</Text>
          </View>
        );
      }else {
        return(<View />);
      }

    }else {
      if (dataDict != null && dataDict.sm!=null && dataDict.sm != "") {
        return(
          <View>
            <Text style={styles.explainTextStyle}>尺码说明：{dataDict.sm}</Text>
          </View>
        );
      }else {
        return(<View />);
      }
    }

  },
  isNewChartData: function(){
    if (this.props.datas.prod.product.sizeModelId
        && this.props.datas.prod.product.sizeModelId != 0){
        return true;
      }else {
        return false;
      }
  },

  // “身高尺码对照表”“尺码信息”“试穿感受
    render: function(){
      if (this.isNewChartData()){
          //新版尺码表
          return(
            <View style={styles.container}>
              <ScrollView
              onScrollEndDrag={this._ScrollViewEndDrag}>
                {this.renderExplainView()}

                {this.renderSizeChartListView()}
                {this.renderNewSizeXXListView()}
                {this.renderNewFellListView()}

                {this.rederProductParameterView()}
              </ScrollView>
            </View>
          );
      }
        //老版尺码表
        return(
          <View style={styles.container}>
            <ScrollView
            onScrollEndDrag={this._ScrollViewEndDrag}>

              {this.renderExplainView()}

              {this.renderSizeChartListView()}
              {this.renderSizeInfoListView()}
              {this.renderBustListView()}
              {this.renderManShoesListView()}
              {this.renderWomenShoesListView()}
              {this.renderFeelListView()}

              {this.rederProductParameterView()}
            </ScrollView>
          </View>
        );
    }
});

var styles = StyleSheet.create({
  container: {
      height:screenHeight - 51 - 44 -64,
      backgroundColor:'white'
  },
  headView:{
    height:40,
    alignItems:'center',
    flexDirection:'row'
  },
  redView:{
    width:3,
    height:13,
    marginLeft:10,
    backgroundColor:'#E30C26'
  },
  headTitle:{
    fontSize:13,
    color:'#545C66',
    marginLeft:5,
    fontWeight: '400',
  },
  explainTextStyle:{
    fontSize: 12,
    marginLeft:10,
    marginTop:20,
    // marginBottom:10,
    marginRight:10,
    color:'#27272F',
    alignItems:'center',
    justifyContent:'center',
  },
  sizeChartView:{
    width:screenWidth,
    flexDirection:'row'
  },
  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  },
  listViewStyle:{
    width:68
  }
});

module.exports = BZMDDimension;
