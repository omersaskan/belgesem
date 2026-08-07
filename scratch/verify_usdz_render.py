import bpy, os, math, mathutils

# Uretilen USDZ'yi geri yukleyip her decal'i KENDI dis normali yonunden,
# backface-culling acikken render eder (QuickLook/RealityKit benzetimi).
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.usd_import(filepath=os.path.abspath("assets/forklift.usdz"))

for m in bpy.data.materials:
    m.use_backface_culling = True

decals = [o for o in bpy.data.objects if o.type == 'MESH' and 'logo' in o.name.lower()]
print("USDZ icindeki decal sayisi:", len(decals), [d.name for d in decals])
if len(decals) != 2:
    raise SystemExit("USDZ'de iki decal bekleniyordu!")

sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = 900
sc.render.resolution_y = 600
sc.world = bpy.data.worlds.new("W")
sc.world.use_nodes = True
sc.world.node_tree.nodes["Background"].inputs[0].default_value = (0.12, 0.12, 0.14, 1)
sc.world.node_tree.nodes["Background"].inputs[1].default_value = 1.2

cam_data = bpy.data.cameras.new("C")
cam = bpy.data.objects.new("C", cam_data)
bpy.context.collection.objects.link(cam)
sc.camera = cam

ld = bpy.data.lights.new("S", 'SUN'); ld.energy = 4
lo = bpy.data.objects.new("S", ld)
bpy.context.collection.objects.link(lo)

for d in decals:
    mw = d.matrix_world
    nrm_mat = mw.to_3x3().inverted().transposed()
    n = mathutils.Vector((0, 0, 0))
    for p in d.data.polygons:
        n += (nrm_mat @ p.normal)
    n.normalize()
    ctr = mw @ (sum((v.co for v in d.data.vertices), mathutils.Vector()) / len(d.data.vertices))
    size = max((max((mw @ mathutils.Vector(c))[i] for c in d.bound_box)
                - min((mw @ mathutils.Vector(c))[i] for c in d.bound_box)) for i in range(3))
    cam.location = ctr + n * size * 2.2
    cam.rotation_euler = (ctr - cam.location).to_track_quat('-Z', 'Y').to_euler()
    lo.location = ctr + n * size * 4
    lo.rotation_euler = (ctr - lo.location).to_track_quat('-Z', 'Y').to_euler()
    out = os.path.abspath(f"scratch/usdz_cull_{d.name}.png")
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED {d.name} dis_normal={tuple(round(v,3) for v in n)} -> {out}")
print("VERIFY DONE")
