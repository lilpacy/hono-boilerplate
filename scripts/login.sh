curl -X POST http://localhost:8787/api/v1/login \  -H "Content-Type: application/json" \  -d '{"email":"revivedtomorrow@gmail.com","password":"password123"}' | jq .
