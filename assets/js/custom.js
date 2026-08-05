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
		'#main .experience > h2, #main .experience > h3, #main .experience > ul, ' +
		'#main .experience > hr, #main .experience > span.image',
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

		cat.addEventListener('click', function () {
			jump();
			showBubble(messages[Math.floor(Math.random() * messages.length)]);
		});

		// A one-time nudge shortly after load so Mewo gets noticed.
		setTimeout(function () {
			jump();
			showBubble('click me!');
		}, 2500);

		// Then a periodic, low-frequency nudge to stay noticeable without being annoying.
		if (!prefersReducedMotion) {
			(function scheduleIdleNudge() {
				var delay = 25000 + Math.random() * 20000; // 25-45s
				setTimeout(function () {
					if (!cat.classList.contains('is-talking')) {
						jump();
						showBubble(messages[Math.floor(Math.random() * messages.length)]);
					}
					scheduleIdleNudge();
				}, delay);
			})();
		}

	}

})();
