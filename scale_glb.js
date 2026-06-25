const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');

async function scaleModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    const rootNodes = doc.getRoot().listScenes()[0].listChildren();
    
    for (const node of rootNodes) {
        let currentScale = node.getScale();
        node.setScale([currentScale[0] * 0.01, currentScale[1] * 0.01, currentScale[2] * 0.01]);
    }
    
    await io.write('assets/forklift.glb', doc);
    console.log('Scaled model saved to assets/forklift.glb');
}

scaleModel().catch(console.error);
