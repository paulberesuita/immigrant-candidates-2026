-- Migration: Update Nico Parra's record with expanded information
-- Run with: wrangler d1 execute young-latino-candidates --file=./migrations/007_update_nico_parra.sql --remote

UPDATE candidates
SET
    -- Background (detailed bio)
    background = 'Nico Parra is the proud son of Colombian immigrants and one of Georgia''s most dedicated young voting rights advocates. At just 16 years old, he began working as a poll worker for Gwinnett County—his very first job—and has since risen to become a Poll Manager. In 2024, at age 20, he made history as Georgia''s youngest Latino delegate to the Democratic National Convention, representing the 7th Congressional District in his first presidential election cycle. A graduate of the prestigious Gwinnett School of Mathematics, Science, and Technology (GSMST)—ranked #1 high school in Georgia—Nico is currently pursuing his studies at Georgia State University while running to represent House District 109. His campaign message is simple: government must deliver for working people, not wealthy and powerful special interests.',

    -- Education
    education = 'Gwinnett School of Mathematics, Science, and Technology (GSMST), ranked #1 high school in Georgia; Currently attending Georgia State University',

    -- Leadership roles
    leadership_roles = 'Chair, Young Democrats of Georgia Latino Caucus (YDG Latino); Georgia''s Youngest Latino DNC Delegate (2024, 7th Congressional District)',

    -- Committees (JSON format) - Civic work and positions
    committees = '[{"name": "Gwinnett County Elections Office", "role": "Poll Manager"}, {"name": "Gwinnett County Language Equity Project", "role": "Volunteer Translator"}, {"name": "Young Democrats of Georgia Latino Caucus", "role": "Chair"}]',

    -- Notable legislation (JSON format) - Work with legislators
    notable_legislation = '[{"title": "Legislative Research for House Democratic Caucus", "description": "Created daily research reports on bills for House Minority Leader James Beverly (143rd District) and coordinated meetings between lobbyists and the House Democratic Caucus", "status": "Completed"}, {"title": "Election Document Translation Initiative", "description": "Translated election documents into Spanish for limited English proficiency families through the Gwinnett County Language Equity Project", "status": "Ongoing"}, {"title": "Youth Voter Registration and Education", "description": "Hosted voter registration drives and implemented voter education initiatives targeting young voters in Gwinnett County", "status": "Ongoing"}]',

    -- Career before politics
    career_before_politics = 'Poll Manager, Gwinnett County Elections Office (started as poll worker at age 16); Volunteer, Gwinnett County Language Equity Project (translating government documents to Spanish); Research Assistant for House Minority Leader James Beverly, creating daily bill analysis reports; GSMST Quiz Bowl team representative; Organizer and recruiter for local and state Democratic candidates throughout Greater Atlanta Area',

    -- Family background
    family_background = 'Son of Colombian immigrants who came to the United States seeking better opportunities for their family. His parents serve as his role models, inspiring his commitment to public service and advocacy. Growing up in Gwinnett County, one of Georgia''s most diverse counties, Nico witnessed firsthand how immigrant families contribute to their communities while navigating language barriers and bureaucratic challenges—experiences that drove his work translating election materials and advocating for language equity.',

    -- Awards
    awards = 'Georgia''s Youngest Latino DNC Delegate (2024); GSMST Graduate (Georgia''s #1 Ranked High School); Selected as DNC Delegate in first presidential election eligible to vote',

    -- Update endorsements to JSON format (keeping it realistic based on research)
    endorsements = '[{"name": "Democratic Party of Georgia", "type": "Political"}, {"name": "Young Democrats of Georgia", "type": "Political"}]',

    -- Update key issues with more detail
    key_issues = '$20 minimum wage, Tax cuts for households under $120K, Reproductive rights, 12 weeks paid parental leave, Medicaid expansion, $70K teacher salary, LGBTQ+ protections, Voting rights, Language equity'

WHERE id = 4;
