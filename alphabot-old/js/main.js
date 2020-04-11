window.addEventListener('load', function(evt) {

	const FPS = 25;
	const DOM = {
		infoContainer: ".info-container",
		infoCollapsed: ".info-collapsed",
		abcContainer: ".abc-container",
		abcTextInput: ".abc-text_input",
		abcLetterTemplate: ".abc-templates .abc-letter",
	}

	for (const keyName in DOM) {
		const selector = DOM[keyName];
		DOM[keyName] = document.querySelector(selector);
	}

	const UTILS = {

		isMobile: function() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
		},

		loadImage: function(path) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = resolve.bind(this, img);
				img.onerror = reject.bind(this, img);
				img.src = path;
			});
		},

		delay: function(millis = 0) {
			return new Promise(resolve => {
				setTimeout(resolve, millis);
			});
		},

		hasParentWithSelector(elem, selector) {
			let parent = undefined;

			while (elem) {
				if (elem.matches(selector)) {
					parent = elem;
					break;
				}

				elem = elem.parentElement;
			}

			return parent;

		},

		findByValue(list, key, value) {

			let result = undefined;

			for (let elem of list) {
				if (elem[key] === value) {
					result = elem;
					break;
				}
			}

			return result;
		},

		isInViewport: function(elem) {
			let bounding = elem.getBoundingClientRect();
			return (bounding.bottom >= 0 && bounding.top <= (window.innerHeight));
		},

		map: function(num, start1, stop1, start2, stop2) {
			return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
		}
	}

	const CHARS = {
		'A': {
			F: 'A.png',
			L: [22, 50],
			C: 15,
			R: 9,
			N: 124
		},
		'B': {
			F: 'B.png',
			L: [46, 86],
			C: 15,
			R: 13,
			N: 192
		},
		'C': {
			F: 'C.png',
			L: [26, 60],
			C: 15,
			R: 9,
			N: 134
		},
		'D': {
			F: 'D.png',
			L: [25, 55],
			C: 15,
			R: 14,
			N: 204
		},
		'E': {
			F: 'E.png',
			L: [41, 125],
			C: 15,
			R: 16,
			N: 234
		},
		'F': {
			F: 'F.png',
			L: [29, 57],
			C: 15,
			R: 10,
			N: 146
		},
		'G': {
			F: 'G.png',
			L: [36, 68],
			C: 15,
			R: 20,
			N: 297
		},
		'H': {
			F: 'H.png',
			L: [49, 102],
			C: 15,
			R: 13,
			N: 191
		},
		'I': {
			F: 'I.png',
			L: [76, 112],
			C: 15,
			R: 18,
			N: 260
		},
		'J': {
			F: 'J.png',
			L: [30, 58],
			C: 15,
			R: 13,
			N: 195
		},
		'K': {
			F: 'K.png',
			L: [54, 84],
			C: 15,
			R: 13,
			N: 184
		},
		'L': {
			F: 'L.png',
			L: [33, 70],
			C: 15,
			R: 24,
			N: 352
		},
		'M': {
			F: 'M.png',
			L: [37, 77],
			C: 15,
			R: 19,
			N: 273
		},
		'N': {
			F: 'N.png',
			L: [48, 126],
			C: 15,
			R: 18,
			N: 257
		},
		'O': {
			F: 'O.png',
			L: [30, 70],
			C: 15,
			R: 10,
			N: 140
		},
		'P': {
			F: 'P.png',
			L: [36, 67],
			C: 15,
			R: 10,
			N: 149
		},
		'Q': {
			F: 'Q.png',
			L: [43, 49],
			C: 15,
			R: 11,
			N: 159
		},
		'R': {
			F: 'R.png',
			L: [26, 56],
			C: 15,
			R: 11,
			N: 156
		},
		'S': {
			F: 'S.png',
			L: [41, 81],
			C: 15,
			R: 16,
			N: 236
		},
		'T': {
			F: 'T.png',
			L: [27, 56],
			C: 15,
			R: 9,
			N: 131
		},
		'U': {
			F: 'U.png',
			L: [77, 117],
			C: 15,
			R: 17,
			N: 251
		},
		'V': {
			F: 'V.png',
			L: [53, 83],
			C: 15,
			R: 16,
			N: 238
		},
		'W': {
			F: 'W.png',
			L: [30, 57],
			C: 15,
			R: 9,
			N: 129
		},
		'X': {
			F: 'X.png',
			L: [27, 55],
			C: 15,
			R: 12,
			N: 168
		},
		'Y': {
			F: 'Y.png',
			L: [20, 48],
			C: 15,
			R: 13,
			N: 191
		},
		'Z': {
			F: 'Z.png',
			L: [38, 68],
			C: 15,
			R: 13,
			N: 183
		},
	}

	const HEADER = {
		container: DOM.infoContainer,
		collapsed: DOM.infoCollapsed,

		init() {
			this.collapsed.classList.remove('transparent');
		},

		update() {

			let height = this.collapsed.parentElement.scrollTop;
			let maxHeight = this.container.offsetHeight;
			let amt = height / maxHeight;

			this.container.style.opacity = UTILS.map(amt, 0, 0.5, 1, 0);
		}

	}

	const VIZ = {

		container: DOM.abcContainer,
		width: 0,
		height: 0,
		nColumns: 6,

		init() {
			this.setColumns();
			this.container.classList.remove('hidden');
			let cursorNode = this.addSpace('', 0);
			this.setCursor(0);
			this.container.scrollIntoView();
			this.getDims();
		},

		focus() {
			this.container.classList.remove('blurred');
		},

		blur() {
			this.container.classList.add('blurred');
		},

		click(evt) {

			let elem = UTILS.hasParentWithSelector(evt.target, '.abc-container .abc-letter');

			if (!elem)
				return;

			let node = UTILS.findByValue(TXT.area, 'elem', elem);

			if (!node)
				return;

			node.clicked = true;
		},

		animateNode(node) {

			let now = performance.now();
			let elapsed = now - node.time;

			node.visible = UTILS.isInViewport(node.elem);

			if (!node.visible) {
				return;
			}

			if (elapsed > node.delay) {
				this.updateNode(node);
				this.updateState(node);
				node.time = now - (elapsed % node.delay);
			}

		},

		updateState(node) {
			this[`state_${node.state}`](node);
		},

		state_start(node) {
			node.iFrame++;

			if (node.iFrame >= node.loopStart)
				node.state = 'loop';
		},

		state_loop(node) {
			node.iFrame++;

			if (node.iFrame > node.loopEnd) {
				if (node.clicked) {
					node.state = 'end';
					node.clicked = false;
				} else {
					node.iFrame = node.loopStart;
				}
			}
		},

		state_end(node) {
			node.iFrame++;

			if (node.iFrame >= node.nFrames) {
				node.iFrame = node.nFrames;
				if (node.clicked) {
					node.iFrame = 0;
					node.state = 'start';
					node.clicked = false;
				}
			}
		},

		getDims() {
			const node = this.container.querySelector('.abc-letter');
			const rect = node.getBoundingClientRect();
			this.width = rect.width;
			this.height = rect.height;
		},

		setColumns() {
			this.nColumns = Math.ceil(window.innerWidth / 200);

			this.nColumns = Math.min(this.nColumns, 8);

			document.documentElement.style.setProperty('--columns', this.nColumns);
		},

		setCursor(position) {
			let oldElem = this.container.querySelector('.abc-cursor');
			if (oldElem)
				oldElem.classList.remove('abc-cursor');

			let newElem = this.container.children[position];

			newElem.classList.add('abc-cursor');

			if (!UTILS.isInViewport(newElem)) {
				newElem.scrollIntoView({
					behavior: "smooth"
				});
			}
		},

		addChar(char, position) {
			let elem = document.querySelector(`.abc-preload .${char}`).cloneNode(true);
			let node = this.buildNode(position, {
				char,
				elem
			});

			return node;
		},

		addSpace(char, position) {
			return this.buildNode(position, {
				char
			});
		},

		newLine(char, position) {
			return this.buildNode(position, {
				char
			});
		},

		updateNode(node) {

			let frame = node.iFrame;
			let cols = (node.columns);
			let x = frame % cols;
			let y = ~~(frame / cols);

			node.spriteElem.style.backgroundPosition =
			`${x/(cols-1) * 100}% ${y/(node.rows-1) * 100}%`;
		},

		buildNode(position, options) {

			const defaults = {
				state: 'start',
				clicked: false,
				char: null,
				elem: DOM.abcLetterTemplate.cloneNode(true),
				delay: 1000 / FPS,
				time: performance.now(),
			};

			const node = Object.assign({}, defaults, options);

			let charProps = CHARS[node.char];

			node.spriteElem = node.elem.firstElementChild;

			if (charProps) {

				node.nFrames = charProps.N;
				node.rows = charProps.R;
				node.columns = charProps.C;
				node.iFrame = 0;
				[node.loopStart, node.loopEnd] = charProps.L;

				node.spriteElem.style.backgroundSize = `${100*charProps.C}%`;
			}

			this.container.insertBefore(node.elem, this.container.children[position]);

			return node;
		},

		removeNode(node) {
			const elem = node.elem;
			return elem.parentElement.removeChild(elem);
		},

	}

	const TXT = {
		value: '',
		area: [],
		start: 0,
		//text cursor position
		selection: 0,

		keydown(key, evt) {


			let node;

			switch (key) {

				case 'ArrowLeft':
				evt.preventDefault();
				this.moveCursor(-1);
				VIZ.setCursor(this.start);
				break;

				case 'ArrowRight':
				evt.preventDefault();
				this.moveCursor(1);
				VIZ.setCursor(this.start);
				break;

				case 'ArrowDown':
				evt.preventDefault();
				this.moveCursor(VIZ.nColumns);
				VIZ.setCursor(this.start);
				break;

				case 'ArrowUp':
				evt.preventDefault();
				this.moveCursor(-VIZ.nColumns);
				VIZ.setCursor(this.start);
				break;

				case 'Enter':
					// this.moveCursor(1);
					evt.preventDefault();
					break;

					case ' ':
					node = VIZ.addSpace(key, this.start);
					this.register(node, this.start);
					this.moveCursor(1);
					VIZ.setCursor(this.start);

					break;

					case 'Backspace':
					evt.preventDefault();
					this.deleteChar();
					this.moveCursor(-1);
					VIZ.setCursor(this.start);

					break;
					default:
					key = key.toUpperCase();

					if (!this.hasChar(key))
						break;
					// this.clearSelection();

					node = VIZ.addChar(key, this.start);
					this.register(node, this.start);
					this.moveCursor(1);
					VIZ.setCursor(this.start);
				}
			},

			moveCursor(move = 1) {
				this.start += move;
				this.start = Math.max(this.start, 0);
				this.start = Math.min(this.start, this.area.length);
			},

			toString() {

				let string = '';

				for (let node of this.area) {
					string += node.char;
				}

				return string;
			},

			deleteChar() {
				let index = this.start - 1;
				if (index < 0) {
					return;
				}

				const node = this.area.splice(index, 1)[0];
				if (node)
					VIZ.removeNode(node);
			},

			delete() {

				const nodes = this.area.splice(this.start, 1);

				for (let i = nodes.length - 1; i >= 0; i--) {

				}
			},

			register(node) {
				this.area.splice(this.start, 0, node);
			},

			hasChar(key) {
				return (key in CHARS);
			}
		}

		const ANIM = {
			area: TXT.area,
			fps: 25,
		// max renders per frame
		maxRenders: 25,
		index: 0,

		init() {
			this.delay = 1000 / this.fps;
			this.time = performance.now();
			requestAnimationFrame(this.update.bind(this));
		},

		update() {
			this.draw();
			requestAnimationFrame(this.update.bind(this));
		},

		draw() {
			let len = this.area.length;

			for (let i = Math.min(len, this.maxRenders); i--;) {

				this.index = (this.index + 1) % len;

				let node = this.area[this.index];

				VIZ.animateNode(node);

				if (!node.visible)
					i++;
			}
		}
	}

	const LOAD = {
		nLoaded: 0,
		status: 0,
		loadingBar: document.querySelector('.abc-loading_bar'),
		message: document.querySelector('.abc-message'),
		jszip: new JSZip(),
		jszipUtils: JSZipUtils,

		async init(folder_path) {

			this.message.classList.remove('hidden');

			if (UTILS.isMobile()) {
				this.message.textContent = 'No mobile version yet :𝙸';
				return new Promise(() => {});
			}

			this.loadingBar.classList.remove('hidden');

			this.jszipUtils.getBinaryContent('./rsrc/sprites.zip', (err, data) => {

				this.jszip.loadAsync(data)
				.then( zip => {
					zip.file('sprites/K.png').async('arraybuffer').then(content => {
						
						let buffer = new Uint8Array(content);
						let blob = new Blob([buffer.buffer]);

						let cont = document.createElement('div');
						cont.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;

						document.body.appendChild(cont);
						cont.style.cssText = 'position: absolute; top: 250px; left: 250px; width: 250px; height: 250px';
					});
				});
			});

			await this.preloadSprites(folder_path);

			let time = performance.now() - 2000;
			let delay = Math.max(Math.abs(time - performance.now()), 0);

			await UTILS.delay(delay);
			this.loadingBar.classList.add('hidden');
			this.message.classList.add('hidden');
			document.body.classList.remove('lockScroll');
		},

		onProgress() {
			this.loadingBar.style.setProperty('--progress', this.status);
		},

		preloadSprites(folder_path) {
			let container = document.querySelector('.abc-preload');
			let model = document.querySelector('.abc-letter');
			let fragment = document.createDocumentFragment();
			let loadedImgs = [];

			for (let charName in CHARS) {

				let char = CHARS[charName];
				char.path = `${folder_path}${char.F}`;

				loadedImgs.push(UTILS.loadImage(char.path));

				let clone = model.cloneNode(true);
				clone.firstElementChild.style.backgroundImage = `url(${char.path})`;
				clone.classList.add(charName);
				clone.classList.add('interactive');
				fragment.appendChild(clone);
			}

			container.appendChild(fragment);

			loadedImgs.forEach(promise => {
				promise.then(img => {
					this.nLoaded++;
					this.status = this.nLoaded / Object.keys(CHARS).length;
					this.onProgress();
				});
			});

			return Promise.all(loadedImgs);
		}
	}



	const DELTA = 0;

	async function init() {
		await LOAD.init('./rsrc/sprites/');
		VIZ.init();
		HEADER.init();
		ANIM.init();

		document.documentElement.addEventListener('keydown', function(evt) {
			TXT.keydown(evt.key, evt);
		});

		document.documentElement.addEventListener('click', function(evt) {
			VIZ.click(evt);
		});

		window.addEventListener('blur', function() {
			VIZ.blur();
		});
		window.addEventListener('focus', function() {
			VIZ.focus();
		});

		document.body.addEventListener('scroll', function(evt) {
			HEADER.update();
		});

		window.addEventListener('resize', function(evt) {
			VIZ.getDims();
			VIZ.setColumns();
			HEADER.update();
		});
	}

	init();
});