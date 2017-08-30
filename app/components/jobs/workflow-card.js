import Ember from 'ember';

export default Ember.Component.extend({
  workflow: null,
  onPicked: null,
  actions: {
    pick() {
      const workflow = this.get('workflow');
      const onPicked = this.get('onPicked');
      onPicked(workflow);
    },
  }
});
