module.exports.onQueryResolveError = function(error) {
    console.log(error);//TODO
};

module.exports.onPackageInstallComplete = function($package, url, files) {
    console.log($package.name, 'instalation complete');//TODO
};

module.exports.onPackageInstallError = function(error){
    console.log('error', error); //TODO
};

module.exports.onError = function(errorAction, error) {
    console.log(errorAction.blue, 'failed with', error);
  //TODO
};