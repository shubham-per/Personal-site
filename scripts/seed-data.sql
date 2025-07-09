-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash) VALUES 
('admin@shubham.dev', '$2b$10$rQZ9vKKQZ9vKKQZ9vKKQZOeJ9vKKQZ9vKKQZ9vKKQZ9vKKQZ9vKKQ');

-- Insert default content
INSERT INTO content (section, title, content) VALUES 
('about', 'About Shubham Ranabhat', 'I''m a final year aerospace engineering student with a passion for pushing boundaries across multiple disciplines. My journey began with a fascination for flight and space exploration, which led me to pursue aerospace engineering.

Beyond engineering, I''ve developed strong interests in game development and digital art. I use tools like Blender, Photoshop, and After Effects to bring creative visions to life, while also building interactive experiences through game development.'),

('contact', 'Get in Touch', 'Feel free to reach out for collaborations, internships, or just to chat about aerospace engineering, game development, or digital art!'),

('faq', 'Frequently Asked Questions', 'Common questions about my work and availability.');

-- Insert sample projects
INSERT INTO projects (title, description, category, tags, order_index) VALUES 
('Liquid Rocket Engine', 'Bipropellant rocket engine development with thrust vectoring capabilities', 'engineering', ARRAY['Propulsion', 'CAD', 'Testing'], 1),
('Flight Computer for Rockets', 'Autonomous flight control system with real-time telemetry', 'engineering', ARRAY['Electronics', 'Programming', 'Control Systems'], 2),
('Thrust Vectoring Model', 'Active flight control demonstration using servo-controlled nozzles', 'engineering', ARRAY['Control Systems', 'Mechanics', '3D Printing'], 3),
('HALE UAV Design', 'High Altitude Long Endurance aircraft design and analysis', 'engineering', ARRAY['Aerodynamics', 'Design', 'Analysis'], 4),

('Space Explorer', '3D space exploration game with realistic physics and procedurally generated planets', 'games', ARRAY['Unity', 'C#', 'Procedural Generation'], 1),
('Orbital Mechanics Simulator', 'Educational game teaching orbital mechanics through interactive puzzles', 'games', ARRAY['Physics', 'Education', 'Simulation'], 2),

('Space Station Concept', '3D model and animation of futuristic space station', 'art', ARRAY['Blender', '3D Modeling', 'Animation'], 1),
('Rocket Launch Animation', 'VFX sequence showing rocket launch with particle effects', 'art', ARRAY['After Effects', 'VFX', 'Motion Graphics'], 2),
('Sci-Fi Environment', 'Detailed 3D environment with atmospheric lighting', 'art', ARRAY['Blender', 'Lighting', 'Texturing'], 3),
('Technical Animations', 'Educational animations explaining aerospace concepts', 'art', ARRAY['Animation', 'Education', 'Technical'], 4);
