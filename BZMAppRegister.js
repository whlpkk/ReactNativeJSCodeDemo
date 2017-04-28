'use strict';

var React = require('react-native');
var {AppRegistry} = React;

var BZMPageLoadError = require('BZMPageLoadError');
var BZMDCommentList = require('BZMDCommentList');
var BZMDMain = require('BZMDMain');
var BZMUMain = require('BZMUMain');
var BZMCartMain = require('BZMCartMain');
var BZMCartCouDan = require('BZMCartCouDan');
var BZMCartInvalidGMain = require('BZMCartInvalidGMain');

AppRegistry.registerConfig([
    {appKey:"BZMPageLoadError",component:()=> BZMPageLoadError},
    {appKey:"BZMDCommentList",component:()=> BZMDCommentList},
    {appKey:"BZMDMain",component:()=> BZMDMain},
    {appKey:"BZMUMain",component:()=> BZMUMain},
    {appKey:"BZMCartMain",component:()=> BZMCartMain},
    {appKey:"BZMCartCouDan",component:()=> BZMCartCouDan},
    {appKey:"BZMCartInvalidGMain",component:()=> BZMCartInvalidGMain}
]);
