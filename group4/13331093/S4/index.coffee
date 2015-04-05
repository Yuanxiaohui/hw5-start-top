$(document).ready ->
    robot.create()
    reset()
    AddClickEventToButton(robot)
    AddClickEventToButton()
    AddClickEventToBubble()
    AddClearEvent()
    AddClickEventToApb()

class Button
    FAILRATE = 0
    constructor: (dom, @goodMessages, @badMessages, @numberFetchhCallBack) ->
        @name = dom[0].title
        @reddot = dom.children()[0]
        dom.click =>
            return if @reddot.innerHTML == '...' or dom.hasClass 'disable'
            @reddot.hidden = false
            @reddot.innerHTML = '...'
            otherButtons = GetOtherButtons()
            DisableButton i for i in otherButtons
            GetNumberAndShow()
            console.log "Click on ", @name

        GetOtherButtons = ->
            otherButtons = []
            buttons = GetAllButton()
            [otherButtons.push i if i != dom[0]] for i in buttons
            otherButtons

        GetNumberAndShow = ->
            $.get '/api/random', (number, result) ->
                return if not isvalid()
                DisableButton dom
                dom.children()[0].innerHTML = number
                EnableUnclickButton()
                CheckAllButtonClick()
                SuccessOrFail()

        isvalid = ->
            return false if dom.children()[0].innerHTML != '...' or dom.hasClass('disable')
            return true

        EnableUnclickButton = ->
            buttons = GetAllButton()  
            [EnableButton i if i.children[0].innerHTML == ""] for i in buttons

        CheckAllButtonClick = ->
            buttons = GetAllButton()
            check = true
            [check = false if $(i).hasClass 'enable'] for i in buttons
            enableBubble() if check

        SuccessOrFail = =>
            if Math.floor(Math.random()*10) > FAILRATE
                ShowMessage()
                @numberFetchhCallBack null, @name
            else
                @numberFetchhCallBack @badMessages, @name
            return

        ShowMessage = => console.log "Button #{@name} say: #{@goodMessages}"

DisableButton = (button) -> $(button).removeClass "enable" ; $(button).addClass "disable"

EnableButton = (button) -> $(button).removeClass "disable" ; $(button).addClass "enable"

GetAllButton = -> $ '.button'

enableBubble = -> $('#info-bar').removeClass 'disable' ; $('#info-bar').addClass 'enable'

disableBubble = -> $('#info-bar').removeClass 'enable' ; $('#info-bar').addClass 'disable'

resetBubble = -> disableBubble() ; $('#info-bar span')[0].innerHTML = ""

resetButton = ->
    [i.hidden = true, i.innerHTML = ""] for i in $('.button span')
    buttons = GetAllButton()
    EnableButton i for i in buttons

reset = ->
    resetButton()
    resetBubble()
    resetRobot()
    $('#info-bar span')[1].innerHTML = ''

AddClearEvent = ->
    $('#at-plus-container').mouseleave ->
        reset()
    $('#at-plus-container').mouseenter ->
        reset()

AddClickEventToBubble = ->
    bubble = $('#info-bar')
    bubbletext = $('#info-bar span')[0]

    Calculate = ->
        buttons = GetAllButton()
        sum = 0
        sum += parseInt i.children[0].innerHTML for i in buttons
        return sum

    bubble.click ->
        return if bubble.hasClass 'disable'
        bubbletext.innerHTML = Calculate()
        disableBubble()

AddClickEventToButton = (robot) ->
    buttons = GetAllButton()
    goodMessages = ['这是个天大的秘密', '我不知道', '你不知道', '他不知道', '才怪']
    badMessages = ['这不是个天大的秘密', '我知道', '你知道', '他知道', '才不怪']
    for button, i in buttons
        tem = new Button $(button), goodMessages[i], badMessages[i], (error, name) ->
            console.log "Handle error from #{name}, message is: #{error}" if error
            robot.ClickNext()  if robot
                

resetRobot = ->
    robot.sequence = ['A','B','C','D','E']
    robot.cursor = 0
    robot.running = false

robot =
  create : ->
    @buttons = $ '#control-ring .button'
    @bubble = $ '#info-bar'
    @sequence = ['A','B','C','D','E']
    @cursor = 0
    @running = false

  ClickNext: ->
    return if not @running
    if @cursor == @sequence.length
        @bubble.click()
        @cursor = 0
        @running = false
        return
    if $(@buttons[@sequence[@cursor].charCodeAt() - 'A'.charCodeAt()]).hasClass "disable"
        @cursor++
        @ClickNext()
    else
        @GetNextButton().click()

  GetNextButton: -> @buttons[@sequence[@cursor++].charCodeAt() - 'A'.charCodeAt()]


  ShuffleOrder: -> @sequence.sort -> 0.5 - Math.random()

  ShowOrder: -> $('#info-bar span')[1].innerHTML = @sequence.join ', '

AddClickEventToApb = ->
    $('#button .apb').click ->
      return if robot.running is true
      robot.ShuffleOrder()
      robot.ShowOrder()
      robot.running = true
      robot.ClickNext()
