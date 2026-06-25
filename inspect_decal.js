const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');

async function inspectModel() {
    const io = new NodeIO();
    const doc = await io.read('assets/forklift.glb');
    
    console.log("=== NODES ===");
    doc.getRoot().listNodes().forEach((node, i) => {
        const mesh = node.getMesh();
        if (mesh) {
            console.log(`Node ${i} (${node.getName()}) -> Mesh ${mesh.getName()}`);
            const translation = node.getTranslation();
            console.log(`  Translation: ${translation}`);
        }
    });
    
    console.log("\n=== MATERIALS ===");
    doc.getRoot().listMaterials().forEach((mat, i) => {
        console.log(`Material ${i} (${mat.getName()}): alphaMode=${mat.getAlphaMode()}, doubleSided=${mat.getDoubleSided()}`);
    });
    
    console.log("\n=== TEXTURES ===");
    let tIdx = 0;
    for (const tex of doc.getRoot().listTextures()) {
        const img = tex.getImage();
        if (img) {
            if (!fs.existsSync('scratch')) fs.mkdirSync('scratch');
            fs.writeFileSync(`scratch/tex_${tIdx}.png`, img);
            console.log(`Saved texture ${tIdx} to scratch/tex_${tIdx}.png`);
        }
        tIdx++;
    }
}

inspectModel().catch(console.error);
