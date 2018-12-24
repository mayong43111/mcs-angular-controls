namespace mcscontrols {

    class ConfigurationBroker {

        private configuration: { [key: string]: string; } = {

        };

        public getConfig() {
            return this.configuration;
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

    var configurationBroker = angular.module('mcs.contols.configurationBroker', []);
    configurationBroker.provider('configurationBroker', ConfigurationProvider);
}