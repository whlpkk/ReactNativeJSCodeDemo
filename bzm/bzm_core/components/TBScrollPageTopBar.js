/*
 *
 * @providesModule TBScrollPageTopBar
 */
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;
var TBScrollPageTopBarManager  = require('react-native').NativeModules.TBScrollPageTopBarManager;

var TOPBAR_REF = 'scrollPageTopBar';

class TBScrollPageTopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <RCTTBScrollPageTopBar
      {...this.props}
      ref={TOPBAR_REF}
      onLayout={()=>{this.selectIndex(this.props.initialIndex);}}
    />;
  }

  reloadData() {
    TBScrollPageTopBarManager.reloadData(React.findNodeHandle(this.refs[TOPBAR_REF]));
  }

  selectIndex(index,animated){
    if (animated === undefined) {
      animated = true;
    }
    TBScrollPageTopBarManager.selectItem( React.findNodeHandle(this.refs[TOPBAR_REF]), index, animated);
  }
}

TBScrollPageTopBar.propTypes = {
  // urlPath: React.PropTypes.string.isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  onExtendPress: React.PropTypes.func,
  onItemChange: React.PropTypes.func,
  initialIndex: React.PropTypes.number,
};

TBScrollPageTopBar.defaultProps = {
  initialIndex: 0,
};

var RCTTBScrollPageTopBar = requireNativeComponent('RCTTBScrollPageTopBar', TBScrollPageTopBar);

module.exports = TBScrollPageTopBar;
