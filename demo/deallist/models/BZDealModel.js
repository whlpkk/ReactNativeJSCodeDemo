/**
* Sample React Native App
* https://github.com/facebook/react-native
*/
'use strict';
var React = require('react-native');
var {
  ListView
} = React;
var TBImage = require('./BZDealItem');

var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;

var LOADING = {};

class BZDealModel extends React.Component {
  constructor(props: mixed, context: mixed) {
    super(props, context);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  loadItems () {
    this.state.isLoading = true;

    fetch(REQUEST_URL)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      LOADING[query] = false;
      this.setState({
        isLoadingTail: false,
      });
    })
    .then((responseData) => {
      console.log("did load data..."+responseData.movies);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
        isLoading: false,
      });
    })
    .done();
  }


}

module.exports = BZDealModel;
