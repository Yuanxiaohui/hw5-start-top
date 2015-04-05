// Generated by LiveScript 1.3.1
(function(){
  var Button, setAllButtons, setLargeBubble, setApb, robot, clickButtonsSeriallyInRandomOrder;
  Button = (function(){
    Button.displayName = 'Button';
    var prototype = Button.prototype, constructor = Button;
    Button.buttons = [];
    Button.enableOtherButtons = function(thisButton){
      var i$, ref$, len$, btn, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        btn = ref$[i$];
        if (btn !== thisButton && btn.state !== 'done') {
          results$.push(btn.enable());
        }
      }
      return results$;
    };
    Button.disableOtherButtons = function(thisButton){
      var i$, ref$, len$, btn, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        btn = ref$[i$];
        if (btn !== thisButton && btn.state !== 'done') {
          results$.push(btn.disable());
        }
      }
      return results$;
    };
    Button.checkAllButtons = function(){
      var i$, ref$, len$, btn;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        btn = ref$[i$];
        if (btn.state !== 'done') {
          return false;
        }
      }
      return true;
    };
    Button.clearAll = function(){
      var i$, ref$, len$, btn;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        btn = ref$[i$];
        btn.clear();
      }
    };
    function Button(dom, goodMessage, badMessage){
      var this$ = this;
      this.dom = dom;
      this.goodMessage = goodMessage;
      this.badMessage = badMessage;
      this.state = 'enabled';
      this.dom.removeClass('disabled').addClass('enabled');
      this.name = this.dom.text();
      this.dom.click(function(){
        var number;
        if (this$.state === 'enabled') {
          this$.constructor.disableOtherButtons(this$);
          number = this$.dom.find('.number');
          number.text("...");
          number.css("visibility", "visible");
          this$.getAndShowNumber();
        }
      });
      this.constructor.buttons.push(this);
    }
    prototype.enable = function(){
      this.dom.removeClass('disabled').addClass('enabled');
    };
    prototype.disable = function(){
      this.dom.removeClass('enabled').addClass('disabled');
    };
    prototype.done = function(){
      this.state = 'done';
    };
    prototype.clear = function(){
      var number;
      number = this.dom.find('.number');
      number.css("visibility", "hidden");
      this.state = 'enabled';
      this.dom.removeClass('disabled').addClass('enabled');
    };
    prototype.getAndShowNumber = function(){
      var this$ = this;
      $.get('/', function(number){
        this$.disable();
        this$.number = number;
        this$.showNumber();
        this$.done();
        if (this$.constructor.checkAllButtons()) {
          this$.constructor.allButtonsSetCallback();
        }
        this$.constructor.enableOtherButtons(this$);
        this$.constructor.thisButtonClickCallback();
      });
    };
    prototype.showNumber = function(){
      this.dom.find('.number').text(this.number);
    };
    prototype.showMessage = function(msg){
      console.log(this.name + " says: " + msg);
    };
    return Button;
  }());
  $(function(){
    setAllButtons();
    setLargeBubble();
    setApb();
    robot.init();
    return clickButtonsSeriallyInRandomOrder();
  });
  setAllButtons = function(){
    var i$, ref$, len$;
    for (i$ = 0, len$ = (ref$ = $('#control-ring .button')).length; i$ < len$; ++i$) {
      (fn$.call(this, i$, ref$[i$]));
    }
    function fn$(i, btn){
      var button;
      button = new Button($(btn));
    }
  };
  setLargeBubble = function(){
    var largeBubble, this$ = this;
    largeBubble = $('#info-bar');
    largeBubble.state = 'disabled';
    Button.allButtonsSetCallback = function(){
      largeBubble.state = 'enabled';
    };
    largeBubble.click(function(){
      var total, i$, ref$, len$, btn;
      if (largeBubble.state === 'enabled') {
        total = 0;
        for (i$ = 0, len$ = (ref$ = Button.buttons).length; i$ < len$; ++i$) {
          btn = ref$[i$];
          total += parseInt(btn.number);
        }
        largeBubble.find('#sum').text(total);
        largeBubble.state = 'disabled';
      }
    });
  };
  setApb = function(){
    $('#button').on('mouseleave', function(event){
      Button.clearAll();
      $('#sum').text('');
      $('#show-order-sequence').text('');
    });
  };
  robot = {
    init: function(){
      this.buttons = $('#control-ring .button');
      this.largeBubble = $('#info-bar');
      this.orderSequence = ["A", "B", "C", "D", "E"];
      this.cur = 0;
    },
    shuffle: function(){
      this.orderSequence.sort(function(){
        return 0.5 - Math.random();
      });
    },
    nextButton: function(){
      var i;
      i = this.orderSequence[this.cur++].charCodeAt() - 'A'.charCodeAt();
      return this.buttons[i];
    },
    clickNext: function(){
      if (this.cur !== this.buttons.length) {
        this.nextButton().click();
      } else {
        this.largeBubble.click();
      }
    },
    showOrder: function(){
      var sequenceStr;
      sequenceStr = this.orderSequence.join(',');
      this.largeBubble.find('#show-order-sequence').text(sequenceStr);
    }
  };
  clickButtonsSeriallyInRandomOrder = function(){
    $('#button .apb').click(function(){
      robot.shuffle();
      robot.showOrder();
      Button.thisButtonClickCallback = function(){
        robot.clickNext();
      };
      robot.clickNext();
    });
  };
}).call(this);
