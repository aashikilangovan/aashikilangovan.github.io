/*
	Custom additions: scroll-reveal animations + cat mascot.
	Kept separate from main.js (template file) so template updates stay clean.
*/
(function () {

	var prefersReducedMotion = window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// main.js only removes body.is-preload on window's `load` event, which
	// waits for every image on the page — including ones sitting behind
	// article panels nobody has opened yet. On a slow connection that can
	// stall the intro reveal for a long time even though the actual markup
	// and styles are long since ready. Remove it as soon as the DOM itself
	// is parsed instead; main.js's own (now redundant) removal on window
	// load still runs harmlessly afterwards.
	function revealEarly() {
		window.setTimeout(function () {
			document.body.classList.remove('is-preload');
		}, 100);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', revealEarly);
	} else {
		revealEarly();
	}

	// YouTube facade: only load the real (heavy) embed once someone
	// actually asks to play it.
	document.querySelectorAll('.yt-facade').forEach(function (el) {
		function loadVideo() {
			var id = el.getAttribute('data-yt-id');
			var iframe = document.createElement('iframe');
			iframe.width = '560';
			iframe.height = '315';
			iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
			iframe.title = 'YouTube video player';
			iframe.frameBorder = '0';
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
			iframe.allowFullscreen = true;
			el.replaceWith(iframe);
		}

		el.addEventListener('click', loadVideo);
		el.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				loadVideo();
			}
		});
	});

	// Scroll-reveal for section content.
	function setupReveal(selector, className, staggerStep, staggerCap) {
		var els = document.querySelectorAll(selector);

		if (els.length === 0)
			return;

		els.forEach(function (el, i) {
			el.classList.add(className);
			if (staggerStep)
				el.style.transitionDelay = (Math.min(i, staggerCap || i) * staggerStep) + 's';
		});

		if (prefersReducedMotion || !('IntersectionObserver' in window)) {
			els.forEach(function (el) { el.classList.add('is-visible'); });
			return;
		}

		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12 });

		els.forEach(function (el) { observer.observe(el); });
	}

	setupReveal(
		'#main article > h2, #main article > h3, #main article > h4, #main article > p, ' +
		'#main article > ul, #main article > span.image, #main article > iframe, ' +
		'#main article > .project-card, ' +
		'#main .experience > h2, #main .experience > ul, #main .experience > hr, ' +
		'#main .experience > .exp-entry',
		'reveal', 0.05, 6
	);

	document.querySelectorAll('.skills-list').forEach(function (list) {
		var items = list.querySelectorAll('li');
		items.forEach(function (li, i) {
			li.classList.add('reveal-chip');
			li.style.transitionDelay = (i * 0.035) + 's';
		});
	});

	if (!prefersReducedMotion && 'IntersectionObserver' in window) {
		var chipObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					chipObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1 });

		document.querySelectorAll('.reveal-chip').forEach(function (el) {
			chipObserver.observe(el);
		});
	} else {
		document.querySelectorAll('.reveal-chip').forEach(function (el) {
			el.classList.add('is-visible');
		});
	}

	// Scroll progress bar (top of page), styled like a track scrubber.
	var progressBar = document.getElementById('scroll-progress-bar');

	if (progressBar) {
		var progressTicking = false;

		function updateProgress() {
			var doc = document.documentElement;
			var scrollTop = window.pageYOffset || doc.scrollTop;
			var scrollHeight = doc.scrollHeight - doc.clientHeight;
			var pct = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
			progressBar.style.width = pct + '%';
			progressTicking = false;
		}

		function onProgressScroll() {
			if (!progressTicking) {
				requestAnimationFrame(updateProgress);
				progressTicking = true;
			}
		}

		window.addEventListener('scroll', onProgressScroll, { passive: true });
		window.addEventListener('resize', onProgressScroll);
		updateProgress();
	}

	// Stars burst from wherever you click.
	if (!prefersReducedMotion) {
		var sparkGlyphs = ['✦', '✧', '⋆'];
		var sparkColors = ['var(--accent-soft)', 'var(--accent)', 'var(--accent-deep)', '#ffffff'];

		// Capture phase: fires before any other handler on the page can
		// stopPropagation() the click (e.g. the article-panel backdrop).
		document.addEventListener('click', function (e) {
			var count = 2 + Math.floor(Math.random() * 2); // 2-3 sparks per click

			for (var i = 0; i < count; i++) {
				var spark = document.createElement('span');
				spark.className = 'click-spark';
				spark.textContent = sparkGlyphs[Math.floor(Math.random() * sparkGlyphs.length)];
				spark.style.left = e.clientX + 'px';
				spark.style.top = e.clientY + 'px';
				spark.style.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
				spark.style.setProperty('--dx', (Math.random() * 64 - 32).toFixed(0) + 'px');
				spark.style.setProperty('--dy', (-42 - Math.random() * 36).toFixed(0) + 'px');
				spark.style.setProperty('--rot', (Math.random() * 44 - 22).toFixed(0) + 'deg');
				spark.style.animationDelay = (i * 55) + 'ms';

				document.body.appendChild(spark);
				spark.addEventListener('animationend', function () {
					this.remove();
				});
			}
		}, true);
	}

	// Starfield: box-shadow "stars" generated once at load — no per-frame
	// work, just a one-time string built from the current viewport size.
	(function generateStarfield() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		var layers = [
			{ selector: '.star-layer-1', count: 110, color: '255,255,255', maxOpacity: 0.9 },
			{ selector: '.star-layer-2', count: 55, color: '125,211,252', maxOpacity: 0.85 },
			{ selector: '.star-layer-3', count: 20, color: '255,255,255', maxOpacity: 1 }
		];

		layers.forEach(function (layer) {
			var el = document.querySelector(layer.selector);
			if (!el) return;

			var shadows = [];
			for (var i = 0; i < layer.count; i++) {
				var x = Math.round(Math.random() * w);
				var y = Math.round(Math.random() * h);
				var o = (0.4 + Math.random() * (layer.maxOpacity - 0.4)).toFixed(2);
				shadows.push(x + 'px ' + y + 'px 0 rgba(' + layer.color + ',' + o + ')');
			}
			el.style.boxShadow = shadows.join(',');
		});
	})();

	// Cat mascot: Mewo.
	var cat = document.getElementById('cat');

	if (cat) {

		var bubble = cat.querySelector('.cat-bubble');
		var messages = [
			'meow!',
			"hi, i'm Mewo 🐾",
			'purrrr~',
			'nice portfolio, huh?',
			'psst... check my projects',
			'✨',
			'hire my human',
			'🎧 good taste in music, right?',
			'click me!'
		];
		var bubbleTimeout;
		var messageIndex = 0;
		var autoRotateInterval;
		var battleActive = false;
		var battleVictoryUnlocked = false;

		function showBubble(text) {
			if (!bubble) return;
			bubble.textContent = text;
			cat.classList.add('is-talking');
			clearTimeout(bubbleTimeout);
			bubbleTimeout = setTimeout(function () {
				cat.classList.remove('is-talking');
			}, 1800);
		}

		function jump() {
			cat.classList.remove('is-jumping');
			// Force reflow so the animation can restart on repeat triggers.
			void cat.offsetWidth;
			cat.classList.add('is-jumping');
		}

		// Auto-rotate through messages continuously.
		function startAutoRotate() {
			if (prefersReducedMotion || battleActive) return;

			autoRotateInterval = setInterval(function () {
				showBubble(messages[messageIndex]);
				messageIndex = (messageIndex + 1) % messages.length;

				// Jump every few messages to keep it lively.
				if (messageIndex % 3 === 0) {
					jump();
				}
			}, 2200); // ~2.2s per message: readable but quick
		}

		function stopAutoRotate() {
			clearInterval(autoRotateInterval);
		}

		// Start auto-rotation after a brief delay.
		setTimeout(function () {
			startAutoRotate();
		}, 1500);

		// Battle System
		var battleModal = document.getElementById('battle-modal');
		var battleConfirm = document.getElementById('battle-confirm');
		var battleArena = document.getElementById('battle-arena');
		var battleVictory = document.getElementById('battle-victory');
		var mewoHealth = 100;
		var maxHealth = 100;

		var attackTypes = [
			{ emoji: '🎵', name: 'Sonic Blast', desc: 'Music notes' },
			{ emoji: '🎧', name: 'Headphone Spin', desc: 'Spinning audio' },
			{ emoji: '💻', name: 'Debug Attack', desc: 'Code bugs' },
			{ emoji: '🐾', name: 'Paw Swipe', desc: 'Cat power' },
			{ emoji: '✨', name: 'Star Burst', desc: 'Star power' },
			{ emoji: '⌨️', name: 'Keyboard Smash', desc: 'Type attack' }
		];

		var mewoDialogues = {
			first: [
				'Huh? What was that?',
				'Scoff... lucky hit.',
				'You dare challenge me?'
			],
			second: [
				'Okay, okay... you\'ve got some skills.',
				'This is getting interesting...',
				'Hmm, not bad at all.'
			],
			third: [
				'Wait... you might actually be strong?',
				'I might have to start trying now...',
				'Okay, you have my attention.'
			],
			final: [
				'You... you actually beat me?',
				'I didn\'t expect this...',
				'Well played, human.'
			]
		};

		function getRandomElement(arr) {
			return arr[Math.floor(Math.random() * arr.length)];
		}

		function getDamage() {
			return 20 + Math.floor(Math.random() * 16); // 20-35 damage
		}

		function getMewoDialogue(healthPercent) {
			if (healthPercent > 75) return getRandomElement(mewoDialogues.first);
			if (healthPercent > 50) return getRandomElement(mewoDialogues.second);
			if (healthPercent > 25) return getRandomElement(mewoDialogues.third);
			return getRandomElement(mewoDialogues.final);
		}

		function showAttackAnimation(attack, callback) {
			var display = document.getElementById('attack-display');

			// Show attack emoji flying toward Mewo
			var atkEl = document.createElement('div');
			atkEl.className = 'attack-animation';
			atkEl.textContent = attack.emoji;
			display.appendChild(atkEl);

			if (!prefersReducedMotion) {
				atkEl.style.animation = 'attackFly 0.5s ease-out forwards';
				setTimeout(function () {
					atkEl.remove();
					callback();
				}, 500);
			} else {
				atkEl.remove();
				callback();
			}
		}

		function spawnImpactBurst() {
			var burst = document.getElementById('impact-burst');
			var glyphs = ['✦', '✧', '⋆', '💥'];
			var count = prefersReducedMotion ? 0 : (4 + Math.floor(Math.random() * 3));

			for (var i = 0; i < count; i++) {
				var spark = document.createElement('span');
				spark.className = 'impact-spark';
				spark.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
				var angle = Math.random() * Math.PI * 2;
				var dist = 30 + Math.random() * 40;
				spark.style.setProperty('--ix', (Math.cos(angle) * dist).toFixed(0) + 'px');
				spark.style.setProperty('--iy', (Math.sin(angle) * dist).toFixed(0) + 'px');
				spark.style.animationDelay = (i * 30) + 'ms';
				burst.appendChild(spark);
				spark.addEventListener('animationend', function () { this.remove(); });
			}
		}

		function spawnDamagePopup(damage) {
			var layer = document.getElementById('dmg-popup-layer');
			var popup = document.createElement('div');
			popup.className = 'dmg-popup';
			popup.textContent = '-' + damage;
			layer.appendChild(popup);

			if (prefersReducedMotion) {
				setTimeout(function () { popup.remove(); }, 900);
			} else {
				popup.addEventListener('animationend', function () { this.remove(); });
			}
		}

		function triggerHitReaction() {
			var sprite = document.getElementById('mewo-sprite');
			var content = document.getElementById('battle-content');

			sprite.classList.remove('is-hit');
			content.classList.remove('is-shaking');
			void sprite.offsetWidth;
			sprite.classList.add('is-hit');
			if (!prefersReducedMotion) {
				content.classList.add('is-shaking');
			}

			setTimeout(function () {
				sprite.classList.remove('is-hit');
				content.classList.remove('is-shaking');
			}, 450);
		}

		function updateHealthBar() {
			var fill = document.getElementById('mewo-health-fill');
			var current = document.getElementById('mewo-current-hp');
			var container = document.getElementById('mewo-health-container');
			var percent = Math.max(0, (mewoHealth / maxHealth) * 100);
			fill.style.width = percent + '%';
			current.textContent = Math.max(0, Math.floor(mewoHealth));

			if (percent > 0 && percent <= 25) {
				container.classList.add('is-low');
			} else {
				container.classList.remove('is-low');
			}
		}

		function performAttack(attack) {
			var buttons = document.querySelectorAll('.attack-btn');
			buttons.forEach(function (btn) { btn.disabled = true; });

			showAttackAnimation(attack, function () {
				var damage = getDamage();
				mewoHealth -= damage;
				if (mewoHealth < 0) mewoHealth = 0;

				triggerHitReaction();
				spawnImpactBurst();
				spawnDamagePopup(damage);
				updateHealthBar();

				var healthPercent = (mewoHealth / maxHealth) * 100;
				var dialogue = getMewoDialogue(healthPercent);
				var dialogueEl = document.getElementById('mewo-dialogue');
				dialogueEl.textContent = dialogue;

				if (mewoHealth <= 0) {
					var sprite = document.getElementById('mewo-sprite');
					setTimeout(function () {
						sprite.classList.add('is-defeated');
					}, 350);
					setTimeout(function () {
						endBattle();
					}, 1100);
				} else {
					setTimeout(function () {
						buttons.forEach(function (btn) { btn.disabled = false; });
					}, 900);
				}
			});
		}

		function initBattleArena() {
			mewoHealth = maxHealth;
			updateHealthBar();

			var sprite = document.getElementById('mewo-sprite');
			sprite.classList.remove('is-defeated', 'is-hit');

			var attackButtons = document.getElementById('attack-buttons');
			attackButtons.innerHTML = '';

			// Shuffle and pick 4 attacks
			var shuffled = attackTypes.slice().sort(function () { return Math.random() - 0.5; });
			var selected = shuffled.slice(0, 4);

			selected.forEach(function (attack) {
				var btn = document.createElement('button');
				btn.className = 'battle-btn attack-btn';
				btn.type = 'button';

				var emojiSpan = document.createElement('span');
				emojiSpan.className = 'atk-emoji';
				emojiSpan.textContent = attack.emoji;

				var nameSpan = document.createElement('span');
				nameSpan.className = 'atk-name';
				nameSpan.textContent = attack.name;

				var descSpan = document.createElement('span');
				descSpan.className = 'atk-desc';
				descSpan.textContent = attack.desc;

				btn.appendChild(emojiSpan);
				btn.appendChild(nameSpan);
				btn.appendChild(descSpan);

				btn.addEventListener('click', function () {
					performAttack(attack);
				});
				attackButtons.appendChild(btn);
			});

			// Reset dialogue
			document.getElementById('mewo-dialogue').textContent = 'What are you doing?';
		}

		function startBattle() {
			battleActive = true;
			stopAutoRotate();
			battleConfirm.classList.add('hidden');
			battleArena.classList.remove('hidden');
			battleVictory.classList.add('hidden');
			initBattleArena();
		}

		function endBattle() {
			var victoryText = document.getElementById('victory-text');
			victoryText.textContent = 'You defeated Mewo!';
			battleArena.classList.add('hidden');
			battleVictory.classList.remove('hidden');

			// Add unlocked message to rotation on first victory
			if (!battleVictoryUnlocked) {
				messages.push('Nice battle, you\'re pretty good... 🐾');
				battleVictoryUnlocked = true;
			}
		}

		function closeBattle() {
			battleActive = false;
			battleModal.classList.add('hidden');
			battleConfirm.classList.remove('hidden');
			battleArena.classList.add('hidden');
			battleVictory.classList.add('hidden');
			startAutoRotate();
		}

		// Battle event listeners
		document.getElementById('battle-confirm-yes').addEventListener('click', startBattle);
		document.getElementById('battle-confirm-no').addEventListener('click', closeBattle);
		document.getElementById('battle-exit-btn').addEventListener('click', closeBattle);
		document.getElementById('battle-victory-close').addEventListener('click', closeBattle);

		// Clicking Mewo shows the battle prompt
		cat.addEventListener('click', function () {
			jump();
			if (!battleActive) {
				battleModal.classList.remove('hidden');
			}
		});

	}

})();
