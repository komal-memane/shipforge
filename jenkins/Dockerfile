FROM jenkins/jenkins:lts-jdk21

USER root

RUN apt-get update && \
    apt-get install -y curl unzip python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" && \
    unzip /tmp/awscliv2.zip -d /tmp && \
    /tmp/aws/install && \
    rm -rf /tmp/aws /tmp/awscliv2.zip

# Trivy
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | \
    sh -s -- -b /usr/local/bin

USER jenkins
