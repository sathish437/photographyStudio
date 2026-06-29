-- Seed Admin (default username: admin, password: admin123)
-- BCrypt hash for admin123: $2a$10$8.Z1fO3b1H1S/e8m.tS/0uq.mPz/T8D3fN6H4lqJkG6jG1sZ7VnS2
INSERT INTO admins (username, password, role, created_at)
VALUES ('admin', '$2a$10$8.Z1fO3b1H1S/e8m.tS/0uq.mPz/T8D3fN6H4lqJkG6jG1sZ7VnS2', 'ROLE_ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Seed Contact
INSERT INTO contacts (phone, whatsapp, email, instagram, youtube, address, updated_at)
VALUES ('9500328838', '9500379678', 'kuttydigital.tmg@gmail.com', 'https://www.instagram.com/kutty_photography_official', '', '12, Olive Grove Avenue, Near Art District, Chennai, Tamil Nadu - 600018', CURRENT_TIMESTAMP);

-- Seed Services
INSERT INTO services (title, description, image_url, created_at, updated_at) VALUES
('Wedding Photography', 'Documenting your sacred promises and grand celebrations with an elegant, fine-art editorial perspective.', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pre Wedding Photography', 'Capturing organic romance, soft frames, and candid emotions in dreamy golden hour locations.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Birthday Photography', 'Bright, energetic candid shots highlighting joy, laughter, and milestones of your loved ones.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Baby Photography', 'Artistic, gentle frames preserving the pure, sweet milestones of your baby''s earliest chapters.', 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Event Photography', 'Professional coverage for corporate summits, visual galas, and high-profile private celebrations.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Gallery
INSERT INTO gallery (title, category, image_url, description, created_at, updated_at) VALUES
('The Sacred Walk', 'Wedding', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', 'The Royal Udaipur Vows', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ethereal Whispers', 'Pre Wedding', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', 'Florence Sunrises', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Aria''s First Sparkler', 'Birthday', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop', 'Golden Milestones', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sweet Anticipation', 'Baby Shower', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop', 'Blossom Cradles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Engagement Ring Glow', 'Engagement', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop', 'Gilded Promises', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bridal Portrait Elegance', 'Wedding', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop', 'The Royal Udaipur Vows', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Misty Lakeside Hug', 'Pre Wedding', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop', 'Florence Sunrises', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sleeping Cherub', 'New Born Baby', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', 'Cozy Tiny Toes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Graceful Silk Saree Gaze', 'Puberty', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop', 'Traditional Portraiture', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
