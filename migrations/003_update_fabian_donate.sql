-- Migration: Update Fabian Doñate's record with expanded information
-- Run with: wrangler d1 execute DB --file=./migrations/003_update_fabian_donate.sql

UPDATE candidates
SET
    -- Update basic info to ensure accuracy
    age = 28,
    heritage = 'Mexican-American',
    is_incumbent = 1,

    -- Background (detailed bio)
    background = 'Senator Fabian Doñate made history in 2021 when he became the youngest state senator in Nevada history at age 24. Born in Los Angeles to Mexican immigrant parents from Zacatecas, he grew up in District 10 surrounded by casino workers and union families. A defining moment came when he had to translate a diabetes diagnosis for his Spanish-speaking father at a doctor''s appointment—despite having excellent health insurance through the Culinary Workers Union, the language barrier created a health disparity that shaped his commitment to healthcare equity.',

    -- New expanded fields
    education = 'B.S. in Public Health from University of Nevada Las Vegas (2018); M.S. in Healthcare Administration from University of Maryland (2020)',

    leadership_roles = 'Deputy Majority Whip',

    committees = '[{"name": "Health and Human Services", "role": "Chair"}, {"name": "Education", "role": "Member"}, {"name": "Growth and Infrastructure", "role": "Member"}]',

    notable_legislation = '[{"title": "SB 92 - Street Vendor Licensing", "description": "Legitimized street vendors across Nevada, providing necessary permits to operate and grow small businesses", "status": "Signed into Law"}, {"title": "SB 295 - Food Vendor Regulation Reform", "description": "Requires local health boards to provide targeted outreach to sidewalk vendors and establishes a dedicated task force for vendor-related public health policies", "status": "2025 Session"}, {"title": "SB 379 - Solar Consumer Protections", "description": "Introduces consumer protection measures for solar energy systems, addressing deceptive marketing practices and strengthening disclosure requirements", "status": "2025 Session"}, {"title": "SB 142 - Wage Protection", "description": "Increases the amount of wages protected from certain debt collections", "status": "2025 Session"}]',

    career_before_politics = 'Development consultant at University of Maryland School of Public Health; Regional account management coordinator at American Cancer Society; Health policy research assistant at Center for Latino Prosperity; Member of Joe Biden''s Health Policy Platform Committee during the 2020 presidential campaign',

    family_background = 'Son of Mexican immigrants from Zacatecas, Mexico. First in his family to complete college and earn a graduate degree. Grew up as a "Culinary kid" with his father working as a porter at the Stratosphere Hotel and a member of the Culinary Workers Union. During the COVID-19 pandemic, returned to Las Vegas to help his family navigate unemployment forms when they were laid off.',

    awards = 'Youngest State Senator in Nevada History; UNLV School of Public Health Alumnus of the Year; Delta Omega Honorary Society in Public Health (Lifetime Member)',

    -- Update endorsements to JSON format
    endorsements = '[{"name": "Culinary Union (UNITE HERE Local 226)", "type": "Labor"}, {"name": "Nevada Conservation League", "type": "Environmental"}, {"name": "Progressive Turnout Project", "type": "Political"}]',

    -- Update key issues
    key_issues = 'Healthcare Access, Immigration Reform, Education, Worker Protections, Small Business Support, Tax Reform'

WHERE name LIKE '%Fabian%' AND state = 'NV';
