/* Services */

app.factory('apiClient', function($timeout) {

    return new ApiClient($timeout);

});

function ApiClient($timeout) {

    // constructor
    var apiClient=this;
    
    // Default values 
    apiClient.nInterval = 1000; // time interval for timeout in ms

    apiClient.streaming = true; // Streaming API is initially stopped
    
    apiClient.filter = {        

        gender  : "Both",       // "Both", "Men", "Women"                        
        age     : "All",        // "All", "18-", "24-", "35-", "40+"              
        tier    : "All",        // "All", "Tier1", "Tier2", "Tier3"               
        city    : null          // "pinyin" (pinyin formatted name of a city)  Optional*/

    }

    apiClient.numberItems = 5;      // number of keywords

    apiClient.streamLength = 30;    // number of values needed

    apiClient.streamData = [];      // Array to store all streming data 


    apiClient.initStream = function (_numberItems, _gender, _age, _tier, _city, _streamLength) {

        console.log("Event : initStream")

        apiClient.filter = {

            gender  : _gender,      // "Both", "Men", "Women"                        
            age     : _age,         // "All", "18-", "24-", "35-", "40+"              
            tier    : _tier,        // "All", "Tier1", "Tier2", "Tier3"               
            city    : _city        // "pinyin" (pinyin formatted name of a city)  Optional*/

        }

        // generate initial data
        console.log("Event : initStreamData");

        // function to fake data available at ../data/streamdata.js
        
        fakeInitStream(apiClient.numberItems, apiClient.streamLength, function(data){ 
            
            // console.log(data)
            apiClient.streamData = data;
        
        });
        

        // apiClient.startStream()

        // apiClient.streaming = false; // "_streaming"  stop the stream by default
        apiClient.nextSlice();
        
    }

    apiClient.startStream = function () {

        console.log("Event : startStream")
        
        apiClient.streaming = true;
        apiClient.nextSlice();
        // apiClient.streaming = false;

        // this.getSlice
        // this.stream;
        // return true;
        // $timeout(getSlice, this.nInterval);

    }

    apiClient.nextSlice = function() {

        if (apiClient.streaming) {

            // loop and get the next slice
            apiClient.stream = $timeout(apiClient.nextSlice, apiClient.nInterval);

            // console.log(apiClient.streamData)

            // wrapper for API request
            newSlice();
        }

    }

    apiClient.stopStream = function () {
        
        apiClient.streaming = false;
        console.log("Event : stopStream")
        $timeout.cancel(apiClient.stream);

    }

    apiClient.feedConfig = function(_numberItems, _gender, _age, _tier, _city, callback) {

        // Filtering by group
        apiClient.filter.gender  = _gender;   // "Both", "Men", "Women"                        
        apiClient.filter.age     = _age;      // "All", "18-", "24-", "35-", "40+"              
        apiClient.filter.tier    = _tier;     // "All", "Tier1", "Tier2", "Tier3"               
        apiClient.filter.city    = _city;     // "pinyin" (pinyin formatted name of a city)  Optional

        apiClient.numberItems = _numberItems;       // Total number of keywords needed

        console.log("Client : updateConfig")

        callback(filter);

    }
    
    // private functions 
    function addSliceToStream(slice, callback) {
        
        var streamTmp = [];
        // console.log(slice[0]);
        var diff = 0; 

        if(apiClient.numberItems != apiClient.streamData.length ) diff = apiClient.numberItems - apiClient.streamData.length;

        // console.log("required Items : "+ apiClient.numberItems, "difference : " +diff);

        for (var i = 0; i < slice[0].length; i++) {

            var keywordTmp = {};


            if(i < apiClient.streamData.length){

                keywordTmp = apiClient.streamData[i];
                
                // move all values up (see function Array.move below)
                keywordTmp.values.move(keywordTmp.values.length, 0);
    
                // remove oldest value
                keywordTmp.values.pop();

                // console.log(keywordTmp)
            
            } else if (diff > 0  && i > apiClient.streamData.length-1) {

                // user has required more items
                
                keywordTmp.key = slice[0][i].keyword;
                
                console.log("Added Item")

                keywordTmp.values = []
                for (var j = 0; j < apiClient.streamLength; j++) {
                    
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
    
    // fake IO
    function newSlice() {
        
        // goes  
        console.log("Event : newSlice")


        generateSlice( apiClient.numberItems, 1, false, function(slice){ // function to fake in ../data/streamdata.js
            
            addSliceToStream(slice, function(streamData) {
                // console.log(streamData)
                apiClient.streamData =  streamData;

            });

            // console.log(slice);
        })

    }
    


}

// from http://www.redips.net/javascript/array-move/
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