import { iVXioActions } from './actions.js'
import { iVXioRules } from './rules.js'
import { Actions as iVXjsActions } from '../ivx-js/actions.js'
import { Comparator } from '../../../utilities/comparator.js'
import { TypeValidator, ObjectParsers } from '../../../utilities/type-parsers.js';
import { assert } from '../../../utilities/asserts.js';
import iVXioErrorNames from '../../../constants/iVXio.errors.js';

let comparator = new Comparator()
let typeValidator = new TypeValidator()
let objectParser = new ObjectParsers()

/**
 * Generates an iVXio data module that iVXjs can use for 
 * navigation, data setting and progress.
 */
export class iVXio {

  /**
   * Pulls in any module settings and the global settings
   * for this iVXjs experience to set up this iVXio 
   * enhance data object.
   * 
   * @param {object} moduleSettings - settings to be passed in to the 
   * iVXio Expereince host.
   * @param {object} iVXjsSettings - global settings for this iVXjs experience.
   */
  constructor(experienceHostSettings, iVXjsSettings = {}, Bus, iVXjsLog) {

    /**
     * Module settings for iVXio which will be all the settings
     * used with the iVXio's experience host such as story keys and
     * funnels.
     * 
     * @type {object}
     */
    this.experienceHostSettings = experienceHostSettings

    /**
     * Global settings for this iVXjs experience 
     * 
     * @type {object}
     */
    this.iVXjsSettings = iVXjsSettings;
    this.Bus = Bus;
    this.iVXjsLog = iVXjsLog;
  }

  /**
   * Takes the current settings and then enhances the story data 
   * pulled from the iVXio experience host and enhances them to 
   * work with iVXjs.
   * 
   * @return {Promise} - a promise that evaluates whether this experience 
   * was successfully enhanced.
   */
  enhance() {
    let { experienceHostSettings = {}, iVXjsSettings = {} } = this;
    let iVXioErrors = new iVXioErrorNames();
    let self = this
    let enhancementPromise = new Promise((resolve, reject) => {
      if(typeof iVX === 'undefined'){
         window.setTimeout(() =>{
           self.Bus.emit(iVXioErrors.PLATFORM_UNAVAILABLE, {});
         }, 100)
          reject();
          return;
      }

      iVX(experienceHostSettings)
        .then(
        (iVX) => {
          let {experience: experienceSettings = {}, rules: customRules} = iVXjsSettings;
          let defaultActions = objectParser.merge(new iVXjsActions(), experienceSettings);
          let experience = objectParser.merge(defaultActions, iVX.experience);
          let modifiedActions = new iVXioActions(experience, this.iVXjsLog);
          let {ui: storyUI, validation: storyValidation} = iVX.experience.story.data;
          let rules = new iVXioRules(experience, customRules).rules;
          let enhancediVXjsSettings = {
            ui: iVXjsSettings.ui,
            validation: iVXjsSettings.validation,
            config: iVX.experience.story.data,
            experience: experience,
            rules: rules,
            actions: modifiedActions
          };

          resolve(enhancediVXjsSettings);
        },
        (error) => {
          self.Bus.emit(iVXioErrors.EXPERIENCE, error);
          reject(error);
        })
    })

    return enhancementPromise
  }
}
