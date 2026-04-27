frontend-dev: 
		npm --prefix ./frontend run dev

frontend-test:
		npm --prefix ./frontend run test:e2e:chromium

backend-dev: 
		npm --prefix ./backend run dev