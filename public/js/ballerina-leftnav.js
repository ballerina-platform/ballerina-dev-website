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
  $(".sub-menu ul").show();
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
  if($("li.current-inner-three-sub").length>0){
    $subUlTwo = $("li.current-inner-three-sub").parent().show().parent('.inner-sub-menu-two').addClass("OpenUL CurrentUl").parent('.sub-ul-two');
    $subUl=$subUlTwo.show().parent('.inner-sub-menu ').addClass("OpenUL CurrentUl").parents('.sub-ul');
    $subUl.show().parents(".sub-menu").addClass("OpenUL CurrentUl");
  }
  $(".sub-menu .cLeftMenuLink").click(function () {
    $(this).parent(".sub-menu").toggleClass("OpenUL").children("ul").slideToggle();
  });
  $(".inner-sub-menu .cLeftMenuInnerLink").click(function () {
    $(this).parent(".inner-sub-menu").toggleClass("OpenUL").children("ul").slideToggle();
  });
  $(".inner-sub-menu-two .cLeftMenuTwoLink").click(function () {
    $(this).parent(".inner-sub-menu-two").toggleClass("OpenUL").children("ul").slideToggle();
  });
});


$(function() {
  $("a").click(function() {
     // remove classes from all
     $("a").removeClass("cLeftMenuInnerLink cTopiAtag highlight");

     // add class to the one we clicked
     $(this).addClass("cLeftMenuInnerLink cTopiAtag highlight");
  });
});

$(function() {
  // Catch URL
  var url = window.location.href;

  // check the URL with a tag
  $(".sub-ul-two a").each(function() {
      if (url == (this.href)) {
          $(this).closest("a").addClass("cLeftMenuInnerLink cTopiAtag highlight");
          //scroll the li to top
          //$(".cLeftMenuInnerLink.cTopiAtag.highlight")[0].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});

      }
  });
  $(".cLeftMenuInnerLink.cTopiAtag.highlight")[0].scrollIntoView({});
  $(document).ready(function(){ 
    $('.cLeftMenuInnerLink.cTopiAtag.highlight')[0].click(function(){
    }); 
  });
  
  $( "li" ).removeClass( "current-inner-sub" )
  $( "li" ).removeClass( "inner-sub-menu-three" )
  $( "li" ).removeClass( "current-inner-three-sub" )

});  

// Highlights the relevent link in the left nav, 
// if the click/redirection is initiated within the page content
$(function() {
  $(".cBlallerina-io-docs-content-container a").click(function() {
    if($(this).attr("href").indexOf("#") != -1) {
      var bookmark = $(this).attr("href");
      $(".sub-menu a").filter("[href$='"+bookmark+"']").addClass("cLeftMenuInnerLink cTopiAtag highlight");
    }
  })
});