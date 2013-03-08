// controllers.js

app.controller('MainCtrl', function($scope, $locale, $filter, d3data) {
        
    /* VARIABLES --------------------------------------------------------------
        */
        $scope.name = 'Dashboard';

        // $scope.appName = "Keywords & Trends generator"
        // $scope.keywords = []; // array to store only keywords text

        $scope.colors = [];   // global array to store keywords color
        $scope.list = [];     // global array to store all 

        $scope.keywords = d3data.current();

        console.log($scope);

        $scope.modal = {content: 'Hello Modal', saved: false};

        // Locale & i18n
        $scope.locale = $filter('i18n')('Language: %1', $locale.id);

        $scope.setLocale = function(l) {
            $locale.id = l;
            // $scope.jsString = $filter('i18n')('Строка в js');
            $scope.locale = $filter('i18n')('Language: %1', $locale.id);
        }


    /* SAVE METHODS --------------------------------------------------------------
        */

        $scope.saveToCsv = saveToCsv;
        $scope.copyToClipboard = copyToClipboard;

});

app.controller('FeedCtrl', function($scope, apiClient, socket) {

    // Default values
    var wordCount = 5;

    apiClient.setDemographics("Both","All","All");
    apiClient.setRealtime("second", 10);
    apiClient.setWordCount(wordCount);
    $scope.samples = wordCount;
    $scope.sampling = 0;
    $scope.samplings = apiClient.validSampling;

    // instance to be watched within the scope
    $scope.filter = apiClient;

    $scope.setAge = function(age) {

        // console.log("age : "+age);
        $scope.filter.age = age;
        apiClient.setAgeRange(age);

    }

    $scope.setGender = function(gender) {

        // console.log("gender : "+gender);
        $scope.filter.gender = gender
        apiClient.setGender(gender)

    }

    $scope.setTier = function(tier) {

        $scope.filter.tier = tier;
        apiClient.setTier(tier);
        
    }

    // set number of keywords
    $scope.setStreamSize = function (size) {

        $scope.filter.samples = size;
        apiClient.setWordCount(size);

    }
            
    // set time sampling
    $scope.setSampling = function (index) {

        apiClient.setSampling(apiClient.validSampling[index])
        $scope.filter.sampling = apiClient.validSampling[index];
        return apiClient.sampling;
        
    } 

    // set timeRange
    $scope.setTimerange = function (start,end) {

        console.log("set up timerange", start, end);



        // $scope.filter.start = start;
        // apiClient.SetStart(start);

        // $scope.filter.end = end;
        // apiClient.setEnd(end);
        
    }

    $scope.ready = false;

    $scope.$watch('filter', function (newVal) {

        if(newVal){

            if($scope.ready == false) {

                socket.emit('client:ready');
                $scope.ready = true;

            }

            // console.log(apiClient);
            socket.emit('feedconfig', apiClient.toJSON());

        }

    }, true)

})


app.controller('StreamCtrl', function($scope, $document, $http, $timeout, d3data, socket) {

    /* VARIABLES --------------------------------------------------------------
        */
    
        // some global variables
        $scope.colors = d3.scale.category20(); // define d3 color scheme    

        // stream data
        $scope.streamData = []; // init data
        $scope.initStream = false; // init data
        
        // init stream type
        $scope.streamType = "stack";
        
        // $scope.$$childHead.chart.style = $scope.streamType;


    /* SOCKET API & DATA --------------------------------------------------------------
        */

        console.log(d3data);

        d3data.setXValues(30);

        // update data on each value
        d3data.on("updated", function() {

            // console.log("updated", $scope.streamGraph.ready);

            // update data
            $scope.streamData = d3data.current();

            // init graph
            if ($scope.streamGraph.ready == false && !$scope.initStream ) {

                console.log("init")

                $scope.streamGraph.init($scope.streamData, $scope.colors, function (chart) {

                    $scope.chart = chart;
                    $scope.initStream = true;

                });

            } 

        })


        socket.on('slice', function (slice) {

            // console.log("receiving slice")
            var datapoint = slice.datapoint;
            // if(d3data.current()[0]) console.log(d3data.current()[0].values.length)
            // if($scope.streamData.ready) console.log(d3data.current()[0].values.length)
            // console.log(slice);

            for (var j = 0; j < datapoint.length; j++) {

              // console.log(datapoint);
              d3data.update(datapoint[j].keyword, datapoint[j].sliceid, datapoint[j].count);

            };

        })

    /* KEYWORDS BUTTONS ----------------------------------------------------------------
        */

        // toggle stream on click
        $scope.stackFocus = function stackFocus(index) {
            
            // console.log(index)
            var svg = d3.select("#stream-viz")
                .attr("class", "blabla")

            svg.each(function(data) {

                var container = d3.select(this);

                // toggle graph area
                data.map(function(d, i) {
                    
                    if(i == index) d.disabled == true;
                    else d.disabled = (d.disabled ==false) ? d.disabled =true : d.disabled = false;
                    return d;
                });

                svg.transition().duration(500).call($scope.$$childHead.chart);
            })

        }


        $scope.showInGraph = function showInGraph (index) {
            
        }

        // Fade in/out for stream stacks on mouse over
        $scope.stackFadeIn = function stacksFadeIn(index) {

            var svg = d3.select("#stream-viz");
            var path = svg.select('.nv-areaWrap').selectAll('path.nv-area')

            for (var i = 0; i < path[0].length; i++) {

                if( i == index) d3.select(path[0][i]).classed('hover', true);
                else d3.select(path[0][i]).classed('lower', true);

            };
            
        }

        $scope.stackFadeOut = function stackFadeOut(index) {

            var svg = d3.select("#stream-viz");
            var path = svg.select('.nv-areaWrap').selectAll('path.nv-area')

            for (var i = 0; i < path[0].length; i++) {

                if( i == index) d3.select(path[0][i]).classed('hover', false);
                else d3.select(path[0][i]).classed('lower', false);

            };
            
        }


        $("close-popover").click(function(e) {
            console.log("close it")

            $(".popover.in").each(function() {
                $(this).popover('hide');
            });
        });
        
    /* STREAM TOOLBAR ----------------------------------------------------------------
        */

        // switch for stream style
        $scope.switchStream = function switchStream (type) {
            
            console.log(type)
            
            // console.log($scope)

            var style  = { style : type}

            // var chart = $scope.$$childHead.chart;
            $scope.$$childHead.chart.style(type)

            // console.log($scope.$$childHead.chart.state())
            $scope.streamType = type;

            var svg = d3.select("#stream-viz")
            $scope.$$childHead.chart(svg)

        }



        // play/stop button
        $scope.startStopStream = function startStopStream () {

            console.log($scope.streamGraph)

            $scope.streamGraph.streaming = ($scope.streamGraph.streaming) ? false : true;
            
            if($scope.streamGraph.streaming) $scope.streamGraph.startStream()
            else $scope.streamGraph.stopStream()
            
            return $scope.streamGraph.streaming;
        }

});

app.controller('compareCtrl', function($scope, $http){

    $scope.vennData = ["oui", "non"];

    $scope.setVennData = function setVennData(item1, item2) {
        // console.log($scope.vennData);
        $scope.vennData = [item1, item2];
    }


})


 // private functions 
function addSliceToStream(streamData, numberItems, slice, callback) {
    
    var streamTmp = [];
    // console.log(slice[0]);
    var diff = 0; 

    if(numberItems != streamData.length ) diff = numberItems - streamData.length;

    // console.log("required Items : "+ apiClient.numberItems, "difference : " +diff);

    for (var i = 0; i < slice[0].length; i++) {

        var keywordTmp = {};


        if(i < streamData.length){

            keywordTmp = streamData[i];
            
            // move all values up (see function Array.move below)
            keywordTmp.values.move(keywordTmp.values.length, 0);

            // remove oldest value
            keywordTmp.values.pop();

            // console.log(keywordTmp)
        
        } else if (diff > 0  && i > streamData.length-1) {

            // user has required more items
            
            keywordTmp.key = slice[0][i].keyword;
            
            console.log("Added Item")

            keywordTmp.values = []
            for (var j = 0; j < streamLength; j++) {
                
                keywordTmp.values.push([0 , new Date()-j*1000]) //populate with 0 values
                
            };

            // console.log(keywordTmp)
            // console.log(i, slice[0])

        }


        // add last value to keyword
        keywordTmp.values[0] = [ slice[0][i].count, slice[0][i].sliceid ];

        streamTmp.push(keywordTmp);

    };
    // console.log(streamTmp)
    callback(streamTmp)

    // apiClient.streamData = streamTmp;

}

function addPoint (newPoint, streamData, callback) {
    console.log(streamData[0].values.length)

    for (var i = 0; i < newPoint.length; i++) { //loop through each keywords

        streamData[i].values.shift(); // trim first point

        //populate with the new value
        streamData[i].values.push([newPoint[i].count,newPoint[i].sliceid])

    };

}

function updateKeywordList(data, list, callback) {
    
    // console.log(data.length)

    var keywords = [];
    var existing = false;

    for (var i = 0; i < data.length; i++) {
        
        var kw = {};
        kw.state = "enabled";
        kw.drag = true;
        kw.key = data[i].key;

        for (var j = list.length - 1; j >= 0; j--) {
            
            if(list[j].key == data[i].key ) existing = true;

        };

        if(!existing) { // keyword already in the list
            kw.state =  "enabled";
            kw.drag  =  "true";
        }
        else {
            kw.state = "active";
            kw.drag  = "false";
        }

        keywords.push(kw);

    };

    callback(keywords);

}


// EXPORT

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

Array.prototype.diff = function(a) {

    return this.filter(function(i) {return !(a.indexOf(i) > -1);});

};