window.addEventListener('load', function() {

	const DOM = {
		abcTemplates: document.querySelector('.abc-templates'),
		infoContainer: document.querySelector('.info-container'),
		infoCollapsed: document.querySelector('.info-collapsed'),
		infoButton: document.querySelector('.info-button'),
		abcSection: document.querySelector('.abc-section'),
		whiteSpaceTemplate: document.querySelector('.abc-templates .abc-letter'),
		loadContainer: document.querySelector('.load-container'),
		loadProgress: document.querySelector('.load-progress'),
	}

	const HEADER = {
		container: DOM.infoContainer,
		collapsed: DOM.infoCollapsed,
		button: DOM.infoButton,
		parent: document.documentElement,

		init() {

			this.hide();
			this.button.addEventListener('click', (e) => {

				if(this.parent.scrollTop === 0) {
					this.hide();
				} else {
					this.show();
				}

				e.preventDefault();

			});
		},

		hide() {
			this.parent.scrollTop = this.container.offsetHeight;
			WRITER.focus();
			document.body.classList.add('enable-scroll');
		},

		show() {
			this.parent.scrollTop = 0;
		},

		update() {

			let height = this.parent.scrollTop;
			let maxHeight = this.container.offsetHeight;
			let amt = height / maxHeight;

			this.container.style.opacity = UTILS.map(amt, 0, 0.5, 1, 0);
		}
	}

	const SPRITE_FOLDER = './rsrc/sprites_light/';
	const FPS = 25;

	//F: file, L: loop between frames, C: columns, R: rows, N: numframes, CH: chars
	const SPRITES = {
		'a': {F: 'a.png', L: [22, 50], C: 15, R: 9,N: 124, CH: 'AaÁáÀàÂâǍǎĂăÃãẢảȦȧẠạÄäÅåḀḁĀāĄąᶏȺⱥȀȁẤấẦầẪẫẨẩẬậẮắẰằẴẵẲẳẶặǺǻǠǡǞǟȀȁȂȃⱭɑᴀⱯɐɒＡａ'},
		'b': {F: 'b.png', L: [46, 86], C: 15, R: 13,N: 192, CH: 'BbḂḃḄḅḆḇɃƀƁɓƂƃᵬᶀʙＢｂȸ'},
		'c': {F: 'c.png', L: [26, 60], C: 15, R: 9,N: 134, CH: 'CcĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ'},
		'd': {F: 'd.png', L: [25, 55], C: 15, R: 14,N: 204, CH: 'DdĎďḊḋḐḑḌḍḒḓḎḏĐđÐðD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄÞþD'},
		'e': {F: 'e.png', L: [41, 125], C: 15, R: 16,N: 234, CH: 'EeÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇƏəƎǝƐɛＥｅ'},
		'f': {F: 'f.png', L: [29, 57], C: 15, R: 10,N: 146, CH: 'FfḞḟƑƒᵮᶂꜰＦｆ'},
		'g': {F: 'g.png', L: [36, 68], C: 15, R: 20,N: 297, CH: 'GgǴǵĞğĜĝǦǧĠġĢģḠḡǤǥƓɠᶃɢȜȝＧｇŊŋ'},
		'h': {F: 'h.png', L: [49, 102], C: 15, R: 13,N: 191, CH: 'HhĤĥȞȟḦḧḢḣḨḩḤḥḪḫH̱ẖĦħⱧⱨɦʰʜＨｈ'},
		'i': {F: 'i.png', L: [76, 112], C: 15, R: 18,N: 260, CH: 'IiÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨᵻᶖİiIıɪƖɩｉ'},
		'j': {F: 'j.png', L: [30, 58], C: 15, R: 13,N: 195, CH: 'JjĴĵɈɉJ̌ǰȷʝɟʄᴊＪｊJjJjj'},
		'k': {F: 'k.png', L: [54, 84], C: 15, R: 13,N: 184, CH: 'KkḰḱǨǩĶķḲḳḴḵƘƙⱩⱪᶄᶄꝀꝁᴋＫｋ'},
		'l': {F: 'l.png', L: [33, 70], C: 15, R: 24,N: 352, CH: 'LlĹĺĽľĻļḶḷḸḹḼḽḺḻŁłĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬ'},
		'm': {F: 'm.png', L: [37, 77], C: 15, R: 19,N: 273, CH: 'MmḾḿṀṁṂṃᵯᶆⱮɱᴍＭｍ'},
		'n': {F: 'n.png', L: [48, 126], C: 15, R: 18,N: 257, CH: 'NnŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋNJNjnjǊǋǌ'},
		'o': {F: 'o.png', L: [30, 70], C: 15, R: 10,N: 140, CH: 'OoÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộƟɵƆɔȢȣⱺᴏＯｏ'},
		'p': {F: 'p.png', L: [36, 67], C: 15, R: 10,N: 149, CH: 'PpṔṕṖṗⱣᵽƤƥP̃p̃ᵱᶈᴘǷƿＰｐ'},
		'q': {F: 'q.png', L: [43, 49], C: 15, R: 11,N: 159, CH: 'QqɊɋƢƣʠＱｑ'},
		'r': {F: 'r.png', L: [26, 56], C: 15, R: 11,N: 156, CH: 'RrŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟɌɍⱤɽꝚꝛᵲᶉɼɾᵳʀＲｒ'},
		's': {F: 's.png', L: [41, 81], C: 15, R: 16,N: 236, CH: 'SsſẞßŚśṤṥŜŝŠšṦṧṠṡẛŞşṢṣṨṩȘșS̩s̩ᵴᶊʂȿꜱƩʃＳｓ'},
		't': {F: 't.png', L: [27, 56], C: 15, R: 9,N: 131, CH: 'TtŤťṪṫŢţṬṭȚțṰṱṮṯŦŧȾⱦƬƭƮʈT̈ẗᵵƫȶᶙᴛＴｔ'},
		'u': {F: 'u.png', L: [77, 117], C: 15, R: 17,N: 251, CH: 'UuÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũṸṹŲųŪūṺṻỦủȔȕȖȗƯưỨứỪừỮữỬửỰựỤụṲṳṶṷṴṵɄʉƱʊȢȣᵾᶙᴜＵｕ'},
		'v': {F: 'v.png', L: [53, 83], C: 15, R: 16,N: 238, CH: 'VvṼṽṾṿƲʋᶌᶌⱱⱴᴠɅʌＶｖ'},
		'w': {F: 'w.png', L: [30, 57], C: 15, R: 9,N: 129, CH: 'WwẂẃẀẁŴŵẄẅẆẇẈẉẘẘⱲⱳᴡＷｗ'},
		'x': {F: 'x.png', L: [27, 55], C: 15, R: 12,N: 168, CH: 'XxẌẍẊẋᶍＸｘ'},
		'y': {F: 'y.png', L: [20, 48], C: 15, R: 13,N: 191, CH: 'YyÝýỲỳŶŷẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴʏＹｙ'},
		'z': {F: 'z.png', L: [38, 68], C: 15, R: 13,N: 183, CH: 'ZzŹźẐẑŽžŻżẒẓẔẕƵƶȤȥⱫⱬᵶᶎʐʑɀᴢƷʒƸƹＺｚ'},
	}

	const UTILS = {
		async loadImage(src) {
			return new Promise(function(resolve, reject) {
				const img = new Image();
				img.onload = resolve;
				img.onerror = reject;
				img.src = src;
			});
		},


		async delay(millis = 0) {

			return new Promise(resolve => {
				setTimeout(resolve, millis);
			});
		},

		shuffle(a) {
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
			}

			return a;
		},

		map(num, start1, stop1, start2, stop2) {
			return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
		},

		isInViewport(elem) {
			let bounding = elem.getBoundingClientRect();
			return (bounding.bottom >= 0 && bounding.top <= (window.innerHeight));
		},

		clearSelection() {
			if (window.getSelection) {window.getSelection().removeAllRanges();}
			else if (document.selection) {document.selection.empty();}
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
	}

	const SPRITE = {

		click(evt) {

			const elem = evt.target;

			if (!elem.matches('.abc-letter.animate'))
				return;

			this.updateProps(elem, {clicked: true});

			this.trigger(elem, 'spriteclicked');
			// UTILS.clearSelection();
			// evt.stopPropagation()
		},

		trigger(elem, type) {
			return elem.dispatchEvent(new CustomEvent(type, {bubbling: true}));
		},

		getProps(elem) {
			return JSON.parse(elem.dataset.props);
		},

		updateProps(elem, props) {
			let nprops = Object.assign(this.getProps(elem), props);
			elem.dataset.props = JSON.stringify(nprops);
		},

		animate(elem) {

			const props = this.getProps(elem);

			const now = performance.now();
			const elapsed = now - props.time;

			props.visible = UTILS.isInViewport(elem);

			if (!props.visible) {
				return props;
			}

			if (elapsed > props.delay) {

				this.updateNode(elem, props);
				this.updateState(elem, props);
				props.time = now - (elapsed % props.delay);
			}

			this.updateProps(elem, props);

			return props;
		},

		updateState(elem, props) {
			this[`state_${props.state}`](elem, props);
		},

		state_start(elem, props) {
			props.iFrame++;

			if (props.iFrame >= props.loopStart)
				props.state = 'loop';
		},

		state_loop(elem, props) {
			props.iFrame++;

			if (props.iFrame > props.loopEnd) {
				if (props.clicked) {
					props.state = 'end';
					props.clicked = false;
				} else {
					props.iFrame = props.loopStart;
				}
			}
		},

		state_end(elem, props) {
			props.iFrame++;

			if (props.iFrame >= props.nFrames) {
				props.iFrame = props.nFrames;
				this.trigger(elem, 'spriteanimationend');
				props.state = 'rewind';
			}
		},

		state_rewind(elem, props) {
			if (props.clicked) {
				props.iFrame = 0;
				props.state = 'start';
				props.clicked = false;
			}
		},

		updateNode(elem, props) {

			let frame = props.iFrame;
			let cols = (props.columns);
			let x = frame % cols;
			let y = ~~(frame / cols);

			elem.style.backgroundPosition =
			`${x/(cols-1) * 100}% ${y/(props.rows-1) * 100}%`;
		},

		create(char) {

			const selector = '.abc-letter[data-char*="'+ this.remapChar(char) +'"]';
			const template = DOM.abcTemplates.querySelector(selector);

			if(!template)
				return;

			const elem = template.cloneNode(true);

			elem.setAttribute('alt', char);

			const props = {
				state: 'start',
				clicked: false,
				delay: 1000 / FPS,
				time: performance.now(),
			};

			this.updateProps(elem, props);

			return elem;
		},

		remapChar(char) {
			return char.replace(/\s+/g, ' ');
		},

	}


	const LOAD = {
		container: DOM.loadContainer,
		progress: null,
		bar: null,
		letterCont: null,

		loaded: 0,
		total: 1,

		async init() {



			this.progress = this.container.querySelector('.load-progress');
			this.bar = this.container.querySelector('.load-bar');
			this.msg = this.container.querySelector('.load-message');
			this.letterCont = this.container.querySelector('.load-letter');
			//load sprites

			this.container.querySelector('.load-infos').classList.remove('hidden');

			const promises = [];

			let keys = UTILS.shuffle(Object.keys(SPRITES));

			this.total = keys.length;

			for (let spriteName of keys) {

				const props = SPRITES[spriteName];
				props.path = SPRITE_FOLDER + props.F;

				const prom = UTILS.loadImage(props.path);
				promises.push(prom);
				prom.then((imageObj) => {

					const elem = DOM.whiteSpaceTemplate.cloneNode(true);
					elem.dataset.char = props.CH;

					const data = {
						nFrames: props.N,
						rows: props.R,
						columns: props.C,
						iFrame: 0,
					};

					[data.loopStart, data.loopEnd] = props.L;
					SPRITE.updateProps(elem, data);

					elem.style.backgroundSize = `${100*props.C}%`;
					elem.style.backgroundImage = `url("${props.path}")`;
					elem.classList.add('animate');

					props.elem = elem;

					DOM.abcTemplates.appendChild(elem);

					this.updateProgress(props);				
				});
			}

			const time = performance.now() + 600;

			await Promise.all(promises);

			const delay = Math.max(time - performance.now(), 0);
			await UTILS.delay(delay);

			await ANIM.disappear(this.bar);
			ANIM.appear(this.msg);

			const clicked = this.spriteClicked();
			const end = this.spriteEnded();

			await clicked;
			this.msg.classList.add('hidden');
			await end;

			
		},

		async disappear() {
			await UTILS.delay(100);
			ANIM.disappear(this.container);
		},

		spriteClicked() {
			return new Promise((resolve, reject) => {
				this.letterCont.addEventListener('spriteclicked', () => {
					resolve();
				}, true);
			});
		},

		spriteEnded() {
			return new Promise((resolve, reject) => {
				this.letterCont.classList.remove('disabled');
				this.letterCont.addEventListener('spriteanimationend', () => {
					resolve();
				}, true);
			});
		},

		updateProgress(props) {

			if(this.loaded === 0) {
				let char = props.CH[0];
				let sprite = SPRITE.create(char);

				this.letterCont.classList.add('disabled');
				this.letterCont.appendChild(sprite);

			}

			this.loaded++;
			this.progress.style.transform = `scaleX(${this.loaded/this.total})`;
		}
	}

	const WRITER = {
		container: DOM.abcSection,

		focus() {
			document.documentElement.classList.add('smooth-scroll');
			DOM.abcSection.focus();
		},

		traverse(node) {

			for(let i = node.childNodes.length-1; i>= 0;i--) {
				let child = node.childNodes[i];

				if(child.nodeType===3) {
					this.replaceNode(child);
				}

				this.traverse(child);
			}
		},

		replaceNode(textNode) {

			const text = textNode.wholeText;
			const fragment = document.createDocumentFragment();

			for(const char of text) {

				const sprite = SPRITE.create(char);
				if(sprite) {
					fragment.appendChild(sprite);
				}
			}

			textNode.parentNode.insertBefore(fragment, textNode);
			textNode.remove();
		},

		resize() {

			const {width} = DOM.abcSection.getBoundingClientRect();

			let nColumns = Math.ceil(width / 200);
			nColumns = Math.min(nColumns, 8);

			document.documentElement.style.setProperty('--columns', nColumns);
			document.documentElement.style.setProperty('--font-size', (width*0.8)/nColumns + 'px');
		},
	}

	const ANIM = {
		container: DOM.abcSection,
		maxRenders: 25,
		index: 0,

		async disappear(elem) {
			await this.animate(elem, {opacity: 0});
			elem.classList.add('hidden');
		},

		async appear(elem) {
			elem.classList.remove('hidden');
			elem.style.opacity = 0;
			elem.offsetWidth;
			await this.animate(elem, {opacity: 1});
		},

		animate(elem, animations) {
			return new Promise((resolve, reject) => {

				elem.classList.add('tween');

				const props = Object.keys(animations);
				let i = 0;

				for (let prop of props) {
					elem.style[prop] = animations[prop];
				}

				const func = (e) => {
					if(e.target !== elem)
						return;

					i++;
					if(i>=props.length) {
						elem.removeEventListener('transitionend', func);	
						resolve(e);
					}
				}

				elem.addEventListener('transitionend', func);
			});
		},

		init() {
			this.delay = 1000 / FPS;
			this.time = performance.now();
			requestAnimationFrame(this.update.bind(this));
		},

		update() {
			this.draw();
			requestAnimationFrame(this.update.bind(this));
		},

		draw() {

			let imgs = document.querySelectorAll('.animate.abc-letter');

			for (let i = Math.min(imgs.length, this.maxRenders); i--;) {

				this.index = (this.index + 1) % imgs.length;

				let node = imgs[this.index];
				let {visible} = SPRITE.animate(node);

				if (!visible)
					i++;
			}
		}
	}


	async function init() {

		document.documentElement.addEventListener('click', function(e) {
			SPRITE.click(e);
		});

		ANIM.init();

		WRITER.resize();

		await LOAD.init();	

		DOM.abcSection.contentEditable = "true";

		HEADER.init();

		LOAD.disappear();


		WRITER.focus();

		//addListeners
		DOM.abcSection.addEventListener('input', function(e) {
			WRITER.traverse(this);
		});

		window.addEventListener('scroll', function(e) {
			HEADER.update();
		}, true);

		window.addEventListener('resize', function(e) {
			WRITER.resize();
		});
	}

	init();
});