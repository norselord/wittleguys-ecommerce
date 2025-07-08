---
title: Contact
date: 2021-12-18T03:10:36.000Z
draft: false
language: en
description: Contact Wittle Guys
---

<section class="py-12 lg:pb-24">
  <div class="max-w-2xl px-4 mx-auto">
    <p class="mb-8 font-light text-center text-gray-500 lg:mb-16 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
    <form id="contactForm" class="contact-form">
      <div class="form-group">
        <label for="email">Your Email:</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="subject">Subject:</label>
        <input type="text" id="subject" name="subject" maxlength="200" required>
      </div>
      <div class="form-group">
        <label for="message">Your message:</label>
        <textarea id="message" name="message" maxlength="3333" rows="6" required placeholder="Tell us how we can help..."></textarea>
        <div class="character-count">
          <span id="charCount">0</span>/3333 characters
        </div>
      </div>
      <button type="submit" id="submitBtn" class="submit-btn">
        <span class="btn-text">Send Message</span>
        <span class="btn-loader" style="display: none;">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="#ffffff" stroke-width="4"/>
          </svg>
        </span>
      </button>
      <div id="formMessage" class="form-message"></div>
    </form>
  </div>
</section>
