import Ember from 'ember';

const SensitiveValue = Ember.Component.extend({
  value: null,
  hideValue: true,
  showLeadingCharacters: 0,
  displayedValue: Ember.computed('value', 'hideValue', 'hiddenValue', 'showLeadingCharacters', function () {
    var value = this.get('value');
    if (value && this.get('hideValue')) {
      const showLeadingCharacters = this.get('showLeadingCharacters');
      const head = value.slice(0, showLeadingCharacters);
      const tail = value.slice(showLeadingCharacters).replace(/./g, '*');
      return head + tail;
    } else {
      return value;
    }
  }),
  actions: {
    showValue() {
      this.set('hideValue', false);
    }
  }
});

SensitiveValue.reopenClass({
  positionalParams: ['value']
});

export default SensitiveValue;
