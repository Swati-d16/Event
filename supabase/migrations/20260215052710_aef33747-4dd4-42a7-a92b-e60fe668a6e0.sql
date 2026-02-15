
-- Create a system/demo profile for seed data
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, recovery_token)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@eventful.app',
  crypt('demo123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  ''
);

-- Insert sample events
INSERT INTO public.events (name, description, organizer_id, location, event_date, event_time, capacity, category_id) VALUES
('Tech Summit 2026', 'Join us for a full day of cutting-edge technology talks, workshops, and networking with industry leaders.', 'a0000000-0000-0000-0000-000000000001', 'San Francisco, CA', '2026-04-15', '09:00', 200, '504d469b-d38c-4ba4-ab2a-5b9ae1016ce5'),
('Jazz Under the Stars', 'An intimate outdoor jazz concert featuring renowned artists under the night sky.', 'a0000000-0000-0000-0000-000000000001', 'Central Park, New York', '2026-03-22', '19:30', 150, 'b38e73ac-6d2c-48c1-97d4-91991aebc748'),
('Startup Pitch Night', 'Watch innovative startups pitch their ideas to top investors. Network with founders and VCs.', 'a0000000-0000-0000-0000-000000000001', 'WeWork, Austin, TX', '2026-03-28', '18:00', 80, '643de168-2f44-4f9c-87e9-5d7f9bd06ff8'),
('Marathon Training Workshop', 'Expert coaches share training tips, nutrition advice, and gear recommendations for marathon runners.', 'a0000000-0000-0000-0000-000000000001', 'Olympic Stadium, Los Angeles', '2026-05-10', '07:00', 300, '991bcb25-1e39-4935-bf26-d3cbb203e2b2'),
('Modern Art Exhibition', 'Explore contemporary art installations from emerging artists around the world.', 'a0000000-0000-0000-0000-000000000001', 'MoMA, New York', '2026-04-01', '10:00', 500, '8ae5baa5-4ae0-4105-bddd-3d9d9d95d60c'),
('Farm-to-Table Dinner', 'A gourmet dining experience featuring locally sourced ingredients and paired wines.', 'a0000000-0000-0000-0000-000000000001', 'Napa Valley, CA', '2026-06-15', '18:30', 40, '78db5a38-7026-4016-b788-7726900211ec'),
('AI & Machine Learning Workshop', 'Hands-on workshop covering the latest in AI, deep learning, and practical applications.', 'a0000000-0000-0000-0000-000000000001', 'MIT Campus, Boston', '2026-04-20', '09:00', 60, '504d469b-d38c-4ba4-ab2a-5b9ae1016ce5'),
('Yoga & Mindfulness Retreat', 'A full-day wellness retreat with yoga sessions, meditation, and mindfulness workshops.', 'a0000000-0000-0000-0000-000000000001', 'Sedona, Arizona', '2026-05-05', '08:00', 30, 'e0995a64-764c-4de3-b463-011b11452fa5'),
('Indie Music Festival', 'Three stages of independent music across all genres. Food trucks and art vendors included.', 'a0000000-0000-0000-0000-000000000001', 'Golden Gate Park, SF', '2026-07-04', '12:00', 1000, 'b38e73ac-6d2c-48c1-97d4-91991aebc748'),
('Data Science Bootcamp', 'Intensive one-day bootcamp covering Python, statistics, and machine learning fundamentals.', 'a0000000-0000-0000-0000-000000000001', 'Online', '2026-03-15', '10:00', 500, 'e9b2f097-50b4-4766-96be-eb9e7b0103db'),
('Rock Climbing Championship', 'Watch elite climbers compete and try out the beginner walls yourself.', 'a0000000-0000-0000-0000-000000000001', 'Boulder, Colorado', '2026-06-20', '09:00', 250, '991bcb25-1e39-4935-bf26-d3cbb203e2b2'),
('Wine Tasting Experience', 'Sample premium wines from local vineyards with expert sommelier guidance.', 'a0000000-0000-0000-0000-000000000001', 'Sonoma, CA', '2026-05-25', '14:00', 50, '78db5a38-7026-4016-b788-7726900211ec');
