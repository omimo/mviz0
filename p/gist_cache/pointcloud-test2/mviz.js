// Variables
var connectivityMatrix;
var positions;
var figureScale = 180;
var h = 1040;
var w = 1000;
var gap = 0;
var skip = 1;


function drawfirst(frame, f) {
    // Prep the environment 
    var parent = d3.select("body").select("#c1");

    var svg = parent.append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("overflow", "scroll")
        .style("display", "inline-block");

    pointG = svg.selectAll("g.markers")
        .data(frame)
        .enter()
        .append('g')
        .attr('class','cg');

    for (var i=0; i< 10; i++) {
        pointG.append("circle")
            .attr("cx", function (d) {
                return d.x + 500 + i;
            }).attr("cy", function (d) {
                return -d.y + 400 +i;
            }).attr("r", function (d, i) {
                s = (f / 600) * 7;
                return s;
            }).attr("fill", '#555555')
            .attr("fill-opacity", function (d, i) {
                // if (i < 10)
                // console.log(d.z);
                MAX = 400;
                MIN = 0;
                o = Math.min(MAX, d.z);
                o = Math.max(MIN, o);

                return Math.max(0.2, o / (MAX - MIN));
            });
    }
    
    
    window.parent.loaded();
    return svg;
}

function update(frame, f, svg) {

    svg.selectAll("circle")
        .data(frame)
        .attr("cx", function (d) {
            return d.x + 500;
        }).attr("cy", function (d) {
            return -d.y + 400;
        }).attr("r", function (d, i) {
            s = (f / 600) * 7;
            return 1;
        }).attr("fill", "#555555")
        .attr("fill-opacity", function (d, i) {
            // if (i < 10)
            // console.log(d.z);
            MAX = 400;
            MIN = 0;
            o = Math.min(MAX, d.z);
            o = Math.max(MIN, o);

            return Math.max(0.2, o / (MAX - MIN));
        });
}


frames = [];
// Read the file
$.getJSON("http://omid.al/moveviz/data/pc4_f.json", function (json) {


    // put joints together
    positions = json.map(function (d) {
        var joints = [];
        for (i = 0; i < d.length; i += 3) {
            joints[i / 3] = {
                x: +d[i],
                y: +d[i + 1],
                z: +d[i + 2]
            };
        }

        return joints;
    });


    frames = positions.map(function (ff, j) {
        return ff.map(function (d, i) {
            return {
                x: (d.x) * figureScale + 30,
                y: 1 * d.y * figureScale,
                z: (d.z - 0) * figureScale
            };
        });
    });

    var fr = 1 / 30;
    var startTimeJ = Date.now();


    svgg = drawfirst(frames[0], 1);

    window.setInterval(function () {
        // document.getElementById('c1').innerHTML = "";
        f = Math.floor((Date.now() - startTimeJ) / 1000 / fr);

        if (f > frames.length) {
            startTimeJ = Date.now();
            f = 1;
        }

        update(frames[f], f + 1, svgg);

    }, fr * 1000);

});