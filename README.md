# Crónicas do Almoço de Natal dos Amigos

Digital archive of the annual Christmas lunches of **A Malta do Restelo**, held every year since 1964.

Built with React, Vite, TypeScript, Tailwind CSS and Framer Motion. Supabase (optional) adds member sign-in, photo uploads and RSVPs.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

The site works as a static archive with no further setup.

## Edit the content

All text, years, captions, members and next-lunch details live in one file:

```
src/data/timelineData.ts
```

Entries marked `TODO` are placeholders waiting for the group to confirm them:

- timeline entries with `year: null` show "Ano por confirmar"
- `members` is empty until names are added
- `nextLunch.date` and `venue` are empty until the lunch is booked; once `date` is set, the countdown and the "Adicionar ao calendário" button appear

Photos go in `src/assets/` and are referenced from the timeline entries.

## Turn on member features (Supabase)

1. Copy `.env.example` to `.env.local` and fill in your project URL and anon key.
2. Run `supabase/setup.sql` once in the Supabase SQL editor. It creates the private photo bucket and the `rsvps` table, both members-only.
3. In Supabase, turn off public sign-ups and invite members by email.

All Supabase calls are in `src/lib/supabase.ts`.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, timeline, next lunch, photo upload |
| `/historico` | Every recorded lunch in order |
| `/arquivo` | All years since 1964, filterable by decade |
| `/fotografias` | Photo wall with full-screen viewer |
| `/membros` | Members |
| `/sobre` | The story of the tradition |
| `/proximo-almoco` | Next lunch: countdown, calendar file, RSVP |
| `/almoco/:ano` | One page per year |
| `/auth` | Member sign-in |
