---
title: Contact
date: 2021-12-18T03:10:36.000Z
draft: false
language: en
description: A test with @tailwindcss/typography & Prose
---

<!-- @format -->

<section class="lg:pb-24">
  <div class="max-w-lg px-4 mx-auto">
      <p class="mb-8 font-light text-center text-gray-500 lg:mb-16 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
      <form id="contactForm" class="space-y-8 w-full">
          <div class="my-4">
              <label for="email" class="block mb-2 font-medium text-gray-900 text-md dark:text-gray-300"><strong>Your Email:</strong></label>
              <input type="email" name="email" id="email" class="w-full shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="name@example.com" required>
          </div>
          <div class="my-4">
              <label for="subject" class="block mb-2 font-medium text-gray-900 text-md dark:text-gray-300"><strong>Subject:</strong></label>
              <input type="text" name="subject" id="subject" class="w-full block p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm text-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required maxlength="200">
          </div>
          <div class="my-4 sm:col-span-2">
              <label for="message" class="block mb-2 font-medium text-gray-900 text-md dark:text-gray-400"><strong>Your message:</strong></label>
              <textarea id="message" name="message" rows="10" maxlength="2000" class="w-full block p-2.5 text-md text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Leave a comment..." required></textarea>
          </div>
          <div id="formFeedback" class="text-center text-md font-semibold"></div>
          <div class="mt-6 lg:pb-16 text-center">
             <button type="submit" class="px-5 py-3 font-bold text-center text-white bg-indigo-600 rounded-lg text-md sm:w-fit hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Send Message</button>
          </div>
      </form>
      <script>
      document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const feedback = document.getElementById('formFeedback');
        feedback.textContent = '';
        try {
          const res = await fetch('https://api.wittleguys.net/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: subject, email, message })
          });
          const data = await res.json();
          if (res.ok) {
            feedback.textContent = 'Message sent successfully!';
            feedback.style.color = '#22c55e';
            document.getElementById('contactForm').reset();
          } else {
            feedback.textContent = data.error || 'Failed to send message.';
            feedback.style.color = '#ef4444';
          }
        } catch (err) {
          feedback.textContent = 'Failed to send message. Please try again later.';
          feedback.style.color = '#ef4444';
        }
      });
      </script>
  </div>
</section>
