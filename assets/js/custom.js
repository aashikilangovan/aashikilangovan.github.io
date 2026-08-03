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

	// Cat mascot.
	var cat = document.getElementById('cat');

	if (cat) {

		var bubble = cat.querySelector('.cat-bubble');
		var messages = [
			'meow!',
			'hi there 🐾',
			'purrrr~',
			'nice portfolio, huh?',
			'psst... check my projects',
			'✨',
			'hire my human'
		];
		var bubbleTimeout;

		cat.addEventListener('click', function () {

			cat.classList.remove('is-jumping');
			// Force reflow so the animation can restart on repeat clicks.
			void cat.offsetWidth;
			cat.classList.add('is-jumping');

			if (bubble) {
				bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
				cat.classList.add('is-talking');
				clearTimeout(bubbleTimeout);
				bubbleTimeout = setTimeout(function () {
					cat.classList.remove('is-talking');
				}, 1800);
			}

		});

	}

})();
