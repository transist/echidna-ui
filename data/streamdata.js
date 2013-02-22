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

// console.log( generateData(20) );

function generateData (numberItems, callback) {
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
  var kws =[];
  // console.log(numberItems);
  
  for (var i = 0; i < numberItems ; i++) {
    
    var kw = {
      keyword : randomKeywords[i],
      samplesrcid : "blablabla",
      count : (i*5)*Math.random() +12.5,
      sliceid : Math.round(Date.now() / 1000) // + Math.random()*2
    };

    kws.push(kw);

  };

  callback(kws);
}



/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}