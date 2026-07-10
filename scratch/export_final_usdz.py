import bpy, bmesh, os

OUT = os.path.abspath("assets/forklift.usdz")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=os.path.abspath("scratch/forklift_temp.glb"))

# decal yuzlerini disari cevir (+X) -> QuickLook backface-cull icin
decal = next(o for o in bpy.data.objects if o.type=='MESH' and 'logo' in o.name.lower())
me = decal.data
bm = bmesh.new(); bm.from_mesh(me)
for f in bm.faces: f.normal_flip()
bm.to_mesh(me); bm.free(); me.update()
print("DECAL YUZLERI CEVRILDI")

# logo materyali: tam opak, double-sided kapali (tek yon, disari)
for m in bpy.data.materials:
    if 'logo' in m.name.lower():
        m.blend_method = 'OPAQUE'
        m.use_backface_culling = True
        # Principled Alpha = 1.0, baglanti yoksa zaten opak (OPAQUE GLB'den geldi)
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type=='BSDF_PRINCIPLED':
                    al = n.inputs.get('Alpha')
                    if al:
                        for l in list(al.links): m.node_tree.links.remove(l)
                        al.default_value = 1.0
        print("logo mat opak/tek-yon:", m.name)

bpy.ops.wm.usd_export(
    filepath=OUT,
    export_textures_mode='NEW',
    generate_preview_surface=True,
    export_materials=True,
    export_normals=True,
    export_uvmaps=True,
    selected_objects_only=False,
    use_instancing=False,
    overwrite_textures=True,
    convert_scene_units='METERS',
    meters_per_unit=1.0,
    convert_orientation=True,
    export_global_up_selection='Y',
    export_global_forward_selection='NEGATIVE_Z',
)
print("DONE USDZ:", OUT, "exists:", os.path.exists(OUT), "size:", os.path.getsize(OUT) if os.path.exists(OUT) else 0)
