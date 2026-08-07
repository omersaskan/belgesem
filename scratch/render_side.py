import bpy, sys, os, mathutils

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
GLB = os.path.abspath(argv[0]) if argv else os.path.abspath("assets/forklift.glb")
OUT = os.path.abspath(argv[1]) if len(argv) > 1 else os.path.abspath("scratch/side_px.png")
SIDE = argv[2] if len(argv) > 2 else "+X"   # +X, -X
HIDE_DECAL = len(argv) > 3 and argv[3] == "hide-decal"
BACKFACE_CULL = len(argv) > 3 and argv[3] == "cull"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)

if HIDE_DECAL:
    for o in list(bpy.data.objects):
        if o.type == 'MESH' and 'logo' in o.name.lower():
            bpy.data.objects.remove(o, do_unlink=True)
            print("DECAL HIDDEN")

if BACKFACE_CULL:
    for m in bpy.data.materials:
        m.use_backface_culling = True     # QuickLook/RealityKit benzeri
    print("BACKFACE CULLING ON")

# sahne bbox
mn = mathutils.Vector((1e9, 1e9, 1e9))
mx = mathutils.Vector((-1e9, -1e9, -1e9))
for o in bpy.data.objects:
    if o.type != 'MESH':
        continue
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
ctr = (mn + mx) / 2
size = mx - mn
print("BBOX", mn[:], mx[:], "center", ctr[:], "size", size[:])

cam_data = bpy.data.cameras.new("cam")
cam_data.type = 'ORTHO'
cam_data.ortho_scale = max(size.y, size.z) * 1.1
cam = bpy.data.objects.new("cam", cam_data)
bpy.context.scene.collection.objects.link(cam)
d = 1.0
if SIDE == "+X":
    cam.location = (ctr.x + d, ctr.y, ctr.z)
    cam.rotation_euler = (1.5707963, 0, 1.5707963)
else:
    cam.location = (ctr.x - d, ctr.y, ctr.z)
    cam.rotation_euler = (1.5707963, 0, -1.5707963)
bpy.context.scene.camera = cam

# isik
for name, loc, energy in [("k", (2, -2, 2), 400), ("f", (-2, -2, 1), 200), ("b", (0, 2, 2), 200)]:
    ld = bpy.data.lights.new(name, 'AREA'); ld.energy = energy; ld.size = 3
    lo = bpy.data.objects.new(name, ld); lo.location = (ctr.x + loc[0], ctr.y + loc[1], ctr.z + loc[2])
    lo.rotation_euler = (0.6, 0, 0.8)
    bpy.context.scene.collection.objects.link(lo)
w = bpy.data.worlds.new("w"); w.use_nodes = True
w.node_tree.nodes["Background"].inputs[1].default_value = 1.5
bpy.context.scene.world = w

sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = 1600
sc.render.resolution_y = 1000
sc.render.film_transparent = False
sc.render.image_settings.file_format = 'PNG'
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT, os.path.exists(OUT))
