json.i18n has a simple goal:
To provide a more robust, easier to use, and generally nicer looking localization solution for Titanium based on JSON.

To use its features, include the json.i18n.js file before you require access to localized resources.

<pre>
Ti.include('vendor/json.18n.js');
</pre>


SETUP
====================

You will need to create your localised resources as JSON files in /Resources/i18n/*.json
Example:

 * default.json (used for fallback values for any requests)
 * en.json (2 letter language code, refer to http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
 * en-US.json (2 letter language code & 2 letter country code, refer to http://en.wikipedia.org/wiki/ISO_3166-1)

In each JSON file, you can define any object structure you like for the resources such as, but you must ensure you use valid JSON (i.e. enclosed in double quotation marks)
<pre>
{
  "parent": {
    "child": {
      "value1": "1",
      "value2": "2".
      "value3": "Supports interpolation %s"
    }
  }
}
</pre>

USE WITHIN YOUR APP
-------------------

<pre>
i18n.getString('parent.child.value1') -> "1"
i18n.getFormattedString('parent.child.value3','value') -> Supports interpolation value
</pre>

A shortcut also exists for the getFormattedString method as follows:
<pre>
I('parent.child.value3','value') -> Supports interpolation value
</pre>

EXAMPLE APP
-----------

I strongly urge you to look at the sample application that is included at https://github.com/mattheworiordan/json.i18n-for-Titanium-Mobile/tree/master/example.
It is very straightforward and provides good examples of how the localized resources fallback to defaults.

CONTACT INFORMATION
===========================

Redux was made by Matthew O'Riordan (www.mattheworiordan.com).

Please provide feedback, I will happily add to this very simple little library.

I can be contacted through my website -- www.mattheworiordan.com