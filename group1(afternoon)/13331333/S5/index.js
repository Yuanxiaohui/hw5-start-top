// Generated by LiveScript 1.3.1
(function(){
  var Button, calculator, robot, S5Robot, clickButtonToGetNumber, clickInforBarToShowResult, moveOutToReset;
  Button = (function(){
    /*构造函数添加了good-messages和bad-messages*/
    Button.displayName = 'Button';
    var prototype = Button.prototype, constructor = Button;
    function Button(dom, goodMessages, badMessages, numberGotCallback){
      var this$ = this;
      this.dom = dom;
      this.goodMessages = goodMessages;
      this.badMessages = badMessages;
      this.numberGotCallback = numberGotCallback;
      this.state = 'unclicked';
      this.succeed = false;
      this.dom.addClass('enabled');
      this.name = this.dom.text();
      this.dom.find('.unread').addClass('hidden');
      this.dom.click(function(){
        if (this$.dom.hasClass('enabled') && this$.state === 'unclicked') {
          this$.constructor.disableAllOtherButtons(this$);
          this$.wait();
          $.get('/', function(number){
            var error;
            if (Math.random() > this$.constructor.failRate) {
              this$.showNumber(number);
              this$.constructor.enableAllOtherButtons(this$);
              this$.showMessage();
              this$.succeed = true;
              if (this$.constructor.allButtonIsSucceed()) {
                this$.constructor.allNumberIsGotCallback();
              }
              this$.numberGotCallback(error = null, number);
            } else {
              this$.numberGotCallback({
                message: this$.badMessages,
                data: number
              });
            }
          });
        }
      });
      this.constructor.buttons.push(this);
    }
    Button.buttons = [];
    Button.failRate = 0.2;
    Button.disableAllOtherButtons = function(thisButton){
      var i$, ref$, len$, button;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        if (button !== thisButton && button.state !== 'clicked') {
          button.disable();
        }
      }
    };
    Button.enableAllOtherButtons = function(thisButton){
      var i$, ref$, len$, button;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        if (button !== thisButton && button.state !== 'clicked') {
          button.enable();
        }
      }
    };
    /*这个函数为S1-S4时所使用的判断是否全部得到数字，但由于这里会处理失败，所以重写了一个判断是否全部处理成功的函数*/
    /*@all-button-is-got = ->
        [return false for button in @buttons when button.state is 'unclicked']
        return true*/
    Button.allButtonIsSucceed = function(){
      var i$, ref$, len$, button;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        if (button.succeed === false) {
          return false;
        }
      }
      return true;
    };
    Button.resetAllButtons = function(){
      var i$, ref$, len$, button;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        button.reset();
      }
    };
    prototype.wait = function(){
      this.state = 'clicked';
      this.dom.find('.unread').text("...").removeClass('hidden');
    };
    prototype.disable = function(){
      this.state = 'can-not-click';
      this.dom.removeClass('enabled').addClass('disabled');
    };
    prototype.enable = function(){
      this.state = 'unclicked';
      this.dom.removeClass('disabled').addClass('enabled');
    };
    prototype.showNumber = function(number){
      this.dom.addClass('disabled');
      this.dom.find('.unread').text(number);
    };
    prototype.showMessage = function(){
      var bubble;
      bubble = $('#info-bar');
      bubble.find('.speaking').text(this.name + ": " + this.goodMessages);
    };
    prototype.reset = function(){
      this.state = 'unclicked';
      this.succeed = false;
      this.dom.removeClass('disabled').addClass('enabled');
      this.dom.find('.unread').text("").addClass('hidden');
    };
    return Button;
  }());
  /*计算总和*/
  calculator = {
    Sum: 0,
    add: function(number){
      return this.Sum += parseInt(number);
    },
    reset: function(){
      this.Sum = 0;
    }
  };
  /*robot机器人, 由于不知道该怎么设计robot，此部分是仿造老师的代码的*/
  robot = {
    initial: function(){
      this.sequence = ["A", "B", "C", "D", "E"];
      this.index = 0;
      this.buttons = $('#control-ring .button');
      return this.bubble = $('#info-bar');
    },
    disorderSequence: function(){
      this.sequence.sort(function(){
        return Math.random() > 0.5;
      });
    },
    showSequence: function(){
      $('#info-bar').find('.sequence').text(this.sequence.join(', '));
    },
    clickButtonBySequence: function(){
      if (this.index === this.sequence.length) {
        this.bubble.click();
      } else {
        this.getNextButton().click();
      }
    },
    getNextButton: function(){
      return this.buttons[this.sequence[this.index++].charCodeAt() - 'A'.charCodeAt()];
    }
  };
  S5Robot = function(){
    var atPlus;
    atPlus = $('#button .apb');
    atPlus.click(function(){
      robot.disorderSequence();
      robot.showSequence();
      robot.clickButtonBySequence();
    });
  };
  /*点击生成button对象,由于需要自动点击，所以改为参数为robot的点击函数的函数*/
  clickButtonToGetNumber = function(next){
    var goodMessages, badMessages, buttons, i$, len$, results$ = [];
    goodMessages = ['这是个天大的秘密', '我不知道', '你不知道', '他不知道', '才怪'];
    badMessages = ['这不是个天大的秘密', '我知道', '你知道', '他知道', '才不怪'];
    buttons = $('#control-ring .button');
    for (i$ = 0, len$ = buttons.length; i$ < len$; ++i$) {
      results$.push((fn$.call(this, i$, buttons[i$])));
    }
    return results$;
    function fn$(i, dom){
      var button;
      return button = new Button($(dom), goodMessages[i], badMessages[i], function(error, number){
        var bubble;
        if (error) {
          bubble = $('#info-bar');
          bubble.find('.speaking').text("来自" + button.name + "的处理错误, 错误信息为: " + error.message);
          number = error.data;
        } else {
          calculator.add(number);
          next();
        }
      });
    }
  };
  /*点击info-bar显示*/
  clickInforBarToShowResult = function(){
    var bubble;
    bubble = $('#info-bar');
    bubble.addClass('disabled');
    Button.allNumberIsGotCallback = function(){
      return bubble.removeClass('disabled').addClass('enabled');
    };
    bubble.click(function(){
      if (bubble.hasClass('enabled')) {
        bubble.removeClass('enabled').addClass('disabled');
        bubble.find('.speaking').text("楼主异步调用战斗力感人，目测不超过" + calculator.Sum);
        bubble.find('.amount').text(calculator.Sum);
      }
    });
  };
  /*移开区域时重置*/
  moveOutToReset = function(){
    var area;
    area = $('#bottom-positioner');
    area.on('mouseleave', function(event){
      Button.resetAllButtons();
      $('#info-bar').removeClass('enabled').addClass('disabled');
      $('#info-bar').find('.amount').text('');
      $('#info-bar').find('.sequence').text('');
      $('#info-bar').find('.speaking').text('');
      robot.initial();
      calculator.reset();
    });
  };
  window.onload = function(){
    clickButtonToGetNumber(function(){
      robot.clickButtonBySequence();
    });
    clickInforBarToShowResult();
    moveOutToReset();
    robot.initial();
    S5Robot();
  };
}).call(this);
