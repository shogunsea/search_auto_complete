// Normal trie tree only supports searching from the root.
// modify its behavir: using a hashmap to map characters to tree nodes?

// 1. if a match has to start from the very first word: then we can use trie here..?
// trie spec: {
//   1. ignore space? special chars? char only?
//   2. interface?
//   3. spec should be flexible: trie can either store words(assuming input will be well split words) or char
// }

/**
 *
 *
 * @class Node
 */
class Node {
  /**
   * Creates an instance of Node.
   * @param {string} [val='']
   * @memberof Node
   */
  constructor(val = '') {
    this.val = val;
    this.children = null; // nodes it connects to.
  }
  /**
   *
   *
   * @param {any} val
   * @return {Node}
   * @memberof Node
   */
  addNode(val) {
    if (this.children === null) {
      this.children = {};
    }

    this.children[val] = this.children[val]? this.children[val] : new Node(val);
    // returning the reference to this node is crucial.
    return this.children[val];
  }
}
/**
 *
 *
 * @class Trie
 */
class Trie {
  /**
   * Creates an instance of Trie.
   * @param {any} wordsList
   * @memberof Trie
   */
  constructor(wordsList) {
    this.root = new Node();

    for (let word of wordsList) {
      let runner = this.root;
      for (let c of word) {
        runner = runner.addNode(c);
      }
    }
  }
  /**
   *
   * @desc reutrn all possible matches based on the given string prefix.
   * @param {any} prefix
   * @memberof Trie
   * @return {[]}
   */
  getMatches(prefix) {
    let runner = this.root;
    let hasMatch = true;

    for (let c of prefix) {
      if (runner.children[c]) {
        runner = runner.children[c];
      } else {
        hasMatch = false;
        break;
      }
    }

    // traverse down the tree to get all words.
    if (hasMatch) {
      const suffixList = [];
      this.dfsTraverse(runner, suffixList, []);
      const result = suffixList.map((s) => prefix.substring(0, prefix.length - 1) + s);

      return result;
    } else {
      return [];
    }
  }

  /**
   *
   *
   * @param {any} node
   * @param {any} resultList
   * @param {any} tempList
   * @memberof Trie
   */
  dfsTraverse(node, resultList, tempList) {
    if (node === null) {
      return;
    }

    tempList.push(node.val);
    if (node.children === null) { // leaf node
      const match = tempList.join('');
      resultList.push(match);
    } else {
      for (let key in node.children) {
        if (node.children.hasOwnProperty(key)) {
          const child = node.children[key];
          this.dfsTraverse(child, resultList, tempList);
        }
      }
    }
    tempList.pop();
    return;
  }
}


module.exports = Trie;
