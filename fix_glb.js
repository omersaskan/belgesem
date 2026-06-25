const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');
const { normals } = require('@gltf-transform/functions');

async function fixModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    // 1. Generate missing normals (required by Android Scene Viewer)
    await doc.transform(normals());
    
    // 2. Some devices struggle with BLEND decals on top of geometry. MASK is safer.
    for (const material of doc.getRoot().listMaterials()) {
        if (material.getName().includes('logo') || material.getAlphaMode() === 'BLEND') {
            material.setAlphaMode('MASK');
            material.setAlphaCutoff(0.5);
        }
    }
    
    await io.write('assets/forklift.glb', doc);
    console.log('Fixed normals and alpha mode in assets/forklift.glb');
}

fixModel().catch(console.error);
