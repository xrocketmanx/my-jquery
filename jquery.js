function $(element) {
	var elements = select(element);
	return new jQuery(elements);

	function select(element) {
		if (element === undefined || element === null) {
			return;
		}
		if (isNode(element)) {
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
				for (var key in event) {
					elements[i].addEventListener(key, event[key]);
				}
			}
		}
	}

	/************************
	*************************
	Timer Functions
	*************************
	************************/
	this.Hide = function() {
		return this;
	}

	function Timer(func, speed, callback) {
		var timeout = 10;
		var count = speed / timeout;
		var interval = setInterval(function() {
			func();
			if (count < 1) {
				clearInterval(interval);
				callback();
			} else {
				count--;
			}
		}, timeout);
	}

	/************************
	*************************
	Dom Manipulating
	*************************
	************************/
	//refactor:
	this.css = function(style, value) {
		changeStyle(style, value);
	};

	function changeStyle(style, value) {
		if (typeof style === "string") {
			if (value.indexOf("+=") === 0) {
				var delta = value.slice(2, value.length - 2);
				for (var i = 0; i < length; i++) {
					var oldStyle = elements[i].style[style];
					var oldValue = oldStyle.slice(0, oldStyle.length - 2);
					elements[i].style[style] = Number(oldValue) + Number(delta) + "px";
					alert(elements[i].style[style]);
				}
			} else {
				for (var i = 0; i < length; i++) {
					elements[i].style[style] = value;
				}
			}
		} else if (typeof style === "object") {
			for (var i = 0; i < length; i++) {
				for (var key in style) {
					elements[i].style[key] = style[key];
				} 			
			}
		}
	}
}