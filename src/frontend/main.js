/**
 * @fileoverview Frontend component that powers auto-complete search box.
 * @author Shogun Sea
 */

'use strict';

const getHtmlCssTerms = require('./data_store/htmlCss');
const getNodeTerms = require('./data_store/node');
const getDesignPatternTerms = require('./data_store/designPattern');
const getRefactoringTechniquesTerms = require('./data_store/refactoringTechniques');
const externalLinkSVG = `
<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
</svg>
`;

const dispatchKeyAction = function(event, inputElem, previousInput, resultContainer) {
  if (isNavAction(event)) {
    return handleNavAction(event, inputElem, previousInput);
  } else if (isSelectAction(event)) {
    return handleSelectAction(event, resultContainer);
  } else {
    return false;
  }
};

const actionIsDispatchable = function(event) {
  return isNavAction(event) || isSelectAction(event);
};

const isSelectAction = function(event) {
  if (event.keyCode == 13) {
    return true;
  }
  return false;
};

/* Check if arrow up/down been pressed */
const isNavAction = function(event) {
  if (event.keyCode == 38 || event.keyCode == 40) {
    return true;
  }
  return false;
};

/* Handle arrow up/down to highlight selected list item,
supports circular cursor movement */
const handleNavAction = function(event, inputElem, previousInput) {
  const moveDown = event.keyCode === 40;
  const moveUp = event.keyCode === 38;
  const actionUnknown = !(moveDown || moveUp);

  if (actionUnknown) {
    return console.warn('Key Action Unknown.');
  }

  const resultItems = document.querySelectorAll('.result-item');
  const resultLen = resultItems.length;

  if (resultLen === 0) {
    return;
  }

  let previousHighlightIndex = -1;
  let highlightIndex = 0;

  for (let i = 0; i < resultLen; i++) {
    const resultItem = resultItems[i];

    if (resultItem.classList.contains('highlight')) {
      previousHighlightIndex = i;
      resultItem.classList.remove('highlight');
      break;
    }
  }

  if (previousHighlightIndex === -1) {
    // initial cursor movement
    highlightIndex = moveDown? 0 : resultLen - 1;
  } else if (moveDown) {
    const nextIndex = previousHighlightIndex + 1;
    highlightIndex = nextIndex === resultLen? -1 : nextIndex;
  } else if (moveUp) {
    const nextIndex = previousHighlightIndex - 1;
    highlightIndex = nextIndex;
  }

  if (highlightIndex === -1) {
  // restore input value.
    inputElem.value = previousInput.value;
  } else {
    const highlightItem = resultItems[highlightIndex];
    const plainText = highlightItem.getAttribute('data-plain-text');
    highlightItem.classList.add('highlight');
    inputElem.value = plainText;
  }
};

const handleSelectAction = function(event, resultContainer) {
  clearResult(resultContainer);
};

const toggleContextSelectList = function(event) {
  const target = event.currentTarget;
  target.classList.toggle('active');
};

const toggleContextItems = function(allContextItems, selectedItem) {
  selectedItem.classList.add('active');

  for (let j = 0; j < allContextItems.length; j++) {
    const otherItem = allContextItems[j];
    if (otherItem === selectedItem) {
      continue;
    } else {
      otherItem.classList.remove('active');
    }
  }
};

const clearResult = function(resultContainer) {
  setTimeout(function() {
    resultContainer.classList.remove('active');
    resultContainer.innerHTML = '';
  }, 100); // why this setTimeout is needed
};

// not clearing innerHTML since dropdown list items
// are pre-defined
const clearContext = function(contextContainer) {
  contextContainer.classList.remove('active');
};

const getFormattedText = function(haystack, needle) {
  let formattedString = '';
  const needleLen = needle.length;

  for (let i = 0; i < haystack.length; i++) {
    const originalText = haystack.substring(i, i + needleLen);
    if (originalText.toLowerCase() == needle) {
      formattedString += `<b>${originalText}</b>`;
      i += needleLen -1;
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

const getMatchedResult = function(input, dataHash) {
  const results = [];
  const {dataSet, currentContext} = dataHash;
  const currentDataSet = dataSet[currentContext];

  if (!currentDataSet) {
    return results;
  }

  // this doesn't scale at all..
  // what if you have 1k entries in the data set?
  // 1. if a match has to start from the very first word: then we can use trie here..?

  for (let data of currentDataSet) {
    const {name: plainText, count, url} = data;
    if (plainText.toLowerCase().indexOf(input) !== -1) {
      const formattedText = getFormattedText(plainText, input);
      results.push({formattedText, plainText, count, url});
    }
  }

  return results;
};

const getComplexList = function(plainText, formattedText, url, count) {
  return `<li class="result-item" data-plain-text="${plainText}" data-url="${url}">
            <div class="result-text">
              ${formattedText}
            </div>
            <div class="external-link">
              <a href="${url}" target="_blank">${externalLinkSVG}</a>
            </div>
        </li>`;
};

const getSimpleList = function(plainText, formattedText) {
  return `<li class="result-item" data-plain-text="${plainText}">
          ${formattedText}
        </li>`;
};

const displayResult = function(data, resultContainer, searchInputElem, previousInput, selectedResultElem) {
  if (data && data.length !== 0) {
    resultContainer.classList.add('active');

    for (let i = 0; i < data.length; i++) {
      const {formattedText, plainText, count, url} = data[i];
      let listHTML = '';
      listHTML = url? getComplexList(plainText, formattedText, url, count) : getSimpleList(plainText, formattedText);
      resultContainer.innerHTML += listHTML;
    }
    activateResultListItem(resultContainer, searchInputElem, previousInput, selectedResultElem);
  } else {
    selectedResultElem.classList.remove('selected');
    clearResult(resultContainer);
  }
};

/* clicking on the list item will cause it to be selected
closing the completion list and fill the value. */
const activateResultListItem = function(resultContainer, searchInputElem, previousInput, selectedResultElem) {
  const resultItems = document.querySelectorAll('.result-item');
  const selectedLinkElem = selectedResultElem.querySelector('.external-link');

  for (let i = 0; i < resultItems.length; i++) {
    const resultItem = resultItems[i];

    resultItem.addEventListener('mouseenter', function(event) {
      const target = event.currentTarget;
      const plainText = target.getAttribute('data-plain-text');
      const dataUrl = target.getAttribute('data-url');
      const resultItems = document.querySelectorAll('.result-item');
      const resultLen = resultItems.length;

      for (let i = 0; i < resultLen; i++) {
        const resultItem = resultItems[i];
        resultItem.classList.remove('highlight');
      }

      searchInputElem.value = plainText;
      selectedLinkElem.innerHTML = `<a href="${dataUrl}" target="_blank">${externalLinkSVG}</a>`;
      target.classList.add('highlight');
    });

    resultItem.addEventListener('click', function(event) {
      selectedResultElem.classList.add('selected');
      clearResult(resultContainer);
    });
  }
};

/* The two activateXXX methods binds event listener as well
logically it should be inside bindSearchEvents, but since
the binding is on-demand so they are seprated */
const activateContextListItem = function(contextContainer, currentContextElem, dataHash) {
  const contextItems = document.querySelectorAll('.context-item');

  for (let i = 0; i < contextItems.length; i++) {
    const contextItem = contextItems[i];
    contextItem.addEventListener('click', function(event) {
      // This is needed because its parent also has a click handler to toggle
      // the context list. without
      event.stopPropagation();

      const target = event.currentTarget;
      const plainText = target.getAttribute('data-plain-text');
      const context = target.getAttribute('data-context');
      // update global context
      const newDataHash = getDataHash(context);

      newDataHash
      .then(({dataSet, currentContext}) => {
        dataHash.currentContext = currentContext;
        dataHash.dataSet = dataSet;

        toggleContextItems(contextItems, target);

        currentContextElem.innerText = plainText;
        clearContext(contextContainer);
      }).catch((e) => {
        // console.log(e);
      });
    });
  }
};

const bindSearchEvents = function(inputElem, resultsElem, dataHash, previousInput, selectedResultElem) {
  inputElem.addEventListener('focusin', function(event) {
    inputElem.classList.add('active');
  });

  inputElem.addEventListener('focusout', function(event) {
    inputElem.classList.remove('active');
    clearResult(resultsElem);
  });

  // prevent the form submition when pressing enter key
  inputElem.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });

  inputElem.addEventListener('keyup', function(event) {
    if (actionIsDispatchable(event)) {
      return dispatchKeyAction(event, inputElem, previousInput, resultsElem);
    }

    let currentText = inputElem.value;
    previousInput.value = currentText;

    resultsElem.innerHTML = '';

    if (currentText.length === 0) {
      return displayResult(null, resultsElem, inputElem, previousInput, selectedResultElem);
    }

    const results = getMatchedResult(currentText.toLowerCase(), dataHash);

    return displayResult(results, resultsElem, inputElem, previousInput, selectedResultElem);
  });
};

const bindContextEvents = function(contextContainerElem, currentContextElem, dataHash) {
  contextContainerElem.addEventListener('click', toggleContextSelectList, false);
  contextContainerElem.addEventListener('focusout', function(event) {
    const target = event.currentTarget;
    clearContext(target);
  });

  activateContextListItem(contextContainerElem, currentContextElem, dataHash);
};

const fetchFromTwitterAPI = function() {
  const makeGETRequest = function(url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      const req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function() {
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
      req.onerror = function() {
        reject(Error('Network Error'));
      };

      req.send();
    });
  };

  return makeGETRequest('/twitter');
};

// return Promise from this method
const getDataHash = function(currentContext = 'html') {
  const dataSet = {
    html: getHtmlCssTerms(),
    node: getNodeTerms(),
    pattern: getDesignPatternTerms(),
    refactor: getRefactoringTechniquesTerms(),
  };

  // kinda lazly init twitter trends: only make api call when context is twitter.
  const showTwitterTrends = currentContext === 'twitter';

  if (showTwitterTrends) {
    const twitterTrends = fetchFromTwitterAPI();

    return twitterTrends.then((trends) => {
      let parsedList = null;
      try {
        const trendsList = JSON.parse(trends);
        parsedList = trendsList;
      } catch (error) {
        console.warn(error);
      }

      dataSet.twitter = parsedList;
      return {dataSet, currentContext: 'twitter'};
    }).catch((e) => {
      console.log('Not able to fetch twitter trends data.');
      console.warn(e);
    });
  }

  return new Promise((resolve, reject) => {
    resolve({dataSet, currentContext});
  });
};

const init = function() {
  if (typeof document == 'undefined') {
    return;
  }

  const contextContainerElem = document.querySelector('#context_container');
  const currentContextElem = document.querySelector('#current_context');
  const searchInputElem = document.querySelector('#search_input');
  const searchResultsElem = document.querySelector('#search_results');
  const selectedResultElem = document.querySelector('#selected_result');
  // use this data to show default context on page?
  const defaultContext = 'html';
  // these two objects will be mutated: candidate for store/state
  const dataHashPromise = getDataHash(defaultContext);
  const previousInput = {value: ''};

  dataHashPromise.then((dataHash) => {
    bindSearchEvents(searchInputElem, searchResultsElem, dataHash, previousInput, selectedResultElem);
    bindContextEvents(contextContainerElem, currentContextElem, dataHash);
    searchInputElem.focus();
  });
};

init();

if (typeof module != 'undefined') {
  module.exports = {
    actionIsDispatchable,
    activateContextListItem,
    activateResultListItem,
    bindContextEvents,
    bindSearchEvents,
    clearContext,
    clearResult,
    dispatchKeyAction,
    displayResult,
    fetchFromTwitterAPI,
    getComplexList,
    getDataHash,
    getFormattedText,
    getMatchedResult,
    getSimpleList,
    handleNavAction,
    handleSelectAction,
    init,
    isNavAction,
    isSelectAction,
    toggleContextItems,
    toggleContextSelectList,
  };
}
