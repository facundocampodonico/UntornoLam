import * as THREE from './3d/build/three.module.js';

import  CombinedCamera  from './3d/jsm/cameras/CombinedCamera.js';

import  { OrbitControls } from './3d/jsm/controls/OrbitControls.js';

//import { TrackballControls}  from './3d/jsm/controls/TrackballControls.js';
import  TrackballControls  from './3d/jsm/visualizador/TrackballControls.js';

import  GridLine  from './3d/jsm/visualizador/GridLine.js';

import  TextSprite  from './3d/jsm/visualizador/TextSprite.js';

import { GCodeLoader } from './3d/jsm/loaders/GCodeLoader.js';

import CoordinateAxes from './3d/jsm/visualizador/CoordinateAxes.js';

import CuttingPointer from './3d/jsm/visualizador/CuttingPointer.js';

import GCodeVisualizer from './3d/jsm/visualizador/GCodeVisualizer.js';

import { getBoundingBox, loadSTL, loadTexture } from './3d/jsm/visualizador/helpers.js';

var container, controls;
var camera, scene, renderer, group;
var cuttingPointer, cuttingTool;
var isAgitated, renderAnimationLoop;
var gcode_visual;
var laprox=false;
var loader;
var objeto_gcode;
var destinox,destinoy,destinoz,haymovimiento;

//var movimientos_eje = new Array();
//var movimientos_cantidad = new Array();

var movimientos_eje = {};
var movimientos_cantidad = {};
var posicion_anterior = {};

var movimiento_actual =0;

//localStorage.setItem('prueba', "pepe");

function addTable(array_cmd) {
  let i,j;
var myTableDiv = document.getElementById("section1")
var table = document.createElement('TABLE')
var tableBody = document.createElement('TBODY')
table.border = '1'
table.appendChild(tableBody);

var heading = new Array();
heading[0] = " GCODE"


//COLUMNAS DE LA TABLA
var tr = document.createElement('TR');
tableBody.appendChild(tr);
for (i = 0; i < heading.length; i++) {
var th = document.createElement('TH')
th.width = '75';
th.appendChild(document.createTextNode(heading[0]));
tr.appendChild(th);
}


//FILAS DE LA TABLA
for (i = 0; i < array_cmd.length; i++) {
var tr = document.createElement('TR');
var td = document.createElement('TD')
td.appendChild(document.createTextNode(array_cmd[i]));
tr.appendChild(td)
tableBody.appendChild(tr);
}
myTableDiv.appendChild(table)
}



  $("#buttonleft").click(function(){
      if (controls) { controls.reset(); }

      camera.up.set(0, 0, 1);
      camera.position.set(200, 0, 0);

      if (controls) { controls.update(); }
  });
  $("#buttonright").click(function(){
      if (controls) { controls.reset(); }

      camera.up.set(0, 0, 1);
      camera.position.set(-200, 0, 0);

      if (controls) { controls.update(); }
  });
  $("#buttontop").click(function(){
      if (controls) { controls.reset();  }

      camera.up.set(0, 1, 0);
      camera.position.set(0, 0, 200);

      if (controls) { controls.update(); }
      //updateScene();
  });
  $("#button3d").click(function(){
      if (controls) { controls.reset(); }

      camera.up.set(0, 0, 1);
      camera.position.set(200, -200, 200);

      if (controls) { controls.update(); }
      //updateScene();
  });
  $("#buttonfront").click(function(){
      if (controls) { controls.reset(); }

      camera.up.set(0, 0, 1);
      camera.position.set(0, -200, 0);

      if (controls) { controls.update(); }
      //updateScene();
  });



  $("#buttonsimular").click(function(){

    var gcode_code=localStorage.getItem('gcode_codigo');

    //var array_comandos=gcode_code.split("\n");
    var array_comandos = gcode_code.replace( /;.+/g, '' ).split( '\n' );

    haymovimiento=true;
    var comando_cargado=0;
    movimientos_eje[0]={};
    posicion_anterior[0]={};
    posicion_anterior[0]['x']=posicion_anterior[0]['y']=posicion_anterior[0]['z']=0;
    movimientos_eje[0]['x']=movimientos_eje[0]['y']=movimientos_eje[0]['z']=0;

    for ( var i = 0; i < array_comandos.length; i ++ ) {


      var tokens = array_comandos[ i ].split( ' ' );

      var cmd = tokens[ 0 ].toUpperCase();
      var args = {};

      tokens.splice( 1 ).forEach( function ( token ) {

        if ( token[ 0 ] !== undefined ) {
          var key = token[ 0 ].toLowerCase();
          var value = parseFloat( token.substring( 1 ) );

          args[ key ] = value;

          if (cmd=="G0" || cmd=="G1")
            {
              if (key=='x' || key=='y' || key=='z')
              {
                movimientos_eje[comando_cargado][key]=value;
              }
            }
          }
        });

    if (cmd=="G0" || cmd=="G1")
    {

      posicion_anterior[comando_cargado]['x']=movimientos_eje[comando_cargado]['x'];
      posicion_anterior[comando_cargado]['y']=movimientos_eje[comando_cargado]['y'];
      posicion_anterior[comando_cargado]['z']=movimientos_eje[comando_cargado]['z'];

      comando_cargado++;
      posicion_anterior[comando_cargado]={};
      movimientos_eje[comando_cargado]={};

      movimientos_eje[comando_cargado]['x']=posicion_anterior[comando_cargado-1]['x'];
      movimientos_eje[comando_cargado]['y']=posicion_anterior[comando_cargado-1]['y'];
      movimientos_eje[comando_cargado]['z']=posicion_anterior[comando_cargado-1]['z'];

    }
  }

});



  $("#buttoncargar").click(function(){
      loader = new GCodeLoader();
      objeto_gcode = new THREE.Object3D();
      //objeto_gcode.matrixAutoUpdate=false;
      //loader.load( './3d/models/gcode/benchy.gcode', function ( object ) {
      //loader.load( './3d/models/gcode/circulo.gcode', function ( object ) {
      //loader.load( './3d/models/gcode/boomerangv4pulgadas.gcode', function ( object ) {
      loader.load( './3d/models/gcode/estrella.gcode', function ( object ) {
      //loader.load( './3d/models/gcode/boomerangv4mm.gcode', function ( object ) {
      //loader.load( './3d/models/gcode/boomerangv4milimetros.gcode', function ( object ) {
                                                                        object.position.set( 0, 0, 0 );
                                                                        objeto_gcode.add(object);
                                                                        render();});



      //console.log(array_comandos);

      //addTable(array_comandos);








      //document.getElementById("section1").innerHTML = gcode_code;
      /*var texto_prueba="";
      for (let i = 0; i <= array_comandos.length; ++i) {
          texto_prueba+=array_comandos[i]+"\n";
      }*/

      //document.getElementById("section1").innerHTML = texto_prueba;
      //localStorage.setItem('prueba', "pepe");

      //const bbox = getBoundingBox(objeto_gcode);

      //var children = objeto_gcode.children,
      //completeBoundingBox = new THREE.Box3(); // tescte a new box which will contain the entire values
      //console.log(objeto_gcode);

      //objeto_gcode.up={x: 0, y: 0, z: 0};
      //objeto_gcode.scale={x: 100, y: 100, z: 100}
      //console.log(children.length);
      //objeto_gcode.rotateX(1.5708);
      //objeto_gcode.rotateX(Math.PI / 2);
      /*for(var i = 0, j = children.length; i < j; i++){ // iterate through the children

        children[i].geometry.computeBoundingBox(); // compute the bounding box of the the meshes geometry

        var box = children[i].geometry.boundingBox.clone(); // clone the calculated bounding box, because we have to translate it

        box.translate(children[i].position); // translate the geometries bounding box by the meshes position


        completeBoundingBox.addPoint(box.max).addPoint(box.min); // add the max and min values to your completeBoundingBox

      }*/

      //var objectCenter = completeBoundingBox.center()
      //var a = new THREE.Vector3(  );
      //var objectCenter = completeBoundingBox.getSize(a)

      //console.log('This is the center of your Object3D:', objectCenter );

      // You want the center of you bounding box to be at 0|0|0

      //objeto_gcode.position.x -= objectCenter.x;
      //objeto_gcode.position.y -= objectCenter.y;
      //objeto_gcode.position.z -= objectCenter.z;

      scene.add( objeto_gcode);

      //var bbox = new THREE.Box3().setFromObject(objeto_gcode);


      //console.log("X" + bbox.min.x)
      //console.log("distanciaY" + bbox.max.y)
      //console.log("distanciaZ" + bbox.min.z)



      render();
      //loader.load( './3d/models/gcode/benchy.gcode', function ( object ) {
      //                                                                  object.position.set( 0, 0, 0 );
      //                                                                  scene.add( object );
      //                                                                  render();});

      //load(name, gcode, callback);
  });

  function load(name, gcode, callback) {
      // Remove previous G-code object
      unload();

      visualizer = new GCodeVisualizer();

      const obj = this.visualizer.render(gcode);
      obj.name = 'Visualizer';
      this.group.add(obj);

      const bbox = getBoundingBox(obj);
      const dX = bbox.max.x - bbox.min.x;
      const dY = bbox.max.y - bbox.min.y;
      const dZ = bbox.max.z - bbox.min.z;
      const center = new THREE.Vector3(
          bbox.min.x + (dX / 2),
          bbox.min.y + (dY / 2),
          bbox.min.z + (dZ / 2)
      );

      // Set the pivot point to the center of the loaded object
      this.pivotPoint.set(center.x, center.y, center.z);

      // Update position
      this.updateCuttingToolPosition();
      this.updateCuttingPointerPosition();
      this.updateLimitsPosition();

      if (this.viewport && dX > 0 && dY > 0) {
          // The minimum viewport is 50x50mm
          const width = Math.max(dX, 50);
          const height = Math.max(dY, 50);
          const target = new THREE.Vector3(0, 0, bbox.max.z);
          this.viewport.set(width, height, target);
      }

      // Update the scene
      this.updateScene();

      (typeof callback === 'function') && callback({ bbox: bbox });
  }


    function updateScene(options) {
              const { forceUpdate = false } = { ...options };
              //const needUpdateScene = this.props.show || forceUpdate;
              const needUpdateScene = forceUpdate;

              console.log("entro a update");
              //if (renderer && needUpdateScene) {
              //if (renderer) {
              renderer.setSize( gcodepreview.clientWidth - 40, gcodepreview.clientWidth * 0.5 );
              renderer.render(scene, camera);
              //}
          }


    /*function  createTrackballControls(object, domElement) {
                  const controls = new TrackballControls(object, domElement);

                  controls.rotateSpeed = 1.0;
                  controls.zoomSpeed = 1.2;
                  controls.panSpeed = 0.8;
                  controls.noZoom = false;
                  controls.noPan = false;

                  controls.staticMoving = true;
                  controls.dynamicDampingFactor = 0.3;

                  controls.keys = [65, 83, 68];

                  //controls.minDistance = TRACKBALL_CONTROLS_MIN_DISTANCE;
                  //controls.maxDistance = TRACKBALL_CONTROLS_MAX_DISTANCE;
                  controls.minDistance = 1;
                  controls.maxDistance = 2000;

                  let shouldAnimate = false;
                  const animate = () => {
                      controls.update();

                      // Update the scene
                      updateScene();

                      if (shouldAnimate) {
                          requestAnimationFrame(animate);
                      }
                  };

                  controls.addEventListener('start', () => {
                      shouldAnimate = true;
                      animate();
                  });
                  controls.addEventListener('end', () => {
                      shouldAnimate = false;
                      updateScene();
                  });
                  controls.addEventListener('change', () => {
                      // Update the scene
                      updateScene();
                  });

                  //controls.addEventListener('change', updateScene);
                  //console.log("saliendo");
                  return controls;
              }*/

      function createGridLineNumbers(units) {
                  const gridCount = (units === 'in') ? 32 : 60;
                  const gridSpacing = (units === 'in') ? 25.4 : 10;
                  const textSize = (units === 'in') ? (25.4 / 3) : (10 / 3);
                  const textOffset = (units === 'in') ? (25.4 / 5) : (10 / 5);
                  const group = new THREE.Group();

                  for (let i = -gridCount; i <= gridCount; ++i) {
                      if (i !== 0) {
                          const textLabel = new TextSprite({
                              x: i * gridSpacing,
                              y: textOffset,
                              z: 0,
                              size: textSize,
                              text: (units === 'in') ? i : i * 10,
                              textAlign: 'center',
                              textBaseline: 'bottom',
                              color: "rgb(100%, 0%, 0%)",
                              opacity: 0.5
                          });
                          group.add(textLabel);
                      }
                  }
                  for (let i = -gridCount; i <= gridCount; ++i) {
                      if (i !== 0) {
                          const textLabel = new TextSprite({
                              x: -textOffset,
                              y: i * gridSpacing,
                              z: 0,
                              size: textSize,
                              text: (units === 'in') ? i : i * 10,
                              textAlign: 'right',
                              textBaseline: 'middle',
                              color: "rgb(0%, 100%, 0%)",
                              opacity: 0.5
                          });
                          group.add(textLabel);
                      }
                  }

                  return group;
              }

    function createScene(el) {
              if (!el) {
                  return;
              }

              //meto cosas que no se donde van porque no tengo visualizador
              //camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
              //camera.position.set( 0, 0, 70 );

              var aspect = window.innerWidth / window.innerHeight;

              camera = new THREE.PerspectiveCamera( 60, aspect, 1, 1000 );
              camera.position.z = 500;

              //fin de meto constants

              //const { state } = this.props;
              //const { units, objects } = state;
              //averiguar si el ancho y alto es lo que se ve o la ventana
              //const width = collapseCardExample3.clientwidth;
              //const height = collapseCardExample3.clientheight;

              //console.log("ancho contenido"+el.clientWidth);
              //console.log("ancho tarjeta"+collapseCardExample3.clientwidth);


              scene = new THREE.Scene();

              // WebGLRenderer
              renderer = new THREE.WebGLRenderer({
                  autoClearColor: true,
                  antialias: true,
                  alpha: true
              });
              renderer.shadowMap.enabled = true;
              renderer.shadowMap.type = THREE.PCFSoftShadowMap;
              renderer.setClearColor(new THREE.Color("rgb(100%, 100%, 100%)"), 1);
              renderer.setSize( gcodepreview.clientWidth - 40, gcodepreview.clientWidth * 0.5 );
              //renderer.clear();
              renderer.setPixelRatio( window.devicePixelRatio );

              el.appendChild(renderer.domElement);


              //probando camara
              //window.addEventListener( 'resize', onWindowResize, false );
              window.addEventListener( 'resize', onWindowResize, false );

              createControls(camera);


              //////////////////


                              camera.aspect = window.innerWidth / window.innerHeight;
                              camera.updateProjectionMatrix();
                              renderer.setSize( gcodepreview.clientWidth - 40, gcodepreview.clientWidth * 0.5 );

                              controls.handleResize();
                              controls.update();

              //////////////////




              { // Directional Light
                  const color = 0xffffff;
                  const intensity = 1;
                  let light;

                  light = new THREE.DirectionalLight(color, intensity);
                  light.position.set(-1, -1, 1);
                  scene.add(light);

                  light = new THREE.DirectionalLight(color, intensity);
                  light.position.set(1, -1, 1);
                  scene.add(light);
              }

              { // Ambient Light
                  const light = new THREE.AmbientLight("rgb(25%, 25%, 25%)"); // soft white light
                  scene.add(light);
              }


              group = new THREE.Group();

              //createCoordinateSystem('mm');

              { // Metric Coordinate System
                  //const visible = objects.coordinateSystem.visible;
                  const metricCoordinateSystem = createCoordinateSystem('mm');
                  metricCoordinateSystem.name = 'MetricCoordinateSystem';
                  //metricCoordinateSystem.visible = visible && (units === 'mm');
                  group.add(metricCoordinateSystem);
              }
              { // Metric Grid Line Numbers
                  //const visible = objects.gridLineNumbers.visible;
                  const metricGridLineNumbers = createGridLineNumbers('mm');
                  metricGridLineNumbers.name = 'MetricGridLineNumbers';
                  //metricGridLineNumbers.visible = visible && (units === 'mm');
                  group.add(metricGridLineNumbers);
              }

              { // Cutting Tool
                  Promise.all([
                      loadSTL('./3d/jsm/visualizador/bit.stl').then(geometry => geometry),
                      loadTexture('./3d/jsm/visualizador/brushed-steel-texture.jpg').then(texture => texture),
                  ]).then(result => {
                      const [geometry, texture] = result;

                      // Rotate the geometry 90 degrees about the X axis.
                      geometry.rotateX(-Math.PI / 2);

                      // Scale the geometry data.
                      geometry.scale(0.5, 0.5, 0.5);

                      // Compute the bounding box.
                      geometry.computeBoundingBox();

                      // Set the desired position from the origin rather than its center.
                      const height = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
                      geometry.translate(0, 0, (height / 2));

                      let material;
                      if (geometry.hasColors) {
                          material = new THREE.MeshLambertMaterial({
                              map: texture,
                              opacity: 0.9,
                              transparent: false
                          });
                      }

                      const object = new THREE.Object3D();
                      object.add(new THREE.Mesh(geometry, material));

                      cuttingTool = object;
                      cuttingTool.name = 'CuttingTool';
                      //cuttingTool.visible = objects.cuttingTool.visible;
                      //herramienta de corte
                      group.add(cuttingTool);

                      // Update the scene
                      //controls.reset();
                      //controls.update();
                      //updateScene();
                  });
              }

              { // Cutting Pointer
                  cuttingPointer = new CuttingPointer({
                      //color: colornames('indianred'),
                      color: "rgb(80%, 36%, 36%)",
                      diameter: 2
                  });
                  cuttingPointer.name = 'CuttingPointer';
                  //cuttingPointer.visible = !objects.cuttingTool.visible;
                  //puntero rojo de corte
                  group.add(cuttingPointer);
              }


              scene.add(group);




              //render();

          }


    function onWindowResize() {

      //var aspect = window.innerWidth / window.innerHeight;
      var aspect = gcodepreview.clientWidth / gcodepreview.clientWidth;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      renderer.setSize( gcodepreview.clientWidth - 40, gcodepreview.clientWidth * 0.5 );

      controls.handleResize();

    }

      function createCoordinateSystem(units) {
              const axisLength = (units === 'in') ? 304.8 : 300;
              const gridCount = (units === 'in') ? 32 : 60;
              const gridSpacing = (units === 'in') ? 25.4 : 10;
              const group = new THREE.Group();

              { // Coordinate Grid
                  const gridLine = new GridLine(
                      gridCount * gridSpacing,
                      gridSpacing,
                      gridCount * gridSpacing,
                      gridSpacing,
                      "rgb(0%, 0%, 100%)",
                      //colornames('blue'), // center line
                      "rgb(44%, 44%, 44%)" // grid
                      //colornames('gray 44') // grid
                  );
                  //son 242 lineas + el 0
                  for (let a = 0; a <= (gridCount*4)+1; ++a) {

                    //console.log("entro"+ a);
                    gridLine.children[a].material.opacity = 0.15;
                    gridLine.children[a].material.transparent = true;
                    gridLine.children[a].material.depthWrite = false;
                  }


                  gridLine.name = 'GridLine';
                  group.add(gridLine);
                  scene.add(group);
              }

              { // Coordinate Axes
                  const coordinateAxes = new CoordinateAxes(axisLength);
                  coordinateAxes.name = 'CoordinateAxes';
                  group.add(coordinateAxes);
              }

              { // Axis Labels
                  const axisXLabel = new TextSprite({
                      x: axisLength + 10,
                      y: 0,
                      z: 0,
                      size: 20,
                      text: 'X',
                      color: "rgb(100%, 0%, 0%)"
                  });
                  const axisYLabel = new TextSprite({
                      x: 0,
                      y: axisLength + 10,
                      z: 0,
                      size: 20,
                      text: 'Y',
                      color: "rgb(0%, 100%, 0%)"
                  });
                  const axisZLabel = new TextSprite({
                      x: 0,
                      y: 0,
                      z: axisLength + 10,
                      size: 20,
                      text: 'Z',
                      color: "rgb(0%, 0%, 100%)"
                  });

                  group.add(axisXLabel);
                  group.add(axisYLabel);
                  group.add(axisZLabel);
              }

              return group;
          }



      function createControls( camera1 ) {

        controls = new TrackballControls( camera1, renderer.domElement );

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noRotate = false;
        controls.keys = [ 65, 83, 68 ];

      }


    /*  function createCombinedCamera(width, height) {
              const frustumWidth = width / 2;
              const frustumHeight = (height || width) / 2; // same to width if height is 0
              const fov = 70;
              const near = 0.001;
              const far = 2000;
              const orthoNear = 0.001;
              const orthoFar = 2000;

              const camera = new CombinedCamera(
                  frustumWidth,
                  frustumHeight,
                  fov,
                  near,
                  far,
                  orthoNear,
                  orthoFar
              );

              camera.position.x = 0;
              camera.position.y = 0;
              camera.position.z = 200;

              return camera;
          }*/

      /*function init() {

        scene = new THREE.Scene();
        var loader = new GCodeLoader();

        loader.load( './3d/models/gcode/benchy.gcode', function ( object ) {
                                                                          object.position.set( - 100, - 20, 100 );
                                                                          scene.add( object );
                                                                          render();});

                  renderer = new THREE.WebGLRenderer({
                                                        autoClearColor: true,
                                                        antialias: true,
                                                        alpha: true
                                                    });
                  renderer.shadowMap.enabled = true;
                  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                  renderer.setClearColor(new THREE.Color("rgb(100%, 100%, 100%)"), 1);
                  renderer.setPixelRatio( window.devicePixelRatio );
                  renderer.setSize( gcodepreview.clientWidth - 40, gcodepreview.clientWidth /2 );

                  camera = createCombinedCamera(collapseCardExample3.clientwidth, collapseCardExample3.clientheight);

                  var controls = new OrbitControls( camera, renderer.domElement );
                  controls.addEventListener( 'change', render ); // use if there is no animation loop
                  controls.minDistance = 10;
                  controls.maxDistance = 100;

                  gcodepreview.appendChild(renderer.domElement);

                  window.addEventListener( 'resize', resize, false );
              }*/


    /*function resize() {
      camera.aspect = gcodepreview.clientWidth / gcodepreview.clientWidth;
      camera.updateProjectionMatrix();
      render();

    }*/

    function render() {

      renderer.setSize( gcodepreview.clientWidth - 40, gcodepreview.clientWidth * 0.5 );
      renderer.render( scene, camera );
      //controls.update();

    }


    function moverherramienta()
    {
      //var avancey=1;
      //movimiento_actual
      if (haymovimiento)
        {
          /*if (movimiento_actual>0)
          {
            if (movimientos_eje[movimiento_actual]['x']!=0)
            {
            console.log(movimientos_eje[movimiento_actual]['y']-posicion_anterior[movimiento_actual-1]['y']/movimientos_eje[movimiento_actual]['x']-posicion_anterior[movimiento_actual-1]['x']);
            //avancey = movimientos_eje[movimiento_actual]['y']-posicion_anterior[movimiento_actual-1]['y']/movimientos_eje[movimiento_actual]['x']-posicion_anterior[movimiento_actual-1]['x'];
            avancey = movimientos_eje[movimiento_actual]['y']/movimientos_eje[movimiento_actual]['x'];
            //var avancez = movimientos_eje[movimiento_actual]['z']/movimientos_eje[movimiento_actual]['x'];
            }
          }*/
          //console.log(movimientos_eje[movimiento_actual]['z']);
          //console.log(movimientos_cantidad[movimiento_actual]);
          //console.log(movimiento_actual);
          console.log("posicionx: " + scene.children[3].children[3].position.x + " - destinox: "+ movimientos_eje[movimiento_actual]['x']);
          //if (movimientos_eje[movimiento_actual]['x'])
          //{
          if (scene.children[3].children[3].position.x < movimientos_eje[movimiento_actual]['x'])
            {
              //console.log(posicion_anterior[movimiento_actual]['x']);
              //console.log(movimientos_eje[movimiento_actual]['x']-posicion_anterior[movimiento_actual-1]['x']);
              if (movimiento_actual>0)
              {
                //scene.children[3].children[3].position.x += 1;
                scene.children[3].children[3].position.x += (movimientos_eje[movimiento_actual]['x']-posicion_anterior[movimiento_actual-1]['x'])/75;
              }
              else
              {
                scene.children[3].children[3].position.x += (movimientos_eje[movimiento_actual]['x'])/75;
                //scene.children[3].children[3].position.x += 1;
              }
              if (scene.children[3].children[3].position.x >= movimientos_eje[movimiento_actual]['x'])
              {
                scene.children[3].children[3].position.x = movimientos_eje[movimiento_actual]['x'];
                movimiento_actual++;
              }
              //scene.children[3].children[3].translateZ(value);
            }
          if (scene.children[3].children[3].position.x > movimientos_eje[movimiento_actual]['x'])
              {
                //scene.children[3].children[3].position.x -= 1;
                scene.children[3].children[3].position.x += (movimientos_eje[movimiento_actual]['x']-posicion_anterior[movimiento_actual-1]['x'])/75;
                if (scene.children[3].children[3].position.x <= movimientos_eje[movimiento_actual]['x'])
                {
                  scene.children[3].children[3].position.x = movimientos_eje[movimiento_actual]['x'];
                  movimiento_actual++;
                }
                //scene.children[3].children[3].translateZ(value);
              }
          //}
          console.log("posiciony: " + scene.children[3].children[3].position.y + " - destinoy: "+ movimientos_eje[movimiento_actual]['y']);
          //if (movimientos_eje[movimiento_actual]['y'])
          //{
          if (scene.children[3].children[3].position.y < movimientos_eje[movimiento_actual]['y'])
              {
                if (movimiento_actual>0)
                {
                scene.children[3].children[3].position.y += (movimientos_eje[movimiento_actual]['y']-posicion_anterior[movimiento_actual-1]['y'])/75;
                //scene.children[3].children[3].position.y += avancey;
                }
                else {
                  scene.children[3].children[3].position.y += (movimientos_eje[movimiento_actual]['y'])/75;
                  //scene.children[3].children[3].position.y += avancey;
                }
                if (scene.children[3].children[3].position.y >= movimientos_eje[movimiento_actual]['y'])
                {
                  scene.children[3].children[3].position.y = movimientos_eje[movimiento_actual]['y'];
                  movimiento_actual++;
                }
                //scene.children[3].children[3].translateZ(value);
              }
          if (scene.children[3].children[3].position.y > movimientos_eje[movimiento_actual]['y'])
              {
                scene.children[3].children[3].position.y +=  (movimientos_eje[movimiento_actual]['y']-posicion_anterior[movimiento_actual-1]['y'])/75;
                //scene.children[3].children[3].position.y -=  avancey;
                if (scene.children[3].children[3].position.y <= movimientos_eje[movimiento_actual]['y'])
                {
                  scene.children[3].children[3].position.y = movimientos_eje[movimiento_actual]['y'];
                  movimiento_actual++;
                }
                //scene.children[3].children[3].translateZ(value);
              }

            //}

          //if (movimientos_eje[movimiento_actual]['z'])
          //{
          if (posicion_anterior[movimiento_actual-1])
            {console.log("anteriorz: " + posicion_anterior[movimiento_actual-1]['z'] + "posicionz: " + scene.children[3].children[3].position.z + " - destinoz: "+ movimientos_eje[movimiento_actual]['z']);}

              if (scene.children[3].children[3].position.z < movimientos_eje[movimiento_actual]['z'])
                {
                 if (movimiento_actual>0)
                    {scene.children[3].children[3].position.z += (movimientos_eje[movimiento_actual]['z']-posicion_anterior[movimiento_actual-1]['z'])/75;}
                  else {scene.children[3].children[3].position.z += (movimientos_eje[movimiento_actual]['z'])/75;}
                 if (scene.children[3].children[3].position.z >= movimientos_eje[movimiento_actual]['z'])
                  {
                   scene.children[3].children[3].position.z = movimientos_eje[movimiento_actual]['z'];
                   movimiento_actual++;
                  }
                  //scene.children[3].children[3].translateZ(value);
                }
              if (scene.children[3].children[3].position.z > movimientos_eje[movimiento_actual]['z'])
                  {
                    scene.children[3].children[3].position.z += (movimientos_eje[movimiento_actual]['z']-posicion_anterior[movimiento_actual-1]['z'])/75;
                    if (scene.children[3].children[3].position.z <= movimientos_eje[movimiento_actual]['z'])
                    {
                      scene.children[3].children[3].position.z = movimientos_eje[movimiento_actual]['z'];
                      movimiento_actual++;
                    }
                    //scene.children[3].children[3].translateZ(value);
                  }
          //}

          if (movimiento_actual>0)
            {
            if (movimientos_eje[movimiento_actual]['x']==posicion_anterior[movimiento_actual-1]['x']&&movimientos_eje[movimiento_actual]['y']==posicion_anterior[movimiento_actual-1]['y']&&movimientos_eje[movimiento_actual]['z']==posicion_anterior[movimiento_actual-1]['z'])
            {movimiento_actual++;}
            }

        }
      //var d = mesh.position.x - mesh2.position.x;
      //if (mesh.position.x > mesh2.position.x) {
      //  mesh.position.x -= Math.min( speed, d );
      //}

    }


    function animate() {

      requestAnimationFrame( animate );

      //meter aca la animacion de la herramienta
      moverherramienta();

      if (laprox==true)
        {
          onWindowResize();
          laprox=false;
        //console.log("NO es cero");
        }
      if (gcodepreview.clientWidth===0)
        {
          //console.log("es cero");
          laprox=true;
        }

      controls.update();

      //console.log("entro");
      //updateScene();
      //renderer.render( scene, camera );
      render();
      //render();

    }

var coll = document.getElementsByClassName("contraerpreview");
var i;

//for (i = 0; i < coll.length; i++) {
  coll[0].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });

  if (cargagcode==false){
    cargagcode=true;
    createScene(gcodepreview);
    animate();
    }
//}
