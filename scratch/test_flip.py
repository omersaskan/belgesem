import bpy, bmesh, os, sys, math, mathutils

argv = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
FLIP = (len(argv) > 0 and argv[0] == "flip")
TAG = "flip" if FLIP else "noflip"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=os.path.abspath("scratch/forklift_temp.glb"))

# decal objesi
decal = next(o for o in bpy.data.objects if o.type=='MESH' and 'logo' in o.name.lower())

if FLIP:
    me = decal.data
    bm = bmesh.new(); bm.from_mesh(me)
    for f in bm.faces: f.normal_flip()
    bm.to_mesh(me); bm.free(); me.update()
    print("DECAL YUZLERI CEVRILDI")

# tum materyallerde backface culling AC (QuickLook benzeri); ozellikle decal
for m in bpy.data.materials:
    m.use_backface_culling = True

# decal dunya merkezi
mw = decal.matrix_world
corners = [mw @ mathutils.Vector(c) for c in decal.bound_box]
ctr = sum(corners, mathutils.Vector())/8
size = max((max(c[i] for c in corners)-min(c[i] for c in corners)) for i in range(3))

# Kamera: +X tarafindan, -X'e bakacak
cam_data = bpy.data.cameras.new("Cam"); cam = bpy.data.objects.new("Cam", cam_data)
bpy.context.collection.objects.link(cam)
cam.location = ctr + mathutils.Vector((size*3.0, 0, 0))
# -X'e bak: kamera +X'te, hedef ctr
d = (ctr - cam.location).normalized()
cam.rotation_euler = d.to_track_quat('-Z','Y').to_euler()
cam_data.lens = 50
bpy.context.scene.camera = cam

# isik
light_data = bpy.data.lights.new("Sun", 'SUN'); light_data.energy=5
light = bpy.data.objects.new("Sun", light_data); bpy.context.collection.objects.link(light)
light.location = ctr + mathutils.Vector((size*3,0,size))
light.rotation_euler = (math.radians(45),0,math.radians(90))

sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = 700; sc.render.resolution_y = 460
sc.render.film_transparent = False
try: sc.world = bpy.data.worlds.new("W"); sc.world.use_nodes=True; sc.world.node_tree.nodes["Background"].inputs[0].default_value=(0.1,0.1,0.12,1)
except Exception as e: print("world:", e)
sc.render.filepath = os.path.abspath(f"scratch/render_{TAG}.png")
bpy.ops.render.render(write_still=True)
print("RENDER:", sc.render.filepath)
