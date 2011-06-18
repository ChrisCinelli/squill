jsio('import std.js as JS');
jsio('import .Widget');
jsio('import .Events');
jsio('import math2D.Point as Point');
jsio('from util.browser import $');
jsio('import .Window');

var Dialog = exports = Class(Widget, function(supr) {
	this.init = function(params) {
		var params = JS.merge(params, {
			draggable: true,
			closeable: true
		});
		
		params.style = JS.merge(params.style, {
			position: 'absolute',
			top: '10px',
			left: '10px'
		});
		
		supr(this, 'init', [params]);
	}
	
	this.buildContent = function() {
		$.addClass(this._el, 'dialog');
		
		this._titlebar = $({
			className: 'titlebar',
			text: this._def.title,
			parent: this._el
		});
		
		if (this._params.closeable) {
			this._closeBtn = $({
				className: 'closeBtn',
				text: 'x'
			});
			
			this._titlebar.insertBefore(this._closeBtn, this._titlebar.firstChild);
			
			$.onEvent(this._closeBtn, 'click', this, function() {
				this.dismiss(null);
			});
		}
		
		this.initDragEvents(this._titlebar);
		
		supr(this, 'buildContent');
	}
	
	this.onDrag = function(dragEvt, moveEvt, delta) {
		if (!dragEvt.data) {
			dragEvt.data = new Point(parseInt(this._el.style.left), parseInt(this._el.style.top));
		}
		
		var pos = Point.add(dragEvt.data, Point.subtract(dragEvt.currPt, dragEvt.srcPt)),
			dim = Window.get().getViewport();
		
		this._el.style.left = Math.max(0, pos.x) + 'px';
		this._el.style.top = Math.max(0, pos.y) + 'px';
	}
	
	this.dismiss = function(data) {
		$(this._el);
		this.publish('Close');
		this._delegate && this._delegate(null, {
			action: 'closed',
			data: data
		});
	}
});
