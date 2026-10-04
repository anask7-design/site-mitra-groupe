(function () {
  'use strict';
  var menu = document.querySelector('.site-menu');
  var button = document.querySelector('.menu-toggle');
  if (!menu || !button) return;
  var groups = Array.from(menu.querySelectorAll('.nav-group'));
  var desktop = window.matchMedia('(min-width: 1201px)');
  function closeGroups(except) {
    groups.forEach(function (group) { if (group !== except) group.open = false; });
  }
  function setMobile(open) {
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (!open) closeGroups();
  }
  function closeAll() { closeGroups(); setMobile(false); }
  closeAll();
  button.addEventListener('click', function () {
    setMobile(button.getAttribute('aria-expanded') !== 'true');
  });
  groups.forEach(function (group) {
    group.querySelector('summary').addEventListener('click', function () {
      closeGroups(group);
    });
    group.addEventListener('pointerleave', function (event) {
      if (desktop.matches && event.pointerType === 'mouse') group.open = false;
    });
  });
  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target) || event.target.closest('.nav a')) closeAll();
  });
  document.addEventListener('focusin', function (event) {
    if (!menu.contains(event.target)) closeAll();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var openGroup = groups.find(function (group) { return group.open; });
    var mobileOpen = button.getAttribute('aria-expanded') === 'true';
    if (!openGroup && !mobileOpen) return;
    closeAll();
    (mobileOpen ? button : openGroup.querySelector('summary')).focus();
    event.preventDefault();
  });
  desktop.addEventListener('change', closeAll);
  window.addEventListener('pageshow', closeAll);
})();
