# 🚀 Jenkins CI/CD Pipeline with Docker

A complete CI/CD implementation using **Jenkins, GitHub, Node.js, and Docker** to automatically build, test, containerize, and deploy a web application.

---

## 📌 Project Overview

This project demonstrates how to implement a **Continuous Integration and Continuous Deployment (CI/CD) pipeline using Jenkins**.

The pipeline connects a GitHub repository with Jenkins and automates the following process:

```text
Developer
   ↓
GitHub Repository
   ↓
Jenkins
   ↓
Checkout Source Code
   ↓
Install Dependencies
   ↓
Run Tests
   ↓
Build Docker Image
   ↓
Deploy Docker Container
   ↓
Running Application
```

The application is a simple Node.js/Express web application that is packaged into a Docker container and deployed automatically through Jenkins.

---

## 🎯 Objective

The main objectives of this project are:

* Understand Jenkins CI/CD fundamentals.
* Integrate Jenkins with GitHub.
* Create a Jenkins Pipeline using a `Jenkinsfile`.
* Automate application dependency installation.
* Automate application testing.
* Build a Docker image automatically.
* Deploy the application using Docker.
* Configure GitHub Webhook integration.
* Verify the deployed application.
* Understand the complete CI/CD workflow.

---

## 🛠️ Technologies Used

| Technology         | Purpose                      |
| ------------------ | ---------------------------- |
| **Jenkins**        | CI/CD automation             |
| **GitHub**         | Source code management       |
| **Git**            | Version control              |
| **Node.js**        | Application runtime          |
| **Express.js**     | Web application framework    |
| **Docker**         | Application containerization |
| **Linux / Ubuntu** | Jenkins server environment   |
| **Java**           | Jenkins runtime              |

---

# 📂 Project Structure

```text
jenkins-cicd-task2/
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── Jenkinsfile
├── README.md
├── app.js
├── app.test.js
├── package.json
├── package-lock.json
│
└── screenshots/
    ├── .gitkeep
    ├── jenkins-pipeline-success.png
    ├── jenkins-console-success.png
    ├── github-webhook-success.png
    ├── docker-container-running.png
    ├── application-home.png
    └── application-health.png
```

---

# 🏗️ Application Architecture

```text
                   ┌─────────────────────┐
                   │      Developer      │
                   └──────────┬──────────┘
                              │
                              │ git push
                              ▼
                   ┌─────────────────────┐
                   │       GitHub        │
                   │   Source Repository │
                   └──────────┬──────────┘
                              │
                       Webhook Trigger
                              │
                              ▼
                   ┌─────────────────────┐
                   │       Jenkins       │
                   │    CI/CD Server     │
                   └──────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        Checkout          Build/Test       Docker Build
             │                │                │
             └────────────────┼────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Docker Container  │
                   │   Node.js App       │
                   │      Port 3000     │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │    Web Browser      │
                   │ localhost:3000      │
                   └─────────────────────┘
```

---

# 🔄 CI/CD Workflow

The complete workflow is:

### 1. Developer Push

The developer makes changes to the application and pushes them to the GitHub `main` branch.

### 2. GitHub Webhook

GitHub sends a webhook notification to Jenkins when a change is pushed.

### 3. Jenkins Checkout

Jenkins retrieves the latest source code from the GitHub repository.

### 4. Build

Jenkins installs the required Node.js dependencies.

```bash
npm install
```

### 5. Test

Jenkins executes the automated application tests.

```bash
npm test
```

### 6. Docker Build

Jenkins creates a Docker image.

```bash
docker build -t jenkins-cicd-task2:latest .
```

### 7. Deploy

Jenkins stops and removes the previous container and starts a new container.

```bash
docker stop jenkins-cicd-task2-container || true
docker rm jenkins-cicd-task2-container || true
docker run -d \
  --name jenkins-cicd-task2-container \
  -p 3000:3000 \
  jenkins-cicd-task2:latest
```

### 8. Application Verification

The application becomes available on port `3000`.

---

# 🧩 Jenkins Pipeline Stages

The Jenkinsfile contains the following stages.

## Stage 1 — Checkout

Retrieves source code from GitHub.

```groovy
stage('Checkout') {
    steps {
        echo 'Checking out source code from GitHub...'
        checkout scm
    }
}
```

### Purpose

This stage ensures that Jenkins works with the latest version of the source code.

---

## Stage 2 — Build

Installs the Node.js application dependencies.

```groovy
stage('Build') {
    steps {
        echo 'Installing application dependencies...'
        sh 'npm install'
    }
}
```

### Purpose

Downloads and installs the packages defined in `package.json`.

---

## Stage 3 — Test

Runs the application's automated tests.

```groovy
stage('Test') {
    steps {
        echo 'Running application tests...'
        sh 'npm test'
    }
}
```

### Purpose

Testing prevents defective code from moving further into the deployment process.

---

## Stage 4 — Docker Build

Creates the Docker image.

```groovy
stage('Docker Build') {
    steps {
        echo 'Building Docker image...'
        sh 'docker build -t ${IMAGE_NAME}:latest .'
    }
}
```

### Purpose

Packages the application and its runtime environment into a portable Docker image.

---

## Stage 5 — Deploy

Deploys the Docker container.

```groovy
stage('Deploy') {
    steps {
        echo 'Deploying application...'
        sh '''
            docker stop ${CONTAINER_NAME} || true
            docker rm ${CONTAINER_NAME} || true
            docker run -d \
                --name ${CONTAINER_NAME} \
                -p 3000:3000 \
                ${IMAGE_NAME}:latest
        '''
    }
}
```

### Purpose

Ensures that the latest Docker image is running as the deployed application.

---

# 📝 Jenkinsfile

The project uses a declarative Jenkins Pipeline.

```groovy
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'jenkins-cicd-task2'
        CONTAINER_NAME = 'jenkins-cicd-task2-container'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Installing application dependencies...'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Running application tests...'
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 3000:3000 \
                        ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline completed successfully!'
        }

        failure {
            echo 'CI/CD Pipeline failed. Check the console output.'
        }
    }
}
```

---

# 🐳 Docker Configuration

The application is containerized using Docker.

## Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY app.js ./

EXPOSE 3000

CMD ["node", "app.js"]
```

### Dockerfile Explanation

| Instruction                  | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `FROM node:18-alpine`        | Uses a lightweight Node.js image       |
| `WORKDIR /app`               | Sets the application working directory |
| `COPY package*.json ./`      | Copies package files                   |
| `RUN npm install --omit=dev` | Installs production dependencies       |
| `COPY app.js ./`             | Copies application source code         |
| `EXPOSE 3000`                | Documents application port             |
| `CMD`                        | Starts the application                 |

---

# 🌐 Application Endpoints

The application provides two endpoints.

## Home Page

```text
http://<EC2-PUBLIC-IP>:3000/
```

Expected response:

```text
Hello from Jenkins CI/CD Pipeline! 🚀
```

## Health Check

```text
http://<EC2-PUBLIC-IP>:3000/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "jenkins-cicd-task2"
}
```

---

# 🧪 Testing

The project uses Node.js built-in testing functionality.

The tests verify:

* Application is successfully created.
* Health endpoint is available.
* HTTP response status is `200`.
* Health status is `healthy`.
* Correct service name is returned.

Command:

```bash
npm test
```

Expected result:

```text
2 tests passed
0 tests failed
```

---

# 🔗 GitHub Integration

The Jenkins pipeline is connected to the GitHub repository:

```text
https://github.com/chinnu9729/jenkins-cicd-task2
```

Jenkins is configured to use:

```text
Branch: main
Script Path: Jenkinsfile
```

The pipeline uses **Pipeline script from SCM**, which means Jenkins retrieves the `Jenkinsfile` directly from the GitHub repository.

---

# 🔔 GitHub Webhook

A GitHub Webhook is configured to notify Jenkins whenever code is pushed to the repository.

Webhook endpoint:

```text
http://<JENKINS-SERVER>:8080/github-webhook/
```

The webhook is configured for:

```text
Push events
```

### Workflow

```text
Git Push
   ↓
GitHub
   ↓
Webhook
   ↓
Jenkins
   ↓
Pipeline Execution
```

This removes the need to manually start the Jenkins pipeline after every code change.

---

# 🖥️ Jenkins Server

Jenkins was installed on an Ubuntu cloud instance.

The environment included:

```text
Ubuntu Linux
Java
Git
Docker
Node.js
npm
Jenkins
```

Jenkins was accessed through:

```text
http://<EC2-PUBLIC-IP>:8080
```

The application was exposed on:

```text
Port 3000
```

---

# 🐳 Docker Deployment Verification

The deployed container can be verified using:

```bash
docker ps
```

Expected container:

```text
jenkins-cicd-task2-container
```

Expected image:

```text
jenkins-cicd-task2:latest
```

Expected port mapping:

```text
3000:3000
```

---

# 📸 Project Screenshots

## 1. GitHub Repository

The GitHub repository contains the complete application source code, Docker configuration, Jenkins pipeline, tests, README, and screenshots.

![GitHub Repository](screenshots/github-repository-files.png)

---

## 2. Jenkins Pipeline Success

This screenshot shows the Jenkins pipeline completing all stages successfully.

![Jenkins Pipeline Success](screenshots/jenkins-pipeline-success.png)

### Pipeline stages demonstrated

```text
Checkout
   ↓
Build
   ↓
Test
   ↓
Docker Build
   ↓
Deploy
```

---

## 3. Jenkins Console Output

The Jenkins console output demonstrates the actual execution of the CI/CD pipeline.

![Jenkins Console Output](screenshots/jenkins-console-success.png)

The console verifies:

* Source code checkout
* Dependency installation
* Test execution
* Docker image creation
* Container deployment
* Successful pipeline completion

---

## 4. GitHub Webhook

This screenshot demonstrates the GitHub webhook integration with Jenkins.

![GitHub Webhook](screenshots/github-webhook-success.png)

The webhook allows GitHub to notify Jenkins about repository changes.

---

## 5. Docker Container

This screenshot shows the Docker container created and deployed by Jenkins.

![Docker Container](screenshots/docker-container-running.png)

The container should show:

```text
jenkins-cicd-task2-container
```

with the application exposed through port `3000`.

---

## 6. Application Home Page

The deployed Node.js application can be accessed through the browser.

![Application Home](screenshots/application-home.png)

Expected output:

```text
Hello from Jenkins CI/CD Pipeline! 🚀
```

---

## 7. Application Health Check

The health endpoint confirms that the deployed service is running correctly.

![Application Health](screenshots/application-health.png)

Expected response:

```json
{
  "status": "healthy",
  "service": "jenkins-cicd-task2"
}
```

---

# 📊 CI/CD Result

The completed pipeline successfully demonstrated:

| Component                | Result       |
| ------------------------ | ------------ |
| GitHub Integration       | ✅ Successful |
| Jenkins Checkout         | ✅ Successful |
| Dependency Installation  | ✅ Successful |
| Automated Testing        | ✅ Successful |
| Docker Image Build       | ✅ Successful |
| Docker Deployment        | ✅ Successful |
| Application Health Check | ✅ Successful |
| GitHub Webhook           | ✅ Configured |
| End-to-End CI/CD         | ✅ Completed  |

---

# 🔐 Security Considerations

For a production environment, the following practices should be followed:

* Never commit passwords or API tokens to GitHub.
* Never expose GitHub Personal Access Tokens in screenshots.
* Store Jenkins credentials using Jenkins Credentials Manager.
* Use GitHub Secrets for sensitive CI/CD values.
* Restrict cloud security-group rules.
* Avoid exposing Jenkins publicly without proper authentication and network controls.
* Use HTTPS for production services.
* Use non-root containers where appropriate.
* Regularly update Jenkins, Docker, Node.js, and dependencies.

---

# 📚 Key DevOps Concepts Demonstrated

## Continuous Integration

Continuous Integration automatically builds and tests code changes frequently.

Benefits:

* Early bug detection
* Automated testing
* Faster feedback
* Better code quality

---

## Continuous Deployment

Continuous Deployment automatically deploys successfully tested changes to the target environment.

In this project:

```text
Code Change
    ↓
Build
    ↓
Test
    ↓
Docker Build
    ↓
Deploy
```

---

## Jenkins

Jenkins is an automation server used to implement CI/CD pipelines.

In this project Jenkins performs:

```text
Source Checkout
Dependency Installation
Testing
Docker Build
Deployment
```

---

## Docker

Docker packages applications into containers.

A container provides a consistent environment for running the application.

---

## GitHub Webhook

A webhook allows GitHub to send an HTTP request to Jenkins when an event occurs, such as a code push.

---

## Jenkinsfile

A Jenkinsfile stores the CI/CD pipeline definition as code.

Advantages:

* Version controlled
* Reproducible
* Easy to review
* Easy to maintain
* Stored together with application source code

---

# 💡 Why CI/CD Is Important

Without CI/CD:

```text
Developer
   ↓
Manual Build
   ↓
Manual Testing
   ↓
Manual Deployment
```

With CI/CD:

```text
Developer
   ↓
Git Push
   ↓
Automated Pipeline
   ↓
Build
   ↓
Test
   ↓
Docker Build
   ↓
Deployment
```

CI/CD reduces repetitive manual work and provides faster feedback on software changes.

---

# 🎓 Learning Outcomes

Through this project, I gained practical experience with:

* Jenkins Pipeline creation
* Declarative Jenkinsfile syntax
* GitHub and Jenkins integration
* GitHub Webhooks
* CI/CD automation
* Node.js application deployment
* Docker image creation
* Docker container deployment
* Linux server administration
* Automated application testing
* Cloud-based Jenkins deployment
* Pipeline troubleshooting

---

# ❓ Interview Questions

## 1. What is Jenkins?

Jenkins is an open-source automation server commonly used to automate software development processes such as building, testing, and deploying applications.

## 2. What is CI/CD?

CI/CD stands for Continuous Integration and Continuous Delivery/Deployment.

It automates the process of integrating code changes, testing applications, and delivering or deploying software.

## 3. What is a Jenkinsfile?

A Jenkinsfile is a text file that defines a Jenkins pipeline as code.

## 4. Why use Pipeline as Code?

It allows the pipeline configuration to be version-controlled together with the application source code.

## 5. What is a GitHub Webhook?

A GitHub Webhook sends event notifications from GitHub to another service such as Jenkins.

## 6. Why is Docker used in this project?

Docker packages the application and its runtime dependencies into a container, making deployment more consistent.

## 7. What happens if the test stage fails?

The pipeline stops progressing to later stages unless the pipeline is explicitly configured to continue.

## 8. What is the purpose of `docker build`?

It creates a Docker image from the instructions defined in the Dockerfile.

## 9. What is the purpose of `docker run`?

It creates and starts a container from a Docker image.

## 10. What is the difference between an image and a container?

A Docker image is a packaged template used to create containers.

A container is a running instance of a Docker image.

---

# 🚀 Future Improvements

The project can be extended with:

* Docker Hub image publishing
* Jenkins credentials management
* SonarQube code-quality analysis
* Trivy security scanning
* Kubernetes deployment
* AWS ECR integration
* AWS ECS/EKS deployment
* Terraform infrastructure automation
* Prometheus monitoring
* Grafana dashboards
* Slack or email notifications
* Blue-Green deployment
* Rolling deployment
* Multi-environment pipelines

---

# 👩‍💻 Author

**Vancha Rishika Reddy**

GitHub:
https://github.com/chinnu9729

LinkedIn:
https://linkedin.com/in/vancha-rishika-4102662ab

---

# 📌 Internship Task

**DevOps Internship — Task 2**

### Task

**Create a Simple Jenkins Pipeline for CI/CD**

### Objective

Create a Jenkins pipeline that automatically builds, tests, and deploys an application using Docker.

### Tools

```text
Jenkins
GitHub
Git
Node.js
Docker
Linux
```

---

# ⭐ Project Summary

This project demonstrates an end-to-end CI/CD workflow where source code stored in GitHub is automatically processed by Jenkins.

The pipeline performs:

```text
GitHub
   ↓
Jenkins
   ↓
Checkout
   ↓
Build
   ↓
Test
   ↓
Docker Build
   ↓
Deploy
   ↓
Running Node.js Application
```

The successful implementation demonstrates practical understanding of **Jenkins, CI/CD, GitHub, Docker, Linux, Node.js, automated testing, webhook integration, and application deployment**.

