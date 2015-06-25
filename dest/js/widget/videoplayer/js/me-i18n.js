/*
 * Adds Internationalization and localization to mediaelement.
 *
 * This file does not contain translations, you have to add them manually.
 * The schema is always the same: me-i18n-locale-[IETF-language-tag].js
 *
 * Examples are provided both for german and chinese translation.
 *
 *
 * What is the concept beyond i18n?
 *   http://en.wikipedia.org/wiki/Internationalization_and_localization
 *
 * What langcode should i use?
 *   http://en.wikipedia.org/wiki/IETF_language_tag
 *   https://tools.ietf.org/html/rfc5646
 *
 *
 * License?
 *
 *   The i18n file uses methods from the Drupal project (drupal.js):
 *     - i18n.methods.t() (modified)
 *     - i18n.methods.checkPlain() (full copy)
 *
 *   The Drupal project is (like mediaelementjs) licensed under GPLv2.
 *    - http://drupal.org/licensing/faq/#q1
 *    - https://github.com/johndyer/mediaelement
 *    - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 *
 * @author
 *   Tim Latz (latz.tim@gmail.com)
 *
 *
 * @params
 *  - context - document, iframe ..
 *  - exports - CommonJS, window ..
 *
 */

(function(e,t,n){var r={locale:{language:t.i18n&&t.i18n.locale.language||"",strings:t.i18n&&t.i18n.locale.strings||{}},ietf_lang_regex:/^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/,methods:{}};r.getLanguage=function(){var e=r.locale.language||window.navigator.userLanguage||window.navigator.language;return r.ietf_lang_regex.exec(e)?e:null},typeof mejsL10n!="undefined"&&(r.locale.language=mejsL10n.language),r.methods.checkPlain=function(e){var t,n,r={"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"};e=String(e);for(t in r)r.hasOwnProperty(t)&&(n=new RegExp(t,"g"),e=e.replace(n,r[t]));return e},r.methods.t=function(e,t){return r.locale.strings&&r.locale.strings[t.context]&&r.locale.strings[t.context][e]&&(e=r.locale.strings[t.context][e]),r.methods.checkPlain(e)},r.t=function(e,t){if(typeof e=="string"&&e.length>0){var n=r.getLanguage();return t=t||{context:n},r.methods.t(e,t)}throw{name:"InvalidArgumentException",message:"First argument is either not a string or empty."}},t.i18n=r})(document,mejs),function(e,t){typeof mejsL10n!="undefined"&&(e[mejsL10n.language]=mejsL10n.strings)}(mejs.i18n.locale.strings)