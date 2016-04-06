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

	this.hide = function(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getNormalPrefix);
		var opacityDeltas = getStyleDeltas('opacity', '0', count, getNormalPrefix);
		changeStyleAll('overflow', 'hidden');
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addSize(elements[i], heightDeltas[i]);
				addStyleValue(elements[i], 'opacity', opacityDeltas[i]);
			}
		}, 
		count, 
		function() {
			for (var i = 0; i < length; i++) {
				setHeight(elements[i], '');
			}
			changeStyleAll({
				opacity: '',
				display: 'none',
				overflow: ''
			});
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.show = function(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getReversedPrefix);
		var opacityDeltas = getStyleDeltas('opacity', '0', count, getReversedPrefix);
		for (var i = 0; i < length; i++) {
			setHeight(elements[i], '0px');
		}
		changeStyleAll({
			opacity: '0',
			display: '',
			overflow: 'hidden'
		});
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addSize(elements[i], heightDeltas[i]);
				addStyleValue(elements[i], 'opacity', opacityDeltas[i]);
			}
		}, 
		count, 
		function() {
			for (var i = 0; i < length; i++) {
				setHeight(elements[i], '');
			}
			changeStyleAll({
				opacity: '',
				overflow: ''
			});
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.toggle = function(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getDisplayBasedPrefix);
		var opacityDeltas = getStyleDeltas('opacity', '0', count, getDisplayBasedPrefix);
		changeStyleAll('overflow', 'hidden');
		for (var i = 0; i < length; i++) {
			if (getStyleValue(elements[i], 'display') === 'none') {
				setStyle(elements[i], 'display', parseStyleValue(''));
				setStyle(elements[i], 'opacity', parseStyleValue('0'));
				setHeight(elements[i], '0px');
			}
		}
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addSize(elements[i], heightDeltas[i]);
				addStyleValue(elements[i], 'opacity', opacityDeltas[i]);
			}
		}, 
		count, 
		function() {
			for (var i = 0; i < length; i++) {
				if (getStyleValue(elements[i], 'opacity') === '0') {
					setStyle(elements[i], 'display', parseStyleValue('none'));
				}
				setHeight(elements[i], '');
			}
			changeStyleAll({
				opacity: '',
				'overflow': ''
			});
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.fadeToggle = function(speed, callback) {
		var count = getCount(speed);
		var opacityDeltas = getStyleDeltas('opacity', '0', count, getDisplayBasedPrefix);
		for (var i = 0; i < length; i++) {
			if (getStyleValue(elements[i], 'display') === 'none') {
				setStyle(elements[i], 'display', parseStyleValue(''));
				setStyle(elements[i], 'opacity', parseStyleValue('0'));
			}
		}
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addStyleValue(elements[i], 'opacity', opacityDeltas[i]);
			}
		}, 
		count, 
		function() {
			for (var i = 0; i < length; i++) {
				if (getStyleValue(elements[i], 'opacity') === '0') {
					setStyle(elements[i], 'display', parseStyleValue('none'));
				}
			}
			changeStyleAll('opacity', '');
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.fadeOut = function(speed, callback) {
		this.fadeTo(speed, '0', function() {
			changeStyleAll({
				display: 'none',
				opacity: ''
			});
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.fadeIn = function(speed, callback) {
		changeStyleAll({
			display: '',
			opacity: '0'
		});
		this.fadeTo(speed, '1', function() {
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.fadeTo = function(speed, opacity, callback) {
		var count = getCount(speed);
		var opacityDeltas = getStyleDeltas('opacity', opacity, count, getNormalPrefix);
		changeStyleAll('display', '');
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addStyleValue(elements[i], 'opacity', opacityDeltas[i]);
			}
		}, 
		count, 
		function() {
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.slideToggle = function(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getDisplayBasedPrefix);
		changeStyleAll('overflow', 'hidden');
		for (var i = 0; i < length; i++) {
			if (getStyleValue(elements[i], 'display') === 'none') {
				setStyle(elements[i], 'display', parseStyleValue(''));
				setHeight(elements[i], '0px');
			}
		}
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addSize(elements[i], heightDeltas[i]);
			}
		}, 
		count, 
		function() {
			for (var i = 0; i < length; i++) {
				if (getStyleValue(elements[i], 'height') === '0px') {
					setStyle(elements[i], 'display', parseStyleValue('none'));
				}
				setHeight(elements[i], '');
			}
			changeStyleAll({
				overflow: ''
			});
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.slideUp = function(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getNormalPrefix);
		changeStyleAll('overflow', 'hidden');
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addSize(elements[i], heightDeltas[i]);
			}
		}, 
		count, 
		function() {
			for (var i = 0; i < length; i++) {
				setHeight(elements[i], '');
			}
			changeStyleAll({
				display: 'none',
				overflow: ''
			});
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.slideDown = function(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getReversedPrefix);
		for (var i = 0; i < length; i++) {
			setHeight(elements[i], '0px');
		}
		changeStyleAll({
			overflow: 'hidden',
			display: ''
		});
		Timer(function() {
			for (var i = 0; i < length; i++) {
				addSize(elements[i], heightDeltas[i]);
			}
		}, 
		count, 
		function() {
			for (var i = 0; i < length; i++) {
				setHeight(elements[i], '');
			}
			changeStyleAll({
				overflow: ''
			});
			if (callback !== undefined) callback();
		});
		return this;
	};

	this.animate = function(css, speed, callback) {
		var count = getCount(speed);
		var deltas = [];
		for (var key in css) {
			deltas[key] = getStyleDeltas(key, css[key], count, getNormalPrefix);
		}
		Timer(function() {
			for (var i = 0; i < length; i++) {
				for (var key in css) {
					addStyleValue(elements[i], key, deltas[key][i]);
				}
			}
		}, 
		count, 
		function() {
			if (callback !== undefined) callback();
		});
		return this;
	}

	var timeout = 10;
	function getCount(speed) {
		if (speed !== undefined) {
			return speed / timeout;
		}
		return 1;
	}

	function getNormalPrefix(element, currentStyle, targetStyle) {
		return currentStyle.value > targetStyle.value? "-=" : "+=";
	}

	function getReversedPrefix(element, currentStyle, targetStyle) {
		return currentStyle.value < targetStyle.value? "-=" : "+=";
	}

	function getDisplayBasedPrefix(element, currentStyle, targetStyle) {
		if (getStyleValue(element, 'display') !== 'none') {
			return getNormalPrefix(element, currentStyle, targetStyle);
		} else {
			return getReversedPrefix(element, currentStyle, targetStyle);
		}
	}

	function addSize(element, sizeDelta) {
		for (var key in sizeDelta) {
			addStyleValue(element, key, sizeDelta[key]);
		}
	}

	function setHeight(element, size) {
		setStyle(element, 'height', parseStyleValue(size));
		setStyle(element, 'paddingTop', parseStyleValue(size));
		setStyle(element, 'paddingBottom', parseStyleValue(size));
	}

	function getHeightDeltas(targetValue, count, getPrefix) {
		var deltas = [];
		var heightDeltas = getStyleDeltas('height', targetValue, count, getPrefix);
		var paddingTopDeltas = getStyleDeltas('paddingTop', targetValue, count, getPrefix);
		var paddingBottomDeltas = getStyleDeltas('paddingBottom', targetValue, count, getPrefix);
		for (var i = 0; i < length; i++) {
			var delta = {};
			delta.height = heightDeltas[i];
			delta.paddingTop = paddingTopDeltas[i];
			delta.paddingBottom = paddingBottomDeltas[i];
			deltas.push(delta);
		}
		return deltas;
	}

	function getStyleDeltas(style, targetValue, count, getPrefix) {
		var deltas = [];
		var currentStyle;
		var prefix;
		var targetStyle = parseStyleValue(targetValue);
		for (var i = 0; i < length; i++) {
			currentStyle = parseStyleValue(getStyleValue(elements[i], style));
			prefix = getPrefix(elements[i], currentStyle, targetStyle);
			var value = prefix + 
				(Math.abs(currentStyle.value - targetStyle.value) / count) + 
				targetStyle.measure;
			deltas.push(parseStyleValue(value));
		}
		return deltas;
	}

	function Timer(func, count, callback) {
		var interval = setInterval(function() {
			func();
			if (count <= 1) {
				clearInterval(interval);
				if (callback !== undefined) callback();
			} else {
				count--;
			}
		}, timeout);
	}

	/************************
	*************************
	Style Manipulating
	*************************
	************************/
	this.css = function(style, value) {
		if(isCssRequest(style, value)) {
			return getStyleValue(elements[0], style);
		} else {
			changeStyleAll(style, value);
			return this;
		}
	};

	function isCssRequest(style, value) {
		return typeof style === "string" && value === undefined;
	}

	function changeStyleAll(style, value) {
		if (typeof style === "string") {
			var styleValue = parseStyleValue(value);
			if (styleValue.adding) {
				for (var i = 0; i < length; i++) {
					addStyleValue(elements[i], style, styleValue);
				}
			} else {
				for (var i = 0; i < length; i++) {
					setStyle(elements[i], style, styleValue);
				}
			}
		} else if (typeof style === "object") {
			for (var i = 0; i < length; i++) {
				for (var key in style) {
					var styleValue = parseStyleValue(style[key]);
					if (styleValue.adding) {
						addStyleValue(elements[i], key, styleValue);
					} else {
						setStyle(elements[i], key, styleValue);
					}
				} 			
			}
		}
	}

	function addStyleValue(element, style, styleValue) {
		var oldValue = parseStyleValue(getStyleValue(element, style));
		var newValue = oldValue.value;
		if (styleValue.sign === '+') {
			newValue += styleValue.value;
		} else {
			newValue -= styleValue.value;
		}
		element.style[style] = newValue + styleValue.measure;
	}

	function setStyle(element, style, styleValue) {
		element.style[style] = styleValue.fullValue;
	}

	function getStyleValue(element, style) {
		return getComputedStyle(element)[style];
	}

	function parseStyleValue(value) {
		var result = {};
		result.adding = value.indexOf("=") >= 0;
		if (result.adding) {
			result.sign = value[0];
			value = value.slice(2);
		}
		result.fullValue = value;
		for (var i = value.length - 1; i >= 0; i--) {
			if (!isNaN(value[i])) {
				i++;
				break;
			}
		}
		result.measure = "";
		if (i < value.length) {
			result.measure = value.slice(i);
			value = value.slice(0, i);
		}
		result.value = Number(value);
		return result;
	}
}