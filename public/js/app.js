//a variable matching the name of your app may sometimes be required by angular
var echidna = {};

// creates the module echidna that has all the required dependencies
var app = angular.module('echidna', [ 
  'tanzFilters', // from angular-i18n, additional module
  'ngResource', // angular common resource library
  'ui', // angular-ui module
  'jqyoui', // drag-n-drop
  '$strap.directives' // Twitter Bootstrap directives for AngularJS 
]);
