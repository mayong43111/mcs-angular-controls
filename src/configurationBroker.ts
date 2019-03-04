namespace mcscontrols {

    class ConfigurationBroker {

        private configuration: { [key: string]: any; } = {

        };

        public getConfig() {
            return this.configuration;
        }

        public getResourceUri(relativeUrl: string, key?: string) {

            if (relativeUrl.indexOf('http') == 0) {
                return relativeUrl;
            }

            if (!key || !this.getAppSetting('resourceUri') || !this.getAppSetting('resourceUri')[key]) {
                return relativeUrl;
            }

            let baseUrl: string = this.getAppSetting('resourceUri')[key];

            if (baseUrl.lastIndexOf('/') != 0) {

                baseUrl = baseUrl + '/';
            }

            if (relativeUrl.indexOf('/') == 0) {
                relativeUrl = relativeUrl.slice(1, relativeUrl.length);
            }

            return baseUrl + relativeUrl;
        }

        public getAppSetting(key: string) {

            return this.getConfig()[key];
        }

        public mergeConfigString(target: string) {
            this.mergeConfig(angular.fromJson(target));
        }

        public mergeConfig(target: object) {
            return angular.extend(this.configuration, target);
        }
    }

    class ConfigurationProvider {

        private configurationBroker: ConfigurationBroker = new ConfigurationBroker();

        public static $inject: Array<string> = [];
        constructor() {
        }

        public initialize(config: object) {
            this.configurationBroker.mergeConfig(config);
        };

        $get() {
            return this.configurationBroker;
        }
    }

    var configurationBroker = angular.module('mcs.controls.configurationBroker', []);
    configurationBroker.provider('configurationBroker', ConfigurationProvider);
}