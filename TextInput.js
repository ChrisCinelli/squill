jsio('from util.browser import $');
jsio('import .Widget, .global');

var TextInput = exports= Class(Widget, function(supr) {
	this._type = 'text';
	this._css = 'textInput';
	this._class = global.getWidgetPrefix() + this._css;
	
	this.buildWidget = function() {
		var el = this._el,
			type = this._params.type,
			label = this.getI18n('label') || '',
			value = this.getI18n('value') || '';
		
		$.style(el, {position: 'relative'});
		
		this._input = $.create({
			tag: 'input',
			attrs: {
				type: type || this._type,
				value: value,
				name: this._name
			},
			parent: el
		});
		
		if ('ontouchstart' in this._el) {
			this._overlay = $({
				parent: this._el,
				attrs: {
					noCapture: true
				},
				style: {
					position: 'absolute',
					top: '0px',
					background: 'blue',
					left: '0px',
					width: '100%',
					height: '100%',
					zIndex: 1
				}
			});
			
			this._overlay.addEventListener('click', bind(this, function() {
				$.hide(this._overlay);
				this._input.focus();
			}), true);
		}
		
		if (this._input.getAttribute('placeholder') === null) {
			this._input.setAttribute('placeholder', label);
		} else {
			this._label = $.create({
				tag: 'button',
				text: label,
				className: global.getWidgetPrefix() + 'textInputLabel',
				style: {position: 'absolute'},
				parent: el
			});	
		}
		
		this.initMouseEvents(el);
		this.initFocusEvents(this._input);
		this.initKeyEvents(this._input);
	}
	
	this.setName = function(name) {
		supr(this, 'setName', arguments);
		
		if (this._input) { this._input.name = name; }
	}
	
	this.setValue = function(value) { this._value = this._input.value = value; }
	this.getValue = function() { return this._input.value; }
	
	this.onKeyDown = function() {
		supr(this, 'onKeyDown', arguments);
		if (this._label) { $.hide(this._label); }
	}
	
	this.onKeyUp = function() {
		supr(this, 'onKeyUp', arguments);
		this.checkLabel();
		this.checkValue();
	}
	
	this.onKeyPress = function(e) {
		supr(this, 'onKeyPress', arguments);
		if (e.keyCode == 13) {
			this.publish('EnterPressed');
		}
		this.checkValue();
	}
	
	this.onBlur = function() {
		supr(this, 'onBlur');
		this.checkLabel();
		
		if (this._overlay) {
			$.show(this._overlay);
		}
	}
	
	this.checkValue = function() {
		if (this._value != this._input.value) {
			this._value = this._input.value;
			this.publish('ValueChange', this._value);
		}
	}
	
	this.checkLabel = function() {
		if(this._label && /^\s*$/.test(this._input.value)) {
			$.show(this._label);
		}
	}
	
	this.onClick = function() {
		supr(this, 'onClick');
		
		//setTimeout(bind(this._input, 'focus'), 100);
	}
});

Widget.register(TextInput, 'TextInput');
