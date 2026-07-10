import bpy
import os
import sys

GLB = os.path.abspath("assets/forklift.glb")
OUT = os.path.abspath("assets/forklift.usdz")

# Temiz sahne
bpy.ops.wm.read_factory_settings(use_empty=True)

# GLB import
bpy.ops.import_scene.gltf(filepath=GLB)

print("=== IMPORTED OBJECTS ===")
for o in bpy.data.objects:
    if o.type == 'MESH':
        print("OBJ:", o.name, "| world dims:", tuple(round(d, 3) for d in o.dimensions))

# Decal materyalini bul ve alpha-clip ayarla (Quick Look icin opacityThreshold)
print("=== MATERIALS ===")
for m in bpy.data.materials:
    bm = getattr(m, 'blend_method', None)
    print("MAT:", m.name, "| blend:", bm)
    if 'logo' in m.name.lower() or 'decal' in m.name.lower():
        # alpha clip garanti
        try:
            m.blend_method = 'CLIP'
            m.alpha_threshold = 0.5
        except Exception as e:
            print("  (blend ayarlanamadi:", e, ")")
        m.use_backface_culling = False

# Sahne genel boyut bilgisi
import mathutils
mins = mathutils.Vector((1e9, 1e9, 1e9))
maxs = mathutils.Vector((-1e9, -1e9, -1e9))
for o in bpy.data.objects:
    if o.type == 'MESH':
        for corner in o.bound_box:
            wc = o.matrix_world @ mathutils.Vector(corner)
            for i in range(3):
                mins[i] = min(mins[i], wc[i])
                maxs[i] = max(maxs[i], wc[i])
print("=== WORLD BBOX ===")
print("min:", tuple(round(v, 3) for v in mins))
print("max:", tuple(round(v, 3) for v in maxs))
print("size:", tuple(round(maxs[i] - mins[i], 3) for i in range(3)))

# USDZ export
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

print("=== DONE ===")
print("USDZ:", OUT, "exists:", os.path.exists(OUT), "size:", os.path.getsize(OUT) if os.path.exists(OUT) else 0)
