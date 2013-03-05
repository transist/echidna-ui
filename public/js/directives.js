// directives.js

app.directive('streamViz', function () {

    return {
        
        link: function (scope, element, attrs) {
            
            // console.log(scope);

            scope.streamGraph = new Stream();
            scope.streamGraph.createSVG(scope, element);
                
                scope.$watch('streamData', function(newVal, oldVal) {

                    if(scope.initStream && scope.streamGraph.streaming) {
                        
                        // console.log(newVal)
                        scope.streamGraph.redraw(newVal, scope);
                        
                    }
                
                })

        }
    }

});



function Stream() {

    var stream = this;

    stream.streaming = true; // initial state of playing

    stream.createSVG = function (scope, element) {

        scope.w = 400;
        scope.h = 100;
        
        // console.log('ha');
        if (!(scope.svg != null)) {
            scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w).attr("height", scope.h).attr("id", "stream-viz");

            // stream.svg=scope.svg;

            return;
        }

    }

    stream.init = function(newVal, colors, callback) {
    
        keyColor = function(d, i) {
            return colors(i);
        };

        nv.addGraph(function() {

            var chart = nv.models.stackedAreaChart()
                              .x( function(d) { return d.x } )
                              .y( function(d) { return d.y } )
                              .color(keyColor)
                              .showLegend(false)
                              .showControls(false)
                          // .attr("id", function(d) { return d[1] })
                          // .clipEdge(true);
            // // console.log(scope.chart);
            chart.xAxis
                .tickFormat(function(d) { return d3.time.format('%X')(new Date(d)) });

            chart.yAxis
                .tickFormat(d3.format(''));

             d3.select("#stream-viz")
                  .datum( newVal )
                    .transition().duration(500).call(chart);

            nv.utils.windowResize(chart.update);



            // MOUSE ACTIONS

            /* chart.dispatch.on('stateChange', function(e) { nv.log('New stateChange:', JSON.stringify(e)); }); */

            // chart.legend.dispatch.on('legendMouseover', function(e) { nv.log('New stateChange:', JSON.stringify(e)); }
            

            callback(chart);



        });
        
    }

    stream.redraw = function (newVal, scope) {    

        // console.log("redraw")

        scope.svg
          .datum( newVal )
            .transition().duration(500).call(scope.chart);

    }

    stream.startStream = function () {
        
        stream.streaming = true;

    }

    stream.stopStream = function () {
        
        stream.streaming = false;

    }

}


app.directive('datePicker', function () { 
    // console.log("daterangepicker()");

    return function (scope, element, attrs) { 
           
        element.daterangepicker({}, function(start,end) {

            // console.log(moment(start).format(), moment(end).format());

            scope.setTimerange(moment(start).format(), moment(end).format());

        });

    } 
 })

app.directive('vennCompare', function( ){
    
    return {
            // restrict: 'E',
            // terminal: true,
            // scope: {
            //   vennData: '='
            // },
            link: function (scope, element, attrs) {

                // console.log(scope.vennData)

                scope.$watch('vennData', function(newVal, oldVal) {
                    
                    // console.log(scope.vennData);

                    if(newVal && newVal.length && scope.venn) {

                        console.log(newVal);
                        redrawVenn(newVal, scope, function (venn) {
                            scope.venn = venn;
                        })

                    } else if(newVal && newVal.length) {

                        initVenn(newVal, function (venn) {
                            scope.venn = venn;
                        });

                    } 

                 }, true);
            }
    }

});


function initVenn (newVal, callback) {
    
    // console.log("init venn diagram " + newVal)

    var B=newVal[0], A=newVal[1];
    
    var groups = [A, B];
    var w = 200, h = 150;

    var data = [];
    for (var i=0; i<2; i++) data.push([A]);
    data.push([A, B]);
    for (var i=0; i<2; i++) data.push([B]);

    // Standard D3
    var color = d3.scale.category10();
    var venn = d3.layout.venn().size([w, h]);
    // var venn = d3.layout.venn().size([Math.min(parseInt(Math.min($(window).width(),$(window).height())*.75),200),Math.min(parseInt(Math.min($(window).width(),$(window).height())*.65),150)]);

    var circle = d3.svg.arc().innerRadius(0).startAngle(0).endAngle(2*Math.PI);
    // console.log(venn)

    var vis = d3.select("#venn")
        .append("svg")
        .data([data])
        .attr("width", w)
        .attr("height", h)
        // .attr("preserveAspectRatio", "xMinYMin meet");
        // .attr("width", Math.min(parseInt($(window).width()*1),200))
        // .attr("height", Math.min(parseInt($(window).width()*.8),150))

    var circles = vis.selectAll("g.arc")
        .data(venn)
        .enter().append("g")
            .attr("class", "arc")
            .attr("transform", function(d, i){ return "translate(" + ( d.x) + "," + ( 30+ d.y) + ")"; });

    // console.log(circles)

        circles.append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("class", "venn-circle")
            .attr("opacity", 0.5)
            .attr("d", circle);

        circles.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "venn-text")
            .text(function(d, i) { return d.label; })
            .attr("fill", function(d, i) { return color(i); })
            .attr("x", function(d, i) { return d.labelX; })
            .attr("y", function(d, i) { return d.labelY; });


    callback(vis);

}

// keywords is an array
function redrawVenn(newVal, scope, callback) {
    
    console.log("redraw venn")

    var color = d3.scale.category20b();

    var B=newVal[0], A=newVal[1];
    var groups = [A, B];

    // recreate data
    var data = [];
    for (var i=0; i<2; i++) data.push([A]);
    data.push([A, B]);
    for (var i=0; i<2; i++) data.push([B]);

    // var venn = d3.layout.venn().size([300,250]);
    
    var vis = d3.select("#venn")
        .data([data])
        // .data(venn)
        .transition()

    var circles = vis.selectAll("g.arc")
        .attr("transform", function(d, i){ return "translate(" + ( d.x) + "," + ( 30+ d.y) + ")"; });

    vis.selectAll(".venn-text")
        .duration(750)
        .text(function(d, i) { return newVal[i]; })
        .attr("fill", function(d, i) { return color(i); });

    vis.selectAll(".venn-circle")
        .duration(750)
        .attr("fill", function(d, i) { return color(i); });

    // callback(vis)
}



