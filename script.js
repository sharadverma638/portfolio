(function () {
  var hasCursor = document.documentElement.classList.contains('has-cursor');
  if (!hasCursor) return; // touch devices: skip entirely, nothing to break

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var core = document.getElementById('cursorCore');
  var ring = document.getElementById('cursorRing');
  var page = document.getElementById('tiltWrap');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (core) {
      core.style.left = mouseX + 'px';
      core.style.top = mouseY + 'px';
    }

    if (page && !reduceMotion) {
      var relX = (mouseX / window.innerWidth) - 0.5;   // -0.5 .. 0.5
      var relY = (mouseY / window.innerHeight) - 0.5;
      var maxTilt = 7;   // degrees — stronger, more noticeable tilt
      var maxShift = 12; // px
      page.style.transform =
        'perspective(1000px) ' +
        'rotateX(' + (-relY * maxTilt) + 'deg) ' +
        'rotateY(' + (relX * maxTilt) + 'deg) ' +
        'translate(' + (relX * maxShift) + 'px, ' + (relY * maxShift) + 'px)';
    }
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    if (page) {
      page.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate(0,0)';
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    if (ring) {
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a').forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring && ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', function () { ring && ring.classList.remove('hovering'); });
  });
})();
