// Variables
var title = 'Scroll Demo';
var skeleton; // Storing the skeleton data
var positions;  // Storing the joint positions
var positions_scaled;  // Storing the scaled joint positions
var figureScale = 2;  // The scaling factor for our visualizations
var h = 200;  // The height of the visualization
var w = 400;  // The width of the visualization
var gap = 40;
var skip = 4;
//******************************************************************//
function run() {
    d3.json("http://omid.al/moveviz/data/Skeleton_BEA.json", function(error, json) {
        if (error) return console.warn(error);
        skeleton = json;
        d3.json("http://omid.al/moveviz/data/BEA1.json", function(error, json) {
           positions = json;
           updatefig();        
           $(window).scroll(updatefig);
        });
    });
}

function draw(index) {
    document.getElementById('container').innerHTML = "";
    var parent = d3.select("body").select("#container");

    var svg = parent.append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("overflow","scroll")
        .style("display","inline-block");

    // Scale the data
    positions_scaled = positions.map(function(f, j) {
        return f.map(function(d, i) {
        return {
            x: (d.x + 50) * figureScale,
            y: -1 * d.y * figureScale + h - 10,
            z: d.z * figureScale
        };
        });
    });

    // Choose the frame to draw
    // index = 60;  // the index of the frame
    currentFrame = positions_scaled[index];

    headJoint = 7;

    svg.selectAll("circle.joints" + index)
    .data(currentFrame)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return d.x;
    }).attr("cy", function(d) {
        return d.y;
    }).attr("r", function(d, i) {
        if (i == headJoint )
            return 4;
        else
            return 2;
    }).attr("fill", function(d, i) {
        return '#555555';
    });

    // Bones
    svg.selectAll("line.bones" + index)
    .data(skeleton)
    .enter()
    .append("line")
    .attr("stroke", "#555555")
    .attr("stroke-width",1)
    .attr("x1",0).attr("x2",0)
    .attr("x1", function(d, j) {
        return currentFrame[d[0]].x;
    })
    .attr("x2", function(d, j) {
        return currentFrame[d[1]].x;
    })
    .attr("y1", function(d, j) {
        return currentFrame[d[0]].y;
    })
    .attr("y2", function(d, j) {
        return currentFrame[d[1]].y;
    });   

    window.parent.loaded();
}

function updatefig() {
    var totalScroll = document.body.scrollHeight - document.body.clientHeight;
            var currentScroll = window.scrollY;
            var per = currentScroll / totalScroll;                        
            
            var frame = Math.floor(per * (positions.length-1));
            
            draw(frame);
}
