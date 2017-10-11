const {getDataHash} = require('../../src/frontend/main');

describe('#getDataHash', () => {
  beforeEach(() => {
    global.document = {getElementById: () => {}};
  });

  it('is a function', () => {
    expect(typeof(getDataHash)).toBe('function');
  });
});

