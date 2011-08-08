/*!
* Appcelerator JSON i18n v0.1 by Matthew O'Riordan
* By: http://mattheworiordan.com/
* Github: https://github.com/mattheworiordan/json.i18n-for-Titanium-Mobile
*
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

/*
 * JSON i18N is a replacement location service for Titanium as the current locale solution is inadequate:
 * - See ticket http://jira.appcelerator.org/browse/TC-184
 * 
 * JSON i18N is superior to the Titanium.Locale solution as it provides: 
 * - JSON is used instead of XML
 * - Default locale without using hints
 * - No bugs related to underscores and hints, see http://jira.appcelerator.org/browse/TIMOB-4191
 * 
 * Localization files are stored as JSON in the /Resources/i18n folder
 * They can have any arbitrary object structure such as
 *   { "parent": { "child": { "key": "value" } } }
 *   but must follow strict JSON formatting with keys and values enclosed in double quotes where applicable
 * 
 * /i18N/default.json is a required DEFAULT file
 * /i18N/[2 letter lower case language].json takes precedence over default.json
 * /i18N/[2 letter lower case language]-[2 letter upper case country].json takes precedence over language json
 * 
 * Please use language codes from http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 *   and country codes from http://en.wikipedia.org/wiki/ISO_3166-1
 */
var i18n = (function() {
  var defaultJson = 'default',
    deviceCountry = Titanium.Locale.currentCountry,
    deviceLanguage = Titanium.Locale.currentLanguage,
    currentCountry,
    currentLanguage,
    localisedData;

  /*
   * Deep copy of objects from newDefault to base
   * base is not overwritten with values from newDefaults
   * base object is modifed
   */
  function addDefaults(base, newDefaults) {
    for (var needle in newDefaults) {
      // Workaround for faulty JSON parse returning invalid object http://jira.appcelerator.org/browse/TIMOB-3373
      if (!newDefaults.hasOwnProperty || newDefaults.hasOwnProperty(needle)) {
        if (!base[needle]) {
          base[needle] = newDefaults[needle];
        } else {
          if (typeof base[needle] == 'object') {
            addDefaults(base[needle], newDefaults[needle]);
          }
        }
      }
    }
  }

  /* Load JSON data from /i18n/ directory */
  function loadData(localeID) {
    var file;
    try {
      file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'i18n', localeID + '.json');
    } catch(e) {
      // file does not exist, sometimes an exception is thrown for some odd reason
    }
    
    if (file && file.exists()) {
      try {
        return JSON.parse(file.read().text);
      } catch (ex) {
        Titanium.API.error("Invalid JSON file " + localeID + ".json");
        throw ex;
      }
    } else {
      return {};
    }
  }

  /* Add localisation data from JSON file to the localised data private object */ 
  function addLocalisedData(localeID) {
    var jsonData = loadData(localeID);
    addDefaults(localisedData, jsonData);
  }

  /* fetch the localised value based on a key with object notation such as view.message.title */
  function getString(key) {
    var key_hierarchy = key.split('.');
    var obj = localisedData;
    for (var i = 0; i < key_hierarchy.length; i++) {
      obj = obj[key_hierarchy[i]];
      if (!obj) { break; }
    }
    if (typeof obj === 'string') {
      return obj;
    } else {
      return '';
    }
  }

  /* 
   * Formatted string uses String.format which supports string interpolation
   * e.g. localised value = "Hello %1$s, thanks for buying a %2$s"
   *      getFormattedString('key.id', 'Matthew', 'Car');
   *      would return "Hello Matthew, thanks for buying a Car"
   */ 
  function getFormattedString(key) {
    var val = getString(key);
    if (typeof val === 'string') {
      if (arguments.length > 1) {
        // additional string formatting arguments have been passed, pass on to String.format
        if (Ti.Platform.osname == 'android') {
          // ridiculous bug http://jira.appcelerator.org/browse/TC-188 means we need a workaround solution
          return String.format(val, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
        } else {
          return String.format.apply(this, [val].concat(Array.prototype.slice.call(arguments, 1)));
        }
      } else {
        return val;
      }
    } else {
      return '';
    }
  }

  /* 
   * Load in the string resources in order of precedence
   * CountryLanguage pair takes precedence over Language which in turn takes precedence over Default
   */
  function setupLocalisedData (language, country) {
    localisedData = {};
    currentCountry = String(country ? country : 'unknown').toUpperCase();
    currentLanguage = String(language ? language : 'unknown').toLowerCase();
    addLocalisedData(currentLanguage + '-' + currentCountry);
    addLocalisedData(currentLanguage);
    addLocalisedData(defaultJson);
  }

  /* load up the localized resources */
  function init() {
    setupLocalisedData(deviceLanguage, deviceCountry);
  }

  /*
   * Initialize this object
   */
  init();

  /*
   * --- PUBLIC METHODS ---
   */
  return {
    /* get string value from JSON localised resources without interpolation */
    getString: getString,
    /* get string value from JSON localised resources with interpolation */
    getFormattedString: getFormattedString,
    /*
     * Force the use of a different locale instead of using device settings
     * @param language (2 letter language code)
     * @param country (2 letter country code)
     */
    forceNewLocale: setupLocalisedData,
    /* return current country locale */
    getCurrentCountry: function() {
      return currentCountry;
    },
    getCurrentLanguage: function() {
      return currentLanguage;
    }
  };
}());

/* Create shortcut to i18N.getString */
var I = i18n.getFormattedString;
