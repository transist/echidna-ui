// controllers.js

app.controller('MainCtrl', function($scope, $http) {
    
    $scope.name = 'World';
    $scope.keywords = []; // array to store keywords text
    $scope.colors = []; // global array to store keywords color

    // $http.get('data/keywords.json').success(function(data) {
    //     // console.log (data);
    // });

    $scope.list = [ 'drag me'];    
    
    // console.log($scope.keywords.length);
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
    
    $scope.streamSize = 5; // number of keywords (y values)
    $scope.streamLength = 30; // timeframe;  number of x values; max length of data stream

    $scope.btnClick = function btnClick(item) {
        // console.log("nv d3");
        
        // console.log(item);

        // class(item)

        var svg = d3.select("#stream-viz")
            .attr("class", "blabla")

        svg.each(function(data) {

            var container = d3.select(this);

            // console.log(container);
            // console.log(d)
            // d.disabled = !d.disabled;

            data.map(function(d) {
                if(d.key == item) d.disabled =true; //console.log(d);
                console.log(d.disabled)
                // d.disabled = false;
                return d;
            });

            // chart(selection);
            
            // console.log()
            // svg.transition().call(chart)
            // chart(svg);

        })


          // .style('fill', function(d,i) { return d.color || color(d,i)})
          // .style('stroke', function(d,i) { return d.color || color(d, i) });



    }

    // Let's simulate stream 
    $scope.data= []; // array to store all values

    // init with first values
    parseStream( $scope.streamSize, $scope.streamLength, function( initData ) {

        $scope.data=initData;

    } )

    // update global scope keyword list
    updateKeywordList($scope.data, function (list) {

        $scope.$parent.keywords = list;

    })
    
    console.log($scope)

    // to start/stop streaming
    $scope.streaming = false; 
    
    // Let's stream some randomness
    setInterval(function(){ // tick every second with fake data

        parseStream( $scope.streamSize, $scope.streamLength, function( initData ) {

            $scope.data=initData;
            
            // update global scope keyword list
            updateKeywordList($scope.data, function (list) {
                $scope.$parent.keywords = list;
            })


    } )

    },1000);
        
    // -------------------------------
    // Utils controls for stream

    // play/stop
    $scope.startStopStream = function startStopStream () {
        $scope.streaming = ($scope.streaming) ? false : true;
        // console.log($scope.streaming);
        return $scope.streaming;
    }


    // set number of keywords
    $scope.setStreamSize = function setStreamSize (size) {

        $scope.streamSize = size;
        console.log("$scope.streamSize : "+$scope.streamSize);

    }
        
    
    // set time granularity
    $scope.setStreamLength = function setStreamLength (size) {
        $scope.streamLength = size;
        console.log("$scope.streamLength : "+$scope.streamLength);

    } 

    $scope.timeframes = [  
        {"name": "30 s", "value": "30"},  
        {"name": "1 min", "value": "60"},
        {"name": "10 min", "value": "600"},
        {"name": "30 min", "value": "1800"},
        {"name": "1 h", "value": "3600"},
        {"name": "2h", "value": "7200"},
        {"name": "3h", "value": "10800"},
        {"name": "10h", "value": "36000"},
        {"name": "1 day", "value": "86400"},
        {"name": "7 day", "value": "604800"}
    ]

});


function parseStream( numberItems, streamLength, callback ) {

    // Generate initial data
    var keywords = [];

    // build empty keywords
    for (var i = 0; i < numberItems; i++) {
        
        var keyword = {};
        keyword.key = "";
        keyword.values = [];
        keyword.sample = {};
        keywords.push(keyword);

    };

    generateStream( numberItems, streamLength, function(data) {
        // format data
        // console.log (data);

        for (var i = 0; i < numberItems; i++) {

            for (var j = 0; j < streamLength; j++) {
                data[i]
                keywords[i].key = data[j][i].keyword;
                keywords[i].values.push( [data[j][i].count, data[j][i].sliceid])
                
            };

        };

    })


    callback(keywords);
}

function addPoint (newPoint, streamData, callback) {
    console.log(streamData[0].values.length)

    for (var i = 0; i < newPoint.length; i++) { //loop through each keywords

        streamData[i].values.shift(); // trim first point

        //populate with the new value
        streamData[i].values.push([newPoint[i].count,newPoint[i].sliceid])

    };
}

function updateKeywordList(data, callback) {
    
    var list = [];

    for (var i = 0; i < data.length; i++) {

        list.push(data[i].key);

    };

    callback(list);

}
