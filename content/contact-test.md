---
title: Contact Test
date: 2021-12-18T03:10:36.000Z
draft: false
language: en
description: Test Contact Form with Direct reCAPTCHA
---

## Contact Test (Direct reCAPTCHA)

<form action="https://mautic.wittleguys.net/form/submit?formId=2" method="post">
  <div style="margin-bottom: 1rem;">
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="mauticform[email]" required style="width: 100%; padding: 0.5rem;">
  </div>
  
  <div style="margin-bottom: 1rem;">
    <label for="message">Message:</label><br>
    <textarea id="message" name="mauticform[f_message]" required style="width: 100%; padding: 0.5rem; height: 100px;"></textarea>
  </div>
  
  <div style="margin-bottom: 1rem;">
    <div class="g-recaptcha" data-sitekey="6Ldvb68rAAAAAIE0RKFT-W9iKk1JbOpnrjYlJvXD"></div>
  </div>
  
  <input type="hidden" name="mauticform[formId]" value="2">
  <input type="hidden" name="mauticform[formName]" value="contactform">
  
  <button type="submit" style="padding: 0.75rem 1.5rem; background: #3ec6a8; color: white; border: none; border-radius: 4px;">Submit Test</button>
</form>

<script>
console.log('Contact test page loaded');
console.log('reCAPTCHA should render above if keys are valid');
</script>
