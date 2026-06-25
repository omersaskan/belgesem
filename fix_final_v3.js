const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');
const { normals } = require('@gltf-transform/functions');

async function fixModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    // 1. Scale down to ~30cm. 
    // Trick: Scale the Belgesem_logo_decal slightly MORE (0.2%) so it physically hovers 
    // above the door mesh, completely eliminating Z-fighting (flickering/culling in AR).
    const baseScale = 0.0015;
    const decalScale = 0.001503; // 0.2% larger
    
    const rootNodes = doc.getRoot().listScenes()[0].listChildren();
    for (const node of rootNodes) {
        const name = node.getName();
        let scale = name.includes('Belgesem_logo_decal') ? decalScale : baseScale;
        
        // Apply the scale
        let currentScale = node.getScale();
        node.setScale([currentScale[0] * scale, currentScale[1] * scale, currentScale[2] * scale]);
    }
    
    // 2. Generate missing normals (Scene Viewer drops meshes without normals)
    await doc.transform(normals());
    
    // 3. Disable doubleSided for the logo to fix transparent backface sorting issues
    for (const mat of doc.getRoot().listMaterials()) {
        if (mat.getName().includes('logo')) {
            mat.setDoubleSided(false);
        }
    }
    
    await io.write('assets/forklift.glb', doc);
    console.log('Final V3 fix applied: scaled, decal offset to prevent z-fighting, normals generated, doubleSided=false.');
}

fixModel().catch(console.error);
