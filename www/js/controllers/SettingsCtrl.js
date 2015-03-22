/**
 * Created by s_tsvetanov on 20.3.2015 г..
 */

app.controller('SettingsCtrl', function($scope, $log, deviceService) {

    $scope.settings = deviceService.getSettings();

    $scope.optionsChange = function(){
        deviceService.setSettings($scope.settings);
        $log.debug('SettingsCtrl: changed - ' + JSON.stringify($scope.settings));
    };
});