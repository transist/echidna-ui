/* Services */
// console.log(window);

app.factory('feedconfig', function($window) {
    
    // return new ApiClient();
    return new $window.feedconfig.FeedConfig();

});

app.factory('d3data', function($window) {

    return new $window.d3container.D3Container();

});

// app.factory('slicer', function($window) {
    
//     // return new ApiClient();
//     console.log($window);
//     return new $window.slicer.Slice();

// })


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



function ApiClient() {

    var apiClient = this;

    // Default state    
    apiClient.init = false;

    // Default values     
    apiClient.feedConfig = {

        gender      : "Both",      // "Both", "Men", "Women"
        age         : "All",       // "All", "18-", "24-", "35-", "40+"              
        tier        : "All",       // "All", "Tier1", "Tier2", "Tier3"               
        // city     :  null  ;      // "pinyin" (pinyin formatted name of a city)  Optional

        start       : "", // date formatted 
        end         : "", // date formatted 
        sampling    : "second",

        samples     : 5 // number of keywords
        
    };

}


//  http://www.redips.net/javascript/array-move/
Array.prototype.move = function (pos1, pos2) {
    // local variables
    var i, tmp;
    // cast input parameters to integers
    pos1 = parseInt(pos1, 10);
    pos2 = parseInt(pos2, 10);
    // if positions are different and inside array
    if (pos1 !== pos2 &&
        0 <= pos1 && pos1 <= this.length &&
        0 <= pos2 && pos2 <= this.length) {
        // save element from position 1
        tmp = this[pos1];
        // move element down and shift other elements up
        if (pos1 < pos2) {
            for (i = pos1; i < pos2; i++) {
                this[i] = this[i + 1];
            }
        }
        // move element up and shift other elements down
        else {
            for (i = pos1; i > pos2; i--) {
                this[i] = this[i - 1];
            }
        }
        // put element from position 1 to destination
        this[pos2] = tmp;
    }
}