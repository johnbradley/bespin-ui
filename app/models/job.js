import DS from 'ember-data';

export default DS.Model.extend({
  workflowVersion: DS.belongsTo('workflow-version'),
  name: DS.attr('string'),
  created: DS.attr('date'),
  state: DS.attr('string'),
  step: DS.attr('string'),
  lastUpdated: DS.attr('date'),
  vmFlavor: DS.attr('string'),
  vmInstanceName: DS.attr('string'),
  vmProjectName: DS.attr('string'),
  jobOrder: DS.attr('string'), // These will be JSON - can we add a transform?
  outputDir: DS.attr('string'), // Don't have an API for this yet, how do we create output dirs?
  start() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.start(this.get('id'));
  },
  cancel() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.cancel(this.get('id'));
  },
  restart() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.restart(this.get('id'));
  }
});