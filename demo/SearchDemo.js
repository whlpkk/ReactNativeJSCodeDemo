'use strict';

var React = require('react-native');
var SearchPage = require('./search/SearchPage');

var styles = React.StyleSheet.create({
  container: {
    flex: 1
  }
});

class SearchDemo extends React.Component {
  render() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Property Finder',
          component: SearchPage,
        }}/>
    );
  }
}

class HelloWorld extends React.Component {
  render() {
    return <React.Text style={styles.text}>Hello World (Again)</React.Text>;
  }
}

React.AppRegistry.registerComponent('SearchDemo',  ()=> SearchDemo);
