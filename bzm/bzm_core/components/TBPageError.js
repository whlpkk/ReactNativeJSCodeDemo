/*
 *
 * @providesModule TBPageError
 */
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;
class TBPageError extends React.Component {
  render() {
    return <RCTTBPageErrorView {...this.props} />;
  }
}
TBPageError.propTypes = {
  imagePath: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  onTap: React.PropTypes.func.isRequired,
};
var RCTTBPageErrorView = requireNativeComponent('RCTTBPageErrorView', TBPageError);

module.exports = TBPageError;
