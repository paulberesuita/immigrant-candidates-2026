-- Migration: Update Manny Rutinel's record with expanded information
-- Run with: wrangler d1 execute young-latino-candidates --file=./migrations/005_update_manny_rutinel.sql --remote

UPDATE candidates
SET
    -- Background (detailed bio)
    background = 'Tonty "Manny" Rutinel was born on December 20, 1994, and raised by a single mother in the Dominican Republic until age six, when they immigrated to the United States. Growing up, his family faced impossible choices between groceries, healthcare, and rent. When the Great Recession hit, they lost their home. To help support his family, Manny worked at McDonald''s while attending high school and regularly donated blood plasma for extra income. Despite these challenges, he earned degrees from four institutions culminating in a J.D. from Yale Law School. In October 2023, he was appointed to the Colorado House of Representatives for District 32, and on January 27, 2025, he announced his candidacy for Congress in Colorado''s competitive 8th District, raising over $500,000 in his first 48 hours.',

    -- Education
    education = 'Associate Degree from Pasco-Hernando State College; B.A. in Economics and B.S. in Microbiology from University of Florida (2016); M.S. in Applied Economics from Johns Hopkins University (2018); J.D. from Yale Law School (2022)',

    -- Leadership roles
    leadership_roles = 'Colorado State Representative, District 32',

    -- Committees (JSON format)
    committees = '[{"name": "Energy & Environment Committee", "role": "Member"}]',

    -- Notable legislation (JSON format)
    notable_legislation = '[{"title": "Housing Affordability Legislation", "description": "Passed 13 bills through the House and Senate related to housing affordability, including allowing flexible roommate arrangements instead of city-imposed limits", "status": "Signed by Governor"}, {"title": "Protecting Workers from Extreme Temperatures", "description": "Legislation to protect workers from dangerous heat and cold conditions", "status": "2025 Session"}, {"title": "Federal Benefits for Youth in Foster Care", "description": "Ensures foster youth have access to federal benefits and support", "status": "2025 Session"}, {"title": "Public Safety Protections Artificial Intelligence", "description": "Regulates the use of AI in public safety contexts", "status": "2025 Session"}, {"title": "Colorado Read to Your Child Day", "description": "Establishes a day promoting early childhood literacy", "status": "Signed by Speaker"}]',

    -- Career before politics
    career_before_politics = 'Environmental Attorney at Earthjustice, Sustainable Food and Farming Program, holding corporate polluters accountable; CEO and Co-founder of Climate Refarm, a public benefit corporation leveraging carbon markets to help farmers transition to plant-based food systems; Economist for the U.S. Army Corps of Engineers; First responder in Puerto Rico after Hurricane Maria; Arrested in 2019 while a Yale student for participating in a protest against university investment in fossil fuels',

    -- Family background
    family_background = 'Son of a single mother who emigrated from the Dominican Republic to give Manny and his brother a better life. First-generation American who grew up understanding sacrifice—his mother worked tirelessly to provide opportunities despite limited resources. The family lost their home during the Great Recession, a formative experience that shaped his commitment to fighting for working families. In his own words: "I am in awe of the amount of sacrifice and work that she gave to us and to our communities to make it so that I had the things that I needed."',

    -- Awards
    awards = 'First-generation college graduate; Yale Law School graduate; Selected to fill Colorado House vacancy from over 50 applicants',

    -- Update endorsements to JSON format
    endorsements = '[{"name": "Martin O''Malley (Former SSA Commissioner)", "type": "Political"}, {"name": "CHC BOLD PAC", "type": "Political"}, {"name": "Latino Victory Fund", "type": "Political"}, {"name": "Wellington Webb (Former Denver Mayor)", "type": "Political"}, {"name": "Conservation Colorado", "type": "Environmental"}, {"name": "Colorado Education Association (CEA)", "type": "Labor"}, {"name": "Colorado AFL-CIO", "type": "Labor"}, {"name": "SEIU Local 105", "type": "Labor"}, {"name": "Cobalt", "type": "Advocacy"}, {"name": "Colorado Working Families Party", "type": "Political"}, {"name": "Planned Parenthood Votes Colorado", "type": "Advocacy"}, {"name": "50+ Colorado Elected Officials", "type": "Political"}]'

WHERE id = 2;
