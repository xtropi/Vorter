$(document).ready(function(){
  let d = new Date();
  let datetext = d.toTimeString();
  let datearray = datetext.split(' ');
  datetext = datearray[0];
  let timezone = datearray[1];
  $(".timeZone")[0].innerText=timezone;

  setInterval(function(){
    d = new Date();
    datetext = d.toTimeString();
    datearray = datetext.split(' ');
    datetext = datearray[0];
    timezone = datearray[1];
    $(".localTime")[0].innerText=datetext;
  }, 1000);

});
