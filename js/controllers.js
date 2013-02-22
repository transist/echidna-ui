// controllers.js

app.controller('MainCtrl', function($scope, $http) {
    
    $scope.name = 'World';

    $http.get('data/keywords.json').success(function(data) {
        $scope.keywords = data;
        // console.log (data);
    });

    $scope.list = [{ 'key': 'test', 'drag': true },];    
    
    // console.log($scope);
    // Drag 'n drop callbacks
        $scope.startCallback = function(event, ui) {
            console.log('You started draggin');
        };

        $scope.stopCallback = function(event, ui) {
          console.log('Why did you stop draggin me?');
        };

        $scope.dragCallback = function(event, ui) {
          console.log('hey, look I`m flying');
        };

        $scope.dropCallback = function(event, ui) {
          console.log('hey, you dumped me :-(');
        };

        $scope.overCallback = function(event, ui) {
          console.log('Look, I`m over you');
        };

        $scope.outCallback = function(event, ui) {
          console.log('I`m not, hehe');
        };

});

app.controller('StreamCtrl', function($scope, $http) {
    
    $scope.streamItemsLen = 5; // number of y values


    // Let's simulate stream 
    $scope.data= []; // array to store all values
    var streamLength = 30; // number of x values; max length of data stream

    // init with first values
    initStream( $scope.streamItemsLen, streamLength, function( initData ) {
        
        $scope.data=initData;

    } )

    // 
    $scope.streaming = false; // to start/stop streaming

    
    // Let's stream some randomness
    setInterval(function(){ // tick every second with fake data
            
        if($scope.streaming == true) {

            generateData($scope.streamItemsLen, function(newPoint) {

                addPoint(newPoint, $scope.data, function (newData) {
                    $scope.data= newData;
                    
                });
            }) 
        }
    },1000);
        
    
    $scope.startStopStream = function startStopStream () {
        $scope.streaming = ($scope.streaming) ? false : true;
        // console.log($scope.streaming);
        return $scope.streaming;
    }

    $scope.setStreamLen = function setStreamLen (size) {
        $scope.streamItemsLen = size;
        console.log("$scope.streamItemsLen : "+$scope.streamItemsLen);
    }

});



function initStream( numberItems, streamLength, callback ) {

    var keywords = [];

    // build empty keywords
    for (var i = 0; i < numberItems; i++) {
        
        var keyword = {};
        keyword.key = "";
        keyword.values = [];
        keyword.sample = {};
        keywords.push(keyword);

    };

    // // Generate initial data
    for (var j = 0; j < streamLength; j++) {

        generateData(numberItems, function(data) {
            // format data
            
            for (var i = 0; i < numberItems; i++) {

                keywords[i].key = data[i].keyword;

                // var slice = data[i].sliceid +i*1000;

                keywords[i].values.push( [data[i].count, data[i].sliceid])

            };

        })
    }

    callback(keywords);
}

function addPoint (newPoint, streamData, callback) {

    for (var i = 0; i < newPoint.length; i++) { //loop through each keywords

        streamData[i].values.shift(); // trim first point

        //populate with the new value
        streamData[i].values.push([newPoint[i].count,newPoint[i].sliceid])

    };
}