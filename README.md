# EliteHub

## Clerk Setup Instructions
**IMPORTANT: Fix "Phone numbers from India not supported" Error**
By default, Clerk might try to verify Indian phone numbers but the current Clerk configuration may not support it or requires paid SMS addons.
To fix the authentication bug where users are blocked during signup:

1. Open your Clerk Dashboard.
2. Go to **User & Authentication** → **Email, Phone, Username**.
3. **Disable Phone number** as an identifier/auth factor.
4. Ensure you keep **Email address** and **Google (OAuth)** enabled.

This will ensure the signup flow works smoothly without hitting the SMS limitation.
