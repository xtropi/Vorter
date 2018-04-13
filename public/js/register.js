$(document).ready(function(){
    let d = new Date();
    let datetext = d.toTimeString();
    let datearray = datetext.split(' ');
    datetext = datearray[0];
    let timezone = datearray[1];
    
    $("#timezone").val(timezone);
});