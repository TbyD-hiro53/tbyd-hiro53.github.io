import os
import bpy
from pathlib import Path
D=Path(os.environ.get('EO_DETAIL_DIR','/tmp/earth-v8'));D.mkdir(parents=True,exist_ok=True);bpy.ops.wm.open_mainfile(filepath=os.environ.get('EO_FOREST_SOURCE','/tmp/earth-v6/earth-forest-v6-hero-packed.blend'));s=bpy.context.scene;s.cycles.samples=4;s.cycles.adaptive_min_samples=4;s.cycles.use_denoising=False;s.view_layers[0].cycles.denoising_store_passes=True;s.render.threads_mode='FIXED';s.render.threads=1;s.use_nodes=True;tree=s.node_tree;tree.nodes.clear();rl=tree.nodes.new('CompositorNodeRLayers');comp=tree.nodes.new('CompositorNodeComposite');tree.links.new(rl.outputs['Image'],comp.inputs[0]);f=tree.nodes.new('CompositorNodeOutputFile');f.base_path=str(D);f.format.file_format='OPEN_EXR';f.format.color_depth='32';f.file_slots.clear()
for label,name in [('Denoising Normal','forest-normal-'),('Denoising Albedo','forest-albedo-')]:
 slot=f.file_slots.new(label);f.file_slots[-1].path=name;tree.links.new(rl.outputs[label],f.inputs[label])
s.render.filepath=str(D/'forest-guides.png');bpy.ops.render.render(write_still=True)
