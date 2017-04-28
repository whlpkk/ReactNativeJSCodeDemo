/*
 *
 * @providesModule ImageViewerDemo
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
    } = React;

var TBAnimation = require('../bzm/bzm_core/components/TBAnimation');
var TBImage = require('../bzm/bzm_core/components/TBImage');
var TBFacade = require('../bzm/bzm_core/components/TBFacade');
var TBTip = require('../bzm/bzm_core/components/TBTip');
var imag1 = "http://img.ivsky.com/img/bizhi/pre/201107/29/kung_fu_panda_2-007.jpg";
var imag2 = "http://img.ivsky.com/img/bizhi/pre/201107/29/kung_fu_panda_2-008.jpg";
var imag3 = "http://img.ivsky.com/img/bizhi/pre/201107/29/resistance_3.jpg";
var imag4 = "http://img.ivsky.com/img/bizhi/pre/201107/29/resistance_3-001.jpg";
var imag5 = "http://img.ivsky.com/img/bizhi/pre/201107/29/kung_fu_panda_2-001.jpg";
var imag6 = "http://img.ivsky.com/img/bizhi/pre/201107/29/kung_fu_panda_2-002.jpg";

class ImageViewerDemo extends React.Component {
    tipBlock() {

    }

    onGoBack() {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.goBack(cTag);
    }

    onImageViewer(imageTagRef, pIndex) {
        var pView = this.refs[imageTagRef];
        var reactTag = React.findNodeHandle(pView);

        var arr2 = [imag1, imag2, imag3, imag4, imag5, imag6];
        var items = [];
        for (var inx in arr2) {
            var item = arr2[inx];
            items.push({title: "仅仅是测试而已", image: item});
        }
        var index2 = parseInt(pIndex);
        //TBAnimation.imageViewer(reactTag, items, index2);
        TBAnimation.imageViewerMore(reactTag, items, index2, "滑动查看图文详情", "释放查看图文详情", (pIndex)=>{
            TBTip.show('查看图文详情提示index=: '+pIndex, 'success');
        });
    }

    onLoadImage(e) {
        if (e.nativeEvent.code == 0) {
            console.log("width: "+e.nativeEvent.width+", height: "+e.nativeEvent.height);
        }
    }

    getImageViews(imgArr, refStartInx) {
        var images1 = [];
        var inx2 = refStartInx;
        for (var index in imgArr) {
            var imgRef = 'TBImage_' + inx2;
            var item = imgArr[index];
            var imageItem =
                (
                    <TouchableHighlight key={inx2}
                                        style={styles.touch_img}
                                        onPress={this.onImageViewer.bind(this, imgRef, inx2)}>
                        <View>
                            <TBImage ref={imgRef} style={styles.pre_img}
                                     urlPath={item}
                                     defaultPath="bundle://house@2x.png"
                                     onLoadImage={this.onLoadImage.bind(this)}
                            />
                        </View>
                    </TouchableHighlight>
                );
            images1.push(imageItem);
            inx2++;
        }
        return images1;
    }

    render() {
        var images1 = this.getImageViews([imag1, imag2, imag3], 0);
        var images2 = this.getImageViews([imag4, imag5, imag6], 3);
        return (
            <View style={styles.container} ref="containerView">
                <View style={styles.topContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.text}>图片预览</Text>
                    </View>
                    <TouchableHighlight style={styles.touchableContainer} onPress={this.onGoBack.bind(this)}>
                        <View style={styles.backContainer}>
                            <TBImage style={styles.img} urlPath="bundle://common_goback_btn@2x.png"/>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.content}>
                    <View style={styles.img_container}>
                        {images1}
                    </View>
                    <View style={styles.img_container}>
                        {images2}
                    </View>
                </View>

            </View>);
    }
}
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var styles = StyleSheet.create({
    touchableContainer: {
        marginTop: 20,
        marginLeft: 10,
        justifyContent: "center",
        height: 44,
        width: 50,
        backgroundColor: '#f0f0f0'
    },
    backContainer: {
        justifyContent: "center",
        height: 44,
        width: 50,
        backgroundColor: '#f0f0f0'
    },
    titleContainer: {
        justifyContent: "center",
        alignItems: "center",
        top: 20,
        left: 0,
        height: 44,
        position: 'absolute',
        width: screenWidth
    },
    text: {
        fontSize: 17
    },
    container: {
        backgroundColor: '#eeeeee',
        flex: 1
    },
    content: {
        backgroundColor: '#333333',
        flex: 1
    },
    img_container: {
        marginTop: 10,
        flexDirection: 'row'
    },
    topContainer: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#f0f0f0',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pageError: {
        backgroundColor: '#ffffff',
        flex: 1
    },
    img: {
        width: 12,
        height: 22,
        backgroundColor: 'transparent'
    },
    touch_img: {
        marginLeft: 10,
        width: 90,
        height: 60,
        backgroundColor: '#eeeeee'
    },
    pre_img: {
        width: 90,
        height: 60,
        backgroundColor: '#eeeeee'
    }
});

React.AppRegistry.registerComponent('ImageViewerDemo', ()=> ImageViewerDemo);
