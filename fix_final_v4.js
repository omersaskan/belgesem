const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');
const { normals } = require('@gltf-transform/functions');

async function fixModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    // 1. Scale down to ~30cm.
    const baseScale = 0.0015;
    const decalScale = 0.001503; // 0.2% larger to physically push decals outward and prevent Z-fighting
    
    const rootNodes = doc.getRoot().listScenes()[0].listChildren();
    for (const node of rootNodes) {
        const name = node.getName();
        let scale = name.includes('logo_decal') ? decalScale : baseScale;
        
        let currentScale = node.getScale();
        node.setScale([currentScale[0] * scale, currentScale[1] * scale, currentScale[2] * scale]);
    }
    
    // 2. Generate missing normals (required by AR Scene Viewer)
    await doc.transform(normals());
    
    // NOTE: We no longer disable doubleSided on the material. The 3D artist mirrored one of the decals, 
    // which flipped its normals. Setting doubleSided=false made the mirrored decal invisible from the outside.
    
    await io.write('assets/forklift.glb', doc);
    console.log('Final V4 fix applied: scaled, z-fighting offset, normals generated, materials untouched.');
}

fixModel().catch(console.error);
