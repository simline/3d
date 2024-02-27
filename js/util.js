const parser	= new DOMParser()

let Util		= {

	isMobile	: window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|MQQBrowser|wOSBrowser|BrowserNG)/i),

	loadScript			: (url, id, cb) => {
		console.debug('loadScript', url, !!cb)
		var script		= document.createElement('script')
		script.id		= id
		// script.src		= `${url}?t=${Date.now()}`
		script.src		= url
		script.onload	= cb
		document.body.appendChild(script)
	},

	loadComponent		: (urls) => {
		if (! urls.length) return
		const url			= urls.shift()
		console.debug('loadComponent', Date.now(), url)
		document.body.appendChild(document.createComment(url))

		fetch(`/com/${url}.html?t=${Date.now()}`)
		.then(rsp => rsp.text())
		.then(html => {
			const doc		= parser.parseFromString(html, 'text/html');

			doc.querySelectorAll('style').forEach(style => {
				document.body.appendChild(style.cloneNode(true));
			})

			document.body.appendChild(doc.querySelector('bi'))

			let scripts		= Array.from(doc.querySelectorAll('script'))
			Util.handleScript(scripts)

			Util.loadComponent(urls)
		})
	},

	handleScript		: (scripts) => {
		if (! scripts.length) return
		const script		= scripts.shift()

		if (script.hasAttribute('src')) {
			const newScript = document.createElement('script')
			newScript.src	= script.src

			newScript.addEventListener('load', () => {
				console.log(`External script loaded: ${script.src}`)
				Util.handleScript(scripts)
			})
			document.body.appendChild(newScript)

		} else {
			const newScript			= document.createElement('script')
			newScript.textContent	= script.textContent
			newScript.type			= script.type
			document.body.appendChild(newScript)
			Util.handleScript(scripts)
		}
	},

	// https://www.zhangxinxu.com/study/201904/scroll-snap-end-event-detect-demo.php
	ViewPager(elPath, orientation=0, cb, defTab=1) {
		cb && cb(defTab, defTab)

		const offset		= orientation===0  ?'left'  :'top'
		const rootEl		= document.querySelector(elPath)
		let ScrollDetecter	= null
		let oldIdx			= 0
		// 滚动事件开始
		rootEl.addEventListener('scroll', () => {
			clearTimeout(ScrollDetecter)

			ScrollDetecter = setTimeout(() => {
				// 100毫秒内滚动事件没触发，认为停止滚动了，对列表元素进行位置检测
				[].slice.call(rootEl.children).forEach((itemEl, newIdx) => {
					if (Math.abs(itemEl.getBoundingClientRect()[offset] - rootEl.getBoundingClientRect()[offset]) > 10)
						return
					// console.log('滚动结束，当前显示的是第'+ (index + 1) +'个元素')
					oldIdx!=newIdx && cb && cb(oldIdx, newIdx)
					oldIdx	= newIdx
				})
			}, 1000/30)
		})
	}
}



class DomGroup {
	el					= null
	lastSel				= 0
	items				= []

	constructor(domPath, itemRender, cb) {
		this.itemRender	= itemRender
		this.cb			= cb
		this.el			= document.querySelector(domPath)
		this.el.addEventListener('click', ev => {
			let itemEl	= ev.composedPath().find(el => el.parentNode == this.el)
			if (!itemEl) return
			let idx		= itemEl.dataset.i
			this.switch(idx)
		})
	}

	render(items, selectedIndex) {
		this.items		= items
		this.el.innerHTML= items  ?items.map((it, i)=> this.itemRender(it, i)).join('\n')  :''
		this.switch(selectedIndex || 0)
		return this
	}

	switch(idx) {
		this.el.children[this.lastSel]?.classList.remove('sel')
		this.el.children[idx]?.classList.add('sel')
		this.lastSel	= idx
		this.cb && this.cb(this.items, idx)
	}
}
