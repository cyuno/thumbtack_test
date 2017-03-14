var SlotMachine=function(el){
	this.machine=el;
	this.reels=[];
	this.winnings='';
	this.winningCombinations={
		'coffeemaker|coffefileter|coffeeground|':'coffee',
		'teapot|teastrainer|loosetea|':'tea',
		'espressomachine|espressotamper|espressobean|':'espresso'
	};
	var _this=this;
	var els=el.find('.reel .choices');
	
	els.each(function(n){
		_this.reels[n]=new Reel($(this),n);
	});
	$(document).on('click','#spin',function(){
		_this.reset()
		_this.start();
	});
	$(document).on('click','#cheat',
	function(event){
		event.preventDefault();
		_this.rig_the_game();
	});
	$(document).on('reel:donespinning',
	function (evt, n,choice){
		_this.winnings+=choice+'|';
		if(_this.winningCombinations[_this.winnings])
		$(document).trigger('new:winner',[_this.winningCombinations[_this.winnings]]);
		if(n===_this.reels.length-1)$(
		'#spin').attr('disabled',false),$('#cheat').fadeIn();
		});
		
	$(document).on('new:winner',function(
	evt, winnings){
		_this.machine.append('<div id="winner">You just won a lot of cups of ' + winnings + '!</div>');
		(function blink(){
			$('#winner').delay(100).fadeTo(
			100,0.2).delay(100).fadeTo(100,1,blink)
			})()//This is what happens when browsers don't support <blink>
		});
	};
	SlotMachine.prototype.start = function () {
	$('#spin').attr('disabled', true);
	$('#cheat').hide();
	for (var i = 0; i < this.reels.length; i++) {
		this.reels[i].scroll();
	}	
};

SlotMachine.prototype.reset = function () {
	$('#winner').remove();
	this.winnings = '';
	for (var i = 0; i < this.reels.length; i++) {
		this.reels[i].reset();
	}	
};

SlotMachine.prototype.rig_the_game = function () {
	this.reset();
	for (var i = 0; i < this.reels.length; i++) {
		var reel = this.reels[i];
		if (i === 0) reel.maxSpins = 10;
		else if (i === 1) reel.maxSpins = 13;
		else reel.maxSpins = 16;
		reel.el.find('#espressomachine').appendTo(reel.el);
		reel.el.find('#espressotamper').appendTo(reel.el);
		reel.el.find('#espressobean').appendTo(reel.el);
		reel.counter = 0;
	}
	this.start();
};

var Reel = function (el, n) {
    this.el = el;
	this.slotNumber = n;
	this.speed = 100;
	this.topOffset = (this.el.find('li:first').height()*-1) + 'px';
	this.reset();
}

Reel.prototype.scroll = function () {
    var _this = this;
    _this.el.animate({
        top: _this.topOffset
    }, _this.speed, 'linear', function () {
        _this.el.css('top', '0px').find('li:first').appendTo(_this.el);
        if (_this.counter++ < _this.maxSpins) _this.scroll();
		else $(document).trigger('reel:donespinning', [_this.slotNumber, _this.el.find('li:first').attr('id')]);
    });
};

Reel.prototype.reset = function () {
	this.maxSpins = ((Math.random() * 1000) + (this.slotNumber * 1000))/this.speed;
	this.counter = 0;
};

var machine = new SlotMachine($('#slotMachine'));