---
title: Contact
date: 2021-12-18T03:10:36.000Z
draft: false
language: en
description: A test with @tailwindcss/typography & Prose
---

<!-- @format -->

<section class="py-12 lg:pb-24">
  <div class="max-w-2xl px-4 mx-auto">
      <p class="mb-8 font-light text-center text-gray-500 lg:mb-16 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
      <form id="contactForm" class="space-y-6 w-full">
          <div class="my-4">
              <label for="email" class="block mb-4 font-medium text-gray-900 text-md dark:text-gray-300"><strong>Your Email:</strong></label>
              <input type="email" name="email" id="email" class="w-full shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 dark:shadow-sm-light" placeholder="name@example.com" required>
          </div>
          <div class="my-4">
              <label for="subject" class="block mb-4 font-medium text-gray-900 text-md dark:text-gray-300"><strong>Subject:</strong></label>
              <input type="text" name="subject" id="subject" class="w-full block p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm text-md bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required maxlength="200">
          </div>
          <div class="my-4 sm:col-span-2">
              <label for="message" class="block mb-4 font-medium text-gray-900 text-md dark:text-gray-400"><strong>Your message:</strong></label>
              <textarea id="message" name="message" rows="10" maxlength="2000" class="w-full block p-2.5 text-md text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Leave a comment..." required></textarea>
          </div>
          <div class="mt-6 lg:pb-16 text-center">
             <button type="submit" class="px-5 py-3 font-bold text-center text-white bg-green-600 rounded-lg text-md sm:w-fit hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-all duration-300">Send Message</button>
          </div>
      </form>
      <script>
      document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        try {
          const res = await fetch('https://api.wittleguys.net/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: subject, email, message })
          });
          const data = await res.json();
          if (res.ok) {
            // Fade-in animation and redirect
            const form = document.getElementById('contactForm');
            form.style.opacity = 0;
            setTimeout(() => {
              window.location.href = '/contact-success';
            }, 400);
          } else {
            alert(data.error || 'Failed to send message.');
          }
        } catch (err) {
          alert('Failed to send message. Please try again later.');
        }
      });
      </script>
  </div>
</section>
