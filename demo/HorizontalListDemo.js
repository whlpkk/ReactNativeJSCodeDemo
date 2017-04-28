/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');

var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  AlertIOS,
  View,
} = React;
var TBImage = require('../bzm/bzm_core/components/TBImage');
var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;

var HorizontalListDemo = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <View style={styles.topContainer} >
           <View style={styles.titleContainer}>
            <Text style={styles.text}>横向滚动列表</Text>
           </View>

        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          style={styles.listView}
          horizontal={true}
          pagingEnabled={true}
          />
      </View>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  },

  renderMovie: function(movie) {
    return (
      <TouchableHighlight style={styles.touchContainer} onPress={() => AlertIOS.alert(
        'T' ,
        'My Alert Msg',
        [
          {text: 'Foo', onPress: () => console.log('Foo Pressed!'+movie.title)},
          {text: 'Bar', onPress: () => console.log('Bar Pressed!')},
        ]
      )}>
      <View style={styles.rowContainer}>

      <TBImage
      urlPath={movie.posters.thumbnail}
      style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.year}>{movie.year}</Text>
      </View>

      </View>


      </TouchableHighlight>

    );
  },
});
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var styles = StyleSheet.create({
  titleContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    marginRight:0,
    backgroundColor:'#912fee',
  },
  text: {
    color:'#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  topContainer: {
    marginLeft:0,
    marginTop: 0,
    marginRight:0,
    backgroundColor:'#11ffee',
    height: 64,
    alignItems: 'center',
  },
  touchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor:'#ff0000',
    flex: 1,
    flexDirection: 'column'
  },
  rowContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 0,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    paddingVertical: 5,
    width: screenWidth
  },
  rightContainer: {
    paddingLeft: 10,
    flex: 1,
    flexDirection: 'column',
    height:81,
    backgroundColor: '#99F090',
  },
  title: {
    paddingTop: 0,
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'left',
  },
  year: {
    color: '#9900ff',
    textAlign: 'left',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('HorizontalListDemo', () => HorizontalListDemo);
