/*
 *
 * @providesModule TBImage
 */
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;
class TBImage extends React.Component {
  render() {
    return <RCTTBImage {...this.props} />;
  }
}
TBImage.propTypes = {
  urlPath: React.PropTypes.string.isRequired,
  clipsToBounds: React.PropTypes.bool,
  contentGravity: React.PropTypes.string,
  defaultPath: React.PropTypes.string,
  capInsets: React.PropTypes.object,
  defaultImage: React.PropTypes.object,
  onLoadImage:React.PropTypes.func
};
var RCTTBImage = requireNativeComponent('RCTTBImage', TBImage);

module.exports = TBImage;
