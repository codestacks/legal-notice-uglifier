(function(w) {
	var stuff = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	var tags = ['b', 'i', 'u', 'span'];
	var tagFix = {
		'b': 'font-weight:inherit;',
		'i': 'font-style:inherit;',
		'u': 'text-decoration: inherit;'
	};
	/**
	 * Generates a simple random string between min and max chars
	 */
	var randomString = function(min, max) {
		min = min || 2;
		max = max || 10;
		var content = "";
		var ic = Math.random() * (max - min) + min;
		for (var i = 0; i < ic; i++) {
			content += stuff[Math.floor(Math.random() * stuff.length)];
		}
		return content;
	};
	/**
	 * Extends an array of information with html tags, mostly without any sense. Result will be an object
	 * with the new information array as well as a string with style cheats. The container should be the
	 * name of the target container (id), which is used by style cheat selectors. Paranoid (true / false)
	 * adds more stuff to code and breakLines (true / false) will break lines instead of generating one
	 * big cheat block.
	 */
	var extendInformation = function(container, information, paranoid, breakLines) {
		var lineEnd = breakLines ? '\n' : '';
		var styles = '';
		for (var key in information) {
			if (information[key].length < 5) {
				// don't change the array if length is lower than five
				continue;
			}

			// Number of manipulations depends on string length, each five chars will result in one manipulation
			var res = '';
			var count = Math.floor(Math.floor(information[key].length / 5)) + 1;
			var parts = Math.floor(information[key].length / count);
			var paranoidPart = Math.floor(Math.random() * count); // paranoid element
			var noExtend = true;
			var cc = 0; // container count

			// for each manipulation block
			for (var c = 0; c < count; c++) {
				// get a random number as start
				var a = Math.floor(parts / 2.0 * Math.random() + 1);
				var l = parts; // max length of block
				if (c == count - 1) {
					l = information[key].length;
				}
				var b = Math.floor((l - a - 2) * Math.random() + 1);

				// use 'a' as initial jump and 'b' as rest
				var jump = a;
				var rest = b;

				// tag to use in this block
				var tag = tags[Math.floor(Math.random() * tags.length)];

				if (paranoid && paranoidPart == c) {
					// in case of paranoid mode, replace a part of this string with some tag and add the rest by using css
					var pos = 'after';
					var int = information[key].substr(0, jump);
					information[key] = information[key].substr(jump);
					var ext = information[key].substr(0, rest);
					if (Math.random() < 0.5) {
						var tmp = ext;
						ext = int;
						int = tmp;
						pos = 'before';
					}
					res += '<' + tag + '>' + int + '</' + tag + '>';
					if (tagFix[tag]) {
						styles += '#' + container + ' > *:nth-child(' + (parseInt(key) + 1) + ') > *:nth-child(' + (cc + 1) + '){' + tagFix[tag] + '}' + lineEnd;
					}
					styles += '#' + container + ' > *:nth-child(' + (parseInt(key) + 1) + ') > *:nth-child(' + (cc + 1) + '):' + pos + '{content:"' + ext + '"}' + lineEnd;
					cc++;
				} else {
					// Append starting stuff
					res += information[key].substr(0, jump);
					information[key] = information[key].substr(jump);

					// add some invisible, but selectable stuff
					if (paranoid && (noExtend || Math.random() < 0.3)) {
						var tag2 = tags[Math.floor(Math.random() * tags.length)];
						res += '<' + tag2 + '>' + randomString() + '</' + tag2 + '>';
						styles += '#' + container + ' > *:nth-child(' + (parseInt(key) + 1) + ') > *:nth-child(' + (cc + 1) + '){position:absolute;left:-' + Math.floor(Math.random() * 500 + 250) + 'px;top:-' + Math.floor(Math.random() * 500 + 250) + 'px;}' + lineEnd;
						noExtend = false;
						cc++;
					}

					// add some hidden parts on dom level
					if (Math.random() < 0.7) {
						var content = '';
						if (Math.random() < 0.3) {
							content = information[key].substr(Math.floor(parts / 2.0 * Math.random()), rest);
						} else {
							content = randomString();
						}
						content = '<' + tag + '>' + content + '</' + tag + '>';
						res += content;
						res += information[key].substr(0, rest);
						styles += '#' + container + ' > *:nth-child(' + (parseInt(key) + 1) + ') > *:nth-child(' + (cc + 1) + '){display:none}' + lineEnd;
						cc++;
					} else {
						res += '<' + tag + '>' + information[key].substr(0, rest) + '</' + tag + '>';
						if (tagFix[tag]) {
							styles += '#' + container + ' > *:nth-child(' + (parseInt(key) + 1) + ') > *:nth-child(' + (cc + 1) + '){' + tagFix[tag] + '}' + lineEnd;
						}
						cc++;
					}
				}
				// Reducing string to remaining parts
				information[key] = information[key].substr(rest);
			}
			information[key] = res + information[key];
		}
		return {
			information: information,
			styles: styles
		};
	};
	/**
	 * Simple method to break lines in javascript code
	 */
	var shortenLines = function(code) {
		var mode = 0;
		var depth = 0;
		var counter = 0;
		var max = 60;
		var res = "";
		for (var i = 0; i < code.length; i++) {
			res += code[i];
			counter++;
			if (code[i] == '\\') {
				continue;
			}
			if (mode == 0) {
				if (code[i] == '\'') {
					mode = 1;
				} else if (code[i] == '"') {
					mode = 2;
				} else {
					if (counter > max) {
						if (code[i] == "{" || code[i] == "}" || code[i] == ";" || code[i] == "," || code[i] == " " || code[i] == "(" || code[i] == ")") {
							if (code.length - i > 1) {
								res += "\n";
								counter = 0;
							}
						}
					}
				}
			} else {
				if (mode == 1) {
					if (code[i] == '\'' && (i == 0 || code[i - 1] != '\\')) {
						mode = 0;
					} else {
						if (counter > max) {
							res += '\'+\n\'';
							counter = 0;
						}
					}
				} else if (mode == 2) {
					if (code[i] == '"' && (i == 0 || code[i - 1] != '\\')) {
						mode = 0;
					} else {
						if (counter > max) {
							res += '"+\n"';
							counter = 0;
						}
					}
				}
			}
		}
		return res;
	};
	/**
	 * Generate source code for an information array. Can be configurated by paranoid and breakLine flag.
	 * Paranoid will make the result mostly unselectable and breakLine will add line breaks. This method will
	 * produce a object with used styles, the container name, the script itself and a already combined full
	 * html code block.
	 */
	w.generateLegalNotice = function(information, paranoid, breakLines) {
		// Check if value n is between l and u
		var between = function(n, l, u) {
			return n >= l && n <= u;
		};
		// Char shift function based on ROT47
		var m = function(t, c) {
			var res = "",
				char;
			for (var k = 0; k < t.length; k++) {
				char = t.charCodeAt(k);
				res += between(char, 33, 126) ? String.fromCharCode(((61 + char + c) % 94) + 33) : t[k];
			}
			return res;
		};

		// Simple random sort function
		var randSort = function() {
			return Math.random() * 2 - 1;
		};

		// Range of random variable names
		var vars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		vars.sort(randSort);
		var varName = function() {
			return vars.pop();
		};

		// Define names
		var shifter = varName();
		var text = varName();
		var shifting = varName();
		var result = varName();
		var counter = varName();
		var list = varName();
		var notice = varName();
		var char = varName();
		var container = varName() + varName() + varName();
		var getElementById = varName();
		var fromCharCode = varName();
		var betweener = varName();

		// Extend information with random stuff
		var extended = extendInformation(container, information, paranoid, breakLines);
		styles = extended.styles;
		information = extended.information;

		// Shifting number
		var sr = Math.floor(Math.random() * 9) + 2;

		// Generate variable definitions
		var defs = [];
		defs.push(
			shifter + '=function(' + text + ',' + shifting + '){' +
			'var ' + result + '=\'\',' + counter + ';' +
			'for(' + counter + '=0;' + counter + '<' + text + '.length;' + counter + '++){' +
			'if(' + betweener + '(' + text + '.charCodeAt(' + counter + '),33,126)){' +
			result + '+=' + fromCharCode + '(((61+' + text + '.charCodeAt(' + counter + ')' + '+' + shifting + ')%94)+33)' +
			'}else{' +
			result + '+=' + text + '[' + counter + ']' +
			'}' +
			'}' +
			'return ' + result +
			'}'
		);
		defs.push(betweener + '=function(n,l,u){return n>=l&&n<=u;}');
		defs.push(
			list + '=[' +
			(function() {
				var l = [];
				for (var k = 0; k < information.length; k++) {
					l.push('"' + m(information[k], k + sr).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"');
				}
				return l.join(',');
			})() +
			']'
		);
		defs.push(notice + '=\'\'');
		defs.push(counter);

		// Calculate some fancy shifters
		var calc = function() {
			if (Math.random() < 0.5) {
				var srn = varName();
				if (Math.random() < 0.5) {
					defs.push(srn + '=-' + sr);
					return srn + '-' + counter;
				}

				defs.push(srn + '=' + (sr - 2));
				return '-(' + srn + '+2)-' + counter;
			}
			var versions = [
				'(' + counter + '+' + sr + ')*-1',
				'-1*(' + sr + '+' + counter + ')',
				'-' + sr + '-' + counter
			];
			versions.sort(randSort);
			return versions.pop();
		};

		defs.sort(randSort);

		var index = calc();

		// Generate code
		var code = '(function(' + getElementById + ',' + fromCharCode + '){';
		code += 'var ' + defs.join(',') + ';';
		code += 'for(' + counter + '=0;' + counter + '<' + list + '.length;' + counter + '++){';
		code += notice + '+=\'<p>\'+' + shifter + '(' + list + '[' + counter + '],' + index + ')+\'</p>\'}' + getElementById + '(\'' + container + '\').innerHTML=' + notice;
		code += '})(function(){return document.getElementById(arguments[0])}, String.fromCharCode)';

		if (breakLines) {
			code = shortenLines(code);
		}

		var lineEnd = breakLines ? '\n' : ''

		// Create full source code for this legal notice
		var full = '';
		full += '\<style\>' + lineEnd + styles + '\<\/style\>' + lineEnd;
		full += '\<div id="' + container + '"\>\<\/div\>' + lineEnd;
		full += '\<script type="text/javascript"\>' + lineEnd + code + lineEnd + '\<\/script\>';

		return {
			style: styles,
			container: container,
			script: code,
			full: full
		};
	};
})(window);
