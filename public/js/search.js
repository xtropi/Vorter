function showSearchParam(){
  $('.searchParam').animate({
    left: '0px'
  }, 200);

  $('.background').animate({
    margin: '0 0 0 285px'
  }, 200);
};

function hideSearchParam(){
  $('.searchParam').animate({
    left: '-285px'
  }, 200);

  $('.background').animate({
    margin: '0 0 0 0px'
  }, 200);
};

let main = function() {
  $('.gameLink').click(function() {
    showSearchParam();
  });

  $("#dota2").click(function() {
    $("#game").val("Dota2");
  });
  $("#csgo").click(function() {
    $("#game").val("CS GO");
  });
  $("#pubg").click(function() {
    $("#game").val("PUBG");
  });
  $("#fortnite").click(function() {
    $("#game").val("Fortnite");
  });
  $("#lol").click(function() {
    $("#game").val("League of legends");
  });

  $('.container').click(function(e) {
    let container1 = $('.gameLink');
    let container2 = $('.searchParam');
    if ((!container1.is(e.target)&& container1.has(e.target).length === 0)&&(!container2.is(e.target)&& container2.has(e.target).length === 0)){
      hideSearchParam();
    }
  });

  $('#searchStart').click(function() {
    $('#searchStart').addClass('d-none');
    $('#searchStop').removeClass('d-none');
  });
  $('#searchStop').click(function() {
    $('#searchStop').addClass('d-none');
    $('#searchStart').removeClass('d-none');
  });

  $(':input').keyup(function() {
    if ((!$('#purpose').val()=="") &&
    (!$('#time').val()=="") &&
    (!$('#country').val()=="") &&
    (!$('#groupSize').val()=="")){
      $('#searchStart').removeClass('disabled');
    } else {
      $('#searchStart').addClass('disabled');
    }
  });
};



$(document).ready(main);
