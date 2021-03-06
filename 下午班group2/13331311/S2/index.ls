calculater =
    sum : 0
    add : (number) ->
        @sum += parse-int number
    reset : ->
        @sum = 0

class Button
    buttons : []

    disable : !-> 
        @state = 'disable'
        @button.add-class 'disable'
        @button.remove-class 'enable'
    wait : !->
        @button.find '.unread' .add-class 'getting';
        @state = 'waiting'
        @button.add-class 'waiting'
        @button.remove-class 'enable'
    done : !->
        @state = 'done'
        @button.add-class 'done'
        @button.remove-class 'waiting'
    enable : !->
        @state = 'enable'
        @button.add-class 'enable'
        @button.remove-class 'disable'
    reset : !->
        @state = 'enable'
        @button.remove-class 'disable wating done'
        @button.add-class  'enable'
        @button.find '.unread' .text '...'
        @button.find '.unread' .remove-class 'getting'

    disable-other-buttons : (this-button)-> 
        for button in @buttons
            when button isnt this-button and button.state isnt 'done'
                button.disable!
    enable-other-buttons : (this-button)-> 
        for button in @buttons
            when button isnt this-button and button.state isnt 'done'
                button.enable!

    all-buttons-are-done : ->
        for button in @buttons
            when button.state != 'done'
                return false
        return true

    show-number : (number) !->
        @button.find '.unread' .text number

    get-and-show-number : !->
        $.get '/', (number, result) !~>
            @done!
            @enable-other-buttons @
            @show-number number
            @number-got-callback number
            if @all-buttons-are-done!
                bubble = $ '.info'
                bubble.remove-class 'disable'
                bubble.add-class 'enable'
                bubble.click!

    reset-all-buttons : !->
        for button in @buttons
            button.reset!

    (@button, @number-got-callback) ->
        @state = 'enable'
        @name = @button.find '.title' .text!
        @button.add-class 'enable'
        @button.click !~>
            if @state is 'enable'
                @disable-other-buttons @
                @wait!
                @get-and-show-number!
        @buttons.push @

add-click-to-all-buttons = (robot-next) ->
    for let dom, i in $ '#control-ring .button'
        button = new Button ($ dom), (number) !->
            calculater.add number
            robot-next?!

add-calculater-to-bubble = ->
    bubble = $ '.info'
    bubble.add-class 'disable'
    bubble.click !->
        if bubble.has-class 'enable'
            bubble.find '#result' .text calculater.sum
            bubble.remove-class 'enable'
            bubble.add-class 'disable'

add-clear-to-this-erea = !->
    is-enter-other = false
    $ '.info, #button' .on 'mouseenter' !->
        is-enter-other := true
    $ '.info, #button' .on 'mouseleave' !->
        is-enter-other := false
        set-timeout !->
            if not is-enter-other
                calculater.reset!
                bubble = $ '.info'
                bubble.find '#result' .text ''
                Button.prototype.reset-all-buttons!
                Robot.current = 0;
        , 0

Robot = 
    initial : !->
        @buttons = $ '#control-ring .button'
        @bubble = $ '.info'
        @order = ['A' to 'E']
        @current = 0
    get-next-button : ->
        index = @order[@current].char-code-at! - 'A'.char-code-at!
        @current++;
        @buttons[index]
    click-next-button : !->
        console.log "#{@current}"
        if @current is @order.length
            @bubble.click!
        else @get-next-button!click!

add-robot-click-order = !-> $ '#button .apb' .click !-> Robot.click-next-button!

$ ->
    Robot.initial!
    add-click-to-all-buttons !-> Robot.click-next-button!
    add-calculater-to-bubble!
    add-clear-to-this-erea!
    add-robot-click-order!