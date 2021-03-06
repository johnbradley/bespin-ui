import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('token-detail-row', 'Integration | Component | token detail row', {
  integration: true
});

test('it renders three columns', function(assert) {
  this.set('token', Ember.Object.create(
    {
      id: 'SecretValue123',
      created: 'SOMEDATE'
    }));
  this.render(hbs`{{token-detail-row token}}`);

  assert.equal(this.$('td').length, 3);
  assert.equal(this.$('td :first .sensitive-value-span').text(), 'Secret********',
    'First column should display the first few characters then asterisks initially');
  assert.equal(this.$('td').eq(1).text(), 'SOMEDATE', 'Second column should display the created date');
  assert.equal(this.$('td').eq(2).text(), 'Delete', 'Third column should show a delete button');

  Ember.run(() => this.$('td :first .sensitive-value-show-button').click());
  assert.equal(this.$('td :first .sensitive-value-span').text(), 'SecretValue123',
    'First column should display the whole token once show button is clicked');
});

test('runs onDeleteToken action when user clicks Delete', function(assert) {
  assert.expect(1);
  this.set('token', Ember.Object.create(
    {
      id: 'SecretValue123',
      created: 'SOMEDATE'
    }));
  this.set('externalAction', (token) => {
    assert.equal(token.id, 'SecretValue123');
  });
  this.render(hbs`{{token-detail-row token onDeleteToken=(action externalAction)}}`);
  Ember.run(() => this.$('.deleteToken-button').click());
});
