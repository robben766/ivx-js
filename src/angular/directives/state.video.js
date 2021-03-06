import createFactoryFunction from '../utilities/create-factory-function.js';
import VideoStateController from '../controllers/state.video.js';
import VideoEventConstants from "../../constants/video.events.js";

class VideoState {
    constructor($compile, $state, $sce, $timeout, iVXjs, iVXjsBus, iVXjsUIModule, createInlineVideo, pullInTemplate, ivxExperienceScope, iVXjsStateCreator, iVXjsVideoService) {
        this.template = this.templateHTML;
        this.restrict = 'E';
        this.replace = true;
        this.scope = {
            stateData: "="
        }
        this.controller = VideoStateController
        this.controllerAs = 'vm';
        this.link = ($scope, iElm, iAttrs, controller) => {
            let data = angular.copy($scope.stateData);

            controller.stateData = data;

            let { id, playerType = "html5", playerSettings = {}, embeddedViews = [], embedded, cuePoints = [], personalizations = [], header = {}, footer = {} } = data;
            let { vimeoId, youtubeId, inlineSrc, iphoneInline = false, controls } = angular.copy(playerSettings);
            const playerId = playerSettings.id ? playerSettings.id : `${id}-video-player`;
            let controlsHTML = iVXjsVideoService.getControlHTML(playerId, controls);

            if (vimeoId) playerType = 'vimeo';
            if (youtubeId) playerType = 'youtube';
            if (createInlineVideo.isiOS() && iphoneInline && inlineSrc) {
                playerType = 'html5';
                playerSettings.src = inlineSrc;
                data.isIphone = true;
            }

            controller.controls = controls;

            controller.playerId = playerId;

            let videoPlayerHTML = `
               <ivxjs-${playerType}-video-player class="ivx-state-video-player" player-id='${playerId}' settings="vm.stateData.playerSettings" state-data="vm.stateData"></ivxjs-${playerType}-video-player>
               ${controlsHTML}`;

            data = pullInTemplate.convertHeaderFooter(header, footer, data, controller);

            let videoFramework = new iVXjsUIModule.states.video(videoPlayerHTML, data);

            $scope = ivxExperienceScope.setScopeExperience($scope);
            
            iElm.html(videoFramework.html);

            if (!embedded && embeddedViews.length > 0) {
                iVXjsStateCreator.addViews(embeddedViews, iElm);
            }

            controller.embedded = embedded;

            $compile(iElm.contents())($scope, (compiled) => {
                iElm.html(compiled);
            });

            $scope.$on('$destroy', () => {
                let videoEventNames = new VideoEventConstants();

                iVXjsBus.removeListener(videoEventNames.ENDED, controller.videoEnded);
            })


        }
    }

    get templateHTML() {
        return `<div ng-class="{'ivx-embedded-state': vm.embedded}" class="ivx-state-container ivx-state-video-container video-state-container"></div>`;
    }
}

VideoState.$inject = ['$compile', '$state', '$sce', '$timeout', 'iVXjs', 'ivxjs.bus', 'ivxjs.modules.ui', 'createInlineVideo', 'pullInTemplate', 'ivxExperienceScope', 'iVXjsStateCreator', 'iVXjsVideoService'];

export default angular
    .module('ivx-js.directives.state.video', [])
    .directive('ivxjsVideoState', createFactoryFunction(VideoState))
    .name;