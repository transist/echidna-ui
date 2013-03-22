/* Services */
// console.log(window);

// return browserified libraries binded to the global scope
// see echidna-data / bundle.js and app.js
app.factory('feedconfig', function($window) {
    
    // return new ApiClient();
    return new $window.feedconfig.FeedConfig();

});

app.factory('d3data', function($window) {

    return new $window.d3container.D3Container();

});

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          console.log(args)

          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      disconnect: function () {
        socket.disconnect();
      },
      socket: socket

    };
  });
