
AFRAME.registerComponent('newshape',
	{

	init:function()
	{
		//https://threejs.org/examples/webgl_geometry_shapes.html
		//https://threejs.org/docs/#api/en/extras/core/Shape
		
				var x = 0, y = 0;

				// Square

				var sqLength = 20;

				var squareShape = new THREE.Shape();
				squareShape.moveTo( 0, 0 );
				squareShape.lineTo( 0, sqLength );
				squareShape.lineTo( sqLength, sqLength );
				squareShape.lineTo( sqLength, 0 );
				squareShape.lineTo( 0, 0 );

				// Spline shape

				var splinepts = [];
				splinepts.push( new THREE.Vector2( 5, 10 ) );
				splinepts.push( new THREE.Vector2( 10, 20 ) );
				splinepts.push( new THREE.Vector2( 20, 25 ) );
				splinepts.push( new THREE.Vector2( 25, 15 ) );
				splinepts.push( new THREE.Vector2( 15, 5 ) );

				var splineShape = new THREE.Shape();
				splineShape.moveTo( 2, 2 );
				splineShape.splineThru( splinepts );
				
				
			// Heart shape
				
				var heartShape = new THREE.Shape();

				heartShape.moveTo( x + 5, y + 5 );
				heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
				heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
				heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
				heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
				heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
				heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

		
		var extrudeSettings = { depth: 8, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		
			//var geometry = new THREE.ShapeGeometry( heartShape );
			
			//var geometry = new THREE.ShapeGeometry(squareShape);
			
			
			
			var geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings ); //Change the name of the shape [geometry] to extrude it
			
			//var geometry = new THREE.ShapeGeometry(splineShape);
			
			
			
			var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
			
			var mesh = new THREE.Mesh( geometry, material ) ;
			
		this.el.setObject3D('mesh', mesh);
		}		
		});



		
		
AFRAME.registerComponent('box', {
  schema: {
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    depth: {type: 'number', default: 1},
    color: {type: 'color', default: '#7fff00'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
    this.material = new THREE.MeshLambertMaterial({color: data.color});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    el.setObject3D('mesh', this.mesh);
  },

  /**
   * Update the mesh in response to property updates.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    // If `oldData` is empty, then this means we're in the initialization process.
    // No need to update.
    if (Object.keys(oldData).length === 0) { return; }

    // Geometry-related properties changed. Update the geometry.
    if (data.width !== oldData.width ||
        data.height !== oldData.height ||
        data.depth !== oldData.depth) {
      el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.width, data.height,
                                                                    data.depth);
    }

    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
      el.getObject3D('mesh').material.color = new THREE.Color(data.color);
    }
  }
});