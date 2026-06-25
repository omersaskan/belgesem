const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');
const { normals } = require('@gltf-transform/functions');

async function fixModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    // 1. Scale down to ~30cm
    const rootNodes = doc.getRoot().listScenes()[0].listChildren();
    for (const node of rootNodes) {
        let currentScale = node.getScale();
        node.setScale([currentScale[0] * 0.0015, currentScale[1] * 0.0015, currentScale[2] * 0.0015]);
    }
    
    // 2. Generate missing normals (Crucial for Android Scene Viewer)
    await doc.transform(normals());
    
    await io.write('assets/forklift.glb', doc);
    console.log('Final fix applied: scaled down, normals generated.');
}

fixModel().catch(console.error);
