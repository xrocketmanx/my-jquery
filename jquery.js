function $(element) {
	var elements = select(element);
	return new jQuery(elements);

	function select(element) {
		if(element === undefined || element === null) {
			return;
		}
		if(isNode(element)) {
			return [element];
		} else if (isNodeList(element)) {
			return element;
		} else if (typeof element === "string") {
			return document.querySelectorAll(element);
		}
	};

	function isNodeList(element) {
		return element.constructor.name === "NodeList";
	};

	function isNode(element) {
		return element.constructor.name.indexOf("HTML") >= 0;
	};
}

function jQuery(elements) {
	if (elements === undefined || elements === null) {
		throw "jquery selector is null or undefined";
	}
	var length = elements.length;

	/************************
	*************************
	Event Handling
	*************************
	************************/
	this.ready = function(handler) {
		addHandlers('DOMContentLoaded', handler);
	};

	this.click = function(handler) {
		addHandlers('click', handler);
	};

	this.mouseenter = function(handler) {
		addHandlers('mouseenter', handler);
	};

	this.mouseleave = function(handler) {
		addHandlers('mouseleave', handler);
	};

	this.hover = function(handlerEnter, handlerLeave) {
		addHandlers({
			mouseenter: handlerEnter,
			mouseleave: handlerLeave
		});
	};

	this.on = function(event, handler) {
		addHandlers(event, handler);
	};

	function addHandlers(event) {
		if (typeof event === "string") {
			var argsLength = arguments.length;
			for (var i = 0; i < length; i++) {
				for (var j = 1; j < argsLength; j++) {
					elements[i].addEventListener(event, arguments[j]);
				}
			}
		} else if (typeof event === "object") {
			for (var i = 0; i < length; i++) {
				for(var key in event) {
					elements[i].addEventListener(key, event[key]);
				}
			}
		}
	};

	/************************
	*************************
	Hide Show
	*************************
	************************/
	var time = 10;

	this.Timer = function(speed, animation, callback) {
		var count = speed / 10;
		var interval = setInterval(function() {
			animation();
			if(count === 0) {
				clearInterval(interval);
				callback();
			}
			count--;
		}, time);
	};
}