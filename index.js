var prompt = require('prompt');
var color = require('color');
var request = require('request');
var _ = require('lodash');

var CDN_ROOT = 'http://localhost:333';

function Dummer() {
    var self = this;

    self.list = function(callback) {
        Get(
            CDN_ROOT +  '/packages.json',
            function(list){

                var packages = {};
                _.each(list, function(value){
                    var packageInfo = new DummerPackageInfo
                    (
                        value.name,
                        value.description,
                        value.directory,
                        value.default_version
                    );

                    _.each(value.versions, function(version){
                        //console.log(version);
                        var versionInfo = new DummerPackageVersionInfo(
                            version.version,
                            version.directory,
                            version.default_build
                        );

                        _.each(version.builds, function(build){
                            var buildInfo = new DummerPackageBuildInfo(
                                build.name,
                                build.js,
                                build.font,
                                build.css,
                                build.img
                            );

                            versionInfo.addBuild(buildInfo);
                        });

                        packageInfo.addVersion(versionInfo);
                    });

                    packages[value.name] = packageInfo;
                });

                callback && callback(packages);
            },
            function(){ },
            'json'
        );
    };

    self.install = function(packageInfo, version, build, callback){

    }
}


function DummerPackageInfo (name, description, directory, default_version) {
    var self = this;
    var versions = {};

    self.addVersion = function(packageVersion){
        versions[packageVersion.version] = packageVersion;
    };

    self.__defineGetter__('name', function(){return name; });
    self.__defineGetter__('description', function(){return description; });
    self.__defineGetter__('directory', function(){return directory});
    self.__defineGetter__('versions', function(){return versions});
    self.__defineGetter__('default_version', function(){return default_version; });
}

function DummerPackageVersionInfo(version, directory, default_build) {
    var self = this;
    var builds = {};
    self.addBuild = function(buildInfo) {
        builds[buildInfo.name] = buildInfo;
    };

    self.__defineGetter__('builds', function(){return builds; });
    self.__defineGetter__('version', function(){ return version; });
    self.__defineGetter__('directory', function(){ return directory; });
    self.__defineGetter__('default_build', function(){ return default_build; });
}

function DummerPackageBuildInfo(name, js_files, font_files, css_files, img_files) {
    var self = this;
    self.__defineGetter__('name', function(){return name; });
}

function InstallInfo (packageInfo, version, build){
    var self = this;

    if(version == 'default'){
        version = packageInfo.default_version;
    }

    if(build == 'default'){
        build = packageInfo.versions[version].default_build;
    }

    self.__defineGetter__('package', function(){ return packageInfo; });
    self.__defineGetter__('version', function(){ return packageInfo.versions[version]; });
    self.__defineGetter__('build', function(){ return self.version.builds[build]; });
}

function createInstallInfo(packageInfo, version, build){
    return new InstallInfo(packageInfo, version, build);
}

function parseVersion(string) {
    var p = { "*" : "", "@" : "", "#" : "" };

    var currentKey = '*', src = '*' + string;

    for(var i = 1; i < src.length; i++){
        var c = src[i];
        if(c in p){
            currentKey = c;
        }else{
            p[currentKey]+=c;
        }
    }

    return {
        name : p['*'],
        version : p['@'] || 'default',
        build : p['#'] || 'default'
    };
}

function DownloadManager () {
    var self = this;
}


function Get(url, onSuccess, onError, format){
    format = format || 'text';
    function parse_format(body){
        return format=='json'?JSON.parse(body):body;
    }

    request(url, function(error, response, body){
        if (!error && response.statusCode == 200){
            onSuccess && onSuccess( parse_format(body) );
        }else{
            onError && onError(response.statusCode);
        }
    });
}

module.exports.Dummer = Dummer;
module.exports.DummerPackage = DummerPackageInfo;
module.exports.parseVersion = parseVersion;
module.exports.createInstallInfo = createInstallInfo;