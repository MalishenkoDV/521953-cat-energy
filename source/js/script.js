// Открытие/скрытие меню на мобильных

var body = document.querySelector("body");
var nav = document.querySelector(".navigation");
var navToggle = nav.querySelector(".navigation__toggle");
var navList = nav.querySelector(".navigation__list");

body.classList.remove("no-js");
body.classList.add("js");

navList.classList.add("navigation__list--close");

navToggle.addEventListener("click", function (evt) {
  evt.preventDefault();
  navList.classList.toggle("navigation__list--close");
  navToggle.classList.toggle("navigation__toggle--close");
});
