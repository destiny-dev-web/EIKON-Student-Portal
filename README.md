# Eikon Academy Portals

Two sites in one Vercel project, sharing one database:

| Site | Address after deploying | File |
|---|---|---|
| Student Portal | `https://your-site.vercel.app/` | `index.html` |
| Staff Portal (HODs, lecturers, desk officers) | `https://your-site.vercel.app/staff` | `staff/index.html` |

## What is in the folder

```
index.html          Student Portal page
staff/index.html    Staff Portal page
assets/styles.css   Colours and layout (navy, orange, charcoal)
assets/app.js       All the portal code (the page sets which portal it is)
api/data.js         Reads and saves portal data
api/forgot.js       Emails a 6-digit password reset code
api/reset.js        Checks the code and sets the new password
api/_lib.js         Database helper
vercel.json         Vercel settings
.env.example        The settings you must fill in
```

## Deploy in 6 steps

1. **Put the folder on GitHub.** Create a new repository and upload everything in this folder.
2. **Import it into Vercel.** On vercel.com choose Add New, then Project, pick the repository. Leave Framework Preset as "Other". Do not change build settings. Click Deploy.
3. **Add the database.** In your Vercel project open the Storage tab, choose Upstash (Redis) from the marketplace, create a free database and connect it to the project. This adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for you.
4. **Set up email for reset codes.** Create an account at resend.com, add and verify your own domain (without this, Resend only delivers to your own address), and create an API key.
5. **Add three more settings** in Project Settings, then Environment Variables:
   - `RESEND_API_KEY`: the key from step 4
   - `MAIL_FROM`: for example `Eikon Academy <no-reply@yourdomain.com>`
   - `RESET_SECRET`: any long random text
6. **Redeploy** (Deployments tab, then Redeploy) so the new settings take effect.

## First-time setup

1. Open `/staff`, tap **Register**, leave the access key empty. This creates the first desk officer (only possible while no desk officer exists).
2. Log in, open **Access keys**, generate keys for HODs and lecturers per department, and hand each key to one person.
3. Staff register at `/staff` with their key. Their role and department come from the key.
4. Desk officer adds courses. Students register at `/`.

## How the pieces work

- **Registration number:** `CRE/` + 9 digits + 2 letters, created automatically when a student registers.
- **Staff login** needs email, password and the staff member's access key. Disable a key and that person is locked out.
- **Forgot password:** the person enters their email, receives a 6-digit code (valid 10 minutes, 5 tries), enters it with a new password. Student emails only reset on the student site, staff emails only on the staff site.
- **Results:** lecturers and desk officers find a student by the last two digits and two letters of the reg number (for example `89AB`).
- **Timetable:** the HOD builds it per level and semester, day by day. Students see a grid starting at 9 AM.
- **Class reminders:** students save classes to their phone calendar (.ics file). The phone then alerts them 10 minutes before. A fully custom ringing alarm needs a phone app.

## Read this before using real student records

This is a working prototype, not a hardened system.

- The browser reads and writes the stored data through `/api/data` with no sign-in check on the server. Anyone who finds that address can read or change records, including password hashes and access keys.
- Access keys and permissions are enforced by the page, not by the server.
- Email addresses are checked for correct format and common typos. A fake address that looks real is still accepted. Only the reset-code email proves an address works.
- Profile pictures are stored inside the data, so a large number of students will slow loading.

Before real students use it, move to a proper backend (a database with real accounts and server-side permissions, for example Supabase or Postgres with an auth service). The screens can stay the same.

## Changing things later

- Colours and layout: `assets/styles.css`
- Wording, pages and logic: `assets/app.js`
- Starter courses and vault items: the `DEFAULTS` block at the top of `assets/app.js`. They apply only until the first save.
