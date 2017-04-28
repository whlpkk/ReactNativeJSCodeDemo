/*
 *
 * @providesModule TBHSwapView
 */
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;
class TBHSwapView extends React.Component {
  render() {
    return <RCTTBHScrollView {...this.props} />;
  }
}
TBHSwapView.propTypes = {
  enableDragToRight: React.PropTypes.bool,
  items:React.PropTypes.array,
  onShowPage:React.PropTypes.func,
  onPageLoad:React.PropTypes.func,
  onSwapScroll:React.PropTypes.func,
  onSwapScrollEnd:React.PropTypes.func
};
var RCTTBHScrollView = requireNativeComponent('RCTTBHScrollView', TBHSwapView);

module.exports = TBHSwapView;
