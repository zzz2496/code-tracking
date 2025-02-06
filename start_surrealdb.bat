@echo off
..\SurrealDB\surreal.exe start -A --auth --log debug --bind 0.0.0.0:8080 file:..\SurrealDB\paradigm_revolution.db -web-crt "..\cert.pem" -web-key "..\cert-key.pem"