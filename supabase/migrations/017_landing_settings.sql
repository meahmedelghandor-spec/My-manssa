-- Create landing_page_settings table to store dynamic content for the landing page
CREATE TABLE IF NOT EXISTS landing_page_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE landing_page_settings ENABLE ROW LEVEL SECURITY;

-- Policies

-- Everyone can read the landing page settings
CREATE POLICY "Public profiles are viewable by everyone." ON landing_page_settings
    FOR SELECT USING (true);

-- Only admins can update the landing page settings
CREATE POLICY "Admins can insert landing settings" ON landing_page_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update landing settings" ON landing_page_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Insert default values (copied from current hardcoded state)
INSERT INTO landing_page_settings (setting_key, setting_value) VALUES
('top_students_2026', '[{"name": "حسناء عمرو سعد أحمد", "rank": "المركز الأول علمي رياضة", "batch": "دفعة 2026", "score": "99.84%", "rankNum": 1}, {"name": "سمية موسى ابراهيم عبدالرحيم", "rank": "المركز السابع علمي علوم", "batch": "دفعة 2026", "score": "99.69%", "rankNum": 7}, {"name": "محمد سامح محمد فتحي", "rank": "المركز الثامن علمي علوم", "batch": "دفعة 2026", "score": "99.69%", "rankNum": 8}, {"name": "زياد ياسر صلاح جمعة", "rank": "المركز السابع علمي رياضة", "batch": "دفعة 2026", "score": "99.53%", "rankNum": 7}]'::jsonb),

('top_students_2025', '[{"name": "حسن محمد عبدالله بيومي", "rank": "المركز السادس على الجمهورية", "batch": "دفعة 2025", "score": "318.5", "rankNum": 6}, {"name": "نوران نبيل الحسيني", "rank": "المركز السادس على الجمهورية", "batch": "دفعة 2025", "score": "316", "rankNum": 6}, {"name": "مي أحمد عبدالله", "rank": "المركز السادس أزهر", "batch": "دفعة 2025", "score": "99.38%", "rankNum": 6}]'::jsonb),

('countdown_timer', '{"targetDate": "2026-08-08T00:00:00", "titlePart1": "أستنوا الكورس التأسيسي هيكون متاح يوم", "titleHighlight": "السبت 8-8", "titlePart2": "-2026", "subtitle": "اشترك دلوقتي وكن أول واحد يوصله مجاناً!", "visible": true}'::jsonb),

('packages', '[{"id": "monthly", "name": "شهري", "label": "باقات شهرية", "color": "#6366f1", "available": false}, {"id": "3months", "name": "3 شهور", "label": "باقات 3 شهور", "badge": "الأوفر / الأكثر اختياراً", "color": "#6366f1", "available": false}, {"id": "special", "name": "خاصة", "label": "باقات خاصة", "color": "#6366f1", "available": false}]'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;
