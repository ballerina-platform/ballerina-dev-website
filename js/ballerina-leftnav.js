// $(".sub-menu ul").hide();
// $(".sub-menu .cLeftMenuLink").click(function () {
//   $(this).parent(".sub-menu").children("ul").toggleClass("showmenu");
//   $(this).find(".right").toggleClass("fa-caret-up fa-caret-down");
// });

// $(document).ready(function () {
//   $("li.current-sub").parent().addClass("Open-submenu");
//   $("ul.Open-submenu").parent().addClass("OpenUL");

//   // $('ul.sub-ul').parent().addClass('OpenUL');

//   // $(".sub-menu a").click(function () {
//   // $('.cCovidMessage').addClass('cHideCovidMessagePermanent');
//   // $('sub-menu').parent().addClass('OpenUL');
//   // });

//   $(function () {
//     $(".sub-menu").on("click", function (e) {
//       $(this).toggleClass("OpenULElement").siblings();
//     });
//   });
// });

$(function () {
  $(".sub-menu ul").hide();
  if($("li.current-sub").length>0){
    $("li.current-sub")
    .parent()
    .show()
    .parents(".sub-menu")
    .addClass("OpenUL CurrentUl");
  }
  if($("li.current-inner-sub").length>0){
    $subUl= $("li.current-inner-sub").parent().show().parent('.inner-sub-menu ').addClass("OpenUL CurrentUl").parents('.sub-ul');
    $subUl.show().parents(".sub-menu").addClass("OpenUL CurrentUl");
  }
  $(".sub-menu .cLeftMenuLink").click(function () {
    $(this).parent(".sub-menu").toggleClass("OpenUL").children("ul").slideToggle();
  });
  $(".inner-sub-menu .cLeftMenuInnerLink").click(function () {
    $(this).parent(".inner-sub-menu").toggleClass("OpenUL").children("ul").slideToggle();
  });
});
