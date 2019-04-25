
var radius = 150; //Control the dimension of the sphere

AFRAME.registerComponent('world', {

  schema: {
    src: {
      type: 'string',
      default: ''
    },

    topojson: {
      type: 'boolean',
      default: false
    },

    color: {
      type: 'color',
      default: '#ee7621'
    }
  },

  init: function() {
    var data = this.data;
    var el = this.el;
    console.log(data);
  
  d3.json(data.src, function(error, topology) {

      if (error) throw error;
     
	 console.log(topology);
	 
	  this.material = new THREE.MeshBasicMaterial({ //changed the line material 
        color: data.color
      });
	
     
	 if (data.topojson) {
      
	//Simplified World SHP//
	//var land = topojson.feature(topology,topology.objects.ne_110m_land_SP); // use simplier ne_110m_land_SP_Topo.json (topojson=TRUE. QGis:MultiPart to SinglePart)
	  
	  //Detailed World SHP//
	 var land = topojson.feature(topology,topology.objects.W_SingleP); // Use W_SingleP.json in HTML (topojson=TRUE. QGis:MultiPart to SinglePart) Even if the source file is the same (I used https://mapshaper.org/ to convert them) TopoJSON has some geometry errors -look at Italy polygon-
	  } else {
        var land = topology; // this is used with W_SinglePGEOJ.json (topojson=FALSE. in QGis --> MultiPart to SinglePart) 
      }
	  
	  //console.log(land);
	  	  
      var splineShps=[];
	  
		for(var i=0;i<land.features.length;i++) //for each polygon/country
			{
				var splinepts = [];
				
				//if(land.features[i].properties.ADMIN=="Italyy") //To check just one polygon
				//{	
					var coordArray=land.features[i].geometry.coordinates;
					
					for(var p=0;p<coordArray.length;p++) //in some case the coordinates are in Array of Array
						{
							var coord=coordArray[p]
							
							for(var k=0;k<coord.length;k++)
							{
								splinepts.push( new THREE.Vector2( coord[k][0], coord[k][1] ) ); //we store the coordinate as Vector2
							}
						}
						
						splinepts.push( splinepts[0] ); //we add the first point to close the shape

						var splineShape = new THREE.Shape(splinepts); //we create the THREE. Shape and...

						splineShps.push(splineShape); //...we store all the shapes (countries) in one array
				//}
			}
	  
						var geometry = new THREE.ShapeGeometry(splineShps); //create the polygon with the array of shapes
					
						for(var i=0; i<geometry.vertices.length;i++) //This loop is used to plce the shapes on a sphere. It change the X Y Z of all the vertices. By commenting this loop the shape are presented flat.
						{
						
						geometry.vertices[i]=vertex(geometry.vertices[i]);
						
						}
			  
						var mesh = new THREE.Mesh( geometry, material ) ;
					
						el.setObject3D('mesh', mesh);
	  
     el.object3D.rotation.set(
        THREE.Math.degToRad(90),
        THREE.Math.degToRad(0),
        THREE.Math.degToRad(0)
      );
	  
	
		
		
	});
	
  }
});
//End of the AFRAME component



function vertex(point) {
  var lambda = point.x * Math.PI / 180,
    phi = point.y * Math.PI / -180,
    cosPhi = Math.cos(phi);
	
	
	return new THREE.Vector3(
    radius * cosPhi * Math.cos(lambda),
    radius * cosPhi * Math.sin(lambda),
    radius * Math.sin(phi)
	
  );
}

//Not Used
function wireframe(multilinestring, material) {
  var geometry = new THREE.Geometry;
		
		multilinestring.coordinates.forEach(function(line) {
			d3.pairs(line.map(vertex), function(a, b) {
			geometry.vertices.push(a, b);
		
    });
  });
  return new THREE.LineSegments(geometry, material);
  
}



//Not used
function graticule10() {
  var epsilon = 1e-6,
    x1 = 180,
    x0 = -x1,
    y1 = 80,
    y0 = -y1,
    dx = 10,
    dy = 10,
    X1 = 180,
    X0 = -X1,
    Y1 = 90,
    Y0 = -Y1,
    DX = 90,
    DY = 360,
    x = graticuleX(y0, y1, 2.5),
    y = graticuleY(x0, x1, 2.5),
    X = graticuleX(Y0, Y1, 2.5),
    Y = graticuleY(X0, X1, 2.5);

  function graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - epsilon, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [x, y];
      });
    };
  }

  function graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - epsilon, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [x, y];
      });
    };
  }
  return {
    type: "MultiLineString",
    coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
      .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
      .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return Math.abs(x % DX) > epsilon;
      }).map(x))
      .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy).filter(function(y) {
        return Math.abs(y % DY) > epsilon;
      }).map(y))
  };
};