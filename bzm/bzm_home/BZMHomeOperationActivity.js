/*
 *
 * @providesModule BZMHomeOperationActivity
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    ListView,
    View,
    AsyncStorage
    } = React;
var TBFacade = require('../bzm_core/components/TBFacade');
var TBImage = require('../bzm_core/components/TBImage');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreModel = require('BZMCoreModel');
var TBExposureManager = require('TBExposureManager');

var BZMHomeTemplate1 = require('./template/BZMHomeTemplate1');
var BZMHomeTemplate2 = require('./template/BZMHomeTemplate2');
var BZMHomeTemplate3 = require('./template/BZMHomeTemplate3');
var BZMHomeTemplate4 = require('./template/BZMHomeTemplate4');
var BZMHomeTemplate5 = require('./template/BZMHomeTemplate5');
var BZMHomeTemplate6 = require('./template/BZMHomeTemplate6');
var BZMHomeTemplate7 = require('./template/BZMHomeTemplate7');
var BZMHomeTemplate8 = require('./template/BZMHomeTemplate8');
var BZMHomeTemplate9 = require('./template/BZMHomeTemplate9');
var BZMHomeTemplate10 = require('./template/BZMHomeTemplate10');

var templateContent = null;
var youpinContent = null;
var youpinStart = 0;
var youpinIndextDidLoad = false;
var badgeObj = null;
var backGroundColor = '#f6f6f6';

class BZMHomeOperationActivity extends React.Component {
    openWindow(module,item) {
      //打点逻辑
        var index = item.module.indexOf(module);
        var modelVo = {
          analysisId: String(module.id),
          analysisType: "opmodule",
          analysisIndex: index+1,
          analysisSourceType: "5",
        };
        var pageId = "home";
        var pageName = "home";
        TBExposureManager.pushLogForPageName(pageName,pageId,item.modelIndex,modelVo);


        var url = module.value;
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.forward(cTag, url);


    }

    componentDidMount() {
        AsyncStorage.getItem(BZMCoreUtils.HOME_YOUPIN_LOPP_KEY)
            .then((value) => {
                if (value !== null) {
                    youpinStart = parseInt(value);
                } else {
                    youpinStart = 0;
                }
                youpinIndextDidLoad = true;
                this.forceUpdate();
            })
            .catch((error) => {
                youpinStart = 0;
                youpinIndextDidLoad = true;

                this.forceUpdate();
            })
            .done();

        BZMCoreModel.registerComponent['BZMHomeOperationActivity'] = (methodName, params) => {
            if (methodName == 'loadItems') {
                this.forceUpdate();
            }
        };
    }

    containerResponderCapture(evt) {
        return this.props.tbNativeMoving;
    }

    _templateData() {
        var templateArray = BZMCoreUtils.jsonParse(templateContent["/homepromotion/v3"]);
        var d2 =BZMCoreUtils.jsonParse(templateContent["/v6/brand/top"]);
        var youpinData = null;
        if (templateArray == null) {
            return [];
        }
        if (d2 == null) {
            d2 = [];
        } else {
            if (d2.objects == undefined || d2.objects == null || d2.objects.length<1) {
                d2 = [];
            } else {
                d2 = [d2]
            }
        }
        if (youpinContent.hasOwnProperty("/youpin/danpin")) {
            youpinData = BZMCoreUtils.jsonParse(youpinContent["/youpin/danpin"]);
        }
        if (youpinData == null) {
            youpinData = []
        } else {
            youpinData = [youpinData];
        }
        var i=1;
        for (var key in templateArray) {
            var item = templateArray[key];

            if (item.key == "t6") {
                item.module = d2;
            } else if (item.key == "t7") {
                item.module = youpinData;
            }

          item.modelIndex = i;
          i++;
        }

        return templateArray;
    }

    render() {
        var dc1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        if (!youpinIndextDidLoad) {
            return(<View />);
        }

        templateContent = this.props.templateContent;
        youpinContent = this.props.youpinContent;

        // console.log(templateContent);

        if (this.props.reactBackgroudColor && this.props.reactBackgroudColor!='') {
          backGroundColor = '#'+this.props.reactBackgroudColor;
        }else {
          backGroundColor = '#f6f6f6';
        }
        badgeObj = this.props.badge || {
            "badgeHidden" : true,
            "badgeText" : "",
            "title" : "赚积分",
        };

        var data1 = [];
        if (templateContent != undefined && youpinContent != undefined) {
            data1 = this._templateData();
        }
        var listData = [];
        for (var key in data1) {
            var item = data1[key];
            if (item.module.length < 1) {
                continue;
            }
            listData.push(item);
        }
        dc1 = dc1.cloneWithRows(listData);

        return (
            <ListView ref="containerView"
                      style = {{backgroundColor:backGroundColor}}
                      onStartShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}
                      onMoveShouldSetResponderCapture={(evt)=>this.containerResponderCapture(evt)}
                      dataSource={dc1}
                      showsVerticalScrollIndicator={false}
                      renderRow={this.renderHomeRow.bind(this)}
                      scrollEnabled={false}
            />
        );
    }

    renderHomeRow(item) {
        switch (item.key) {
            case "t1":
            {
                return (
                    <BZMHomeTemplate1 optData={item.module}  backGroundColor = {backGroundColor} height={item.height} badge={badgeObj} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t2":
            {
                return (
                    <BZMHomeTemplate2 optData={item.module} backGroundColor = {backGroundColor} height={item.height} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t3":
            {
                return (
                    <BZMHomeTemplate3 optData={item.module} backGroundColor={backGroundColor} height={item.height} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t4":
            {
                return (
                    <BZMHomeTemplate4 optData={item.module} backGroundColor={backGroundColor} height={item.height} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t5":
            {
                return (
                    <BZMHomeTemplate5 optData={item.module} backGroundColor={backGroundColor} height={item.height} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t6":
            {
                return (
                    <BZMHomeTemplate6 optData={item.module} backGroundColor={backGroundColor} height={item.height} modelIndex={item.modelIndex} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t7":
            {
                return (
                    <BZMHomeTemplate7 startIndex={youpinStart} backGroundColor={backGroundColor} height={item.height} optData={item.module} modelIndex={item.modelIndex} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t8":
            {
                return (
                    <BZMHomeTemplate8 optData={item.module} backGroundColor={backGroundColor} height={item.height} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t9":
            {
                return (
                    <BZMHomeTemplate9 optData={item.module} backGroundColor={backGroundColor} height={item.height} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
            case "t10":
            {
                return (
                    <BZMHomeTemplate10 optData={item.module} backGroundColor={backGroundColor} height={item.height} openWindow={(module) => this.openWindow(module,item)}/>
                );
            }
                break;
        }
        return (
            <BZMHomeTemplate4 optData={item.module} height={item.height} backGroundColor={backGroundColor} renderHomeRow openWindow={(module) => this.openWindow(module,item)}/>
        );
    }
}

var styles = StyleSheet.create({
    listView: {
        // backgroundColor: '#ffffff',
    }
});

React.AppRegistry.registerComponent('BZMHomeOperationActivity', () => BZMHomeOperationActivity);
// module.exports = BZMHomeOperationActivity;
