-- Migration: Update Maxwell Alejandro Frost's record with expanded information
-- Run with: wrangler d1 execute young-latino-candidates --file=./migrations/004_update_maxwell_frost.sql --remote

UPDATE candidates
SET
    -- Background (detailed bio)
    background = 'Maxwell Alejandro Frost made history in 2023 when he became the first member of Generation Z elected to Congress and the first Afro-Cuban to serve in Congress. Born on January 17, 1997, in Orlando, Florida, Frost was placed for adoption at birth by his biological mother—a Puerto Rican and Lebanese woman who was caught in cycles of poverty and violence while pregnant. Adopted by Patrick Frost, a Kansas-born musician-producer, and Maritza Argibay-Frost, a Cuban immigrant and special education teacher, Maxwell was raised in a household that valued music, education, and civic engagement. The Sandy Hook shooting in 2012, when Frost was just 15, became a defining moment that launched his activism. After the Parkland shooting in 2018, he became the National Organizing Director for March for Our Lives. To fund his congressional campaign, he famously worked as an Uber driver.',

    -- Education
    education = 'Osceola County School for the Arts, Kissimmee, Florida',

    -- Leadership roles
    leadership_roles = 'Vice Chair, Congressional Progressive Caucus; Vice Chair, Gun Violence Prevention Taskforce; Co-Chair, House Democratic Policy and Communications Committee',

    -- Committees (JSON format)
    committees = '[{"name": "Committee on Oversight and Government Reform", "role": "Ranking Member, Subcommittee on Economic Growth, Energy Policy, and Regulatory Affairs"}, {"name": "Committee on Oversight and Government Reform", "role": "Member, Subcommittee on Government Operations and the Federal Workforce"}, {"name": "Committee on Transportation and Infrastructure", "role": "Member"}]',

    -- Notable legislation (JSON format)
    notable_legislation = '[{"title": "EPIPEN Act", "description": "Caps out-of-pocket costs for epinephrine autoinjectors at $60 per two-pack for individuals with health insurance", "status": "Introduced"}, {"title": "Faster Buses Better Futures Act", "description": "Legislation to improve public transit infrastructure and bus services", "status": "Introduced"}, {"title": "Wheelchair Right to Repair Act", "description": "Ensures wheelchair users have the right to repair their own mobility equipment", "status": "Introduced"}, {"title": "Safe Air on Airplanes Act", "description": "Addresses air quality standards on commercial aircraft", "status": "Introduced"}, {"title": "End Junk Fees for Renters Act", "description": "Eliminates extra fees imposed by landlords, bans application fees, and increases transparency in rental agreements", "status": "Co-sponsored"}]',

    -- Career before politics
    career_before_politics = 'National Organizing Director for March for Our Lives; ACLU of Florida organizer; Volunteer for Bernie Sanders 2020 presidential campaign; Uber driver to fund congressional campaign; Professional jazz drummer and percussionist; Band leader of award-winning salsa band Seguro Que Si, which performed at President Obama''s second inauguration parade',

    -- Family background
    family_background = 'Born to a Puerto Rican and Lebanese mother and a Haitian father who placed him for adoption. Adopted at birth by Patrick Frost (a Kansas-born musician-producer) and Maritza Argibay-Frost (a special education teacher who immigrated from Cuba as a child during the Freedom Flights of the late 1960s). His adoptive grandmother, Zenaida Argibay (nicknamed "Yeya"), fled Cuba with nothing and worked over 70 hours a week in Miami factories to build a life for her family. Maxwell has a sister, Maria Elizabeth, who was also adopted. In June 2021, he reconnected with his birth mother for the first time—this conversation about her struggles inspired him to run for Congress.',

    -- Awards
    awards = 'First Gen Z Member of Congress; First Afro-Cuban Member of Congress; Honorary Doctorate of Humane Letters from University of the District of Columbia; Congressional Progressive Caucus PAC Executive Board Member; Youngest current member of Congress (sworn in at age 25)',

    -- Update endorsements to JSON format
    endorsements = '[{"name": "Bernie Sanders", "type": "Political"}, {"name": "Elizabeth Warren", "type": "Political"}, {"name": "Pramila Jayapal", "type": "Political"}, {"name": "Congressional Progressive Caucus", "type": "Political"}, {"name": "National Education Association", "type": "Labor"}, {"name": "United Auto Workers (UAW)", "type": "Labor"}, {"name": "Service Employees International Union (SEIU)", "type": "Labor"}, {"name": "Communication Workers of America (CWA)", "type": "Labor"}, {"name": "AFL-CIO", "type": "Labor"}, {"name": "Central Florida Labor Council", "type": "Labor"}, {"name": "Orlando Firefighters Local 1365", "type": "Labor"}, {"name": "Dolores Huerta", "type": "Political"}, {"name": "Jesse Jackson", "type": "Political"}, {"name": "Equality Florida", "type": "Advocacy"}, {"name": "Giffords", "type": "Advocacy"}, {"name": "Jane Fonda Climate PAC", "type": "Environmental"}]'

WHERE id = 1;
