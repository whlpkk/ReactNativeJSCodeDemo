/*
 *
 * @providesModule TBRefreshView
 */
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;
class TBRefreshView extends React.Component {
  render() {
    return <RCTTBRefreshView {...this.props}  />;
  }
}
TBRefreshView.propTypes = {
  onRefreshStart: React.PropTypes.func,
};
var RCTTBRefreshView = requireNativeComponent('RCTTBRefreshView', TBRefreshView);

module.exports = TBRefreshView;
