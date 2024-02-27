let prd_platform_itx3720ml = {
	id		: 1,
	auther	: 1,
	cate	: 1,
	name	: "ITX主机 3.72L",
	tilt	: [0, 0, 0],
	size	: {d:94, w:201, h:197,  r:8},

	icons   : '//at.alicdn.com/t/c/font_4443301_og13972617i.js',
	info	: '3.72L 定制散热机箱，采用独立设计的贯通风道，使散热更流畅，体积骤减，噪音更小，性能释放更稳定。',

	prices	: [
		['≤ 5件', 		'9.5折'],
		['≤ 50件', 		'9.1折'],
		['≤ 200件', 	'8.8折'],
		['≤ 1000件', 	'8.3折'],
	],

	args	: [
		{k:"重量", v:'34567 克'},
		{k:"宽x深x高", v:'201 x 94 x 197毫米'},
		{k:"质保", v:'15日包退，3年保修'},
		{k:"主板", v:'微星 MPG B650I EDGE WiFi'},
		{k:"显卡", v:'Nvidia 4060Ti / 4070 Super'},
		{k:"供电", v:'400W，ICE320-C14 标准三孔插头'},
	],

	com		: [
		{	name	: "外壳",
			icon	: "r_rect",
			selGlb	: 0,
			selColor: 3,
			glb		: [{
				name	: "7075铝合金",
				color	: ["#FA6400", "#F7B500", "#BBBBBB", "#333647", "#121419"],
				builder	: (size) => {
					let IOarea			= BABYLON.MeshBuilder.CreateBox("",{width:20,	height:size.d-size.r*2, depth:size.h+20, }, scene)
					IOarea.position.x	= size.w/-2

					let shell			= buildShell(size.w, size.d, size.h,  size.r, 0, 1, [IOarea])
					shell.rotation.x	= Math.PI/2
					shell.rotation.y	= Math.PI


					let IOs				= BABYLON.MeshBuilder.CreateBox("",{width:1,	depth:size.h, height:size.d-size.r*2-.1}, scene)
					IOs.position.x		= size.w/-2 +1/2
					IOs.material		= Mdark
					IOs.parent			= shell

					return shell
				},
			}],
		},

		{	name	: "风道",
			icon	: "airflow",
			selGlb	: 0,
			selColor: 0,
			glb		: [{
				name	: "6061铝合金", 
				color	: ["#FA6400", "#F7B500", "#BBBBBB", "#333647", "#121419"],
				builder	: (size) => {
					let fins			= []
					let Fin				= BABYLON.MeshBuilder.CreateBox('', {width:1.4, height:size.d-6, depth:1})
					for (let x=7; x<size.w-5; x+=6) {
						let it			= Fin.clone()
						it.position		= new BABYLON.Vector3(x-size.w/2, 0, 0)
						fins.push(it)
					}

					let Cap			= buildShell(size.w-2*1-.1, size.d-2*1-.1, 1,    size.r-1, 0, 2,    [], fins)
					dispose(Fin)
					return Cap
				},
				repeat	: [
					{y:197/-2+1/2, rx:90},
					{y:197/ 2-1/2, rx:90},
				],
			}]
		},

		{	name	: "风扇",
			icon	: "c_fan",
			glb		: [
				{name:"9025 x2", src:"9025.glb", color:[], repeat:[
					{ x:0,			y:197/-2+25+1,	z:92/-2, rx:180, },
					{ x:201/-2+7,	y:197/-2+25+1,	z:92/-2, rx:180, },
				]},
			],
			color	: [],
		},

		{	name	: "主板",
			icon	: "itx",
			glb		: [{name:"华硕 B650m-AC", }],
		},

		{	name	: "显卡",
			icon	: "gpu",
			glb		: [
				{name:"公版 Nvidia 4060Ti",},
				{name:"公版 Nvidia 4070Super",},
			],
		},

		{	name	: "供电",
			icon	: "powerAC",
			glb		: [{name:"明纬 LOP-400", src:"LOF350-20Bxx.glb", repeat:[{x:201/-2+5, y:127/-2+20, z:76.2/-2, ry:90, rz:90,}]}],
		},
	],
}