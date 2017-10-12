import Ember from 'ember';

export default Ember.Service.extend({
  fetchReadmeUrl(outputDir) {
    const fetchUrl = this.get('fetchUrl');
    return outputDir.readmeURL().then(function (response) {
      const urlInfo = response['dds-file-url'];
      const url = `${urlInfo.host}${urlInfo.url}`;
      return fetchUrl(url);
    });
  },
  fetchUrl(url) {
    return Ember.$.get(url);
  }
});
