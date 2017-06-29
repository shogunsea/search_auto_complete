/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Frontend component that powers auto-complete search box.
 * @author Shogun Sea
 */



var getHtmlCssTerms = __webpack_require__(1);
var getNodeTerms = __webpack_require__(2);
var getDesignPatternTerms = __webpack_require__(3);

var dispatchKeyAction = function dispatchKeyAction(event, inputElem, previousInput, resultContainer) {
  if (isNavAction(event)) {
    return handleNavAction(event, inputElem, previousInput);
  } else if (isSelectAction(event)) {
    return handleSelectAction(event, resultContainer);
  } else {
    return false;
  }
};

var actionIsDispatchable = function actionIsDispatchable(event) {
  return isNavAction(event) || isSelectAction(event);
};

var isSelectAction = function isSelectAction(event) {
  if (event.keyCode == 13) {
    return true;
  }
  return false;
};

/* Check if arrow up/down been pressed */
var isNavAction = function isNavAction(event) {
  if (event.keyCode == 38 || event.keyCode == 40) {
    return true;
  }
  return false;
};

/* Handle arrow up/down to highlight selected list item,
supports circular cursor movement */
var handleNavAction = function handleNavAction(event, inputElem, previousInput) {
  var moveDown = event.keyCode === 40;
  var moveUp = event.keyCode === 38;
  var actionUnknown = !(moveDown || moveUp);

  if (actionUnknown) {
    return console.warn('Key Action Unknown.');
  }

  var resultItems = document.querySelectorAll('.result-item');
  var resultLen = resultItems.length;

  if (resultLen === 0) {
    return;
  }

  var previousHighlightIndex = -1;
  var highlightIndex = 0;

  for (var i = 0; i < resultLen; i++) {
    var resultItem = resultItems[i];

    if (resultItem.classList.contains('highlight')) {
      previousHighlightIndex = i;
      resultItem.classList.remove('highlight');
      break;
    }
  }

  if (previousHighlightIndex === -1) {
    // initial cursor movement
    highlightIndex = moveDown ? 0 : resultLen - 1;
  } else if (moveDown) {
    var nextIndex = previousHighlightIndex + 1;
    highlightIndex = nextIndex === resultLen ? -1 : nextIndex;
  } else if (moveUp) {
    var _nextIndex = previousHighlightIndex - 1;
    highlightIndex = _nextIndex;
  }

  if (highlightIndex === -1) {
    // restore input value.
    inputElem.value = previousInput.value;
  } else {
    var highlightItem = resultItems[highlightIndex];
    var plainText = highlightItem.getAttribute('data-plain-text');
    highlightItem.classList.add('highlight');
    inputElem.value = plainText;
  }
};

var handleSelectAction = function handleSelectAction(event, resultContainer) {
  clearResult(resultContainer);
};

var toggleContextSelectList = function toggleContextSelectList(event) {
  var target = event.currentTarget;
  target.classList.toggle('active');
};

var toggleContextItems = function toggleContextItems(allContextItems, selectedItem) {
  selectedItem.classList.add('active');

  for (var j = 0; j < allContextItems.length; j++) {
    var otherItem = allContextItems[j];
    if (otherItem === selectedItem) {
      continue;
    } else {
      otherItem.classList.remove('active');
    }
  }
};

var clearResult = function clearResult(resultContainer) {
  setTimeout(function () {
    resultContainer.classList.remove('active');
    resultContainer.innerHTML = '';
  }, 100);
};

// not clearing innerHTML since dropdown list items
// are pre-defined
var clearContext = function clearContext(contextContainer) {
  contextContainer.classList.remove('active');
};

var getFormattedText = function getFormattedText(haystack, needle) {
  var formattedString = '';
  var needleLen = needle.length;

  for (var i = 0; i < haystack.length; i++) {
    var originalText = haystack.substring(i, i + needleLen);
    if (originalText.toLowerCase() == needle) {
      formattedString += '<b>' + originalText + '</b>';
      i += needleLen - 1;
    } else {
      formattedString += haystack.substring(i, i + 1);
    }
  }

  return formattedString;
};

/* match all occurances of 'needle' in 'haystack', examples:
adfsdasdf, a --> highlight all occurances of 'a'
helloworldhello, hello -> highlight all occurances of 'hello'
helloworldhello, wor -> highlight 'wor' */
var getMatchedResult = function getMatchedResult(input, dataHash) {
  var results = [];
  var dataSet = dataHash.dataSet,
      currentContext = dataHash.currentContext;

  var currentDataSet = dataSet[currentContext];

  if (!currentDataSet) {
    return results;
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = currentDataSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var data = _step.value;
      var plainText = data.name,
          count = data.count,
          url = data.url;

      if (plainText.toLowerCase().indexOf(input) !== -1) {
        var formattedText = getFormattedText(plainText, input);
        results.push({ formattedText: formattedText, plainText: plainText, count: count, url: url });
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return results;
};

var getComplexList = function getComplexList(plainText, formattedText, url, count) {
  return '<li class="result-item" data-plain-text="' + plainText + '" data-url="' + url + '">\n            <div class="result-text">\n              ' + formattedText + '\n            </div>\n            <div class="external-link">\n              <a href="' + url + '" target="_blank">\uD83D\uDD17</a>\n            </div>\n        </li>';
};

var getSimpleList = function getSimpleList(plainText, formattedText) {
  return '<li class="result-item" data-plain-text="' + plainText + '">\n          ' + formattedText + '\n        </li>';
};

var displayResult = function displayResult(data, resultContainer, searchInputElem, previousInput) {
  if (data && data.length !== 0) {
    resultContainer.classList.add('active');

    for (var i = 0; i < data.length; i++) {
      var _data$i = data[i],
          formattedText = _data$i.formattedText,
          plainText = _data$i.plainText,
          count = _data$i.count,
          url = _data$i.url;

      var listHTML = '';
      if (url) {
        listHTML = getComplexList(plainText, formattedText, url, count);
      } else {
        listHTML = getSimpleList(plainText, formattedText);
      }
      resultContainer.innerHTML += listHTML;
    }
    activateResultListItem(resultContainer, searchInputElem, previousInput);
  } else {
    clearResult(resultContainer);
  }
};

/* clicking on the list item will cause it to be selected
closing the completion list and fill the value. */
var activateResultListItem = function activateResultListItem(resultContainer, searchInputElem, previousInput) {
  var resultItems = document.querySelectorAll('.result-item');

  for (var i = 0; i < resultItems.length; i++) {
    var resultItem = resultItems[i];

    resultItem.addEventListener('mouseenter', function (event) {
      var target = event.currentTarget;
      var plainText = target.getAttribute('data-plain-text');
      var resultItems = document.querySelectorAll('.result-item');
      var resultLen = resultItems.length;

      for (var _i = 0; _i < resultLen; _i++) {
        var _resultItem = resultItems[_i];
        _resultItem.classList.remove('highlight');
      }

      searchInputElem.value = plainText;
      target.classList.add('highlight');
    });

    resultItem.addEventListener('click', function (event) {
      clearResult(resultContainer);
    });

    // *** Element is selcted because mouseleave event won't be triggered! ***
    resultItem.addEventListener('mouseleave', function (event) {
      searchInputElem.value = previousInput.value;
    });
  }
};

/* The two activateXXX methods binds event listener as well
logically it should be inside bindSearchEvents, but since
the binding is on-demand so they are seprated */
var activateContextListItem = function activateContextListItem(contextContainer, currentContextElem, dataHash) {
  var contextItems = document.querySelectorAll('.context-item');

  for (var i = 0; i < contextItems.length; i++) {
    var contextItem = contextItems[i];
    contextItem.addEventListener('click', function (event) {
      event.stopPropagation();

      var target = event.currentTarget;
      var plainText = target.getAttribute('data-plain-text');
      var context = target.getAttribute('data-context');
      // update global context
      var newDataHash = getDataHash(context);

      newDataHash.then(function (_ref) {
        var dataSet = _ref.dataSet,
            currentContext = _ref.currentContext;

        dataHash.currentContext = currentContext;
        dataHash.dataSet = dataSet;

        toggleContextItems(contextItems, target);

        currentContextElem.innerText = plainText;
        clearContext(contextContainer);
      }).catch(function (e) {
        // console.log(e);
      });
    });
  }
};

var bindSearchEvents = function bindSearchEvents(inputElem, resultsElem, dataHash, previousInput) {
  inputElem.addEventListener('focusin', function (event) {
    inputElem.classList.add('active');
  });

  inputElem.addEventListener('focusout', function (event) {
    inputElem.classList.remove('active');
  });

  // prevent the form submition when pressing enter key
  inputElem.addEventListener('keydown', function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });

  inputElem.addEventListener('keyup', function (event) {
    if (actionIsDispatchable(event)) {
      return dispatchKeyAction(event, inputElem, previousInput, resultsElem);
    }

    var currentText = inputElem.value;
    previousInput.value = currentText;

    resultsElem.innerHTML = '';

    if (currentText.length === 0) {
      return displayResult(null, resultsElem, inputElem);
    }

    var results = getMatchedResult(currentText.toLowerCase(), dataHash);

    return displayResult(results, resultsElem, inputElem, previousInput);
  });
};

var bindContextEvents = function bindContextEvents(contextContainerElem, currentContextElem, dataHash) {
  contextContainerElem.addEventListener('click', toggleContextSelectList, false);
  contextContainerElem.addEventListener('focusout', function (event) {
    var target = event.currentTarget;
    clearContext(target);
  });

  activateContextListItem(contextContainerElem, currentContextElem, dataHash);
};

var fetchFromTwitterAPI = function fetchFromTwitterAPI() {
  var makeGETRequest = function makeGETRequest(url) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function () {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
        } else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function () {
        reject(Error('Network Error'));
      };

      req.send();
    });
  };

  return makeGETRequest('/twitter');
};

// return Promise from this method
var getDataHash = function getDataHash() {
  var currentContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'html';

  var htmlTerms = getHtmlCssTerms();
  var nodejsTerms = getNodeTerms();
  var designPatterns = getDesignPatternTerms();

  var dataSet = {
    html: htmlTerms,
    node: nodejsTerms,
    pattern: designPatterns
  };
  var showTwitterTrends = currentContext === 'twitter';

  if (showTwitterTrends) {
    var twitterTrends = fetchFromTwitterAPI();

    return twitterTrends.then(function (trends) {
      var parsedList = null;
      try {
        var trendsList = JSON.parse(trends);
        parsedList = trendsList;
      } catch (error) {
        console.warn(error);
      }

      dataSet.twitter = parsedList;
      return { dataSet: dataSet, currentContext: 'twitter' };
    }).catch(function (e) {
      console.warn(e);
    });
  }

  return new Promise(function (resolve, reject) {
    resolve({ dataSet: dataSet, currentContext: currentContext });
  });
};

var init = function init() {
  if (typeof document == 'undefined') {
    return;
  }

  var contextContainerElem = document.getElementById('context_container');
  var currentContextElem = document.getElementById('current_context');
  var searchInputElem = document.getElementById('search_input');
  var searchResultsElem = document.getElementById('search_results');
  // use this data to show default context on page?
  var defaultContext = 'html';
  // these two objects will be mudated
  var dataHashPromise = getDataHash(defaultContext);
  var previousInput = { value: '' };

  dataHashPromise.then(function (dataHash) {
    bindSearchEvents(searchInputElem, searchResultsElem, dataHash, previousInput);
    bindContextEvents(contextContainerElem, currentContextElem, dataHash);
    searchInputElem.focus();
  });
};

init();

if (true) {
  module.exports = {
    actionIsDispatchable: actionIsDispatchable,
    activateContextListItem: activateContextListItem,
    activateResultListItem: activateResultListItem,
    bindContextEvents: bindContextEvents,
    bindSearchEvents: bindSearchEvents,
    clearContext: clearContext,
    clearResult: clearResult,
    dispatchKeyAction: dispatchKeyAction,
    displayResult: displayResult,
    fetchFromTwitterAPI: fetchFromTwitterAPI,
    getComplexList: getComplexList,
    getDataHash: getDataHash,
    getFormattedText: getFormattedText,
    getMatchedResult: getMatchedResult,
    getSimpleList: getSimpleList,
    handleNavAction: handleNavAction,
    handleSelectAction: handleSelectAction,
    init: init,
    isNavAction: isNavAction,
    isSelectAction: isSelectAction,
    toggleContextItems: toggleContextItems,
    toggleContextSelectList: toggleContextSelectList
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getHtmlCssTerms = function getHtmlCssTerms() {
  var data = [{
    'name': 'element',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML'
  }, {
    'name': 'border',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/border'
  }, {
    'name': 'border-radius',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius'
  }, {
    'name': 'background',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/background'
  }, {
    'name': 'body',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body'
  }, {
    'name': 'padding',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/padding'
  }, {
    'name': 'margin',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin'
  }, {
    'name': 'position',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/position'
  }, {
    'name': 'display',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/display'
  }, {
    'name': 'float',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/float'
  }, {
    'name': 'flex',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex'
  }, {
    'name': 'block formatting context',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context'
  }, {
    'name': 'document',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/API/Document'
  }, {
    'name': 'dom tree',
    'url': 'https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Using_the_W3C_DOM_Level_1_Core'
  }];

  return data;
};

module.exports = getHtmlCssTerms;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNodeTerms = function getNodeTerms() {
  var data = [{
    'name': 'socket',
    'url': 'https://en.wikipedia.org/wiki/Network_socket'
  }, {
    'name': 'module',
    'url': 'https://nodejs.org/api/modules.html#modules_modules'
  }, {
    'name': 'io',
    'url': 'http://www.onlamp.com/pub/a/python/2004/02/12/advanced_nio.html'
  }, {
    'name': 'blocking',
    'url': 'https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/'
  }, {
    'name': 'non-blocking',
    'url': 'https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/'
  }, {
    'name': 'v8',
    'url': 'https://en.wikipedia.org/wiki/Chrome_V8'
  }, {
    'name': 'file system',
    'url': 'https://nodejs.org/api/fs.html#fs_file_system'
  }, {
    'name': 'request',
    'url': 'https://nodejs.org/api/http.html#http_class_http_clientrequest'
  }];
  return data;
};

module.exports = getNodeTerms;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getDesignPatternTerms = function getDesignPatternTerms() {
  var data = [{
    'name': 'factory',
    'url': 'https://sourcemaking.com/design_patterns/factory_method'
  }, {
    'name': 'singleton',
    'url': 'https://sourcemaking.com/design_patterns/singleton'
  }, {
    'name': 'observor',
    'url': 'https://sourcemaking.com/design_patterns/observer'
  }, {
    'name': 'decorator',
    'url': 'https://sourcemaking.com/design_patterns/decorator'
  }, {
    'name': 'prototype',
    'url': 'https://sourcemaking.com/design_patterns/prototype'
  }];
  return data;
};

module.exports = getDesignPatternTerms;

/***/ })
/******/ ]);