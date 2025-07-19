# ShopSphere: Full-Stack E-commerce Application

This repository contains the complete source code and deployment configurations for ShopSphere, a modern e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js) and deployed using cloud-native technologies like Docker and Kubernetes.

## Project Architecture

The application is broken down into three core, decoupled services:

1.  **Frontend:** A responsive client-side application built with **React** and styled with **Tailwind CSS**. It is served as a static site by a lightweight **Nginx** web server.
2.  **Backend:** A RESTful API built with **Node.js** and **Express**. It handles business logic and communicates with the database.
3.  **Database:** A **MongoDB** instance that stores all application data, including products and users.

![Architecture Diagram](https://placehold.co/800x400/1e293b/ffffff?text=Frontend+%3C--%3E+Backend+%3C--%3E+Database)

---

## 1. Git and GitHub: Version Control

This project uses Git for version control. All code is hosted on GitHub.

### GitHub CLI

To streamline your workflow, we recommend using the [GitHub CLI (`gh`)](https://cli.github.com/).

```bash
# Clone the repository
gh repo clone yogananadabrahmachari/ecommerce-project

# Create a pull request
gh pr create --title "feat: Add new feature" --body "Detailed description of changes."

# Check CI/CD status
gh run list
```

---

## 2. CI/CD with GitHub Actions

A Continuous Integration/Continuous Deployment (CI/CD) pipeline is set up using **GitHub Actions**. The workflow is defined in `.github/workflows/ci.yaml`.

**Workflow Overview:**

* **Trigger:** The workflow runs automatically on every `push` to the `main` branch or any `pull_request` targeting `main`.
* **Jobs:**
    1.  **Build & Test Backend:** Installs Node.js dependencies for the backend and runs build/lint checks.
    2.  **Build & Test Frontend:** Installs dependencies for the frontend and runs a production build to ensure it compiles without errors.

---

## 3. Containerisation with Docker

Each service is containerised using Docker for consistency across all environments.

**To run the entire application stack locally:**

```bash
# This single command will build the images and start all three containers.
docker-compose up --build
```

* Frontend will be available at: `http://localhost:3000`
* Backend API will be available at: `http://localhost:5000`

---

## 4. Container Orchestration with Kubernetes (K8s)

Kubernetes is used to deploy, scale, and manage the containerised application. The configuration files (manifests) are located in the `/kubernetes` directory.

### Deployment Steps:

1.  **Deploy MongoDB:**
    ```bash
    kubectl apply -f kubernetes/mongo-statefulset.yaml
    ```
2.  **Deploy the Backend:**
    ```bash
    kubectl apply -f kubernetes/backend-deployment.yaml
    ```
3.  **Deploy the Frontend:**
    ```bash
    kubectl apply -f kubernetes/frontend-deployment.yaml
    ```

### Accessing the Application

```bash
# Get the External IP for the frontend service
kubectl get services frontend-service
