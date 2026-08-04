/*
	Custom additions: scroll-reveal animations + cat mascot.
	Kept separate from main.js (template file) so template updates stay clean.
*/
(function () {

	var prefersReducedMotion = window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

	// Equalizer icons "spike" briefly as their heading scrolls into view.
	if (!prefersReducedMotion && 'IntersectionObserver' in window) {
		var eqObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					var el = entry.target;
					el.classList.add('is-boosted');
					setTimeout(function () {
						el.classList.remove('is-boosted');
					}, 1200);
				}
			});
		}, { threshold: 0.6 });

		document.querySelectorAll('.eq').forEach(function (el) {
			eqObserver.observe(el);
		});
	}

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
