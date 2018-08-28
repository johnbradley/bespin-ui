import Ember from 'ember';

const JobDetailRow = Ember.Component.extend({
  tagName: 'tr',
  classNames: ['job-detail-row'],
  actions: {
    delete() {
      this.get('job').destroyRecord();
    }
  },
  modalConfirmationTitle: Ember.computed('job.id', function() {
    return `Are you sure you want to delete job ${this.get('job.id')}?`;
  }),
  modalConfirmationBody: Ember.computed('job.name', function() {
    return `Your Bespin job '${this.get('job.name')}' will be deleted permanently. This action cannot be undone.`
  }),
  elapsedTime: Ember.computed('job.usage.vm_hours', function () {
    const vmHours = this.get('job.usage.vm_hours');
    if (vmHours) {
      return Number.parseFloat(vmHours).toFixed(1) + ' hours';
    }
    return null;
  })
});

JobDetailRow.reopenClass({
  positionalParams: ['job']
});

export default JobDetailRow;
