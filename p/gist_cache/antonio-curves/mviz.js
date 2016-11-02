// Variables
var title = 'Template V2';
var skeleton;
var positions;
var figureScale = 2.2;
var h = 540;
var w = 500;
var gap = 0;
var skip = 1;
var traillength = 3;
//******************************************************************//
var Mova = {};

Mova.Joints = function(parent, frames, className) {
    return parent.selectAll(className)
                 .data(frames.filter(function(d, i) {
                 return i % skip === 0;
                 }))
                 .enter()
                 .append("g")
                 .attr("class", className)
                 .attr("transform", function(d, i) {
                  return "translate(" + (i * gap) + ",0)";
                 })
                 .selectAll("joint")
                 .data(function(d, i) {
                 return d;
                 })
                 .enter();
};

Mova.Bones = function(parent, frames, skeleton, className) {
    return parent.selectAll(className)
                 .data(frames)
                 .enter()
                 .append("g")
                 .attr("class", className)
                 .selectAll("bone")
                 .data(skeleton)
                 .enter();
};

function run() {
    document.title = document.title + ' [' + title + '] ';
    $('#title').text('['+title+']');
    // Read the files
    console.log('Loading the data...');
    
    d3.json("http://omid.al/moveviz/data/ConnectivityMatrix_Antonio.json", function(error, json) {
        if (error) return console.warn(error);
        skeleton = json;
        d3.json("http://omid.al/moveviz/data/Improv_Antonio.json", function(error, json) {
            positions = json;
            positions.splice(0, 160);
            positions.splice(positions.length-190, 190);

             var frames = positions.map(function(ff, j) {
                return ff.map(function(d, i) {
                return {
                    x: (d.x + 80) * figureScale,
                    y: -1 * d.y * figureScale + h - 10,
                    z: d.z * figureScale
                };
                });
            });


            svg = draw(frames);
            
            var fr = 1/30;
            var startTimeJ = Date.now();   

            anim0(frames.slice(0,traillength),svg);
            
            window.setInterval(function() {
                f = traillength + Math.floor((Date.now() - startTimeJ)/1000 / fr);                                        
                
                if (f > frames.length) {
                    startTimeJ=Date.now();
                    f = 0;
                }
                segment = frames.slice(f-traillength,f);
                anim(segment,svg);                    
                
            }, fr * 1000);
            
        });
    });
}


function draw(frames) {
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

  // Joints
  headJoint = 15;


//   var joints = Mova.Joints(svg, frames,"ci");

//    var joint = joints.append("circle")
//     .attr("cx", function(d) {
//       return d.x + Math.random() * 0;
//     })
//     .attr("cy", function(d) {
//       return d.y + Math.random() * 0;
//     })
//     .attr("r", function(d, i) {
//       if (i == headJoint)
//         return .8;
//       else
//         return .8;
//     })
//     .attr("fill",'grey')
//     .attr("fill-opacity", function(d, j, k) {
//     	if ((k * skip) < (frames.length/ 2))
//         coef = (k * skip)/frames.length;
//       else
//         coef = (frames.length - (k * skip))/frames.length;
//       return coef;
//     });


  // Bones
  // svg.selectAll("g.bones")
  //   .data(frames.filter(function(d, i) {
  //     return i % skip == 0;
  //   }))
  //   .enter()
  //   .append("g")
  //   .attr("transform", function(d, i) {
  //     return "translate(" + (i * gap) + ",0)";
  //   })
  //   .selectAll("line.f" + index)
  //   .data(skeleton)
  //   .enter()
  //   .append("line")
  //   .attr("stroke", "grey")
  //   .attr("stroke-opacity", function(d, j, k) {
  //   	if ((k * skip) < (frames.length/ 2))
  //       coef = (k * skip)/frames.length;
  //     else
  //       coef = (frames.length - (k * skip))/frames.length;
  //     return coef;
  //   })
  //   .attr("stroke-width", .2)
  //   .attr("x1", 0).attr("x2", 0)
  //   .attr("x1", function(d, j, k) {
  //     return frames[k * skip][d[0]].x;
  //   })
  //   .attr("x2", function(d, j, k) {
  //     return frames[k * skip][d[1]].x;
  //   })
  //   .attr("y1", function(d, j, k) {
  //     return frames[k * skip][d[0]].y;
  //   })
  //   .attr("y2", function(d, j, k) {
  //     return frames[k * skip][d[1]].y;
  //   });
    window.parent.loaded();

    return svg;
}

function anim0(frames, svg) {
  // Joints
  headJoint = 15;


var joints = Mova.Joints(svg, frames,"jointsanim");
var bones = Mova.Bones(svg, frames, skeleton, "boneanim");

// joints.append("circle")
//     .attr("class","anim")
//     .attr("cx", function(d) {
//       return d.x;
//     }).attr("cy", function(d) {
//       return d.y;
//     }).attr("r", function(d, i) {
//       if (i == headJoint)
//         return .8;
//       else
//         return 1.8;
//     })
//     .attr("fill",'#cc6666')
//     .attr("fill-opacity",1);


  // Bones
var boneFunction = d3.svg.line()
    .x(function(d,j,k) { console.log(d);return frames[0][d[0]].x; })
    .y(function(d) { return frames[0][d[0]].y; })
    .interpolate("linear");

 bones.append("path")  
    .attr("d", boneFunction(skeleton))
    .attr("class","anim")   
    .attr("stroke", "#cc6666")
    .attr("stroke-opacity", .8)
    .attr("stroke-width", 2);
}

function anim(frames, svg, f) {
  // Joints
  headJoint = 15;

 svg.selectAll("g.jointsanim")
    .data(frames)
    .selectAll("circle.anim")
    .data(function(d, i) {
      return d;
    })
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", function(d, i, k) {
        return .2 + 1.5 * k/traillength;
    })
    .attr("fill",'#cc6666')
    .attr("fill-opacity", function (d,i, k) {
        return k/traillength;
    });


  // Bones

var boneFunction = function(d, k) {
    bf = d3.svg.line()
    .x(function(d) { return frames[k][d[0]].x; })
    .y(function(d) { return frames[k][d[0]].y; })
    .interpolate("basis");
    return (bf(d));
};


 svg.selectAll("g.boneanim")
    .data(frames)
    .selectAll("path.anim")
    .data(skeleton)
    .attr("d", function(d,j,k) {
        return boneFunction(skeleton,k);
    })
    .attr("fill", "transparent")
    .attr("fill-opacity", "0.2")
    .attr("stroke", "#666666")
    .attr("stroke-opacity",  function (d,i, k) {
        return 0 + 0.1 * k/traillength;
    })
    .attr("stroke-width", function (d,i, k) {
        return  0.2 +  k/traillength  + Math.random() * 0;
    });
}
var boneFunction_ = function() {
    return d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");
};

function fu(k) {
    // console.log(k);
    return Math.sin(k) * 0;
}