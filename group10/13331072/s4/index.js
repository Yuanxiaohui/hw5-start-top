// Generated by LiveScript 1.3.1
(function(){
  var getnumber, enable_other_button, disable_other_button, show_number, all_button_done, button_click, add_button_click, add_info_click, reset_number, reset_buttons, reset_info, reset, robot, robot_action;
  getnumber = function(this_id, callback){
    var request;
    request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if (request.readyState === 4 && request.status === 200) {
        $("#" + this_id)[0].innerHTML = request.responseText;
        enable_other_button(this_id);
        if (all_button_done()) {
          add_info_click();
        }
        return typeof callback == 'function' ? callback() : void 8;
      }
    };
    request.open("GET", "/" + this_id, true);
    return request.send();
  };
  enable_other_button = function(this_id){
    var lis, number, i$, i, results$ = [];
    lis = $(".plank");
    number = $(".number");
    for (i$ = 0; i$ <= 4; ++i$) {
      i = i$;
      if (number[i].classList.contains("appear") && this_id !== -1) {
        results$.push(lis[i].style.backgroundColor = 'gray');
      } else {
        results$.push(lis[i].style.backgroundColor = 'rgba(48,63,159,.8)');
      }
    }
    return results$;
  };
  disable_other_button = function(this_id){
    var lis, i$, i, results$ = [];
    lis = $(".plank");
    for (i$ = 0; i$ <= 4; ++i$) {
      i = i$;
      if (i !== this_id) {
        results$.push(lis[i].style.backgroundColor = 'gray');
      }
    }
    return results$;
  };
  show_number = function(this_id){
    var number;
    number = $(".number");
    number[this_id].classList.remove("disappear");
    return number[this_id].classList.add("appear");
  };
  all_button_done = function(){
    var number, i$, i;
    number = $(".number");
    for (i$ = 0; i$ <= 4; ++i$) {
      i = i$;
      if (number[i].innerHTML === "...") {
        return false;
      }
    }
    return true;
  };
  button_click = function(this_id){
    var buttons, number, lis;
    buttons = $(".letter");
    number = $(".number");
    lis = $(".plank");
    if (number[this_id].style.display === "block") {
      return;
    }
    if (lis[this_id].style.backgroundColor === "gray") {
      return;
    }
    show_number(this_id);
    disable_other_button(this_id);
    getnumber(this_id, buttons[this_id].callback);
  };
  add_button_click = function(){
    var buttons, i$, i, results$ = [];
    buttons = $(".letter");
    for (i$ = 0; i$ <= 4; ++i$) {
      i = i$;
      buttons[i].Index = i;
      results$.push(buttons[i].onclick = fn$);
    }
    return results$;
    function fn$(){
      return button_click(this.Index);
    }
  };
  add_info_click = function(){
    var buttons;
    buttons = $(".letter");
    return $('#info-bar')[0].onclick = function(){
      var number, k, i$, i;
      if (all_button_done() !== true) {
        return;
      }
      number = $(".number");
      k = 0;
      for (i$ = 0; i$ <= 4; ++i$) {
        i = i$;
        k += parseInt(number[i].innerHTML);
      }
      return $('#big')[0].innerHTML = k;
    };
  };
  reset_number = function(){
    var number, i$, i, results$ = [];
    number = $('.number');
    for (i$ = 0; i$ <= 4; ++i$) {
      i = i$;
      number[i].innerHTML = '...';
      number[i].classList.add("disappear");
      results$.push(number[i].classList.remove("appear"));
    }
    return results$;
  };
  reset_buttons = function(){
    enable_other_button(-1);
    return reset_number();
  };
  reset_info = function(){
    return $('#big')[0].innerHTML = "";
  };
  reset = function(){
    reset_buttons();
    reset_info();
    $(".apb")[0].state = 'enable';
    return robot.state = 'enable';
  };
  robot = function(){
    return $(".apb")[0].onclick = function(){
      return robot_action();
    };
  };
  robot_action = function(){
    var buttons, order, information, i$;
    if (robot.state !== 'disable') {
      robot.state = 'disable';
      buttons = $(".letter");
      order = [0, 1, 2, 3, 4];
      information = ["A", "B", "C", "D", "E"];
      order.sort(function(){
        return 0.5 - Math.random();
      });
      $('#big')[0].innerHTML = information[order[0]] + information[order[1]] + information[order[2]] + information[order[3]] + information[order[4]];
      for (i$ = 0; i$ <= 3; ++i$) {
        (fn$.call(this, i$));
      }
      buttons[order[4]].callback = function(){
        return $('#info-bar')[0].click();
      };
      return buttons[order[0]].click();
    }
    function fn$(i){
      buttons[order[i]].callback = function(){
        return buttons[order[i + 1]].click();
      };
    }
  };
  window.onload = function(){
    reset();
    robot();
    add_button_click();
    add_info_click();
    return $('#at-plus-container')[0].onmouseleave = reset;
  };
}).call(this);
