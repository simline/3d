let times			= 0
let windowLoad		= false

let echo			= {
	uuid			: null,

	uploadStatus	: (event='') => {
		if (!windowLoad) return

		fetch('action?data=' + [
			'time:'			+ Date.now(),
			'times:'		+ (++times),
			'uuid:'			+ (echo.uuid ?? ''),
			'standalone:'	+ !!window.navigator.standalone,
			'part:'			+ parts	.lastSel,
			'glb:'			+ glbs	.lastSel,
			'color:'		+ colors.lastSel,
			'focusMode:'	+ !!focusMode,
			'event:'		+ event,
			].join('|').replaceAll(' ', '.')
		).then(r=>{}).then(r=>{}).catch(e=>{console.log('fail upload'+e)})
	},

	init			: () => {
		windowLoad	= true
		
		fetch('https://api.ipify.org')
		.then(response => response.text())
		.then(data => echo.uuid = data)
		.catch(console.error)
		.finally(() => {
			fetch('action?info=' + [
				'time:'			+ Date.now(),
				'uuid:'			+ (echo.uuid ?? ''),
				'standalone:'	+ !!window.navigator.standalone,
				'userAgent:'	+ navigator.userAgent,
			].join('|').replaceAll(' ', '.'))
		})
	},
}
