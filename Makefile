frontend-dev:
		npm --prefix ./frontend run dev

frontend-test:
		npm --prefix ./frontend run test:e2e:chromium

backend-dev:
		npm --prefix ./backend run dev

# Docker команды
docker-build:
		docker build -t booking-app:latest .

docker-run:
		docker run -p 3000:3000 --env-file .env booking-app:latest

docker-compose-up:
		docker-compose up -d

docker-compose-down:
		docker-compose down

docker-compose-logs:
		docker-compose logs -f

docker-compose-restart:
		docker-compose restart

docker-compose-build:
		docker-compose up -d --build