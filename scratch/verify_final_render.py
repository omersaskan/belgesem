import bpy, os, math, mathutils
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.usd_import(filepath=os.path.abspath("assets/forklift.usdz"))

decal = next(o for o in bpy.data.objects if o.type=='MESH' and 'logo' in o.name.lower())
for m in bpy.data.materials:
    m.use_backface_culling = True  # QuickLook benzeri

mw = decal.matrix_world
corners = [mw @ mathutils.Vector(c) for c in decal.bound_box]
ctr = sum(corners, mathutils.Vector())/8
size = max((max(c[i] for c in corners)-min(c[i] for c in corners)) for i in range(3))

# USDZ Y-up: decal disa bakan yon? GLB +X idi, Y-up donusumunde de +X kalir.
cam_data = bpy.data.cameras.new("C"); cam = bpy.data.objects.new("C", cam_data)
bpy.context.collection.objects.link(cam)
cam.location = ctr + mathutils.Vector((size*3.0, 0, 0))
cam.rotation_euler = (ctr-cam.location).normalized().to_track_quat('-Z','Y').to_euler()
bpy.context.scene.camera = cam

ld = bpy.data.lights.new("S",'SUN'); ld.energy=5
lo = bpy.data.objects.new("S",ld); bpy.context.collection.objects.link(lo)
lo.location = ctr + mathutils.Vector((size*3,0,size)); lo.rotation_euler=(math.radians(45),0,math.radians(90))

sc=bpy.context.scene
sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=700; sc.render.resolution_y=460
sc.world = bpy.data.worlds.new("W"); sc.world.use_nodes=True
sc.world.node_tree.nodes["Background"].inputs[0].default_value=(0.1,0.1,0.12,1)
sc.render.filepath=os.path.abspath("scratch/render_final.png")
bpy.ops.render.render(write_still=True)
print("RENDER_FINAL OK")
