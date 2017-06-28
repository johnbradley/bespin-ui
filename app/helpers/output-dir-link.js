import Ember from 'ember';

function projectLinkTag(projectId) {
  return `https://dataservice.duke.edu/#/project/${projectId}`;
}

export function outputDirLink(params) {
  if(params && params.length > 0 && params[0] && params[0].get('project.id')) {
    return projectLinkTag(params[0].get('project.id'));
  } else {
    return '';
  }
}

export default Ember.Helper.helper(outputDirLink);