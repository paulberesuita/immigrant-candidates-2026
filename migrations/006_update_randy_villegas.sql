-- Migration: Update Randy Villegas's record with expanded information
-- Run with: wrangler d1 execute young-latino-candidates --file=./migrations/006_update_randy_villegas.sql --remote

UPDATE candidates
SET
    -- Update age to current
    age = 31,

    -- Background (detailed bio)
    background = 'Randy Villegas is the proud son of Mexican immigrants, born and raised in California''s Central Valley. Growing up in a working-class family in Kern County, he worked as many jobs as he could to help make ends meet, including at his family''s auto repair shop which he now owns. A product of public education, Randy attended Golden Valley High School in Bakersfield, earned his Associate''s degree from Bakersfield College, and his Bachelor''s from CSU Bakersfield. He then received the prestigious Cota-Robles Fellowship—named after one of the first Mexican American professors in the UC system—for a full ride to UC Santa Cruz, where he completed his Master''s and Ph.D. in Politics with a designated emphasis in Latin American and Latino Studies. At 25, he became a tenure-track professor at College of the Sequoias; at 27, he completed his doctorate. In 2020, he married his high school sweetheart Carina, who is pursuing her Ph.D. in Chemical Biology.',

    -- Education
    education = 'A.A. in Political Science, Bakersfield College (2015); B.A. in Political Science, California State University Bakersfield (2017); M.A. in Politics, UC Santa Cruz; Ph.D. in Politics with Designated Emphasis in Latin American and Latino Studies, UC Santa Cruz',

    -- Leadership roles
    leadership_roles = 'Visalia Unified School District Board Trustee, Area 6 (elected 2022, reelected 2024)',

    -- Committees (JSON format) - School board related work
    committees = '[{"name": "Visalia Unified School District Board of Education", "role": "Trustee, Area 6"}, {"name": "Power California", "role": "Board of Directors"}, {"name": "Alisal Community Arts Network", "role": "Board of Directors"}]',

    -- Notable legislation (JSON format) - School board accomplishments
    notable_legislation = '[{"title": "A-G Graduation Requirement Alignment", "description": "Working to make VUSD the first school district in the Central Valley to fully align graduation requirements with UC and CSU admission requirements (A-G)", "status": "In Progress"}, {"title": "Transparency and Accountability Initiatives", "description": "Led efforts to increase transparency and accountability in the Visalia Unified School District", "status": "Ongoing"}, {"title": "Student Success Programs", "description": "Advocated for programs and policies to improve student outcomes and equity", "status": "Ongoing"}]',

    -- Career before politics
    career_before_politics = 'Associate Professor of Political Science at College of the Sequoias (tenure-track at age 25); Owner of family auto repair shop; Graduate Student Researcher for UC Santa Cruz Sociology Department on Central Valley Freedom Summer, a Participatory Action Research Project engaging students in non-partisan voter education and grassroots organizing in low-income Central Valley communities; Developed immigration politics teaching guide through APSA grant; Volunteer drumline instructor for local high school and percussion groups (El Ritmo Percussion, Valley Independent Percussion); Organized Know Your Rights forums and hosted speakers like Jim Acosta and Dolores Huerta',

    -- Family background
    family_background = 'Son of Mexican immigrants who raised him in Kern County, California. First-generation American and first-generation college graduate who experienced firsthand the challenges facing working families in the Central Valley. His story mirrors that of his neighbors—growing up on Medicaid, food assistance (SNAP), and school lunches. In 2020, married high school sweetheart Carina Villegas, who is pursuing her Ph.D. in Chemical Biology, Biochemistry and Biophysics. They have adopted three rescue dogs: Cinnamon and Spice (and one more).',

    -- Awards
    awards = 'Cota-Robles Fellowship, UC Santa Cruz (named after one of first Mexican American UC professors); 2020 CARE-UC Innovation Fellowship; American Political Science Association Fund for Latino Scholarship; 2025 APSA Community College Faculty Award; Featured in California State Capitol Museum Unity Exhibit for social justice work in Central Valley',

    -- Update endorsements to JSON format
    endorsements = '[{"name": "Bernie Sanders", "type": "Political"}, {"name": "Dolores Huerta / Dolores Huerta Action Fund", "type": "Labor/Political"}, {"name": "Working Families Party", "type": "Political"}, {"name": "CHC BOLD PAC", "type": "Political"}, {"name": "Congressional Progressive Caucus", "type": "Political"}, {"name": "Latino Victory Fund", "type": "Political"}, {"name": "Leaders We Deserve PAC", "type": "Political"}, {"name": "Visalia Unified Teachers Association", "type": "Labor"}, {"name": "California Teachers Association", "type": "Labor"}]',

    -- Update key issues
    key_issues = 'Medicare for All, Protecting Medicaid SNAP and Social Security, College affordability, Student debt relief, Economic justice, Healthcare access for Central Valley families'

WHERE id = 3;
