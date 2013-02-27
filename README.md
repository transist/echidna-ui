# Echidna UI


UI components for Echidna


## API


Feed Configuration

    feedConfig(gender, age, tier, city, callback) {
        
        /*

        Possible Values

        gender  : "Both", "Men", "Women"                        
        age     : "All", "18-", "24-", "35-", "40+"              
        tier    : "All", "Tier1", "Tier2", "Tier3"               
        city    : "pinyin" (pinyin formatted name of a city)    : Optional

        */

        callback(slice)

    }



Compare keywords 

    
    compareKeywords(keyword1, keyword2, group, callback) {
        // ...

    }


