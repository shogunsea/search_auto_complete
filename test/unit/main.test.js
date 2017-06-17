const {expect} = require('chai');
const {getDataHash} = require('../../src/frontend/main');

describe('#getDataHash', () => {
  beforeEach(() => {
    global.document = {getElementById: () => {}};
  });

  it('is a function', () => {
    expect(typeof(getDataHash)).to.equal('function');
  });
});

