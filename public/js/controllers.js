// controllers.js

app.controller('MainCtrl', function($scope, $http) {
    
    // CONSTANT
    $scope.name = 'Your brand';

    $scope.keywords = []; // array to store keywords text
    $scope.colors = []; // global array to store keywords color

    $scope.list = [ {'key':'drag me'}];

    // some global methods
    $scope.saveToCsv = saveToCsv;
    $scope.copyToClipboard = copyToClipboard;

    
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
    $scope.colors = d3.scale.category20();
    
    // console.log($scope)


    // button for switch action
    $scope.switchStream = function switchStream (type) {
        console.log(type)
        var style  = { style : type}

        // var chart = $scope.$$childHead.chart;
        $scope.$$childHead.chart.style(type)
        console.log($scope.$$childHead.chart.state())


        var svg = d3.select("#stream-viz")
        $scope.$$childHead.chart(svg)
    }

    // handle btn click actions
    $scope.btnClick = function btnClick(item) {
        
        var chart = $scope.$$childHead.chart;

        // console.log(item)
        // var chart = $scope.$$childHead.chart;
        var enabled = true;

        var svg = d3.select("#stream-viz")
            .attr("class", "blabla")

        svg.each(function(data) {

            var container = d3.select(this);

            // toggle graph area
            data.map(function(d) {
                // console.log(d)
                // colors()
                if(d.key == item.key) d.disabled = (d.disabled ==true) ? d.disabled =false : d.disabled = true; //
                enabled = d.disabled;
                return d;
            });

            // redraw graph
            // chart(svg);
            svg.transition().duration(500).call(chart);
            console.log(item)
            // btn class
            var state =  (item.state == "enabled") ? "enabled" : "disabled";
            // item.state = state;


            return item.state;

        })

    }

    $scope.stackFadeIn = function stacksFadeIn(index) {

        // console.log("other stacks fade to "+ index);

        // var chart = $scope.$$childHead.chart;
        // $scope.updateBtns();


        var svg = d3.select("#stream-viz");
        var path = svg.select('.nv-areaWrap').selectAll('path.nv-area')
        // console.log(path, index)

        for (var i = 0; i < path[0].length; i++) {

            if( i == index) {
                d3.select(path[0][i]).classed('hover', true);

            } else { 
                // console.log("hhha"); 
                d3.select(path[0][i]).classed('lower', true);
            }

        };
        
        
        // select('.nv-chart-' + id + ' .nv-area-' + e.seriesIndex).classed('hover', true);

    }

    $scope.stackFadeOut = function stackFadeOut(index) {

        var svg = d3.select("#stream-viz");
        var path = svg.select('.nv-areaWrap').selectAll('path.nv-area')
        // console.log(path, index)

        for (var i = 0; i < path[0].length; i++) {

            if( i == index) {
                d3.select(path[0][i]).classed('hover', false);

            } else { 
                // console.log("hhha"); 
                d3.select(path[0][i]).classed('lower', false);
            }

        };
        
        
        // select('.nv-chart-' + id + ' .nv-area-' + e.seriesIndex).classed('hover', true);

    }

    // Let's simulate stream 
    $scope.data= []; // array to store all values

    // console.log($scope)
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



/*
function updateBtns() {
    
    var colors = d3.scale.category20();

    d3.selectAll(".keyword-item")
        .style("background-color", function(d, i) {  console.log(colors(i));
        // return colors(i) })
        .style("background-image", "none");

    console.log("changed")
}
*/

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
        
        var kw = {};
        kw.state = "enabled"
        kw.key = data[i].key;

        // console.log(i)
        // console.log(colors(i));
        // console.log(nv.utils.defaultColor());
        // console.log($scope);
        // kw.color = colors(i) ;
        
        list.push(kw);
        // list.push(data[i].key);

    };

    callback(list);

}

function saveToCsv (rawData) {

    var data = listToArray(rawData);
    var keys = listToArray(rawData);

    var convertToCSV = function(data) { 

        return keys.join(',');       

        /*
        var orderedData = [];
        for (var i = 0, iLen = data.length; i < iLen; i++) {
            temp = data[i];
            for (var j = 0, jLen = temp.length; j < jLen; j++) {

                if (!orderedData[j]) {
                    orderedData.push([temp[j]]);
                } else {
                    orderedData[j].push(temp[j]);
                }
            }
        }
        return keys.join(',') + '\r\n' + orderedData.join('\r\n');
        */
    }

    var str = convertToCSV(data, keys);
    if (navigator.appName != 'Microsoft Internet Explorer') {
        window.open('data:text/csv;charset=utf-8,' + escape(str));
    }
    else {
        var popup = window.open('', 'csv', '');
        popup.document.body.innerHTML = '<pre>' + str + '</pre>';
    }

}

function copyToClipboard (data) {
    var text = listToArray(data).join(',')
    window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);

}

function listToArray(list) {
    var tmp = []
    for (var i = 0; i < list.length; i++) {
        tmp.push(list[i].key);
    };
    return tmp;
}