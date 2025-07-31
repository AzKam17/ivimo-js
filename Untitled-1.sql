{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NjY0MmRjZS1iNDgwLTRlMzQtYWE1MS05NDRlYTI3YzM1YWIiLCJmaXJzdF9uYW1lIjoiTWFyaWtvIiwibGFzdF9uYW1lIjoiT3Vkb3UiLCJwaG9uZV9udW1iZXIiOiIwMDAwMDAwMDA0IiwiY29tcGFueUlkIjoiYWU2NzY2YTYtODNlZS00NjQzLTkxYWMtMzliYTFiMmVhNGJhIiwiZXh0cmFzIjp7fSwiZXhwIjoxNzUzOTEyODA3fQ.ld_Uqp4_jRqpvQ-R5_nMS30f7lIwKbzgzq-vwvAEaes",
  "user": {
    "id": "96642dce-b480-4e34-aa51-944ea27c35ab",
    "first_name": "Mariko",
    "last_name": "Oudou",
    "email": "test.test@mail.com",
    "phone_number": "0000000004",
    "role": "partner",
    "isActive": true,
    "companyId": "ae6766a6-83ee-4643-91ac-39ba1b2ea4ba",
    "extras": {}
  },
  "timestamp": 1753902007737
}
psql -h 172.19.0.2 -U root -p 5432
psql -h 172.19.0.2 -p 5432 -U root -d 225immo

select a."first_name", a."last_name", a."role", a."phone_number", a."created_by", a."id" 
from "user" as a;


SELECT 
u2.first_name,
u2.email as user_email,
COUNT(u1.id) as nombre_utilisateurs_crees
FROM "user" as u1 
INNER JOIN "user" as u2 ON u1.created_by::text = u2.id::text 
WHERE u1.role = 'client'
GROUP BY u2.id, u2."first_name", u2."email"
ORDER BY nombre_utilisateurs_crees DESC;

SELECT * FROM
(SELECT 
    u_all.first_name as user_name,
    u_all.role as role,
    u_all.email as user_email,
    u_all.company_id as company_id,
    u_all.created_by as created_by,
    COALESCE(creation_stats.nombre_utilisateurs_crees, 0) as nombre_utilisateurs_crees
FROM "user" u_all
LEFT JOIN (
    SELECT 
        created_by,
        COUNT(*) as nombre_utilisateurs_crees
    FROM "user"
    WHERE role = 'client' AND created_by IS NOT NULL
    GROUP BY created_by
) creation_stats ON u_all.id::text = creation_stats.created_by::text
LEFT JOIN "user" creator ON u_all.created_by::text = creator.id::text 
ORDER BY nombre_utilisateurs_crees DESC, u_all.first_name) list
WHERE list.company_id = 'ae6766a6-83ee-4643-91ac-39ba1b2ea4ba'
AND list.role in ('client', 'partner');