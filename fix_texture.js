const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');
const sharp = require('sharp');

async function fixTexture() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    // 1. Fix NPOT Textures
    const isPOT = (x) => (x & (x - 1)) === 0;
    const nextPOT = (x) => Math.pow(2, Math.round(Math.log2(x)));

    for (const texture of doc.getRoot().listTextures()) {
        const image = texture.getImage();
        if (!image) continue;
        
        try {
            const metadata = await sharp(image).metadata();
            if (!isPOT(metadata.width) || !isPOT(metadata.height)) {
                console.log(`Resizing NPOT texture: ${metadata.width}x${metadata.height}`);
                const newWidth = nextPOT(metadata.width);
                const newHeight = nextPOT(metadata.height);
                
                const newImage = await sharp(image)
                    .resize(newWidth, newHeight, { fit: 'fill' })
                    .png()
                    .toBuffer();
                    
                texture.setImage(newImage);
                texture.setMimeType('image/png');
                console.log(`Resized to POT: ${newWidth}x${newHeight}`);
            }
        } catch(e) {
            console.log("Error processing texture, skipping...", e);
        }
    }
    
    // 3. Revert logo to BLEND in case MASK hid it due to soft alpha
    for (const material of doc.getRoot().listMaterials()) {
        if (material.getName().includes('logo')) {
            material.setAlphaMode('BLEND');
            // Ensure doubleSided is false to prevent self z-fighting
            material.setDoubleSided(false);
        }
    }
    
    await io.write('assets/forklift.glb', doc);
    console.log('Fixed NPOT textures and alpha mode in assets/forklift.glb');
}

fixTexture().catch(console.error);
