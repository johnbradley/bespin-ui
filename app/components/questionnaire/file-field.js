import Ember from 'ember';
import { FileItem } from 'bespin-ui/utils/file-item-list';

const FileField = Ember.Component.extend({
  /**
   * Lets user pick a file and see any errors associated with the field.
   */
  tagName: 'div',
  classNames: ['file-field', 'row'],
  answerFormErrors: null,
  fieldErrors: Ember.computed('answerFormErrors.errors.[]', 'fieldName', function() {
    return this.get('answerFormErrors.errors').filterBy('field', this.get('fieldName'));
  }),
  validityDidChange: Ember.on('init', Ember.observer('fileItem', function() {
      const answerFormErrors = this.get('answerFormErrors');
      const fieldName = this.get('fieldName');
      if(!answerFormErrors) {
        // We have not answerFormErrors object, bail out
        return;
      }
      if(!this.get('fileItem')) {
        answerFormErrors.setError(fieldName, `Please select a file.`)
      } else {
        // All Good!
        answerFormErrors.clearError(fieldName);
      }
    })),
  formatSettings: null,  // settings based on cwl type and format
  displayFieldName: Ember.computed('fieldName', function() {
    const fieldName = this.get('fieldName');
    if(fieldName) {
      return fieldName.capitalize();
    } else {
      return null;
    }
  }),
  fieldName: null,
  ddsProjects: Ember.inject.service(),
  ddsUserCredentials: Ember.inject.service(),
  credential: null, // populated on didInsertElement
  projects: null, // populated on didInsertElement
  answer: Ember.computed('fieldName', 'fileItem.cwlObject', function() {
    const fieldName = this.get('fieldName');
    const answer = Ember.Object.create();
    answer.set(fieldName, this.get('fileItem.cwlObject'));
    return answer;
  }),
  index: null, // order within the questionnaire
  fileItem: null,
  inputFiles: Ember.computed('fileItem.inputFile', function() {
    // returns a flat array of the job input files
    return [this.get('fileItem.inputFile')];
  }),
  ddsFiles: Ember.computed('fileItem.ddsFile', function () {
      return [this.get('fileItem.ddsFile')];
  }),
  actions: {
    remove() {
      this.set('fileItem', null);
      this.sendAction('answerChanged', this);
    },
    setFile(file) {
      const credential = this.get('credential');
      // Temporarily removing prefix to preserve original file names.
      // See https://github.com/Duke-GCB/bespin-ui/issues/39
      const prefix = ''; // `${this.get('fieldName')}_${Date.now()}_`;
      const fileItem = FileItem.create({ddsFile: file, prefix: prefix, credential: credential});
      this.set('fileItem', fileItem);
      this.sendAction('answerChanged', this);
    }
  },

  init() {
    this._super(...arguments);
  },

  // Per https://emberigniter.com/render-promise-before-it-resolves/
  didInsertElement() {
    this._super(...arguments);
    this.get('ddsUserCredentials').primaryCredential().then(credential => {
      this.set('credential', credential);
    });
    this.get('ddsProjects').projects().then(projects => {
      this.set('projects', projects);
    });
  }
});

FileField.reopenClass({
  positionalParams: ['fieldName','answerChanged']
});

export default FileField;

