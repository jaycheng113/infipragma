# InfiPragma Sandbox — isolated execution environment for agents
FROM node:20-slim

# Install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      git \
      curl \
      ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install yq
RUN curl -sL https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -o /usr/bin/yq && \
    chmod +x /usr/bin/yq

WORKDIR /project

# API key is passed as env var at runtime:
# docker run -e ANTHROPIC_API_KEY=... infipragma-sandbox ...
