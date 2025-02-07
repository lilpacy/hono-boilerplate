curl http://localhost:8787/api/v1/countries \
    -H "Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjF9.ja4lY2x_xiCmS8kXmniuQS2-dBNPa4so3yLPj6tnk9c; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJyZWZyZXNoIn0.zL7wVM6sOkhoZbYIqRijh7WDGkEivUHIA4SlabX2eMk" | jq .
