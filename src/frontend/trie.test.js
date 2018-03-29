
const Trie = require('./trie.js');

describe('Trie', function() {
  const dict = ['normal', 'trie', 'tree', 'try', 'norman', 'tesla', 'tr'];
  const queries = [
    {input: 'n', output: ['normal', 'norman']},
    {input: 'no', output: ['normal', 'norman']},
    {input: 'noo', output: []},
    {input: 's', output: []},
    {input: 't', output: ['tr', 'trie', 'tree', 'try', 'tesla']},
    {input: 'tr', output: ['tr', 'trie', 'tree', 'try']},
    {input: 'tri', output: ['trie']},
  ];

  const inst = new Trie(dict);

  it('passes', function() {
    for (let query of queries) {
      const result = inst.getMatches(query.input);
      expect(result).toEqual(query.output);
    }
  });
});
