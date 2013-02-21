//services.js

/* Services */

angular.module('streamServices', ['ngResource']).
    
    factory('Keyword', function($resource){

      return $resource('keywords/:phoneId.json', {}, {
        query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
      });

});
