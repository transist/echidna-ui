// directives.js

app.directive('streamViz', function () {

    return {
        restrict: 'E',
        terminal: true,
        scope: {
          val: '='
        },
        link: function (scope, element, attrs) {
            createSVG(scope, element);
            console.log(attrs);
            scope.$watch('val', updateGraph, true);
        }
    }
});


function createSVG(scope, element){
    scope.w = 400;
    scope.h = 200;
    if (!(scope.svg != null)) {
      return scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w).attr("height", scope.h);
    }
}

function updateGraph (newVal, oldVal, scope) {
            
    // constants
    var colors = d3.scale.category20();
    keyColor = function(d, i) {return colors(d.key)};

    nv.addGraph(function() {
        scope.chart = nv.models.stackedAreaChart()
                      .x(function(d) { return d[0] })
                      .y(function(d) { return d[1] })
                      .color(keyColor)
                      //.clipEdge(true);

      // chart.stacked.scatter.clipVoronoi(false);

        scope.chart.xAxis
            .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        scope.chart.yAxis
            .tickFormat(d3.format(',.2f'));


        scope.svg
          .datum( newVal )
            .transition().duration(500).call(scope.chart);

        nv.utils.windowResize(scope.chart.update);

        scope.chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

        // console.log(scope.chart);
        return scope.chart;
    });

}