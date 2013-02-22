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
    
    var numberItems = 5; // number of y values


    // Let's simulate stream 
    $scope.data= []; // array to store all values
    var streamLength = 30; // number of x values; max length of data stream

    // var keywords = [];

    // build empty keywords
    for (var i = 0; i < numberItems; i++) {
        
        var keyword = {};
        keyword.key = "";
        keyword.values = [];
        keyword.sample = {};
        $scope.data.push(keyword);

    };

    // Generate inital data
    for (var i = 0; i < streamLength; i++) {
        generateData(numberItems, function(data) {
            // format data
            
            for (var i = 0; i < numberItems; i++) {

                $scope.data[i].key = data[i].keyword;
                $scope.data[i].values.push([data[i].count,data[i].sliceid])

            };

        })
    }

    // console.log($scope.data)

    // console.log(datastream);
    // console.log($scope.datastream.length);

    // Let's stream some randomness
    setInterval(function(){ // tick every second with fake data

        generateData(numberItems, function(incomingData) {// callback
                // console.log(incomingData);

                for (var i = 0; i < numberItems; i++) { //loop through each keywords

                    $scope.data[i].values.shift(); // trim first point

                    //populate with the new value
                    $scope.data[i].values.push([incomingData[i].count,incomingData[i].sliceid])

                };

            // console.log($scope.data[0].values[0]);

        }) },1000);


});