// directives.js
app.directive('streamViz', function () {

    return {
        restrict: 'E',
        terminal: true,
        scope: {
          val: '='
        },
        link: function (scope, element, attrs) {
            console.log(scope.$parent.data);
            createSVG(scope, element);
            

            initGraph(scope, function(chart) {
                scope.chart = chart;
                // scope.$watch('val', updateGraph, true);
            });
            

            setInterval(function () {
                console.log(scope.$parent.data)
                if (scope.$parent.streaming) updateGraph(scope.$parent.data, scope);
                // if(scope.streaming == true) {
                    // return updateGraph(scope.val, scope);
                // }

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


function initGraph(scope, callback) {

    // constants
    var colors = d3.scale.category20();
    keyColor = function(d, i) {return colors(i)};

    nv.addGraph(function() {

        var chart = nv.models.stackedAreaChart()
                      .x( function(d) { return d[1] } )
                      .y( function(d) { return d[0] } )
                      .color(keyColor)
                      // .clipEdge(true);
        // console.log(scope.chart);
        chart.xAxis
            .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',.2f'));

         scope.svg
              .datum( scope.val )
                .transition().duration(500).call(chart);



        nv.utils.windowResize(chart.update);
        
        callback(chart);

    });

}

function updateGraph (val, scope) {

    console.log("graph updated");
    // console.log(scope)
    // chart.stacked.scatter.clipVoronoi(false);
    
    // console.log(scope.val)
    // console.log(newVal, oldVal);

    scope.svg
      .datum( val )
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





