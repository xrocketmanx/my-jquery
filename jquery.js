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
			try {
				var elements = document.querySelectorAll(element);
				if (elements.length === 0) throw "query selector returned []";
				return elements;
			} catch(exception) {
				return [parseHTML(element)];
			}
		}
	}

	function parseHTML(element) {
		if (isTag(element)) {
			var tagName = "";
			var tagLength = 0;
			for (var i = 1; i < element.length; i++) {
				if (element.charAt(i) === ">") {
					tagLength = i + 1;
					break;
				}
				tagName += element.charAt(i);
			}
			var tag = document.createElement(tagName);
			tag.innerHTML = element.slice(tagLength, element.length - tagLength - 1);
			return tag;
		} else {
			return document.createTextNode(element);
		}
	}

	function isTag(element) {
		return element[0] === '<';
	}

	function isNodeList(element) {
		return element.constructor.name === "NodeList";
	}

	function isNode(element) {
		return element.constructor.name.indexOf("HTML") >= 0;
	}
}

function jQuery(elements) {
	if (elements === undefined || elements === null) {
		throw "jquery selector is null or undefined";
	}
	var length = elements.length;
	this.getElements = function() {
		return elements;
	};

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
		if (isString(event)) {
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
		return safeCall(hide, this, speed, callback);
	};

	this.show = function(speed, callback) {
		return safeCall(show, this, speed, callback);
	};

	this.toggle = function(speed, callback) {
		return safeCall(toggle, this, speed, callback);
	};

	this.fadeToggle = function(speed, callback) {
		return safeCall(fadeToggle, this, speed, callback);
	};

	this.fadeOut = function(speed, callback) {
		return safeCall(fadeOut, this, speed, callback);
	};

	this.fadeIn = function(speed, callback) {
		return safeCall(fadeIn, this, speed, callback);
	};

	this.fadeTo = function(speed, opacity, callback) {
		return safeCall(fadeTo, this, speed, opacity, callback);
	};

	this.slideToggle = function(speed, callback) {
		return safeCall(slideToggle, this, speed, callback);
	};

	this.slideUp = function(speed, callback) {
		return safeCall(slideUp, this, speed, callback);
	};

	this.slideDown = function(speed, callback) {
		return safeCall(slideDown, this, speed, callback);
	};

	this.animate = function(css, speed, callback) {
		return safeCall(animate, this, css, speed, callback);
	};

	function safeCall(func) {
		var summoner = arguments[1];
		var args = [];
		for (var i = 2; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		waitQueue(createBlock(), function() {
			func.apply(summoner, args);
		});
		return summoner;
	}

	function hide(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getNormalPrefix);
		var opacityDeltas = getStyleDeltas('opacity', '0', count, getNormalPrefix);
		changeStyleAll('overflow', 'hidden');
		Timer.call(this, function() {
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
			if (callback !== undefined) callback.call(this);
		});
	};

	function show(speed, callback) {
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
		Timer.call(this, function() {
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
			if (callback !== undefined) callback.call(this);
		});
	};

	function toggle(speed, callback) {
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
		Timer.call(this, function() {
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
			if (callback !== undefined) callback.call(this);
		});
	};

	function fadeToggle(speed, callback) {
		var count = getCount(speed);
		var opacityDeltas = getStyleDeltas('opacity', '0', count, getDisplayBasedPrefix);
		for (var i = 0; i < length; i++) {
			if (getStyleValue(elements[i], 'display') === 'none') {
				setStyle(elements[i], 'display', parseStyleValue(''));
				setStyle(elements[i], 'opacity', parseStyleValue('0'));
			}
		}
		Timer.call(this, function() {
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
			if (callback !== undefined) callback.call(this);
		});
	};

	function fadeOut(speed, callback) {
		fadeTo.call(this, speed, '0', function() {
			changeStyleAll({
				display: 'none',
				opacity: ''
			});
			if (callback !== undefined) callback.call(this);
		});
	};

	function fadeIn(speed, callback) {
		changeStyleAll({
			display: '',
			opacity: '0'
		});
		fadeTo.call(this, speed, '1', function() {
			if (callback !== undefined) callback.call(this);
		});
	};

	function fadeTo(speed, opacity, callback) {
		var count = getCount(speed);
		var opacityDeltas = getStyleDeltas('opacity', opacity, count, getNormalPrefix);
		changeStyleAll('display', '');
		Timer.call(this, function() {
			for (var i = 0; i < length; i++) {
				addStyleValue(elements[i], 'opacity', opacityDeltas[i]);
			}
		}, 
		count, 
		function() {
			if (callback !== undefined) callback.call(this);
		});
	};

	function slideToggle(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getDisplayBasedPrefix);
		changeStyleAll('overflow', 'hidden');
		for (var i = 0; i < length; i++) {
			if (getStyleValue(elements[i], 'display') === 'none') {
				setStyle(elements[i], 'display', parseStyleValue(''));
				setHeight(elements[i], '0px');
			}
		}
		Timer.call(this, function() {
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
			if (callback !== undefined) callback.call(this);
		});
	};

	function slideUp(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getNormalPrefix);
		changeStyleAll('overflow', 'hidden');
		Timer.call(this, function() {
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
			if (callback !== undefined) callback.call(this);
		});
	};

	function slideDown(speed, callback) {
		var count = getCount(speed);
		var heightDeltas = getHeightDeltas('0px', count, getReversedPrefix);
		for (var i = 0; i < length; i++) {
			setHeight(elements[i], '0px');
		}
		changeStyleAll({
			overflow: 'hidden',
			display: ''
		});
		Timer.call(this, function() {
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
			if (callback !== undefined) callback.call(this);
		});
	};

	function animate(css, speed, callback) {
		var count = getCount(speed);
		var deltas = [];
		for (var key in css) {
			deltas[key] = getStyleDeltas(key, css[key], count, getNormalPrefix);
		}
		Timer.call(this, function() {
			for (var i = 0; i < length; i++) {
				for (var key in css) {
					addStyleValue(elements[i], key, deltas[key][i]);
				}
			}
		}, 
		count, 
		function() {
			if (callback !== undefined) callback.call(this);
		});
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
		var targetStyle;
		var prefix;
		for (var i = 0; i < length; i++) {
			currentStyle = parseStyleValue(getStyleValue(elements[i], style));
			targetStyle = parseStyleValue(targetValue);
			if (targetStyle.adding) {
				if (targetStyle.sign === "+") {
					targetStyle.value = currentStyle.value + targetStyle.value;
				} else {
					targetStyle.value = currentStyle.value - targetStyle.value;
				}
			}
			prefix = getPrefix(elements[i], currentStyle, targetStyle);
			var value = prefix + 
				(Math.abs(currentStyle.value - targetStyle.value) / count) + 
				targetStyle.measure;
			deltas.push(parseStyleValue(value));
		}
		return deltas;
	}

	var blocks = [];
	var blockingIndex = 0;

	function createBlock() {
		var index = blockingIndex++;
		blocks.push(index);
		return index;
	}

	function waitQueue(index, func) {
		var interval = setInterval(function() {
			if (blocks[0] === index) {
				clearInterval(interval);
				func();
			}
		}, 1);
	}

	function freeBlock() {
		blocks.shift();
	}

	function Timer(func, count, callback) {
		var summoner = this;
		var interval = setInterval(function() {
			func();
			if (count <= 1) {
				clearInterval(interval);
				if (callback !== undefined) callback.call(summoner);
				freeBlock();
			} else {
				count--;
			}
		}, timeout);
	}

	/************************
	*************************
	Style Manipulation
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
		return isString(style) && isUndefined(value);
	}

	function changeStyleAll(style, value) {
		if (isString(style)) {
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

	/************************
	*************************
	Dom Manipulation
	*************************
	************************/
	this.html = function(value) {
		if (isUndefined(value)) {
			return elements[0].innerHTML;
		} else if (isString(value)) {
			for (var i = 0; i < length; i++) {
				elements[i].innerHTML = value;
			}
		} else if (isFunction(value)) {
			for (var i = 0; i < length; i++) {
				elements[i].innerHTML = value(i, elements[i].innerHTML);
			}
		}
	};

	this.text = function(value) {
		if (isUndefined(value)) {
			var text = "";
			for (var i = 0; i < length; i++) {
				text += elements[i].innerText;
			}
			return text;
		} else if (isString(value)) {
			for (var i = 0; i < length; i++) {
				elements[i].innerText = value;
			}
		} else if (isFunction(value)) {
			for (var i = 0; i < length; i++) {
				elements[i].innerText = value(i, elements[i].innerText);
			}
		}
	};

	this.val = function(value) {
		if (isUndefined(value)) {
			return elements[0].value;
		} else if (isString(value)) {
			for (var i = 0; i < length; i++) {
				elements[i].value = value;
			}
		} else if (isFunction(value)) {
			for (var i = 0; i < length; i++) {
				elements[i].value = value(i, elements[i].value);
			}
		}
	};

	this.attr = function(attr, value) {
		if (isString(attr) && isUndefined(value)) {
			return elements[0][attr];
		} else if (isString(value) && isString(attr)) {
			for (var i = 0; i < length; i++) {
				elements[i][attr] = value;
			}
		} else if (isFunction(value)) {
			for (var i = 0; i < length; i++) {
				elements[i][attr] = value(i, elements[i][attr]);
			}
		} else if (typeof attr === "object") {
			for (var i = 0; i < length ; i++) {
				for (var key in attr) {
					elements[i][key] = attr[key];
				}
			}
		} 
	};

	this.append = function() {
		addElement(function(parent, nodes) {
			for (var i = 0; i < nodes.length; i++) {
				parent.appendChild(nodes[i].cloneNode(true));
			}
		}, arguments);
	};

	this.appendTo = function() {
		for (var i = 0; i < arguments.length; i++) {
			if (!isJQuery(arguments[i])) {
				object = $(arguments[i]);
			} else {
				object = arguments[i];
			}
			object.append(this);
		}
	};

	this.prepend = function() {
		addElement(function(parent, nodes) {
			if(parent.firstChild) {
				var firstChild = parent.firstChild;
				for (var i = 0; i < nodes.length; i++) {
					parent.insertBefore(nodes[i].cloneNode(true), 
										firstChild);
				}
			} else {
				for (var i = 0; i < nodes.length; i++) {
					parent.appendChild(nodes[i].cloneNode(true));
				}
			}
		}, arguments);
	};

	this.after = function() {
		addElement(function(element, nodes) {
			if(element.nextSibling) {
				var next = element.nextSibling;
				for (var i = 0; i < nodes.length; i++) {
					element.parentNode.insertBefore(nodes[i], 
												next);
				}
			} else {
				for (var i = 0; i < nodes.length; i++) {
					element.parentNode.appendChild(nodes[i].cloneNode(true));
				}
			}
		}, arguments);
	};

	this.before = function() {
		addElement(function(element, nodes) {
			for (var i = 0; i < nodes.length; i++) {
				element.parentNode.insertBefore(nodes[i], element);
			}
		}, arguments);
	};

	this.remove = function() {
		for (var i = 0; i < length; i++) {
			elements[i].parentNode.removeChild(elements[i]);
		}
	};

	this.empty = function() {
		for (var i = 0; i < length; i++) {
			elements[i].innerHTML = "";
		}
	};

	function addElement(addFunction) {
		var args = arguments[1];
		var object;
		var nodes = [];
		for (var i = 0; i < args.length; i++) {
			if (!isJQuery(args[i])) {
				object = $(args[i]);
			} else {
				object = args[i];
			}
			nodes.push.apply(nodes, object.getElements());
		}
		for (var i = 0; i < nodes.length; i++) {
			if(nodes[i].parentNode) {
				nodes[i].parentNode.removeChild(nodes[i]);
			}
		}
		for (var i = 0; i < length; i++) {
			addFunction(elements[i], nodes);
		}
	}

	this.addClass = function(value) {
		var classes = value.split(' ');
		for (var i = 0; i < length; i++) {
			elements[i].classList.add.apply(elements[i].classList, classes);
		}
	}

	this.removeClass = function(value) {
		var classes = value.split(' ');
		for (var i = 0; i < length; i++) {
			elements[i].classList.remove.apply(elements[i].classList, classes);
		}
	}

	this.toggleClass = function(value) {
		var classes = value.split(' ');
		for (var i = 0; i < length; i++) {
			list = elements[i].classList;
			for (var j = 0; j < classes.length; j++) {
				if (list.contains(classes[j])) {
					list.remove(classes[j]);
				} else {
					list.add(classes[j]);
				}
			}
		}
	}

	/************************
	*************************
	Dimensions
	*************************
	************************/
	this.width = function(value) {
		return size('width', value);
	};

	this.height = function(value) {
		return size('height', value);
	};

	function size(dimension, value) {
		if (isUndefined(value)) {
			return getStyleValue(elements[0], dimension);
		} else {
			for (var i = 0; i < length; i++) {
				setStyle(elements[i], dimension, parseStyleValue(value)); 
			}
		}
	}

	this.innerWidth = function(value) {
		return innerSize('width', value);
	};

	this.innerHeight = function(value) {
		return innerSize('height', value);
	};

	function innerSize(dimension, value) {
		var temp;
		if (dimension == 'height') {
			temp = ['Top', 'Bottom'];
		} else {
			temp = ['Left', 'Right'];
		}
		if (isUndefined(value)) {
			var element = elements[0];
			var size = parseStyleValue(getStyleValue(element, dimension));
			var paddingA = parseStyleValue(getStyleValue(element, 'padding' + temp[0]));
			var paddingB = parseStyleValue(getStyleValue(element, 'padding' + temp[1]));
			return size.value + paddingA.value + paddingB.value + size.measure;
		} else {
			for (var i = 0; i < length; i++) {
				var size = parseStyleValue(getStyleValue(elements[i], dimension));
				var paddingA = parseStyleValue(getStyleValue(elements[i], 'padding' + temp[0]));
				var paddingB = parseStyleValue(getStyleValue(elements[i], 'padding' + temp[1]));
				styleValue = parseStyleValue(value);
				styleValue.fullValue = 
					styleValue.value - paddingA.value - paddingB.value + styleValue.measure;
				setStyle(elements[i], dimension, styleValue);
			}
		}
	}

	this.outerWidth = function(value) {
		return outerSize('width', value);
	};

	this.outerHeight = function(value) {
		return outerSize('height', value);
	};

	function outerSize(dimension, value) {
		var temp;
		if (dimension == 'height') {
			temp = ['Top', 'Bottom'];
		} else {
			temp = ['Left', 'Right'];
		}
		if (isUndefined(value)) {
			var element = elements[0];
			var size = parseStyleValue(getStyleValue(element, dimension));
			var paddingA = parseStyleValue(getStyleValue(element, 'padding' + temp[0]));
			var paddingB = parseStyleValue(getStyleValue(element, 'padding' + temp[1]));
			var borderA = parseStyleValue(getStyleValue(element, 'border' + temp[0] + "Width"));
			var borderB = parseStyleValue(getStyleValue(element, 'border' + temp[1] + "Width"));
			return size.value + paddingA.value + paddingB.value + borderA.value + borderB.value + size.measure;
		} else {
			for (var i = 0; i < length; i++) {
				var size = parseStyleValue(getStyleValue(elements[i], dimension));
				var paddingA = parseStyleValue(getStyleValue(elements[i], 'padding' + temp[0]));
				var paddingB = parseStyleValue(getStyleValue(elements[i], 'padding' + temp[1]));
				var borderA = parseStyleValue(getStyleValue(elements[i], 'border' + temp[0] + "Width"));
				var borderB = parseStyleValue(getStyleValue(elements[i], 'border' + temp[1] + "Width"));
				styleValue = parseStyleValue(value);
				styleValue.fullValue = 
					styleValue.value - paddingA.value - paddingB.value - 
					borderA.value - borderB.value + styleValue.measure;
				setStyle(elements[i], dimension, styleValue);
			}
		}
	}

	/************************
	*************************
	Dimensions
	*************************
	************************/
	this.parent = function() {
		return elements[0].parentNode;
	};

	this.parents = function() {
		var ancerstors = [];
		var current = elements[0];
		while (current.parentNode) {
			ancerstors.push(current.parentNode);
			current = current.parentNode;
		}
		return ancerstors;
	};

	this.parentsUntil = function(template) {
		var ancerstors = [];
		var current = elements[0];
		while (current.parentNode && current.localName !== template) {
			ancerstors.push(current.parentNode);
			current = current.parentNode;
		}
		return ancerstors;
	};

	/************************
	*************************
	Type compare
	*************************
	************************/
	function isUndefined(value) {
		return value === undefined;
	}

	function isString(value) {
		return typeof value === "string";
	}

	function isFunction(value) {
		return typeof value === "function";
	}

	function isJQuery(value) {
		return value.constructor.name.indexOf("jQuery") >= 0;
	}
}