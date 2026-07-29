# Toast system

Application-wide toasts provide brief transient feedback for successful recipe actions.

- Toasts are rendered from a shared provider so they survive route navigation.
- Supported variants are success and error.
- Each toast is dismissed automatically after a default 4-second duration, or manually with the close button.
- Validation and form errors remain near the relevant fields instead of being replaced by toast-only messaging.
- Future recipe, rating, favorite, and comment actions can reuse the same system.
