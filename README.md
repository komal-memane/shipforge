# ShipForge

**Production-style cloud-native DevOps platform built on AWS, Kubernetes, Terraform, CI/CD, GitOps, and observability.**

ShipForge is a microservices application designed to demonstrate an end-to-end DevOps workflow from source code to a monitored Kubernetes deployment on AWS.

## Architecture

```text
Developer
    |
    | git push
    v
GitHub
    |
    v
Jenkins CI/CD
    |
    +--> Tests
    +--> Docker Build
    +--> Trivy Security Scan
    |
    v
Amazon ECR
    |
    v
GitOps Manifest Update
    |
    v
GitHub
    |
    v
Argo CD
    |
    v
Amazon EKS
    |
    +-------------------+
    |                   |
    v                   v
Product Service     Order Service
    |                   |
    +---------+---------+
              |
              v
         PostgreSQL
              |
              v
          EBS Volume

Users
  |
  v
AWS Application Load Balancer
  |
  v
Kubernetes Ingress
  |
  +---- /products ----> Product Service
  |
  +---- /orders ------> Order Service
```

## Services

### Product Service

Node.js/Express microservice responsible for product data.

Endpoints:

* `GET /`
* `GET /health`
* `GET /products`

Port: `3000`

### Order Service

Node.js/Express microservice responsible for order data.

Endpoints:

* `GET /`
* `GET /health`
* `GET /orders`
* `POST /orders`

Port: `3001`

### PostgreSQL

PostgreSQL provides persistent application data storage for the microservices.

The database runs inside Kubernetes using a Deployment, ClusterIP Service, PersistentVolumeClaim, and AWS EBS storage.

## Technology Stack

| Area                     | Technology                    |
| ------------------------ | ----------------------------- |
| Application              | Node.js                       |
| API Framework            | Express.js                    |
| Database                 | PostgreSQL                    |
| Containers               | Docker                        |
| Container Registry       | Amazon ECR                    |
| Cloud                    | AWS                           |
| Kubernetes               | Amazon EKS                    |
| Infrastructure as Code   | Terraform                     |
| Kubernetes Configuration | Kustomize                     |
| CI/CD                    | Jenkins                       |
| GitOps                   | Argo CD                       |
| Load Balancing           | AWS Application Load Balancer |
| Security Scanning        | Trivy                         |
| Monitoring               | Prometheus                    |
| Dashboards               | Grafana                       |
| Metrics                  | Kubernetes Metrics Server     |
| Source Control           | GitHub                        |

## CI/CD Pipeline

Every application change follows an automated pipeline:

```text
Git Push
   |
   v
Jenkins
   |
   +--> Install dependencies
   |
   +--> Run tests
   |
   +--> Build Docker images
   |
   +--> Trivy vulnerability scan
   |
   +--> Push images to Amazon ECR
   |
   +--> Update Kustomize image tags
   |
   +--> Commit GitOps change
   |
   +--> Push to GitHub
   |
   v
Argo CD
   |
   +--> Detect Git change
   |
   +--> Synchronize Kubernetes manifests
   |
   v
Amazon EKS
```

Docker images are tagged using the Jenkins build number.

## GitOps

Argo CD continuously watches the GitHub repository for Kubernetes configuration changes.

The development overlay is located at:

```text
kubernetes/overlays/dev/
```

Kustomize manages the ECR image names and deployment tags.

Argo CD automatically synchronizes the desired Kubernetes state from Git.

## AWS Infrastructure

Terraform manages the AWS infrastructure used by ShipForge.

Infrastructure includes:

* Amazon VPC
* Public and private subnets
* Internet Gateway
* Route tables
* Security groups
* Amazon EKS
* EKS managed node group
* Amazon ECR repositories
* IAM roles and policies
* EBS CSI integration
* AWS Load Balancer Controller

AWS region:

```text
ap-south-1
```

## Amazon EKS

The ShipForge Kubernetes environment runs on Amazon EKS.

The cluster contains:

* Product Service
* Order Service
* PostgreSQL
* Argo CD
* AWS Load Balancer Controller
* Metrics Server
* Prometheus
* Grafana
* Node Exporter
* Kubernetes state metrics

## Amazon ECR

Two private ECR repositories store the application images:

```text
shipforge/product-service
shipforge/order-service
```

Jenkins pushes images to ECR after the tests and security scans pass.

## Kubernetes

Kubernetes resources are organized using Kustomize.

```text
kubernetes/
├── base/
│   ├── product-service/
│   ├── order-service/
│   ├── postgres/
│   └── ingress.yaml
│
└── overlays/
    └── dev/
        └── kustomization.yaml
```

The base contains reusable Kubernetes resources while the development overlay contains environment-specific configuration.

## Ingress and Load Balancing

The application is exposed through an AWS Application Load Balancer.

```text
Internet
   |
   v
AWS Application Load Balancer
   |
   v
Kubernetes Ingress
   |
   +---- /products ----> Product Service :3000
   |
   +---- /orders ------> Order Service :3001
```

The AWS Load Balancer Controller manages the ALB from the Kubernetes Ingress resource.

The application services remain Kubernetes ClusterIP services.

## Security

ShipForge includes security controls throughout the delivery pipeline.

### Container Security

Trivy scans Docker images for HIGH and CRITICAL vulnerabilities before images are pushed to ECR.

The application containers use:

```text
node:24-alpine
```

Unnecessary npm and Corepack runtime components are removed from the final runtime image.

### Secrets

Database credentials are not hardcoded into application source code.

Kubernetes Secrets provide database configuration to the application pods.

### IAM

AWS workloads use IAM roles and EKS Pod Identity where appropriate.

Dedicated IAM roles are used for components such as:

* EKS
* Worker nodes
* EBS CSI
* AWS Load Balancer Controller

## Monitoring and Observability

ShipForge uses Prometheus and Grafana for Kubernetes monitoring.

Monitoring components include:

* Prometheus
* Grafana
* Alertmanager
* Node Exporter
* kube-state-metrics
* Kubernetes Metrics Server

Grafana provides visibility into:

* Node CPU usage
* Node memory usage
* Pod counts
* Kubernetes resources
* Container activity
* Cluster metrics

## Health Checks

Both application services expose:

```text
GET /health
```

These endpoints are used by Kubernetes for liveness and readiness probes.

Example response:

```json
{
  "status": "healthy"
}
```

## Testing

The services use Node.js testing capabilities.

Tests currently validate the health endpoints of:

* Product Service
* Order Service

Jenkins executes the tests automatically before Docker images are built.

```bash
npm test
```

A failed test stops the CI/CD pipeline before deployment.

## Deployment Strategy

ShipForge uses Kubernetes rolling updates.

The deployments are configured with controlled rollout settings to work within the capacity of the development EKS cluster.

```text
New Image
    |
    v
Amazon ECR
    |
    v
GitOps Tag Update
    |
    v
Argo CD Sync
    |
    v
Kubernetes Rolling Update
    |
    v
New Application Pods
```

Readiness and liveness probes help Kubernetes maintain application availability during updates.

## Repository Structure

```text
shipforge/
│
├── application/
│   ├── product-service/
│   └── order-service/
│
├── architecture/
│
├── argocd/
│   ├── application.yaml
│   └── project.yaml
│
├── docker/
│
├── docs/
│
├── jenkins/
│
├── kubernetes/
│   ├── base/
│   │   ├── product-service/
│   │   ├── order-service/
│   │   ├── postgres/
│   │   └── ingress.yaml
│   │
│   └── overlays/
│       └── dev/
│
├── monitoring/
│
├── terraform/
│   ├── provider.tf
│   ├── variables.tf
│   ├── vpc.tf
│   ├── eks.tf
│   ├── ecr.tf
│   ├── lbc.tf
│   └── outputs.tf
│
└── Jenkinsfile
```

## Local Development

### Prerequisites

Install:

* Node.js
* npm
* Docker Desktop
* Git
* AWS CLI
* Terraform
* kubectl
* Helm

### Clone Repository

```bash
git clone https://github.com/komal-memane/shipforge.git
cd shipforge
```

### Product Service

```bash
cd application/product-service
npm install
npm test
npm start
```

### Order Service

```bash
cd application/order-service
npm install
npm test
npm start
```

## Docker

Build the services locally:

```bash
docker build -t shipforge-product-service:local application/product-service
docker build -t shipforge-order-service:local application/order-service
```

Run the product service:

```bash
docker run --rm -p 3000:3000 shipforge-product-service:local
```

Run the order service:

```bash
docker run --rm -p 3001:3001 shipforge-order-service:local
```

## Kubernetes Deployment

Render the Kubernetes manifests locally:

```bash
kubectl kustomize kubernetes/overlays/dev
```

The actual EKS deployment is managed through Argo CD.

## Terraform

Terraform manages the AWS infrastructure.

Initialize:

```bash
cd terraform
terraform init
```

Review changes:

```bash
terraform plan
```

Apply infrastructure:

```bash
terraform apply
```

## End-to-End Release Flow

```text
1. Developer changes application code
             |
             v
2. git push
             |
             v
3. Jenkins starts
             |
             v
4. Tests execute
             |
             v
5. Docker images are built
             |
             v
6. Trivy scans the images
             |
             v
7. Images are pushed to ECR
             |
             v
8. Kustomize image tags are updated
             |
             v
9. GitOps change is pushed to GitHub
             |
             v
10. Argo CD detects the change
             |
             v
11. Argo CD synchronizes EKS
             |
             v
12. Kubernetes performs rolling update
             |
             v
13. ALB routes user traffic
             |
             v
14. Prometheus collects metrics
             |
             v
15. Grafana visualizes the platform
```

## Project Outcomes

ShipForge demonstrates practical implementation of:

* AWS cloud infrastructure with Terraform
* Containerized microservices
* Docker image security scanning
* Amazon ECR
* Amazon EKS
* Kubernetes deployments and services
* PostgreSQL persistent storage
* AWS Application Load Balancer
* Jenkins CI/CD
* GitOps with Argo CD
* Kustomize
* Kubernetes health probes
* Prometheus monitoring
* Grafana dashboards
* AWS IAM
* EKS Pod Identity
* Infrastructure and application troubleshooting


