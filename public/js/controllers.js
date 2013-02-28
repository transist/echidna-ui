// controllers.js

app.controller('MainCtrl', function($scope, $locale, $filter, $http) {
        
    /* VARIABLES --------------------------------------------------------------
        */
        $scope.name = 'Your brand';

        // $scope.appName = "Keywords & Trends generator"

    
        $scope.keywords = []; // array to store keywords text
        $scope.colors = []; // global array to store keywords color

        $scope.list = [ {'key':'drag me'}];

        $scope.modal = {content: 'Hello Modal', saved: false};

        // Locale & i18n

        // default to english
        // setLocale('en-us');
        console.log($locale)

        // Trick here : 
        $scope.locale = $filter('i18n')('Language: %1', $locale.id);

        $scope.setLocale = function(l) {
            $locale.id = l;
            // $scope.jsString = $filter('i18n')('Строка в js');
            $scope.locale = $filter('i18n')('Language: %1', $locale.id);
        }
        
        // $scope.apiClient = apiClient;


    /* FILTERING --------------------------------------------------------------

        */

        // Init Stream
        /* feedConfig( "Both", "All", "All", null, function(filter) {
            
            $scope.activeFilter = filter;
        
        })
        */

    /* METHODS --------------------------------------------------------------
        */

        $scope.saveToCsv = saveToCsv;
        $scope.copyToClipboard = copyToClipboard;

    /* DRAG'N DROP --------------------------------------------------------------
        */    
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

    /* MOUSE ACTIONS -------------------------------------------------
        */

});

app.controller('StreamCtrl', function($scope, $http, $timeout, apiClient) {

    /* VARIABLES --------------------------------------------------------------
        */
        // some global variables
        
        $scope.streamSize = 5; // default number of keywords (y values)
        $scope.streamLength = 30; // timeframe;  number of x values; max length of data stream
        
        $scope.colors = d3.scale.category20(); // define d3 color scheme    
        $scope.streaming = apiClient.streaming;  // to start/stop streaming

        // console.log($scope)

    /* API & DATA --------------------------------------------------------------
        */

        console.log(apiClient)

        apiClient.initStream();

        apiClient.stream.then(function(data){


            setInterval(function(){

                $scope.streamData = apiClient.streamData;
                
            }, 1000)

        }, function(error) {
            
            // handle error

        })

        /* OLD FUNCTIONS ----------------------------------------------------------------
        */

        /*
        $scope.data= []; // array to store all values
        
        // init with first values
        parseStream( $scope.streamSize, $scope.streamLength, function( initData ) {

            $scope.data=initData;
        } )

        // update global keyword list
        updateKeywordList($scope.data, function (list) {

            $scope.$parent.keywords = list;

        })
        
        // console.log($scope)


        // Let's stream some randomness
        setInterval(function(){ // tick every second with fake data

            parseStream( $scope.streamSize, $scope.streamLength, function( data ) {

                $scope.data=data;
                
                // update global scope keyword list
                updateKeywordList($scope.data, function (list) {
                    $scope.$parent.keywords = list;
                })

        } )

        },1000);
    */

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

                    // console.log(d)
                    // colors()
                    // if(d.key == item.key) d.disabled = (d.disabled ==true) ? d.disabled =false : d.disabled = true; //
                    // enabled = d.disabled;
                    return d;
                });

                // redraw graph
                // chart(svg);
                svg.transition().duration(500).call($scope.$$childHead.chart);
                // console.log(item)
                // btn class
                // var state =  (item.state == "enabled") ? "enabled" : "disabled";
                // item.state = state;


                // return item.state;

            })

        }


        $scope.showInGraph = function showInGraph (index) {
            
        }

        // Fade in/out for stream stacks on mouse over
        $scope.stackFadeIn = function stacksFadeIn(index) {

            // console.log("other stacks fade to "+ index);

            var svg = d3.select("#stream-viz");
            var path = svg.select('.nv-areaWrap').selectAll('path.nv-area')
            // console.log(path, index)

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
            var style  = { style : type}

            // var chart = $scope.$$childHead.chart;
            $scope.$$childHead.chart.style(type)
            console.log($scope.$$childHead.chart.state())


            var svg = d3.select("#stream-viz")
            $scope.$$childHead.chart(svg)
        }

        // play/stop button
        $scope.startStopStream = function startStopStream () {
            apiClient.streaming = (apiClient.streaming) ? false : true;
            
            if(apiClient.streaming) apiClient.startStream()
            else apiClient.stopStream()
            
            // console.log(apiClient.streaming);
            $scope.streaming = apiClient.streaming
            
            return apiClient.streaming;
        }

        // set number of keywords
        $scope.setStreamSize = function setStreamSize (size) {

            apiClient.numberItems = size;
            // console.log("$scope.streamSize : "+$scope.streamSize);

        }
            
        // set time granularity
        $scope.setStreamLength = function setStreamLength (size) {
            apiClient.streamLength = size;
            // console.log("$scope.streamLength : "+$scope.streamLength);

        } 

        // set timeframe
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

        $scope.setTimerange = function setTimerange(timerange) {
            console.log(timerange);
            // do sth...

        }

});

app.controller('compareCtrl', function($scope, $http){

    $scope.vennData = ["oui", "non"];

    $scope.setVennData = function setVennData(item1, item2) {
        // console.log($scope.vennData);
        $scope.vennData = [item1, item2];
    }


})

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