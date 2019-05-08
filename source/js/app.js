;(function() {
  "use strict;"

  var MENU_BUTTON_ID = 'site-menu-button';
  var OPEN_MENU_BUTTON_CLASS = 'page-nav__menu-btn--open';

  var MENU_ID = 'site-menu';
  var OPEN_MENU_CLASS = 'site-menu--open';

  var menuBtnNode = document.getElementById(MENU_BUTTON_ID);
  if (!menuBtnNode || !menuBtnNode.classList || !menuBtnNode.classList.contains) {
    return;
  };

  var menuNode = document.getElementById(MENU_ID);
  if (!menuNode || !menuNode.classList || !menuNode.classList.contains) {
    return;
  };

  closeMenu();

  menuBtnNode.addEventListener('click', function() {
    if (menuBtnNode.classList.contains(OPEN_MENU_BUTTON_CLASS)) {
      closeMenu();
    } else {
      openMenu();
    };
  });

  function closeMenu() {
    menuNode.classList.remove(OPEN_MENU_CLASS);
    menuBtnNode.classList.remove(OPEN_MENU_BUTTON_CLASS);
  }

  function openMenu() {
    menuNode.classList.add(OPEN_MENU_CLASS);
    menuBtnNode.classList.add(OPEN_MENU_BUTTON_CLASS);
  }

})();
