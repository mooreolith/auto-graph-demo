import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import init, { Graph as LayoutGraph, Constants, VertexData, Vector3 } from "../pkg/layout_graph.js";

await init();

class SceneGraph extends EventTarget {

  constructor(options = {
    width: window.innerWidth,
    height: window.innerHeight
  }){
    super();
    // an inexaustible supply of vertex and edge ids
    this.#setupNewIds();
    this.#housekeeping(); // inner to outer edge ids - maps to keep track of the various objects in the scene
    this.#setupScene(options);
    this.#setupControls();
    this.renderer.setAnimationLoop(this.render.bind(this));
    this.#setupObjectPicking();

    // layout graph
    this.layoutGraph = new LayoutGraph();

    window.addEventListener('resize', () => {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      // Also update the camera aspect ratio and call camera.updateProjectionMatrix()
    });
  }

  render(){
    // obtain the new vertex positions
    const positions = this.layoutGraph.update();
    
    // update label positions
    this.#updateLabels();

    // update the vertex positiosn in the scene
    positions.forEach((vertexData) => {
      const id = vertexData.id;
      const pos = vertexData.position;
      const mesh = this.iVertexIdsToMeshes.get(BigInt(id));

      mesh.position.set(pos.x, pos.y, pos.z);
    })

    // update the edges to their new source and target positions
    for(const line of this.iEdgeIdsToLines.values()){
      let spos = line.userData.source.position.clone();
      let tpos = line.userData.target.position.clone();
      
      line.geometry.attributes.position = new THREE.BufferAttribute(
        new Float32Array([spos.x, spos.y, spos.z, tpos.x, tpos.y, tpos.z]), 3);
      line.geometry.verticesNeedUpdate = true;
    }

    // update the controls
    this.controls.update();

    // render the scene
    this.renderer.render(this.scene, this.camera);
  }

  addVertex(options={}){
    let _id = options.id;
    let cleanId = (options.id instanceof String) && (parseInt(options.id[0]) == NaN);
    options = Object.assign({}, {
      id: cleanId ? _id : `vertex-${this.newVertexId++}`,
      size: 1.0,
      color: 0x000000,
      invisible: false,
      face: undefined
    }, options);
    
    if(options.invisible) options.size = 0.0;

    // create a cube
    const cube = this.createCube(options);

    // render label
    if(options.label){
      const label = this.createLabel(options);
      cube.userData.label = label;
    }

    cube.userData.size = options.size;
    cube.userData.color = options.color;
    cube.userData.invisible = options.invisible;
    cube.userData.face = options.face;
    
    cube.userData.edges = new Set([]);

    this.scene.add( cube );

    // add a corresponding vertex to the layout graph
    const iid = this.layoutGraph.add_vertex();

    // housekeeping
    this.iVertexIdsToMeshes.set(iid, cube);
    this.o2i_vid.set(options.id, iid);
    this.i2o_vid.set(iid, options.id);

    cube.userData.id = options.id;

    // return the passed in id for confirmation. 
    // this is what users of this class will refer to the vertex by.
    return options.id;
  }

  addEdge(oSourceId, oTargetId, options={}){
    // options
    let cleanId = (options.id instanceof String) && (parseInt(options.id[0]) == NaN);
    let _id = options.id;

    options = Object.assign({}, {
      id: cleanId ? _id : `edge-${this.newEdgeId++}`,
      color: 'black',
      linewidth: 1.0,
      arrow: false,
      invisible: false
    }, options)
    
    //#region reverse housekeeping
    // resolve source and target vertex
    const iSourceId = this.o2i_vid.get(oSourceId);
    const iTargetId = this.o2i_vid.get(oTargetId);

    const sourceMesh = this.iVertexIdsToMeshes.get(iSourceId);
    const targetMesh = this.iVertexIdsToMeshes.get(iTargetId);

    // create line 
    const geometry = new THREE.BufferGeometry().setFromPoints([
      sourceMesh.position.clone(),
      targetMesh.position.clone()
    ])
    const material = new THREE.LineBasicMaterial({ color: options.color, linewidth: options.linewidth });
    const line = new THREE.Line(geometry, material);
    line.userData.source = sourceMesh;
    line.userData.target = targetMesh;

    sourceMesh.userData.edges.add(options.id);
    targetMesh.userData.edges.add(options.id);
    //#endregion

    // render label
    if(options.label){
      const label = this.createLabel(options);
      line.userData.label = label;
    }

    line.userData.id = options.id;
    line.userData.color = options.color;
    line.userData.linewidth = options.linewidth;
    line.userData.arrow = options.arrow;

    // add line to scene
    this.scene.add(line);

    // housekeeping
    const id = this.layoutGraph.add_edge(BigInt(iSourceId), BigInt(iTargetId));
    this.iEdgeIdsToLines.set(id, line);
    this.o2i_eid.set(options.id, id);
    this.i2o_eid.set(id, options.id);

    line.userData.id = options.id;

    return options.id;
  }

  remove(id){
    if(this.o2i_vid.has(id)){
      this.removeVertex(id);
    }else if(this.o2i_eid.has(id)){
      this.removeEdge(id);
    }else{
      return false;
    }
    return true;
  }

  removeVertex(oid){
    const iid = this.o2i_vid.get(oid);
    if(iid === undefined) return false;

    const cube = this.iVertexIdsToMeshes.get(iid);

    if(this.selection.has(cube)){
      this.undrawSelection(cube);
      this.selection.delete(cube);
      this.prevMaterials.delete(cube.id);
    }

    if(cube.userData.edges.size > 0){
      cube.userData.edges.forEach((oeid) => {
        this.removeEdge(oeid);
      })
    }

    this.o2i_vid.delete(oid);
    this.i2o_vid.delete(iid);
    this.iVertexIdsToMeshes.delete(iid);

    this.scene.remove(cube);
    cube.geometry.dispose();
    cube.material.dispose();
    this.layoutGraph.remove_vertex(BigInt(iid));
    return true;
  }

  removeEdge(oid){
    const iid = this.o2i_eid.get(oid);
    if(iid === undefined) return false;

    const line = this.iEdgeIdsToLines.get(iid);

    if(this.selection.has(line)){
      this.undrawSelection(line);
      this.selection.delete(line);
      this.prevMaterials.delete(line.id);
    }

    this.o2i_eid.delete(oid);
    this.i2o_eid.delete(iid);
    this.iEdgeIdsToLines.delete(iid)

    this.scene.remove(line);
    line.geometry.dispose();
    line.material.dispose();
    this.layoutGraph.remove_edge(BigInt(iid));
    return true;
  }

  drawSelection(object){
    this.prevMaterials.set(object.id, object.material.clone());
    object.material.color.set(0xffa500);

    const s = 1.25;
    const geometry = new THREE.EdgesGeometry( object.geometry );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const highlight = new THREE.LineSegments( geometry, material );

    if(object.type == 'Mesh') highlight.scale.set(s, s, s);
    object.add(highlight);
  }

  undrawSelection(object){
    const highlight = object.children.find((obj) => obj.type === 'LineSegments');
    if(highlight){
      object.remove(highlight);
      object.material.copy(this.prevMaterials.get(object.id));
      this.prevMaterials.delete(object.id);
    }
  }

  createLabel(options) {
    let div = document.createElement('div');

    div.innerHTML = options.label;
    div.style.position = 'fixed';
    div.style.color = 'black';
    div.style.backgroundColor = 'white';
    div.style.padding = '2px';
    div.style.border = '1px solid black';
    div.style.borderRadius = '5px';
    div.style.zIndex = '1000';

    this.canvas.parentElement.appendChild(div);
    return div;
  }

  createCube(options) {
    const s = options.size;
    const c = options.color;
    
    const geometry = new THREE.BoxGeometry(s, s, s);
    let material;
    if (options.face !== undefined) {
      const face = options.face;
      const texture = new THREE.TextureLoader().load(face);
      material = new THREE.MeshBasicMaterial({ map: texture });
    } else {
      material = new THREE.MeshBasicMaterial({ color: c });
    }
    const cube = new THREE.Mesh(geometry, material);

    // set the position of the cube 
    cube.position.set(
      Math.random(),
      Math.random(),
      Math.random()
    )

    return cube;
  }

  #toClientCoords(scenePos, camera, canvas) {
    // Clone the vertex because project modifies the vector in place
    let position = scenePos.clone();

    // Transform from world space to NDC space
    position.project(camera);

    // Transform from NDC space to client coordinates
    let x = Math.round((position.x + 1) / 2 * canvas.clientWidth);
    let y = Math.round((-position.y + 1) / 2 * canvas.clientHeight);

    return { x, y };
  }

  #updateLabels(){
    const raycaster = new THREE.Raycaster();
    const allSet = new Set(this.scene.children);
    const visibleSet = new Set([]);
    
    this.scene.traverseVisible((object) => {
      if(object.userData.label === undefined) return;

      let position;
      if(object.type === 'Mesh'){
        position = object.position.clone();
      }else if(object.type === 'Line'){
        let spos = object.userData.source.position.clone();
        let tpos = object.userData.target.position.clone();
        position = spos.clone().add(tpos).divideScalar(2);
      }

      visibleSet.add(object);

      raycaster.ray.origin.copy(this.camera.position);
      raycaster.ray.direction.copy(position.clone().sub(this.camera.position).normalize())

      let label = object.userData.label;
      label.style.display = 'block';
      let coords = this.#toClientCoords(position, this.camera, this.canvas);
      let rect = this.canvas.getBoundingClientRect();
      label.style.left = `${(coords.x - rect.left - label.offsetWidth / 2)}px`;
      label.style.top = `${(coords.y - rect.top - label.offsetHeight / 2) + 50}px`;
    })

    allSet.forEach((object) => {
      if(!visibleSet.has(object) && object.userData.label !== undefined){
        object.userData.label.style.display = 'none';
      }
    })
  }

  resize(){
    const w = getComputedStyle(this.canvas.parentElement).width;
    const h = getComputedStyle(this.canvas.parentElement).height;

    console.log('resize', w, h);

    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  set backgroundColor(color){
    this.renderer.setClearColor(color);
  }

  get backgroundColor(){
    return this.renderer.getClearColor();
  }

  set width(w){
    const h = this.renderer.getSize().y;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  get width(){
    return this.renderer.getSize().y;
  }

  set height(h){
    const w = this.renderer.getSize().x;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  get height(){
    return this.renderer.getSize().height;
  }

  getVertexOption(oid, attr){
    const iid = this.o2i_vid.get(oid);
    if(iid === undefined) return undefined;

    const mesh = this.iVertexIdsToMeshes.get(iid);

    if(attr === 'size'){
      return mesh.scale.x;
    }else if(attr === 'color'){
      return mesh.material.color.getHex();
    }else if(attr === 'face'){
      return mesh.material.map;
    }

    return undefined;
  }

  getEdgeOption(oid, attr){
    const iid = this.o2i_eid.get(oid);
    if(iid === undefined) return undefined;

    const line = this.iEdgeIdsToLines.get(iid);

    if(attr === 'color'){
      return line.material.color.getHex();
    }else if(attr === 'linewidth'){
      return line.material.linewidth;
    }

    return undefined;
  }

  setVertexOption(oid, attr, value){
    const iid = this.o2i_vid.get(oid);
    if(iid === undefined) return false;

    const mesh = this.iVertexIdsToMeshes.get(iid);

    if(attr === 'size'){
      mesh.scale.set(value, value, value);
    }else if(attr === 'color'){
      mesh.material.color.set(value);
    }else if(attr === 'face'){
      const texture = new THREE.TextureLoader().load(value);
      mesh.material = new THREE.MeshBasicMaterial({ map: texture });
    }

    return true;
  }

  setEdgeOption(oid, attr, value){
    const iid = this.o2i_eid.get(oid);
    if(iid === undefined) return false;

    const line = this.iEdgeIdsToLines.get(iid);

    if(attr === 'color'){
      line.material.color.set(value);
    }else if(attr === 'linewidth'){
      line.material.linewidth = value;
    }

    return true;
  }

  #setupObjectPicking(){
    const raycaster = new THREE.Raycaster();

    this.selection = new Set([]);
    this.prevMaterials = new Map();

    this.canvas.addEventListener('mousedown', event => {
      /* Left Mouse Button */

      // Normalize mouse
      const intersects = this.#mouseIntersects(event, raycaster);
      const ctrl = event.ctrlKey;
      let object = intersects.length > 0 ? intersects[0].object : undefined;

      // if the highlight object is selected, select the parent object, the vertex or edge
      if(object && object.type === 'LineSegments'){
        object = object.parent;  
      }
      
      // if ctrl is not pressed, but an object is selected, clear previous and select new
      if(object && !ctrl && event.button === 0){
        this.clearSelection();
        this.select(object);
      }

      // if ctrl is pressed, toggle selection
      if(object && ctrl && event.button === 0){
        if(this.selection.has(object)){
          this.deselect(object);
        }else{
          this.select(object);
        }
      }

      // if no object is selected, clear selection
      if(!object && !ctrl && event.button === 0){
        this.clearSelection();
      }
    })
  }

  centerCamera(){
    this.controls.target = this.center();
  }

  clearSelection(){
    this.selection.forEach((object) => {
      this.deselect(object);
    })
    this.selection.clear();
    this.prevMaterials.clear();
  }

  deselect(object) {
    this.selection.delete(object);
    this.undrawSelection(object);
  }

  select(object) {
    this.selection.add(object);
    this.drawSelection(object);
  }

  #mouseIntersects(event, raycaster) {
    const mouse = new THREE.Vector2();
    let rect = this.canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(this.scene.children);
    return intersects;
  }

  #setupNewIds() {
    this.newVertexId = 0;
    this.newEdgeId = 0;
  }

  #housekeeping() {
    this.iVertexIdsToMeshes = new Map();
    this.iEdgeIdsToLines = new Map();

    this.o2i_vid = new Map(); // outer to inner vertex ids
    this.i2o_vid = new Map(); // inner to outer vertex ids

    this.o2i_eid = new Map(); // outer to inner edge ids
    this.i2o_eid = new Map();
  }

  #setupScene(options) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, options.width / options.height, 0.1, 1000);
    this.camera.position.z = -15;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(options.width, options.height);
    this.canvas = this.renderer.domElement;
    this.light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.light);
  }

  #setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = true;
  }

  center(){
    return this.layoutGraph.middle();
  }
}

export { SceneGraph };