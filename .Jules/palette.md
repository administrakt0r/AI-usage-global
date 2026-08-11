## 2026-07-29 - [Contact Form Validation and Labeling UX]
**Learning:** For contact forms that rely on a custom submission handler leading to mailto: link generation, lacking visual indicators and input validation constraints causes a poor user experience. Specifically, empty form submissions still trigger mailto: redirection, which is confusing and non-functional.
**Action:** Always add visual indicators (* with red-500) and standard HTML `required` attributes to inputs in ContactForm to prevent empty submissions and provide clear guidance to users.
