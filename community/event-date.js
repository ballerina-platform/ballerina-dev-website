window.setInterval(function() {
   /* Time Format - YYYY-MM-DDTHH:MM:SS.0000TimeZone -> Ex 2022-05-25T18:30:00.0000-07:00 */
   /* Please make sure to add correct time zone */
   
   /* Start expire date for event 1 */
    var current = new Date();
    var expiry = new Date("2022-08-11T18:30:00.0000-07:00")
  
    if (current.getTime() > expiry.getTime()) {
      $('.bEvent1').hide();
  
    } else if (current.getTime() < expiry.getTime()) {
      $('.bEvent1').show();
    }
    /* Finish expire date for event 1 */
    /* Start expire date for event 2 */
    var current = new Date();
    var expiry = new Date("2022-09-07T06:10:00.0000-04:00")

    if (current.getTime() > expiry.getTime()) {
     $('.bEvent2').hide();

    } else if (current.getTime() < expiry.getTime()) {
     $('.bEvent2').show();
    }
    /* Finish expire date for event 2 */
  
}, 0);



