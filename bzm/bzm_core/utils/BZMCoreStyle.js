/*
 *
 * @providesModule BZMCoreStyle
 */
'use strict';

class BZMCoreStyle {

    static RIGHT_ARROW_MARGIN:number = 10; //单元格右箭头距离右侧的距离
    static RED_UNDERLAY_COLOR:string = "#B33B3E";
    static ORANGE_UNDERLAY_COLOR:string = "#CA7532";
    static LIGHTGRAY_UNDERLAY_COLOR:string = "#D5D5D5";

    static lineHeight():number {
        return 0.5;
    }

    static navigationBarHeight():number {
        return 64;
    }

    static skuContainer():object {
        var Dimensions = require('Dimensions');
        var screenWidth = Dimensions.get('window').width;
        var screenHeight = Dimensions.get('window').height;
        let presentHeight = screenHeight - 135;
        return {
            backgroundColor: '#333333',
            width: screenWidth,
            position: "absolute",
            top: screenHeight  ,
            height: presentHeight
        };
    }
}

module.exports = BZMCoreStyle;
