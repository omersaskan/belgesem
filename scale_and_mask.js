const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');

async function fixModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    // 1. Scale down by another 0.15x (to make it a ~30cm "toy" size by default so it doesn't open huge)
    const rootNodes = doc.getRoot().listScenes()[0].listChildren();
    for (const node of rootNodes) {
        let currentScale = node.getScale();
        node.setScale([currentScale[0] * 0.15, currentScale[1] * 0.15, currentScale[2] * 0.15]);
    }
    
    // 2. Change the logo to MASK. BLEND causes depth issues and culling on Android AR.
    for (const material of doc.getRoot().listMaterials()) {
        if (material.getName().toLowerCase().includes('logo')) {
            material.setAlphaMode('MASK');
            material.setAlphaCutoff(0.25); // Lower cutoff so even semi-transparent edges show up
        }
    }
    
    await io.write('assets/forklift.glb', doc);
    console.log('Scaled down further and set logo to MASK in assets/forklift.glb');
}

fixModel().catch(console.error);
