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

        // console.log($scope);

        $scope.modal = {content: 'Hello Modal', saved: false};

        // Locale & i18n
        $scope.locale = $filter('i18n')('Language: %1', $locale.id);

        $scope.setLocale = function(l) {
            $locale.id = l;
            // $scope.jsString = $filter('i18n')('Строка в js');
            $scope.locale = $filter('i18n')('Language: %1', $locale.id);
        }

    /* resize window */

    var computeWidth = function() {

        var diff = 42+ 50+ $("#flow").height() +160;
        // var diff = $('#flow').height(), $('#toolbar').height(), $("#topbar").height();

        // console.log($('#flow').height(), $('#toolbar').height(), $("#topbar").height())s
        // console.log(diff);
        return window.innerHeight - diff;

    };


    // console.log()
    $scope.boxStyle = {height: computeWidth() + 'px'};
    
    angular.element(document).on('ready', function() {
        $scope.boxStyle.height = computeWidth() + 'px';
        $scope.$apply();        
    })

    angular.element(window).bind('resize', function() {

        $scope.boxStyle.height = computeWidth() + 'px';
        $scope.$apply();

    });



    /* SAVE METHODS --------------------------------------------------------------
        */

        $scope.saveToCsv = saveToCsv;
        $scope.copyToClipboard = copyToClipboard;

});

app.controller('FeedCtrl', function($scope, feedconfig, socket) {

    // Default values
    var wordCount = 10;

    feedconfig.setDemographics("Both","All","All");
    feedconfig.setRealtime("second", 10);
    feedconfig.setWordCount(wordCount);
    $scope.samples = wordCount;
    $scope.sampling = 0;
    $scope.samplings = feedconfig.validSampling;

    // instance to be watched within the scope
    $scope.filter = feedconfig;

    $scope.setAge = function(age) {

        // console.log("age : "+age);
        $scope.filter.age = age;
        feedconfig.setAgeRange(age);

    }

    $scope.setGender = function(gender) {

        // console.log("gender : "+gender);
        $scope.filter.gender = gender
        feedconfig.setGender(gender)

    }

    $scope.setTier = function(tier) {

        $scope.filter.tier = tier;
        feedconfig.setTier(tier);
        
    }

    // set number of keywords
    $scope.setStreamSize = function (size) {

        $scope.filter.samples = size;
        feedconfig.setWordCount(size);

    }
            
    // set time sampling
    $scope.setSampling = function (index) {

        feedconfig.setSampling(feedconfig.validSampling[index])
        $scope.filter.sampling = feedconfig.validSampling[index];
        return feedconfig.sampling;
        
    } 

    // set timeRange
    $scope.setTimerange = function (start,end) {

        console.log("set up timerange", start, end);

        // $scope.filter.start = start;
        // feedconfig.SetStart(start);

        // $scope.filter.end = end;
        // feedconfig.setEnd(end);
        
    }

    $scope.ready = false;

    $scope.$watch('filter', function (newVal) {

        if(newVal){

            if($scope.ready == false) {

                socket.emit('client:ready');
                $scope.ready = true;

            }

            // console.log(feedconfig);
            socket.emit('feedconfig', feedconfig.toJSON());

        }

    }, true)

})

app.controller('StreamCtrl', function($scope, $document, $http, $timeout, $window, d3data, socket) {

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

        // console.log(d3data);

        d3data.setXValues(20);

        // update data on each value
        d3data.on("updated", function() {

            // update data
            $scope.streamData = d3data.current();

            // init graph
            if ($scope.streamGraph.ready == false && !$scope.initStream ) {

                // console.log("init")

                $scope.streamGraph.init($scope.streamData, $scope.colors, function (chart) {

                    $scope.chart = chart;
                    $scope.initStream = true;

                });

            } 

        })

        socket.on('connect', function () {
            
            console.log('socket.io connected');

        });

        socket.on('slice', function (slice) {

            
            // console.log("slice received")
            // console.log(JSON.parse(slice))
            // var sTmp = JSON.parse(slice);


            var s = new $window.slicer.Slice(slice);

            // console.log("create Slice Object with", s.words.length,' words')
            

            // console.log(s);

            d3data.updateSlice(s);
            // console.log("d3data : ", d3data.current())

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


        $scope.addTolist  =  function (item) {
            
            // console.log(item)
            // console.log($scope.$parent.list)
            item.state = "disabled";
            $scope.$parent.list.push(item);


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

    // console.log("required Items : "+ feedconfig.numberItems, "difference : " +diff);

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

    // feedconfig.streamData = streamTmp;

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