$('.sub-menu ul').hide();
$(".sub-menu .cLeftMenuLink").click(function () {
   $(this).parent(".sub-menu").children("ul").toggleClass("showmenu");
   $(this).find(".right").toggleClass("fa-caret-up fa-caret-down");
   
});

$(document).ready(function () {
$('li.current-sub').parent().addClass('Open-submenu');
$('ul.Open-submenu').parent().addClass('OpenUL');

   // $('ul.sub-ul').parent().addClass('OpenUL');


   // $(".sub-menu a").click(function () {
   // $('.cCovidMessage').addClass('cHideCovidMessagePermanent');
   // $('sub-menu').parent().addClass('OpenUL');
   // });

$(function() {
$(".sub-menu").on("click", function(e) {
$(this).toggleClass("OpenULElement").siblings();
});
})



});