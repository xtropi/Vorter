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
  $(".game").removeClass("shadow");
  $('.background').animate({
    margin: '0 0 0 0px'
  }, 200);
};

function showedSearchParam(){
  $('.searchParam').css({
    left: '0px'
  });

  $('.background').css({
    margin: '0 0 0 285px'
  });
};

function hidedSearchParam(){
  $('.searchParam').css({
    left: '-285px'
  });

  $('.background').css({
    margin: '0 0 0 0px'
  });
};

let main = function() {
  if ($("#searchStart").hasClass("d-none")) {
    $(".game").addClass("disabled");
    $("#"+$("#game").val()+"").removeClass("disabled");
    $("#submitForm").addClass("disabled");
    showedSearchParam();
  } else {
    $(".game").removeClass("disabled");
    $("#submitForm").removeClass("disabled");
    hidedSearchParam();
  }

  $('.gameLink').click(function() {
    showSearchParam();
  });

  $("#dota2").click(function() {
    $("#game").val("dota2");
    $(".game").removeClass("shadow");
    $(this).addClass("shadow");
  });
  $("#csgo").click(function() {
    $("#game").val("csgo");
    $(".game").removeClass("shadow");
    $(this).addClass("shadow");
  });
  $("#pubg").click(function() {
    $("#game").val("pubg");
    $(".game").removeClass("shadow");
    $(this).addClass("shadow");
  });
  $("#fortnite").click(function() {
    $("#game").val("fortnite");
    $(".game").removeClass("shadow");
    $(this).addClass("shadow");
  });
  $("#lol").click(function() {
    $("#game").val("lol");
    $(".game").removeClass("shadow");
    $(this).addClass("shadow");
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

};



$(document).ready(main);
