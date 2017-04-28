/*
 * @providesModule BZMDCostEffective
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('../../bzm_core/components/TBImage');
var TBAlert = require('../../bzm_core/components/TBAlert');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    AlertIOS
} = React;

var fireImageWidth = 58;
var PropTypes = React.PropTypes;

var BZMDCostEffective = React.createClass({
  propTypes: {
    onPressedButton: PropTypes.func
  },
    getInitialState: function() {
      return {
      };
    },
    renderLoadingView: function () {

        return (
            <View />
        );
    },
    //显示评价入口
    renderCommentEntry: function(){
      return(
        <TouchableHighlight onPress={() => this.pressedButton()}>
        <View style={[styles.container2,styles.sbu_borderLeft]}>

        <View>
            <TBImage style={styles.image}
                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_costeffective_icon.png")}/>
        </View>

        <View style={styles.textView}>
          <Text style={styles.textStyle}>值不值?</Text>
        </View>
        </View>
        </TouchableHighlight>
      );
    },
    renderScoreCannotComment: function(model){
      var fireOnWidth=this.countFireWidth(model.score);
      return(
        <View style={[styles.container,styles.sbu_borderLeft]}>

            <View>
                  <Text style={styles.textStyle2}>划算度:
                    <Text style={styles.textStyle3}>{model.ppDegreeContent}</Text>
                  </Text>
            </View>

            <View style={styles.blankView} />

            <View style={styles.fireViewStyle}>
            <TBImage style={styles.fireOffImage}
                    urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_costeffective_fireoff.png")}/>

            <TBImage style={[styles.fireOnImage,{width:fireOnWidth}]}
                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_costeffective_fireon.png")}
                     clipsToBounds={true}
                     contentGravity={'left'}/>
            </View>

        </View>
      );
    },
    countFireWidth: function(score){
      var width = score/5.0*fireImageWidth;
      return width;
    },
    //显示评分并且展示评价入口
    renderScoreAndCommentEntry: function(model){
      var fireOnWidth=this.countFireWidth(model.score);

      return(
        <TouchableHighlight onPress={() => this.pressedButton()}>
        <View style={[styles.container2,styles.sbu_borderLeft]}>

            <View>
                  <Text style={styles.textStyle2}>划算度:
                    <Text style={styles.textStyle3}>{model.ppDegreeContent}</Text>
                  </Text>
            </View>

            <View style={styles.blankView} />

            <View style={styles.fireViewStyle}>
            <TBImage style={styles.fireOffImage}
                    urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_costeffective_fireoff.png")}/>

            <TBImage style={[styles.fireOnImage,{width:fireOnWidth}]}
                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_costeffective_fireon.png")}
                     clipsToBounds={true}
                     contentGravity={'left'}/>
            </View>

            <View style={styles.arrowsView}>
            <TBImage style={styles.arrowsImage}
                     urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>
            </View>
        </View>
        </TouchableHighlight>
      );

    },
    render: function(){
        var model = this.props.costEffectiveModel;
        // console.log(model);
        if (model) {
          if (model.showScoreSwitch && model.showCommentEntrySwitch
              /*&& model.ppDegreeContent!='' && model.ppDegree >=2
              && model.score>0*/) {
              // console.log('两个都开');

              return this.renderScoreAndCommentEntry(model);
          }else if (!model.showScoreSwitch && model.showCommentEntrySwitch
              /*&& model.ppDegreeContent!='' && model.ppDegree >=2
              && model.score>0*/) {
              // console.log('仅显示平价入口，值不值');
              return this.renderCommentEntry();
          }else if (model.showScoreSwitch && !model.showCommentEntrySwitch
              /*&& model.ppDegreeContent!='' && model.ppDegree >=2
              && model.score>0*/) {
              // console.log('显示分数，不能评价打分');
              return this.renderScoreCannotComment(model);
          }else if (!model.showScoreSwitch && !model.showCommentEntrySwitch){
              // console.log('啥也不显示');
              return(
                <View />
              );
          }
        }


      return(
        <View />
      );
    },
    pressedButton: function (){

      this.props.onPressedButton && this.props.onPressedButton();
    }
});

var containerWidth = 97;
var containerHeight = 63;

var styles = StyleSheet.create({
  container: {
      height:containerHeight,
      width:containerWidth,
      backgroundColor:'white',
      position: 'absolute',
      top: 14,
      right:0,
      justifyContent:'center',
      alignItems:'center'
  },
  container2: {
      height:containerHeight,
      width:containerWidth,
      backgroundColor:'white',
      position: 'absolute',
      bottom: 28,
      right:0,
      justifyContent:'center',
      alignItems:'center'
  },
  blankView:{
    height:12+10,
    width:containerWidth
  },
  image: {
    height:22,
    width:20,
    backgroundColor:'white'
  },
  fireOnImage: {
    height:12,
    backgroundColor:'white',
    position:'absolute',
    left:0,

  },
  fireOffImage: {
    height:12,
    width:fireImageWidth,
    backgroundColor:'white',
    position:'absolute',
    left:0,
  },
  textStyle:{
    fontSize:14,
    color:'#545C66',
  },
  textStyle2:{
    fontSize:12,
    color:'#9d9d9d',
    marginRight:10
  },
  textStyle3:{
    fontSize:12,
    color:'#e30c26',
  },
  textView:{
    marginTop:5
  },
  fireViewStyle:{
    position:'absolute',
    marginTop:-12,
    left:(containerWidth-fireImageWidth)/2,
  },
  arrowsView:{
    position:'absolute',
    top:(containerHeight-14)/2,
    right:10
  },
  arrowsImage:{
    width:8,
    height:14,
    backgroundColor:'transparent'
  },
  sbu_borderLeft:{
    // borderColor:'#d5d5d5',
    // borderLeftWidth:0.5
  }
});


module.exports = BZMDCostEffective;
