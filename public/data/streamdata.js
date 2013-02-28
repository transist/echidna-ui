var randomKeywords  = [
  "activity",
  "Alaska",
  "appearance",
  "aren't",
  "article",
  "Aunt",
  "automobile",
  "avoid",
  "basket",
  "birthday",
  "cage",
  "cake",
  "Canada",
  "central",
  "character",
  "Charles",
  "chicken",
  "chosen",
  "club",
  "cook",
  "court",
  "cream",
  "cutting",
  "daily",
  "darkness",
  "diagram",
  "Dick",
  "disappear",
  "doubt",
  "dozen",
  "dream",
  "driving",
  "effort",
  "establish",
  "exact",
  "excitement",
  "fifteen",
  "flag",
  "flies",
  "football",
  "foreign",
  "frame",
  "frequently",
  "frighten",
  "function",
  "gate",
  "gently",
  "gradually",
  "hadn't",
  "harder",
  "hide",
  "hurried",
  "identity",
  "importance",
  "impossible",
  "India",
  "invented",
  "Italian",
  "jar",
  "journey",
  "joy",
  "lesson",
  "Lincoln",
  "lips",
  "log",
  "London",
  "loose",
  "massage",
  "minerals",
  "outer",
  "paint",
  "Papa",
  "Paris",
  "particles",
  "personal",
  "physical",
  "pie",
  "pipe",
  "pole",
  "pond",
  "progress",
  "quarter",
  "rays",
  "recent",
  "recognize",
  "replace",
  "rhythm",
  "Richard",
  "Robert",
  "rod",
  "ruler",
  "safety",
  "Sally",
  "sang",
  "setting",
  "shells",
  "sick",
  "situation",
  "slightly",
  "Spain",
  "spirit",
  "steady",
  "stepped",
  "strike",
  "successful",
  "sudden",
  "sum",
  "terrible",
  "tie",
  "traffic",
  "unusual",
  "volume",
  "whale",
  "wise",
  "yesterday"
];


function generateSlice (numberItems, streamLength, callback) {
  /*
    DATA STRUCTURE

    "keywords" : [
          {
              "keyword": "<KEYWORD>",
              "samplesrcid": "<ONE MATCHING SOURCE POST ID>",
              "count" : "<TOTAL ACCUMULATED COUNT FOR TIME PERIOD>",
              "sliceid" : "sliceid"
          }
  */
  
  // console.log(numberItems);
  var stream = [];
  for (var j = 0;j < streamLength; j++) {
    
    var slice =[];
    // console.log(j)
    for (var i = 0; i < numberItems ; i++) {
      
      var kw = {
        keyword : randomKeywords[i],
        samplesrcid : "blablabla",
        count : (i*5)*Math.random() +12.5,
        sliceid : Math.round(Date.now() / 1000)  + j*1000// + Math.random()*2
      };
      
      slice.push(kw);

    };

    stream.push(slice)


  };
  // console.log(stream);
  callback(stream);
}


// Parse x slices into a stream array for nvd3 
function fakeInitStream( numberItems, streamLength, callback ) {

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

    generateSlice( numberItems, streamLength, function(data) {
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
