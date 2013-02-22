// directives.js
var chart;

app.directive('streamViz', function () {

    return {
        restrict: 'E',
        terminal: true,
        scope: {
          val: '='
        },
        link: function (scope, element, attrs) {
            // console.log(scope);
            createSVG(scope, element);
            scope.$watch('val', initGraph, true);
            setInterval(function () {
                // console.log("tick")
                updateGraph(scope);
            }, 1000)
            
            

        }
    }

});


function createSVG(scope, element){
    scope.w = 400;
    scope.h = 200;
    // console.log('ha');
    if (!(scope.svg != null)) {
        scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w).attr("height", scope.h);
        return;
    }

}


function initGraph(newVal, oldVal, scope) {
    console.log(newVal);

    // constants
    var colors = d3.scale.category20();
    keyColor = function(d, i) {return colors(i)};
    scope.chart = {};

    nv.addGraph(function() {

        scope.chart = nv.models.stackedAreaChart()
                      .x( function(d) { return d[1] } )
                      .y( function(d) { return d[0] } )
                      .color(keyColor)
                      // .clipEdge(true);
        // console.log(scope.chart);
        scope.chart.xAxis
            .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        scope.chart.yAxis
            .tickFormat(d3.format(',.2f'));

        scope.svg
          .datum( newVal )
            .transition().duration(500).call(scope.chart);

        nv.utils.windowResize(scope.chart.update);
        

        return scope.chart;

    });

}

function updateGraph (scope) {

    // console.log("graph updated");
    // console.log(scope)
    // chart.stacked.scatter.clipVoronoi(false);
    
    // console.log(scope)
    // console.log(newVal, oldVal);

    scope.svg
      .datum( scope.val )
        .transition().duration(500).call(scope.chart);

    // scope.chart.dispatch.on('stateChange', function(e) { nv.log('New stateChange:', JSON.stringify(e)); });
    // scope.chart.dispatch.on('changeState', function(e) { nv.log('New changeState:', JSON.stringify(e)); });
}


app.directive('btnClick', function($document, mouse){
    
    // Mouse Handle Actions

    // console.log(scope.chart.legend);
    
    scope.chart.dispatch.on('stateChange', function(e) { nv.log('New stateChange:', JSON.stringify(e)); });

    scope.chart.dispatch.on('changeState', function(e) { nv.log('New changeState:', JSON.stringify(e)); });

    /*
    scope.chart.legend.dispatch.on('legendClick.hi', function(e){
      console.log('legend was clicked', 'namespace:', 'hi');
    });

    scope.chart.stacked.dispatch.on('areaClick.toggle', function(e){
      console.log('stacked was toggled', 'namespace:', 'toggle');
      nv.log('New stack toggle:', JSON.stringify(e));
    });

    scope.chart.dispatch.on('changeState', function(e) {
        nv.log('New changeState:', JSON.stringify(e));
    })


*/
    // scope.chart.stacked.dispatch.on('stackedClick.hi', function(e){
    //   console.log('stack was clicked', 'namespace:', 'hi');
    // });

    // scope.chart.dispatch.on('legendClick', function(e) { nv.log('New legendClick:', JSON.stringify(e)); });


    // console.log(scope.chart);

})





