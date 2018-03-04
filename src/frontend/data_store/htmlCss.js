const getHtmlCssTerms = function() {
  const data = [
    {
      'name': 'element',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    },
    {
      'name': 'border',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/border',
    },
    {
      'name': 'border-radius',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius',
    },
    {
      'name': 'background',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/background',
    },
    {
      'name': 'body',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body',
    },
    {
      'name': 'padding',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/padding',
    },
    {
      'name': 'margin',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin',
    },
    {
      'name': 'position',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/position',
    },
    {
      'name': 'display',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/display',
    },
    {
      'name': 'float',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/float',
    },
    {
      'name': 'flex',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex',
    },
    {
      'name': 'block formatting context',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context',
    },
    {
      'name': 'document',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/API/Document',
    },
    {
      'name': 'dom tree',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Using_the_W3C_DOM_Level_1_Core',
    },
    {
      'name': 'elements',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
    },
    {
      'name': 'label',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label',
    },
    {
      'name': 'legend',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend',
    },
    {
      'name': 'input',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input',
    },
    {
      'name': 'optgroup',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup',
    },
    {
      'name': 'option',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option',
    },
    {
      'name': 'select',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select',
    },
    {
      'name': 'textarea',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea',
    },
    {
      'name': 'fieldset',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset',
    },
    {
      'name': 'button',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
    },
    {
      'name': 'form',
      'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form',
    },
  ];

  return data;
};

module.exports = getHtmlCssTerms;
