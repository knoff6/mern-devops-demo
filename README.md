# MERN DevOps Demo

A comprehensive, hands-on demonstration of a full CI/CD pipeline for a MERN (MongoDB, Express, React, Node.js) application. This project showcases how to integrate Docker, Jenkins, and SonarQube for continuous integration and code quality analysis, with deployment options for GCP, AWS, and Azure.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Repository Structure](#repository-structure)
- [Part 1: Local Development](#part-1-local-development)
- [Part 2: CI/CD with Jenkins & SonarQube](#part-2-cicd-with-jenkins--sonarqube)
- [Part 3: Deployment to the Cloud](#part-3-deployment-to-the-cloud)
- [Demo Flow](#demo-flow)
- [Security Best Practices](#security-best-practices)
- [Cleanup](#cleanup)

## Project Overview

This project demonstrates a real-world DevOps workflow:

-   **Application:** A simple MERN stack application with a React frontend and a Node.js/Express backend.
-   **Containerization:** Docker is used to containerize the frontend and backend applications.
-   **Local Development:** Docker Compose provides a one-command setup for local development, including the application and a MongoDB database.
-   **Continuous Integration:** Jenkins is used as the CI server to automate the build, test, and deployment process.
-   **Code Quality:** SonarQube is integrated into the pipeline to perform static code analysis and provide a quality gate.
-   **Deployment:** The pipeline includes steps to deploy the application to popular cloud platforms like GCP, AWS, or Azure.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine) with Docker Compose v2.
-   [Node.js](https://nodejs.org/en/download/) (version 20 or higher).
-   [Git](https://git-scm.com/downloads).
-   **(Optional)** CLIs for your chosen cloud provider:
    -   **GCP:** `gcloud` CLI
    -   **AWS:** `aws` CLI
    -   **Azure:** `az` CLI

Make sure the following ports are available on your machine: `3000`, `4000`, `27017`, `9000`, `8080`.

## Repository Structure

```
mern-demo/
├─ frontend/         # React frontend application
│  ├─ src/App.jsx
│  ├─ package.json
│  └─ Dockerfile
├─ backend/          # Node.js/Express backend application
│  ├─ index.js
│  ├─ package.json
│  └─ Dockerfile
├─ infra/            # Infrastructure configurations
│  ├─ docker-compose.dev.yml   # For local development
│  └─ docker-compose.ci.yml    # For Jenkins and SonarQube
├─ Jenkinsfile       # Jenkins pipeline definition
├─ sonar-project.properties  # SonarQube project configuration
└─ README.md         # This file
```

## Part 1: Local Development

This section describes how to run the MERN application on your local machine using Docker Compose.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/knoff6/mern-devops-demo.git
    cd mern-devops-demo
    ```

2.  **Start the application:**
    Navigate to the `infra` directory and run the development docker-compose file.
    ```bash
    cd infra
    docker compose -f docker-compose.dev.yml up -d --build
    ```
    This command will:
    -   Build the Docker images for the frontend and backend.
    -   Start three containers: `mern_frontend`, `mern_backend`, and `mern_mongo`.

3.  **Access the application:**
    Open your web browser and go to [http://localhost:3000](http://localhost:3000). You should see the MERN demo application. You can add items, and they will be stored in the MongoDB database.

## Part 2: CI/CD with Jenkins & SonarQube

This section explains how to set up the CI/CD stack with Jenkins and SonarQube.

1.  **Start the CI/CD stack:**
    From the `infra` directory, run the CI docker-compose file.
    ```bash
    cd infra
    docker compose -f docker-compose.ci.yml up -d
    ```
    This will start Jenkins, SonarQube, and a PostgreSQL database for SonarQube.

2.  **Access Jenkins and SonarQube:**
    -   **Jenkins:** [http://localhost:8080](http://localhost:8080)
    -   **SonarQube:** [http://localhost:9000](http://localhost:9000)

3.  **One-time SonarQube Setup:**
    -   Log in to SonarQube with default credentials: `admin` / `admin`. You will be prompted to change the password.
    -   Create a new project: Click on "Create Project" -> "Manually".
    -   Enter a project key (e.g., `mern-demo`) and a display name.
    -   Generate a token when prompted. Copy this token, as you will need it for Jenkins.

4.  **One-time Jenkins Setup:**
    -   When you first access Jenkins, you will need to provide an administrator password. You can get it from the Jenkins container logs:
        ```bash
        docker logs jenkins
        ```
    -   Follow the instructions to install the suggested plugins.
    -   Create an admin user.
    -   Go to **Manage Jenkins** -> **Credentials**.
    -   Add the following credentials:
        -   **SonarQube Token:**
            -   **Kind:** Secret text
            -   **Secret:** The token you generated from SonarQube.
            -   **ID:** `SONAR_TOKEN`
        -   **SonarQube Host URL:**
            -   **Kind:** Secret text
            -   **Secret:** `http://sonarqube:9000` (this is the internal Docker network address)
            -   **ID:** `SONAR_HOST_URL`
        -   **(Optional) Container Registry Credentials:** If you plan to push Docker images to a private registry, add credentials for it here (e.g., `registry-url`, `registry-user`, `registry-pass`).

5.  **Create the Jenkins Pipeline:**
    -   On the Jenkins dashboard, click on "New Item".
    -   Enter an item name (e.g., `mern-demo-pipeline`), select "Pipeline", and click "OK".
    -   In the pipeline configuration, under the "Pipeline" section:
        -   **Definition:** Select "Pipeline script from SCM".
        -   **SCM:** Select "Git".
        -   **Repository URL:** Enter the URL of this repository: `https://github.com/knoff6/mern-devops-demo.git`.
        -   **Branch Specifier:** `*/main`.
        -   **Script Path:** `Jenkinsfile`.
    -   Click "Save".

6.  **Run the Pipeline:**
    -   Click on "Build Now" to run the pipeline.
    -   You can view the pipeline stages and logs in the "Stage View" and "Console Output".
    -   After the "SonarQube Scan" stage is complete, go to your SonarQube project dashboard to see the code quality report.

## Part 3: Deployment to the Cloud

The `Jenkinsfile` is set up to deploy the application to a cloud provider. Here is an example for **GCP Cloud Run**.

1.  **One-time GCP Setup:**
    ```bash
    gcloud auth login
    gcloud config set project YOUR_PROJECT_ID
    gcloud services enable artifactregistry.googleapis.com run.googleapis.com
    gcloud artifacts repositories create mernrepo --repository-format=docker --location=asia-south1
    ```

2.  **Update Jenkinsfile for GCP Deployment:**
    In your `Jenkinsfile`, replace the "Login & Push" and "Deploy" stages with the GCP-specific stages from the `whole-pipe.txt` file (or from the comments in the `Jenkinsfile` if available). You will need to replace `YOUR_PROJECT_ID` with your actual GCP project ID.

    *Note: For a real project, you would use a more secure way to authenticate with GCP from Jenkins, like Workload Identity Federation.*

## Demo Flow

Here is a suggested flow for demonstrating this project:

1.  **Local Run:** Show how to start the application locally with one command. Open the frontend in the browser, add some items, and show that they persist in the database.
2.  **CI/CD Stack:** Show the Jenkins and SonarQube UIs.
3.  **Run Jenkins Pipeline:** Trigger a build and walk through the pipeline stages:
    -   Checkout -> Install & Test -> SonarQube Scan -> Build Images -> Deploy.
    -   Open the SonarQube dashboard and show the code quality report and Quality Gate status.
4.  **Cloud Deployment:** Show the application running in the cloud. Access the public URL of the deployed frontend and verify that it's working.

## Security Best Practices

-   **Non-root containers:** The Dockerfiles are configured to run the application with a non-root user.
-   **Secrets Management:** Secrets are passed to the pipeline via Jenkins credentials, not hardcoded in the source code.
-   **Database Security:** For a production environment, use a managed database service like MongoDB Atlas with IP allowlists and strong credentials.
-   **CORS:** The backend should be configured to only allow requests from the frontend's origin in a production environment.

## Cleanup

To stop and remove all the containers and volumes created during this demo, run the following commands from the `infra` directory:

```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.ci.yml down -v
```
