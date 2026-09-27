CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  roll_number text NOT NULL CHECK (char_length(roll_number) BETWEEN 2 AND 80),
  track text NOT NULL CHECK (track IN ('ai-robotics','cybersecurity','neural','cloud','spatial')),
  team_name text NOT NULL CHECK (char_length(team_name) BETWEEN 2 AND 120),
  portfolio_url text NOT NULL CHECK (char_length(portfolio_url) BETWEEN 8 AND 500)
);
GRANT INSERT ON public.event_registrations TO anon, authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit registration" ON public.event_registrations FOR INSERT TO anon, authenticated WITH CHECK (true);