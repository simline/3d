console.time('init baby')
let canvas			= document.getElementById("glb")
let engine			= new BABYLON.Engine(canvas, true)
let scene			= new BABYLON.Scene(engine);

let camera			= new BABYLON.ArcRotateCamera("camera", 
	// BABYLON.Tools.ToRadians(-90), BABYLON.Tools.ToRadians(90), 140*4.5, 
	BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(60), 140*4,
	new BABYLON.Vector3(0, 0, 0),
	scene
)
// scene.clearColor	= new BABYLON.Color3 ( .95, .95, .95)
scene.clearColor	= new BABYLON.Color4 (0,0,0,0)
// let axisViewer		= new BABYLON.AxesViewer(scene, 200, BABYLON.Axis.XYZW, null, null, null, 0.05)

// camera.radius	= Math.min(window.innerHeight, window.innerWidth) / 4.5 * (window.devicePixelRatio>1  ?window.devicePixelRatio/2  :1); // 根据需求进行调整
// camera.alpha	= BABYLON.Tools.ToRadians(window.innerHeight>window.innerWidth  ?90  :0)
let reloadEngine	= () => {
	engine.resize()
	var devicePixelRatio= window.devicePixelRatio || 1
	canvas.width		= devicePixelRatio * canvas.clientWidth
	canvas.height		= devicePixelRatio * canvas.clientHeight
}
reloadEngine()
camera.attachControl(canvas, true)

engine.runRenderLoop(()=> scene.render())
window.addEventListener("resize", reloadEngine)

new BABYLON.DirectionalLight("", new BABYLON.Vector3(-1, 0, 0), scene).intensity = .62
new BABYLON.DirectionalLight("", new BABYLON.Vector3( 1, 0, 0), scene).intensity = .62
new BABYLON.DirectionalLight("", new BABYLON.Vector3( 0,-1, 0), scene).intensity = .62
new BABYLON.DirectionalLight("", new BABYLON.Vector3( 0, 1, 0), scene).intensity = .62
new BABYLON.DirectionalLight("", new BABYLON.Vector3( 0, 0,-1), scene).intensity = .62
new BABYLON.DirectionalLight("", new BABYLON.Vector3( 0, 0, 1), scene).intensity = .62

// new BABYLON.DirectionalLight("", new BABYLON.Vector3(-1,-1, 0), scene).intensity = .4
// new BABYLON.DirectionalLight("", new BABYLON.Vector3( 1, 1, 0), scene).intensity = .4
// new BABYLON.DirectionalLight("", new BABYLON.Vector3( 0,-1,-1), scene).intensity = .4
// new BABYLON.DirectionalLight("", new BABYLON.Vector3( 0, 1, 1), scene).intensity = .4
// new BABYLON.DirectionalLight("", new BABYLON.Vector3(-1, 0,-1), scene).intensity = .4
// new BABYLON.DirectionalLight("", new BABYLON.Vector3( 1, 0, 1), scene).intensity = .4

var Mglass			= new BABYLON.StandardMaterial("", scene);
// 设置镜面反射颜色和强度
// Mglass.specularColor= new BABYLON.Color3(0.1, 0.1, 0.1);
// Mglass.specularPower= 64;
// 设置漫反射颜色和强度
Mglass.diffuseColor = new BABYLON.Color3(0, 0, 0);
Mglass.alpha		= 0.5; // 设置材质透明度
// Mglass.reflectivityColor = new BABYLON.Color3(1, 1, 1); // 将 reflectivityColor 设置为白色
// Mglass.reflectivityTexture = null; // 禁用镜面反射纹理
// Mglass.microSurface = 1; // 将 microSurface 设置为 1，使其完全光滑

// 禁用漫反射
// Mglass.albedoColor = new BABYLON.Color3(0, 0, 0); // 将 albedoColor 设置为黑色
// Mglass.directIntensity = 0; // 将 directIntensity 设置为 0，禁用直接光照
// Mglass.environmentIntensity = 1; // 将 environmentIntensity 设置为 1，使环境光照明显
// Mglass.maxSimultaneousLights = 16

var Mdark			= new BABYLON.StandardMaterial("", scene);
Mdark.diffuseColor	= BABYLON.Color3.Black(); // 设置漫反射颜色为纯黑色
Mdark.alpha			= .8
Mdark.maxSimultaneousLights = 16



function loopMesh(mesh, cb) {
	mesh?.getChildMeshes().map(m=>m).forEach((m, im) => {
		cb(m, im)
	})
	if (mesh?.material) cb(mesh)
}

function calculateRoundedRectPoints(cx, cy, width, height, radii) {
	let tl			= radii.tl || radii.r || 0
	let tr			= radii.tr || radii.r || 0
	let br			= radii.br || radii.r || 0
	let bl			= radii.bl || radii.r || 0

	let topLeft		= new BABYLON.Vector3( cx+width/2 - tl,	cy+height/2-tl,	0);
	let bottomLeft	= new BABYLON.Vector3( cx+width/2 - bl,	cy-height/2+bl,	0);
	let topRight	= new BABYLON.Vector3( cx-width/2 + tr,	cy+height/2-tr,	0);
	let bottomRight	= new BABYLON.Vector3( cx-width/2 + br,	cy-height/2+br, 0);

	let tlPoints	= calculateCornerPoints(topLeft, tl, 0, Math.PI/2);
	let trPoints	= calculateCornerPoints(topRight, tr, Math.PI/2, Math.PI);
	let brPoints	= calculateCornerPoints(bottomRight, br, Math.PI, Math.PI*3/2);
	let blPoints	= calculateCornerPoints(bottomLeft, bl, Math.PI * 3 / 2, Math.PI*2);

	return [ ...tlPoints, ...trPoints, ...brPoints, ...blPoints, tlPoints[0] ]
}

function calculateCornerPoints(center, radius, startAngle, endAngle) {
	let points		= [];
	let angleStep	= (endAngle - startAngle) / (12-1);
	for (let i=0; i<12; i++) {
		let angle	= startAngle + angleStep * i;
		let x		= center.x + radius * Math.cos(angle); 
		let y		= center.y + radius * Math.sin(angle);
		points.push(new BABYLON.Vector3(x, y, 0));
	}
	// console.log('calculateCornerPoints', center, radius, startAngle/Math.PI, endAngle/Math.PI, points);
	return points;
}

function load3D(path, pos) {
	let obj		= new BABYLON.Mesh('', scene)
	BABYLON.SceneLoader.ImportMesh("", "", path, scene, function (newMeshes) {
		for (let i = 0; i < newMeshes.length; i++) {
			if (!newMeshes[i]) return

			newMeshes[i].parent		= obj
		}
		if (pos) obj.position= pos
	})
	return obj
}

function CirleHoles(opt = {r:2, d:10, x:63/1, y:4, xo:.4, yo:.4, m:MamdRed}, size={w:1, h:1}) {
	let rHoles			= []

	let fill			= BABYLON.MeshBuilder.CreateBox("",{width:(opt.r+opt.xo)/2, height:opt.r+opt.yo, depth:opt.d}, scene)
	let shell			= BABYLON.MeshBuilder.CreateBox("",{width:(opt.r+opt.xo)  , height:opt.r+opt.yo, depth:opt.d}, scene)
	let hole			= BABYLON.MeshBuilder.CreateCylinder("",{height:opt.d, diameter:opt.r, tessellation:18}, scene)
		hole.rotation.x	= Math.PI/2
	let rHole			= BABYLON.CSG.FromMesh(shell).subtract(BABYLON.CSG.FromMesh(hole)).toMesh('', opt.m)

	let sizeW			= opt.x * (opt.r+opt.xo)
	let sizeH			= (opt.y*2-1) * opt.r + opt.y*opt.yo
	for (let x = 0; x < opt.x; x++) {
		for (let y = 0; y < opt.y; y++) {
			let rHole_		= rHole.clone()
			rHole_.position = new BABYLON.Vector3(sizeW/-2 + (x+.5)*(opt.xo+opt.r),				sizeH/-2 + (y*2+.5)*(opt.r) +(y*2+.5)*(opt.yo/2))
			rHoles.push(rHole_);
		}
	}

	let offsets			= [ (opt.xo+opt.r)/2,  opt.r,  0 ]
	for (let y = 0; y < opt.y-1; y++) {
		let offsetY		= sizeH/-2 + (y*2+1.5)*(opt.r) +(y*2+1.5)*(opt.yo/2)
		let fillL		= fill.clone()
		fillL.position	= new BABYLON.Vector3(sizeW/-2+(opt.r+opt.xo)/4,	offsetY)
		rHoles.push(fillL)

		let lastX		= (opt.x-1)*(opt.xo+opt.r)+offsets[0]
		let fillR		= fill.clone()
		fillR.position	= new BABYLON.Vector3(sizeW/ 2-(opt.r+opt.xo)/4,	offsetY)
		rHoles.push(fillR)

		for (let x = 0; x < opt.x-1; x++) {
			let rHole_		= rHole.clone()
			rHole_.position = new BABYLON.Vector3(sizeW/-2 + (x+1)*(opt.xo+opt.r),	offsetY)
			rHoles.push(rHole_)
		}
	}

	let allHoles		= BABYLON.Mesh.MergeMeshes(rHoles, true, true)
	;[fill, shell, hole, rHole, ...rHoles].forEach(it => it.dispose())
	return allHoles
}

function buildFins(w, h, d, x=0, y=0, z=0, thin=.1, gap=1.1) {
	let fins			= []
	let fin				= BABYLON.MeshBuilder.CreateBox('', {width:thin, height:h, depth:d})
	fin.material		= Mbronze
	for (let i=0; i<w; i+=(gap+thin)) {
		let fin_ = fin.clone()
		fins.push(fin_)
		fin_.position	= new BABYLON.Vector3(x+i, y+h/2, z+d/2)
	}
	fin.dispose()

	return BABYLON.Mesh.MergeMeshes(fins, true)
}

function buildRoundCube(w, h, d, r, depressDepth=0) {
	r					= (typeof r == 'number') ?{r} :r

	return BABYLON.MeshBuilder.ExtrudeShape('', {
		shape			: calculateRoundedRectPoints(0, 0, w, h, r), 
		path			: [
			new BABYLON.Vector3(0, 0,  d/2),
			new BABYLON.Vector3(0, 0, -d/2+depressDepth),
		],
		cap				: BABYLON.Mesh.CAP_ALL, 
		sideOrientation	: BABYLON.Mesh.DOUBLESIDE
	}, scene)
}

function buildShell(w, h, d,    r=6, depressDepth=27, wt=.2,    dels=[], adds=[]) {
	let ro				= typeof r == 'number'  ?{r}  :r
	let ri				= {}
	for (let k in ro) {ri[k] = Math.max(0, ro[k]-wt)}

	let o				= buildRoundCube(w,      h,      d, ro, depressDepth>=0 ?depressDepth :0)
	let i				= buildRoundCube(w-wt*2, h-wt*2, d+(depressDepth>=0?10:0), ri, depressDepth>=0 ? -20 : -depressDepth)
	let DelCSG			= BABYLON.CSG.FromMesh(i)
	dels.forEach(it=> DelCSG = DelCSG.union(BABYLON.CSG.FromMesh(it)))

	let shell			= BABYLON.CSG.FromMesh(o).subtract(DelCSG)
	if (adds != null  &&  adds.length) {
		let AddCSG		= BABYLON.CSG.FromMesh(adds[0])
		adds.forEach(it=> AddCSG = AddCSG.union(BABYLON.CSG.FromMesh(it)))
		shell			= shell.union(AddCSG)
	}
	shell				= shell.toMesh('')
	;[o, i, ...dels, ...adds].forEach(it=> it.dispose())

	return shell
}

function dispose() {
	let len = arguments.length;
	for (var i = 0; i < len; i++) {
		arguments[i].dispose();
		scene.removeMesh(arguments[i]);
	}
}





let USBA
{
	// let USBA_			= buildRoundCube(5, 12, 8, .8)
	let USBA_			= BABYLON.MeshBuilder.ExtrudeShape('', {
		shape			: calculateRoundedRectPoints(0, 0, 5, 12, {r:.8}), 
		path			: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 8)], 
		cap				: BABYLON.Mesh.CAP_ALL, 
		sideOrientation	: BABYLON.Mesh.DOUBLESIDE,
	}, scene)
	let USBApins		= BABYLON.MeshBuilder.CreateBox('', {width:1.8, height:10.8, depth:8}, scene)
	USBApins.position.x	= 1.1
	USBA				= BABYLON.CSG.FromMesh(USBA_).subtract(BABYLON.CSG.FromMesh(USBApins)).toMesh('')
	USBA_.dispose()
	USBApins.dispose()
}

let USBC
{
	let USBC_			= BABYLON.MeshBuilder.ExtrudeShape('', {
		shape			: calculateRoundedRectPoints(0, 0, 2.4, 8.2, {tl:1.2, tr:1.2, bl:1.2, br:1.2}), 
		path			: [new BABYLON.Vector3(0, 0, 8), new BABYLON.Vector3(0, 0, 1), new BABYLON.Vector3(0, 0, 0)], 
		cap				: BABYLON.Mesh.CAP_ALL, 
		sideOrientation	: BABYLON.Mesh.DOUBLESIDE,
	}, scene)
	let USBCpins		= BABYLON.MeshBuilder.CreateBox('', {width:.4, height:6.2, depth:12}, scene)
	USBC				= BABYLON.CSG.FromMesh(USBC_).subtract(BABYLON.CSG.FromMesh(USBCpins)).toMesh('')
	USBC_.dispose()
	USBCpins.dispose()
}

let HDMI
{
	let HDMI_			= BABYLON.MeshBuilder.ExtrudeShape('', {
	shape			: [
		new BABYLON.Vector3(-14/2,   4.5/2, 0),
		new BABYLON.Vector3( 14/2,   4.5/2, 0),
		new BABYLON.Vector3( 14/2,     -.5, 0),
		new BABYLON.Vector3( 14/2-2,-4.5/2, 0),
		new BABYLON.Vector3(-14/2+2,-4.5/2, 0),
		new BABYLON.Vector3(-14/2,     -.5, 0),
		new BABYLON.Vector3(-14/2,   4.5/2, 0),
	],
	path			: [new BABYLON.Vector3(0, 0, 12), new BABYLON.Vector3(0, 0, -2)], 
	cap				: BABYLON.Mesh.CAP_ALL, 
	sideOrientation	: BABYLON.Mesh.DOUBLESIDE,
	}, scene)
	HDMI_.flipFaces(false);
	let HDMIpins		= BABYLON.MeshBuilder.CreateBox		("",{width:10, height:.5, depth:8}, scene)
	HDMI				= BABYLON.CSG.FromMesh(HDMI_).subtract(
	BABYLON.CSG.FromMesh(HDMIpins)
	).toMesh('')
	HDMI_.dispose()
	HDMIpins.dispose()
}

let DP
{
	let DP_		= BABYLON.MeshBuilder.ExtrudeShape('', {
		shape			: [
			new BABYLON.Vector3(-16/2,   4.5/2, 0),
			new BABYLON.Vector3( 16/2-2, 4.5/2, 0),
			new BABYLON.Vector3( 16/2,      .5, 0),
			new BABYLON.Vector3( 16/2,  -4.5/2, 0),
			new BABYLON.Vector3(-16/2,  -4.5/2, 0),
			new BABYLON.Vector3(-16/2,   4.5/2, 0),
		],
		path			: [new BABYLON.Vector3(0, 0, 10), new BABYLON.Vector3(0, 0, 0)], 
		cap				: BABYLON.Mesh.CAP_ALL, 
		sideOrientation	: BABYLON.Mesh.DOUBLESIDE,
	}, scene)
	DP_.flipFaces(false)

	let DPpins		= BABYLON.MeshBuilder.CreateBox		("",{width:12, height:.5, depth:8}, scene)
	let DPpin2		= BABYLON.MeshBuilder.CreateBox		("",{width:.5, height:1.5, depth:8}, scene); DPpin2.position = new BABYLON.Vector3(12/ 2, .5)
	let DPpin1		= BABYLON.MeshBuilder.CreateBox		("",{width:.5, height:1.5, depth:8}, scene); DPpin1.position = new BABYLON.Vector3(12/-2, .5)
	DP				= BABYLON.CSG.FromMesh(DP_).subtract(
		BABYLON.CSG.FromMesh(DPpins)
		.union(BABYLON.CSG.FromMesh(DPpin1))
		.union(BABYLON.CSG.FromMesh(DPpin2))
	).toMesh('')
	DP_.dispose()
	DPpins.dispose()
	DPpin1.dispose()
	DPpin2.dispose()
	DP.position.y	= -7
}

let m2_2230				= BABYLON.MeshBuilder.CreateBox		("",{width: 30, height: 1.8, depth:  22}, scene)
let ScrewHole2			= BABYLON.MeshBuilder.CreateCylinder("",{height:5, diameter:3, tessellation:36}, scene);  
// m2_2230.position		= new BABYLON.Vector3(PCSize.w/2-134 -30/2, -PCSize.h/2 + 1.5 + 1.8/2, -PCSize.d/2 +93.5+ 22/2);
// ScrewHole2.position		= new BABYLON.Vector3(PCSize.w/2-134 -30,	-PCSize.h/2 + 1.5 + 1.8/2, -PCSize.d/2 +93.5+ 22/2);
ScrewHole2.position		= new BABYLON.Vector3(30/2,	1.8/2, 0)
let wifi				= BABYLON.CSG.FromMesh(m2_2230).subtract(BABYLON.CSG.FromMesh(ScrewHole2)).toMesh("");
m2_2230		.dispose(); scene.removeMesh(m2_2230)
ScrewHole2	.dispose(); scene.removeMesh(ScrewHole2)
// wifi.parent				= miniPC

// global dispose
dispose(wifi, HDMI, DP, USBA, USBC)
console.timeEnd('init baby')