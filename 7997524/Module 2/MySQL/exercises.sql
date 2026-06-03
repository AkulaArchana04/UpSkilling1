--/User Upcoming Events

SELECT u.full_name, e.title, e.city, e.start_date
FROM Users u
JOIN Registrations r ON u.user_id = r.user_id
JOIN Events e ON r.event_id = e.event_id
WHERE e.status = 'upcoming'
AND u.city = e.city
ORDER BY e.start_date;

--//Top Rated Events//

SELECT e.title,
       AVG(f.rating) AS avg_rating,
       COUNT(f.feedback_id) AS total_feedback
FROM Events e
JOIN Feedback f ON e.event_id = f.event_id
GROUP BY e.event_id, e.title
HAVING COUNT(f.feedback_id) >= 10
ORDER BY avg_rating DESC;

--//Inactive Users//

SELECT *
FROM Users
WHERE user_id NOT IN
(
    SELECT DISTINCT user_id
    FROM Registrations
    WHERE registration_date >= CURDATE() - INTERVAL 90 DAY
);

--//Peak Session Hours//

SELECT e.title,
       COUNT(s.session_id) AS sessions_between_10_12
FROM Events e
LEFT JOIN Sessions s
ON e.event_id = s.event_id
WHERE HOUR(s.start_time) BETWEEN 10 AND 12
GROUP BY e.title;

--//Most Active Cities//

SELECT u.city,
       COUNT(DISTINCT r.registration_id) AS registrations
FROM Users u
JOIN Registrations r
ON u.user_id = r.user_id
GROUP BY u.city
ORDER BY registrations DESC
LIMIT 5;

--//Event Resource Summary//

SELECT e.title,
       COUNT(r.resource_id) AS total_resources
FROM Events e
LEFT JOIN Resources r
ON e.event_id = r.event_id
GROUP BY e.title;

--//Low Feedback Alerts//

SELECT u.full_name,
       e.title,
       f.rating,
       f.comments
FROM Feedback f
JOIN Users u
ON f.user_id = u.user_id
JOIN Events e
ON f.event_id = e.event_id
WHERE f.rating < 3;

--//Sessions per Upcoming Event//

SELECT e.title,
       COUNT(s.session_id) AS session_count
FROM Events e
LEFT JOIN Sessions s
ON e.event_id = s.event_id
WHERE e.status='upcoming'
GROUP BY e.title;

--//Organizer Event Summary//

SELECT u.full_name,
       e.status,
       COUNT(*) AS total_events
FROM Users u
JOIN Events e
ON u.user_id=e.organizer_id
GROUP BY u.full_name,e.status;

--//Feedback Gap//

SELECT e.title
FROM Events e
JOIN Registrations r
ON e.event_id=r.event_id
LEFT JOIN Feedback f
ON e.event_id=f.event_id
WHERE f.feedback_id IS NULL
GROUP BY e.title;

--//Daily New User Count//
SELECT registration_date,
       COUNT(*) AS new_users
FROM Users
WHERE registration_date >= CURDATE() - INTERVAL 7 DAY
GROUP BY registration_date;

--//Event with Maximum Sessions//

SELECT e.title,
       COUNT(s.session_id) AS total_sessions
FROM Events e
JOIN Sessions s
ON e.event_id=s.event_id
GROUP BY e.event_id,e.title
HAVING COUNT(s.session_id)=
(
SELECT MAX(session_count)
FROM
(
SELECT COUNT(*) session_count
FROM Sessions
GROUP BY event_id
) x
);


--//Average Rating per City//

SELECT e.city,
       AVG(f.rating) AS avg_rating
FROM Events e
JOIN Feedback f
ON e.event_id=f.event_id
GROUP BY e.city;

--//Most Registered Events//

SELECT e.title,
       COUNT(r.registration_id) AS registrations
FROM Events e
JOIN Registrations r
ON e.event_id=r.event_id
GROUP BY e.title
ORDER BY registrations DESC
LIMIT 3;

--//Event Session Time Conflict//

SELECT
s1.event_id,
s1.title AS session1,
s2.title AS session2
FROM Sessions s1
JOIN Sessions s2
ON s1.event_id=s2.event_id
AND s1.session_id < s2.session_id
AND s1.start_time < s2.end_time
AND s1.end_time > s2.start_time;

--//Unregistered Active Users//

SELECT *
FROM Users u
WHERE u.registration_date >= CURDATE() - INTERVAL 30 DAY
AND u.user_id NOT IN
(
SELECT user_id
FROM Registrations
);

--//Multi-Session Speakers//

SELECT speaker_name,
       COUNT(*) AS sessions_handled
FROM Sessions
GROUP BY speaker_name
HAVING COUNT(*) > 1;

--/Resource Availability Check//
SELECT e.title
FROM Events e
LEFT JOIN Resources r
ON e.event_id=r.event_id
WHERE r.resource_id IS NULL;

--Completed Events with Feedback Summary//

SELECT e.title,
       COUNT(DISTINCT r.registration_id) AS registrations,
       AVG(f.rating) AS avg_rating
FROM Events e
LEFT JOIN Registrations r
ON e.event_id=r.event_id
LEFT JOIN Feedback f
ON e.event_id=f.event_id
WHERE e.status='completed'
GROUP BY e.title;
--User Engagement Index//

SELECT u.full_name,
       COUNT(DISTINCT r.event_id) AS events_attended,
       COUNT(DISTINCT f.feedback_id) AS feedbacks_given
FROM Users u
LEFT JOIN Registrations r
ON u.user_id=r.user_id
LEFT JOIN Feedback f
ON u.user_id=f.user_id
GROUP BY u.user_id,u.full_name;

--21. Top Feedback Providers//

SELECT u.full_name,
       COUNT(f.feedback_id) AS feedback_count
FROM Users u
JOIN Feedback f
ON u.user_id=f.user_id
GROUP BY u.full_name
ORDER BY feedback_count DESC
LIMIT 5;

--22. Duplicate Registrations Check//

SELECT user_id,
       event_id,
       COUNT(*) AS duplicate_count
FROM Registrations
GROUP BY user_id,event_id
HAVING COUNT(*) > 1;

--23. Registration Trends//

SELECT
YEAR(registration_date) AS year,
MONTH(registration_date) AS month,
COUNT(*) AS registrations
FROM Registrations
WHERE registration_date >= CURDATE() - INTERVAL 12 MONTH
GROUP BY YEAR(registration_date),
         MONTH(registration_date)
ORDER BY year,month;

--24. Average Session Duration per Event//

SELECT e.title,
       AVG(
       TIMESTAMPDIFF
       (
       MINUTE,
       s.start_time,
       s.end_time
       )
       ) AS avg_duration_minutes
FROM Events e
JOIN Sessions s
ON e.event_id=s.event_id
GROUP BY e.title;

--25. Events Without Sessions//

SELECT e.title
FROM Events e
LEFT JOIN Sessions s
ON e.event_id=s.event_id
WHERE s.session_id IS NULL;