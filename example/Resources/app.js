/*global i18n:false */ // JSLint

Titanium.include('vendor/json.i18n.js');

Titanium.UI.setBackgroundColor('#000');

var win = Titanium.UI.createWindow();

var greetingLabel = Titanium.UI.createLabel({
  top: 20,
  left: 30,
  color: '#FFF',
  height: 30
});

var languageLabel = Titanium.UI.createLabel({
  top: 100,
  color: '#FFF',
  height: 30,
  left: 30
});

var countryLabel = Titanium.UI.createLabel({
  top: 130,
  color: '#FFF',
  height: 30,
  left: 30
});

var localeLabel = Titanium.UI.createLabel({
  bottom: 150,
  color: '#FFF',
  height: 60,
  left: 30
});

win.add(greetingLabel);
win.add(languageLabel);
win.add(countryLabel);
win.add(localeLabel);

function setText() {
  greetingLabel.text = I('startup.labelGreeting', 'with', 'interpolation');
  languageLabel.text = 'Language: ' + I('startup.labelLanguage');
  countryLabel.text = 'Country: ' + I('startup.labelCountry');
  localeLabel.text = 'Locale defined as (lang-COUNTRY): ' + i18n.getCurrentLanguage() + '-' + i18n.getCurrentCountry();
}

setText();

var localeIndex = 0;
var locales = [{ country: 'FR', language: 'fr' }, { country: 'AR', language: 'es' }, { country: 'US', language: 'en'}];

var switchLocaleButton = Titanium.UI.createButton({
  title: I('startup.buttons.change.title'),
  bottom: 50,
  height: 30,
  width: 250
});

switchLocaleButton.addEventListener('click', function() {
  var locale = locales[localeIndex++ % locales.length];
  i18n.forceNewLocale(locale.language, locale.country);
  setText();
});

win.add(switchLocaleButton);

win.open();
