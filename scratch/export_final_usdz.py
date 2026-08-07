import bpy, bmesh, os, mathutils

OUT = os.path.abspath("assets/forklift.usdz")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=os.path.abspath("scratch/forklift_temp.glb"))

# Her decal'in yuzleri DISARI baksin (QuickLook/RealityKit backface-cull yapar).
# GLB'de zaten disari bakiyorsa dokunma; bakmiyorsa cevir.
decals = [o for o in bpy.data.objects if o.type == 'MESH' and 'logo' in o.name.lower()]
if not decals:
    raise SystemExit("decal bulunamadi")
for decal in decals:
    me = decal.data
    mw = decal.matrix_world
    nrm_mat = mw.to_3x3().inverted().transposed()
    ctr_x = sum((mw @ v.co).x for v in me.vertices) / len(me.vertices)
    side = 1.0 if ctr_x >= 0 else -1.0
    avg = sum(((nrm_mat @ p.normal).x for p in me.polygons), 0.0) / len(me.polygons)
    print(f"{decal.name}: taraf={'+X' if side > 0 else '-X'} ort_normal_x={avg:.3f}")
    if avg * side < 0:
        bm = bmesh.new(); bm.from_mesh(me)
        for f in bm.faces:
            f.normal_flip()
        bm.to_mesh(me); bm.free(); me.update()
        print(f"  -> yuzler cevrildi (ice bakiyordu)")
    else:
        print(f"  -> zaten disari bakiyor")

# logo materyali: tam opak, tek yon (disari)
for m in bpy.data.materials:
    if 'logo' in m.name.lower():
        m.blend_method = 'OPAQUE'
        m.use_backface_culling = True
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type == 'BSDF_PRINCIPLED':
                    al = n.inputs.get('Alpha')
                    if al:
                        for l in list(al.links):
                            m.node_tree.links.remove(l)
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
