/*!
 * Copyright 2018 Hitachi Vantara. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The component for database connection details
 */
define([
  'text!./details.html',
  'pentaho/i18n-osgi!repositories-plugin.messages',
  'css!./details.css'
], function (template, i18n) {

  'use strict';

  var options = {
    bindings: {
      onError: "&",
      connection: "="
    },
    controllerAs: "vm",
    template: template,
    controller: detailsController
  };

  detailsController.$inject = ["detailsService", "$state"];

  /**
   * Details controller for database connection
   *
   * @param {Object} detailsService - Service for database connection
   * @param {Object} $state - Object for controlling app state
   */
  function detailsController(detailsService, $state) {
    var vm = this;
    vm.$onInit = onInit;
    vm.selectDatabase = selectDatabase;
    vm.canFinish = canFinish;
    vm.setDefaultConn = setDefaultConn;
    vm.back = back;
    vm.finish = finish;
    vm.resetErrorMsg = resetErrorMsg;

    /**
     * The $onInit hook of components lifecycle which is called on each controller
     * after all the controllers on an element have been constructed and had their
     * bindings initialized. We use this hook to put initialization code for our controller.
     */
    function onInit() {
      vm.connectionDetails = i18n.get('repositories.connectiondetails.label');
      vm.displayNameLabel = i18n.get('repositories.displayName.label');
      vm.databaseConnection = i18n.get('repositories.database.connection.label');
      vm.descriptionLabel = i18n.get('repositories.description.label');
      vm.launchLabel = i18n.get('repositories.launch.label');
      vm.finishLabel = i18n.get('repositories.finish.label');
      vm.backLabel = i18n.get('repositories.back.label');
      vm.existsMessage = i18n.get('repositories.error.exists.label');
    }

    /**
     * Determine if the finish button is enabled
     *
     * @returns {boolean}
     */
    function canFinish() {
      return vm.connection.displayName && vm.connection.databaseConnection !== "None";
    }

    /**
     * Sets that the connection is default
     *
     * @param {boolean} isDefault
     */
    function setDefaultConn(isDefault) {
      vm.connection.isDefault = isDefault;
    }

    /**
     * Transition to the finish state
     */
    function finish() {
      if (vm.connection.edit || vm.connection.modify) {
        $state.go("database.loading");
      } else {
        detailsService.checkDuplicate(vm.connection).then(function (res) {
          if (res.data === true) {
            vm.onError({message: vm.existsMessage});
          } else {
            resetErrorMsg();
            $state.go("database.loading");
          }
        });
      }
    }

    function resetErrorMsg() {
      vm.onError({message: null});
    }

    /**
     * Transition to the select database state
     */
    function selectDatabase() {
      $state.go("database.select");
    }

    /**
     * Go back to the manager or other state
     */
    function back() {
      if (vm.connection.edit) {
        $state.go("manager");
      } else {
        $state.go("other", {type: "KettleDatabaseRepository"});
      }
    }
  }

  return {
    name: "database.details",
    options: options
  };

});
