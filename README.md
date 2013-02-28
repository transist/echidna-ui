# Echidna UI
UI components for Echidna


ApiClient is a pseudo-class that contains variables and methods for communication with the server.
Code can be found in ./public/js/services.js

## Socket messaging

**List of events**
    
    * Client : initStream        : Load default/preset filters   > feedConfig()
    * Client : initStreamData    : Request initial data points   > 
    * Server : initSlices        : Send initial data
    * Server : newSlice          : new data slice
    * Client : updateFilter      : change request parameters     > feedConfig() 
    * Client : startStream       : start sending slices
    * Client : stopStream        : stop sending slices


## API

**Feed Configuration** 

    apiClient.feedConfig = function(_numberItems, _gender, _age, _tier, _city, callback)
        
        // Filtering by group
        apiClient.filter.gender  = _gender;   // "Both", "Men", "Women"                        
        apiClient.filter.age     = _age;      // "All", "18-", "24-", "35-", "40+"              
        apiClient.filter.tier    = _tier;     // "All", "Tier1", "Tier2", "Tier3"               
        apiClient.filter.city    = _city;     // Optional (pinyin formatted name of a city)  

        apiClient.numberItems = _numberItems;       // Total number of keywords needed

        console.log("Client : updateConfig")

        callback(filter);

    }

**Request Initial Data**

    apiClient.initStream = function (_numberItems, _gender, _age, _tier, _city, _streamLength) {

        feedConfig(_numberItems, _gender, _age, _tier, _city);
        apiClient.streamLength = _streamLength;     // Number of data points needed

        console.log("Client : initStream")
        
    }

## Data


