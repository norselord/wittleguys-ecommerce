---
title: Contact
date: 2021-12-18T03:10:36.000Z
draft: false
language: en
description: Contact Wittle Guys
---

<section style="display: flex; justify-content: center; align-items: flex-start; min-height: 60vh; background: #fff9f3;">
  <div style="max-width: 600px; width: 100%; padding: 2.5rem 2rem; background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(30,50,40,0.07); margin: 2rem 0;">
    <h1 style="text-align: center; margin-bottom: 2rem;">Contact</h1>
    <p class="mb-8 font-light text-center text-gray-500 lg:mb-16 dark:text-gray-400 sm:text-xl" style="margin-bottom: 1.5rem; color: #666;">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
    <form id="contactForm" class="contact-form" style="display: flex; flex-direction: column; gap: 1.2rem;">
      <div class="form-group" style="display: flex; flex-direction: column;">
        <label for="email" style="margin-bottom: 0.5rem; font-weight: 600;">Your Email:</label>
        <input type="email" id="email" name="email" required style="padding: 0.8rem 1rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1.1rem;">
      </div>
      <div class="form-group" style="display: flex; flex-direction: column;">
        <label for="subject" style="margin-bottom: 0.5rem; font-weight: 600;">Subject:</label>
        <input type="text" id="subject" name="subject" maxlength="200" required style="padding: 0.8rem 1rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1.1rem;">
      </div>
      <div class="form-group" style="display: flex; flex-direction: column;">
        <label for="message" style="margin-bottom: 0.5rem; font-weight: 600;">Your message:</label>
        <textarea id="message" name="message" maxlength="3333" rows="6" required placeholder="Tell us how we can help..." style="padding: 0.8rem 1rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1.1rem;"></textarea>
        <div class="character-count" style="text-align: right; font-size: 0.98rem; color: #888; margin-top: 0.3rem;">
          <span id="charCount">0</span>/3333 characters
        </div>
      </div>
      <button type="submit" id="submitBtn" class="submit-btn" style="background: #4CAF50; color: #fff; border: none; border-radius: 6px; padding: 1rem 0; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: background 0.2s;">
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
