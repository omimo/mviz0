// Variables
var title = 'BEA - Entangled';
var skeleton;
var positions;
var figureScale = 7;
var h = 670;
var w = 700;
var gap = 0;
var skip = 1;
//******************************************************************// 

function run() {
    document.title = document.title + ' [' + title + '] ';
    $('#title').text('['+title+']');
    // Read the files
    console.log('Loading the data...');
    
    d3.json("http://omid.al/moveviz/data/Skeleton_BEA.json", function(error, json) {
        if (error) return console.warn(error);
        skeleton = json;
        d3.json("http://omid.al/moveviz/data/BEA.json", function(error, json) {
            positions = json;
            positions.splice(0, 160);
            positions.splice(positions.length-190, 190);
            draw();
        });
    });
}

function draw() {
   console.log('Drawing...');
  // Prep the environment 
  var parent = d3.select("body").select("#c1");
  var svg = parent.append("svg")
    .attr("id","svg")
    .attr("width", w)
    .attr("height", h)
    .attr("overflow", "scroll")
    .style("display", "inline-block");

  // Scale the data
  
  index = 30;

  
  frames = positions.map(function(ff, j) {
    return ff.map(function(d, i) {
      return {
        x: (d.x ) * figureScale + 370,
        y: -1 * d.y * figureScale + h - 10,
        z: d.z * figureScale
      };
    });
  });

  // Joints
  headJoint = 15;

  svg.selectAll("g.joints")
    .data(frames.filter(function(d, i) {
      return i % skip == 0;
    }))
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + (i * gap) + ",0)";
    })
    .selectAll("circle.f" + index)
    .data(function(d, i) {
      return d
    })
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", function(d, i) {
      if (i == headJoint)
        return .4;
      else
        return .4;
    }).attr("fill",'#555555')
    .attr("fill-opacity",function(d, i,k) {
    	if ((k * skip) < (frames.length/ 2))
        coef = (k * skip)/frames.length;
      else
        coef = (frames.length - (k * skip))/frames.length;   
			return coef-0.1;
    });


  // Bones
 frameBones = svg.selectAll("g.bones")
    .data(frames.filter(function(d, i) {
      return i % skip == 0;
    }))
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + (i * gap) + ",0)";
    });

  bones = frameBones.selectAll("line.f" + index)
    .data(skeleton)
    .enter();

  bone = bones.append("line")
    .attr("stroke", function(d,j,k) {
        return "black";
    })
    .attr("stroke-opacity", function(d, j, k) {
    	if ((k * skip) < (frames.length/ 2))
        coef = (k * skip)/frames.length;
      else
        coef = (frames.length - (k * skip))/frames.length;
      return coef - 0.1;
    })
    .attr("stroke-width", .2)
    .attr("x1", 0).attr("x2", 0)
    .attr("x1", function(d, j, k) { 
      return frames[k * skip][d[0]].x;
    })
    .attr("x2", function(d, j, k) {
      return frames[k * skip][d[1]].x;
    })
    .attr("y1", function(d, j, k) {
      return frames[k * skip][d[0]].y;
    })
    .attr("y2", function(d, j, k) {
      return frames[k * skip][d[1]].y;
    });
    
    window.parent.loaded();
}
