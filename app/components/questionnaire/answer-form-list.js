import Ember from 'ember';

/**
 * Map of CWL specified types to the Ember UI components that can provide their data
 * @type {[*]}
 */
const ComponentInfos = [
  {
    cwlType: { type: 'array', items: { type: 'array', items: 'File' } }, // From CWL
    name: 'file-group-list',  // Component to render
    description: 'A list of file pairs' // Description
  }
];

const AnswerFormList = Ember.Component.extend({
  tagName: 'ul',
  classNames: ['answer-form-list'],
  answerSet: null,
  fields: Ember.computed('answerSet.questionnaire.userFieldsJson.@each', function() {
    const userFields = this.get('answerSet.questionnaire.userFieldsJson') || [];
    const fieldsToComponents = userFields.map(field => {
      let componentInfo = this.componentInfoForCwlType(field.type);
      if(Ember.isEmpty(componentInfo)) {
        return null;
      } else {
        return Ember.Object.create({
          name: field.name,
          componentName: `questionnaire/${componentInfo.name}`
        });
      }
    });
    // Strip out any fields for which we don't have a component
    return fieldsToComponents.compact();
  }),

  /**
   * Look up the component name to use to render a form field for the given CWL type
   * May return null
   * @param type
   * @returns {*}
   */
  componentInfoForCwlType: function(cwlType) {
    return ComponentInfos.find(each => {
      // Ember does not have a comparison function for objects, so instead we'll compare their JSON representations
      // This should be fine for small types
      return JSON.stringify(each.cwlType) === JSON.stringify((cwlType));
    });
  },

  actions: {
    answerChanged(answerComponent) {
      // Answer components will send this action when their answer changes
      // When that happens, update the answer and any input files
      const answerSet = this.get('answerSet');
      let userJobOrder = Ember.Object.create(answerSet.get('userJobOrderJson'));
      userJobOrder.setProperties(answerComponent.get('answer'));
      answerSet.set('userJobOrderJson', userJobOrder);
      // set the stage group in the files
      answerComponent.get('inputFiles').setEach('stageGroup', answerSet.get('stageGroup'));
    }
  }
});

AnswerFormList.reopenClass({
  positionalParams: ['answerSet']
});

export default AnswerFormList;
