# Notes App DevOps Learning

This repository documents my step-by-step journey of taking a Node.js app from local development to production using Docker, Docker Compose, PostgreSQL, Nginx, EC2, and GitHub Actions.

## Learning Milestones

- [X] Initialize repository structure
Steps:

Created a README.md file to document the project and its progress

Created a .gitignore file to exclude unnecessary files from version control, such as:

node_modules/ (installed dependencies)

.env (environment variables)

Result:

Clean repository structure

Sensitive and unnecessary files are excluded from Git tracking

- [X] Build minimal Node.js app
Steps:

Created a package.json file to define:

Application name and version

Dependencies

Start script (npm start)

Created a simple Node.js server (server.js) inside the src directory

Installed dependencies using:

npm install

Started the application using:

npm start
Result:

The application runs successfully using a simple JavaScript server

node_modules directory and package-lock.json were generated after installing dependencies
- [X] Dockerize the app
- [ ] Add Docker Compose for local development
- [ ] Integrate PostgreSQL
- [ ] Add Nginx reverse proxy
- [ ] Create production setup
- [ ] Deploy to EC2
- [ ] Add CI/CD with GitHub Actions