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

	this.ready = function(handler) {
		for (var i = 0; i < length; i++) {
			elements[i].addEventListener('DOMContentLoaded', handler);
		}
	};

	this.click = function(handler) {
		for (var i = 0; i < length; i++) {
			elements[i].addEventListener('click', handler);
		}
	};

	this.mousenter = function(handler) {
		for (var i = 0; i < length; i++) {
			elements[i].addEventListener('mouseenter', handler);
		}
	};

	this.mouseleave = function(handler) {
		for (var i = 0; i < length; i++) {
			elements[i].addEventListener('mouseleave', handler);
		}
	};

	this.hover = function(handlerEnter, handlerLeave) {
		for (var i = 0; i < length; i++) {
			elements[i].addEventListener('mouseenter', handlerEnter);
			elements[i].addEventListener('mouseleave', handlerLeave);
		}
	};

	this.on = function(event, handler) {
		if (typeof event === "string") {
			for (var i = 0; i < length; i++) {
				elements[i].addEventListener(event, handler);
			}
		} else if (typeof event === "object") {
			for (var i = 0; i < length; i++) {
				for(var key in event) {
					elements[i].addEventListener(key, event[key]);
				}
			}
		}
	};
}