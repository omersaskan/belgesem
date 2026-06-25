const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');
const { normals } = require('@gltf-transform/functions');

async function fixModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    const baseScale = 0.0015;
    const decalScale = 0.001503;
    
    for (const node of doc.getRoot().listNodes()) {
        const name = node.getName();
        let scale = name.includes('logo_decal') ? decalScale : baseScale;
        
        let currentScale = node.getScale();
        node.setScale([currentScale[0] * scale, currentScale[1] * scale, currentScale[2] * scale]);
        
        // Fix winding order for the mirrored decal
        if (name === 'Belgesem_logo_decal_mirror') {
            const mesh = node.getMesh();
            if (mesh) {
                for (const prim of mesh.listPrimitives()) {
                    // Remove existing broken inward normals
                    prim.setAttribute('NORMAL', null);
                    
                    // Invert winding order
                    const indices = prim.getIndices();
                    if (indices) {
                        // clone array because getArray returns a reference to the typed array
                        const arr = indices.getArray().slice();
                        for(let i=0; i<arr.length; i+=3) {
                            let tmp = arr[i+1];
                            arr[i+1] = arr[i+2];
                            arr[i+2] = tmp;
                        }
                        indices.setArray(arr);
                    }
                }
            }
        }
        
        // Also remove normals from the main decal just to ensure they are regenerated perfectly
        if (name === 'Belgesem_logo_decal') {
            const mesh = node.getMesh();
            if (mesh) {
                for (const prim of mesh.listPrimitives()) {
                    prim.setAttribute('NORMAL', null);
                }
            }
        }
    }
    
    // Generate fresh outward-pointing normals for everything that needs it
    await doc.transform(normals());
    
    await io.write('assets/forklift.glb', doc);
    console.log('Fixed mirrored decal winding order and generated fresh normals.');
}
fixModel().catch(console.error);
