---
title: Contact
date: 2021-12-18T03:10:36.000Z
draft: false
language: en
description: Contact Wittle Guys
---

## Contact

<script type="text/javascript">
  /** This section is only needed once per page if manually copying **/
  if (typeof MauticSDKLoaded == 'undefined') {
    var MauticSDKLoaded = true;
    var head   = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src  = 'https://mautic.wittleguys.net/media/js/mautic-form.js?v3073047c';
    script.onload = function() { MauticSDK.onLoad(); };
    head.appendChild(script);
    var MauticDomain = 'https://mautic.wittleguys.net';
    var MauticLang   = { 'submittingMessage': 'Please wait...' };
  } else if (typeof MauticSDK != 'undefined') {
    MauticSDK.onLoad();
  }
</script>

<style type="text/css" scoped>
  .mauticform_wrapper { max-width: 600px; margin: 10px auto; }
  .mauticform-innerform {}
  .mauticform-post-success {}
  .mauticform-name { font-weight: bold; font-size: 1.5em; margin-bottom: 3px; }
  .mauticform-description { margin-top: 2px; margin-bottom: 10px; }
  .mauticform-error { margin-bottom: 10px; color: red; }
  .mauticform-message { margin-bottom: 10px; color: green; }
  .mauticform-row { display: block; margin-bottom: 20px; }
  .mauticform-label { font-size: 1.1em; display: block; font-weight: bold; margin-bottom: 5px; }
  .mauticform-row.mauticform-required .mauticform-label:after { color: #e32; content: " *"; display: inline; }
  .mauticform-helpmessage { display: block; font-size: 0.9em; margin-bottom: 3px; }
  .mauticform-errormsg { display: block; color: red; margin-top: 2px; }
  .mauticform-selectbox, .mauticform-input, .mauticform-textarea { width: 100%; padding: 0.5em 0.5em; border: 1px solid #CCC; background: #fff; box-shadow: 0px 0px 0px #fff inset; border-radius: 4px; box-sizing: border-box; }
  .mauticform-button-wrapper .mauticform-button.btn-ghost, .mauticform-pagebreak-wrapper .mauticform-pagebreak.btn-ghost { color: #5d6c7c;background-color: #ffffff;border-color: #dddddd;}
  .mauticform-button-wrapper .mauticform-button, .mauticform-pagebreak-wrapper .mauticform-pagebreak { display: inline-block;margin-bottom: 0;font-weight: 600;text-align: center;vertical-align: middle;cursor: pointer;background-image: none;border: 1px solid transparent;white-space: nowrap;padding: 6px 12px;font-size: 13px;line-height: 1.3856;border-radius: 3px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}
  .mauticform-button-wrapper .mauticform-button.btn-ghost[disabled], .mauticform-pagebreak-wrapper .mauticform-pagebreak.btn-ghost[disabled] { background-color: #ffffff; border-color: #dddddd; opacity: 0.75; cursor: not-allowed; }
  .mauticform-pagebreak-wrapper .mauticform-button-wrapper {  display: inline; }
</style>

<div id="mauticform_wrapper_contactform" class="mauticform_wrapper">
  <form autocomplete="false" role="form" method="post" action="https://mautic.wittleguys.net/form/submit?formId=2" id="mauticform_contactform" data-mautic-form="contactform" enctype="multipart/form-data">
    <div class="mauticform-error" id="mauticform_contactform_error"></div>
    <div class="mauticform-message" id="mauticform_contactform_message"></div>
    <div class="mauticform-innerform">
      <div id="mauticform_contactform_email" class="mauticform-row mauticform-email mauticform-field-1 mauticform-required" data-validate="email" data-validation-type="email">
        <label id="mauticform_label_contactform_email" for="mauticform_input_contactform_email" class="mauticform-label">Email</label>
        <input id="mauticform_input_contactform_email" name="mauticform[email]" value="" class="mauticform-input" type="email" />
        <span class="mauticform-errormsg" style="display:none;">This is required.</span>
      </div>

      <div id="mauticform_contactform_message" class="mauticform-row mauticform-text mauticform-textarea mauticform-field-2 mauticform-required" data-validate="message" data-validation-type="textarea">
        <label id="mauticform_label_contactform_message" for="mauticform_input_contactform_message" class="mauticform-label">Message</label>
        <textarea id="mauticform_input_contactform_message" name="mauticform[message]" class="mauticform-textarea" rows="5" placeholder="How can we help?"></textarea>
        <span class="mauticform-errormsg" style="display:none;">Please enter your message</span>
      </div>

      <div id="mauticform_contactform_captcha_google_recaptcha" class="mauticform-row mauticform-captcha mauticform-captcha-google_recaptcha mauticform-field-3">
        <label id="mauticform_label_contactform_captcha_google_recaptcha" for="mauticform_input_contactform_captcha_google_recaptcha" class="mauticform-label">Captcha (Google reCAPTCHA)</label>
        <div class="g-recaptcha" data-sitekey="6Ldvb68rAAAAAIE0RKFT-W9iKk1JbOpnrjYlJvXD"></div>
      </div>

      <div id="mauticform_contactform_submit" class="mauticform-row mauticform-button-wrapper mauticform-field-4">
        <button type="submit" name="mauticform[submit]" id="mauticform_input_contactform_submit" value="1" class="mauticform-button btn btn-default">Submit</button>
      </div>
    </div>
    <input type="hidden" name="mauticform[formId]" id="mauticform_contactform_id" value="2">
    <input type="hidden" name="mauticform[return]" id="mauticform_contactform_return" value="">
    <input type="hidden" name="mauticform[formName]" id="mauticform_contactform_name" value="contactform">
  </form>
</div>
