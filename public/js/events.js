$(document).ready(function(){
	$( ".cWebinarList tr:last" ).addClass("cLastTableRow");
        $( ".cMeetupsList tr:last" ).addClass("cLastTableRow");
        $( ".cConferencesList tr:last" ).addClass("cLastTableRow");
        $( ".cGLList tr:last" ).addClass("cLastTableRow");
	$( ".cWorkshopList tr:last" ).addClass("cLastTableRow");

        $( ".cWebinarList tr:first" ).addClass("cFirstTableRow");
        $( ".cMeetupsList tr:first" ).addClass("cFirstTableRow");
        $( ".cConferencesList tr:first" ).addClass("cFirstTableRow");
        $( ".cGLList tr:first" ).addClass("cFirstTableRow");
	$( ".cWorkshopList tr:first" ).addClass("cFirstTableRow");

});




$(function() {

        var current_date = new Date();
        
              $(".event-expiry").each(function() {
                        var div_date = $(this).data('expiry');
            
            // wrap in Date class
            div_date = new Date(div_date);
        
                        if(current_date.getTime()>div_date.getTime()){
                                      $(this).hide();
            } else {
                    $(this).show();
            }
        });
      
      
      
      })