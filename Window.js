jsio('import lib.PubSub');
jsio('import std.uri');

var UNIQUE_ID = '__squill__window_id';

var Window = exports = Class(lib.PubSub, function() {
	this.init = function(win) {
		this._win = win || window;
		this._location = new std.uri(this._win.location);
		this._dim = $(this._win);
		$.onEvent(this._win, 'resize', this, 'onViewportChange');
		$.onEvent(this._win, 'scroll', this, 'onViewportChange');
	}
	
	this.onViewportChange = function(e) {
		this._dim = $(this._win);
		this.publish('ViewportChange', e, this._dim);
	}
	
	this.getViewport = function() { return this._dim; }
	
	this.query = function(key) {
		return this._location.query(key);
	}
	
	this.hash = function(key) {
		return this._location.query(key);
	}
});

var gWin = {};
exports.get = function(win) {
	if (!win) { win = window; }
	
	if (win[UNIQUE_ID]) {
		return gWin[win[UNIQUE_ID]];
	} else {
		return gWin[win[UNIQUE_ID]] = new Window(win);
	}
}