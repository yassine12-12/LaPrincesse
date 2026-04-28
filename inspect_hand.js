const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader.js');
const THREE = require('three');
const fs = require('fs');
const buf = fs.readFileSync('./public/models/hand_right.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer, '', (gltf) => {
  const targets = ['index-finger-phalanx-distal','ring-finger-phalanx-distal','thumb-phalanx-distal'];
  gltf.scene.traverse(n => {
    if (targets.includes(n.name)) {
      n.updateWorldMatrix(true, false);
      const wq = new THREE.Quaternion(); n.getWorldQuaternion(wq);
      const wd = new THREE.Vector3(0,0,1).applyQuaternion(wq);
      const wu = new THREE.Vector3(0,1,0).applyQuaternion(wq);
      console.log(n.name);
      console.log('  worldFwd=' + [wd.x,wd.y,wd.z].map(v=>v.toFixed(3)).join(','));
      console.log('  worldUp=' + [wu.x,wu.y,wu.z].map(v=>v.toFixed(3)).join(','));
    }
  });
}, e => console.error(e));
