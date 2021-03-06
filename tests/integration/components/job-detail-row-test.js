import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('job-detail-row', 'Integration | Component | job detail row', {
  integration: true,
  setup() {
    this.container.lookup('router:main').setupRouter();
  }
});

test('it renders', function(assert) {
  const job = {id:1,name:'job', workflowVersion: {
    version: 23,
    workflow: {name:'RNA-seq'}},
    outputProject: '{"name":"results","project_id":"ab-12-cd-34"}'
  };
  this.set('job',job);
  this.render(hbs`{{job-detail-row job}}`);

  assert.equal(this.$('.job-detail-cell-id').text().trim(), '1');
  assert.equal(this.$('.job-detail-cell-name').text().trim(), 'job');
  assert.equal(this.$('.job-detail-cell-workflow-name').text().trim().replace(/ /g, ''), 'RNA-seq-v23');
  assert.equal(this.$('.job-detail-cell-readme').text().trim(), '', 'Should not show readme link unless job is finished');
  // Without routing, the link-to doesn't generate a href
  assert.equal(this.$('a.job-show-link').length, 1, 'Should generate a link for the job details');
});

test('it renders readme link for finished jobs', function(assert) {
  this.set('job', {id: 123, isFinished: true});
  this.render(hbs`{{job-detail-row job}}`);
  assert.equal(this.$('.job-detail-cell-readme a').text().trim(), 'README', 'Should show readme link for finished job');
  assert.equal(this.$('.job-detail-cell-readme a').attr('href'), '/jobs/123/readme');
});

test('it hides readme link for finished jobs', function(assert) {
  this.set('job', {isFinished: false});
  this.render(hbs`{{job-detail-row job}}`);
  assert.equal(this.$('.job-detail-cell-readme a').text().trim(), '', 'Should not show readme link for unfinished job');
});

test('it renders a modal confirmation button for deletable jobs', function(assert) {
  this.set('job', {isDeletable: false});
  this.render(hbs`{{job-detail-row job}}`);
  assert.equal(this.$('.job-detail-cell-delete button.modal-confirmation-open').length, 0);

  this.set('job', {isDeletable: true});
  this.render(hbs`{{job-detail-row job}}`);
  assert.equal(this.$('.job-detail-cell-delete button.modal-confirmation-open').length, 1);

});

test('it shows updated formatted by moment', function(assert) {
  const date = Date.now();
  this.set('job', {lastUpdated: date});
  this.render(hbs`{{job-detail-row job}}`);
  assert.equal(this.$('.job-detail-cell-updated').text(), 'a few seconds ago',
    'lastUpdated should be formatted by moment to a human');
});

test('it shows elapsedTime with hours suffix', function(assert) {
  this.set('job', {usage: {vmHours: 12.123}});
  this.render(hbs`{{job-detail-row job}}`);
  assert.equal(this.$('.job-detail-cell-elapsed-time').html(), '12.1 hours', 'vm hours shown for elapsed time');
});
