(function () {
  'use strict';
  var menu = document.querySelector('.site-menu');
  var button = document.querySelector('.menu-toggle');
  if (!menu || !button) return;
  var groups = Array.from(menu.querySelectorAll('.nav-group'));
  var desktop = window.matchMedia('(min-width: 1201px)');
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  function setGroup(group, open) {
    group.toggleAttribute('open', open);
    group.querySelector('.nav-trigger').setAttribute('aria-expanded', String(open));
  }
  function closeGroups(except) {
    groups.forEach(function (group) { if (group !== except) setGroup(group, false); });
  }
  function closeAll() {
    closeGroups();
    menu.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Ouvrir le menu');
  }
  closeAll();
  button.addEventListener('click', function () {
    var open = button.getAttribute('aria-expanded') !== 'true';
    if (!open) closeGroups();
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  groups.forEach(function (group, index) {
    var trigger = group.querySelector('.nav-trigger');
    var panel = group.querySelector('.nav-panel');
    panel.id = 'mitra-submenu-' + index;
    trigger.setAttribute('aria-controls', panel.id);
    group.addEventListener('mouseenter', function () {
      if (!desktop.matches || !hover.matches) return;
      closeGroups(group);
      setGroup(group, true);
    });
    group.addEventListener('mouseleave', function () {
      if (desktop.matches && hover.matches) setGroup(group, false);
    });
    trigger.addEventListener('click', function (event) {
      var open = !group.hasAttribute('open');
      if (desktop.matches && hover.matches && event.detail > 0) open = true;
      closeGroups(group);
      setGroup(group, open);
    });
    group.addEventListener('focusout', function (event) {
      if (!group.contains(event.relatedTarget)) setGroup(group, false);
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
    var group = groups.find(function (item) { return item.hasAttribute('open'); });
    var mobileOpen = button.getAttribute('aria-expanded') === 'true';
    if (!group && !mobileOpen) return;
    closeAll();
    (mobileOpen ? button : group.querySelector('.nav-trigger')).focus();
    event.preventDefault();
  });
  desktop.addEventListener('change', closeAll);
  window.addEventListener('pageshow', closeAll);
})();
