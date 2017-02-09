import Ember from 'ember';

const DDSFilePicker = Ember.Component.extend({
  store: Ember.inject.service(), // Needs access to store to query for children
  resources: [], // Can be files or folders
  pickedFiles: [],
  filesChanged: function() {},
  actions: {
    toggleFile(file) {
      let pickedFiles = this.get('pickedFiles');
      if(pickedFiles.includes(file)) {
        pickedFiles.removeObject(file);
      } else {
        pickedFiles.addObject(file);
      }
      this.get('filesChanged')();
    }
  },
  projectChanged: Ember.observer('project', function() {
    this.get('store').query('dds-resource', {
      project_id: this.get('project.id')
    }).then((resources) => {
      this.set('resources', resources);
    });
  })
});

DDSFilePicker.reopenClass({
  positionalParams: ['project', 'pickedFiles', 'filesChanged']
});

export default DDSFilePicker;