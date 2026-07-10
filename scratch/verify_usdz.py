import bpy, os

USDZ = os.path.abspath("assets/forklift.usdz")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.usd_import(filepath=USDZ)

print("=== MESH SAYISI ===", len([o for o in bpy.data.objects if o.type=='MESH']))

# Decal mesh
decal = [o for o in bpy.data.objects if o.type=='MESH' and ('logo' in o.name.lower() or 'decal' in o.name.lower())]
for o in decal:
    print("DECAL OBJ:", o.name, "dims:", tuple(round(d,4) for d in o.dimensions),
          "mats:", [m.material.name if m.material else None for m in o.material_slots])

# Logo materyalinin node yapisi (opacity / alpha)
for m in bpy.data.materials:
    if 'logo' in m.name.lower() or 'decal' in m.name.lower():
        print("=== MAT:", m.name, "===")
        if m.use_nodes:
            for n in m.node_tree.nodes:
                print("  node:", n.type, n.name)
                if n.type == 'BSDF_PRINCIPLED':
                    al = n.inputs.get('Alpha')
                    print("    Alpha input linked:", bool(al.links) if al else 'n/a',
                          "val:", round(al.default_value,3) if al and not al.links else '-')
                if n.type == 'TEX_IMAGE' and n.image:
                    print("    image:", n.image.name, "has_alpha:", n.image.alpha_mode)
