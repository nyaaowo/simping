FROM mcr.microsoft.com/devcontainers/base:debian-11

# install radicle (optional)
USER vscode
RUN curl -sSf https://radicle.xyz/install | sh
USER root

# install rust
USER vscode
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
USER root

# install foundry
USER vscode
RUN curl -L https://foundry.paradigm.xyz | bash && \
    $HOME/.foundry/bin/foundryup
USER root

# install nodejs and pnpm
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - &&\
    apt-get install -y nodejs
RUN npm install -g pnpm

# install tauri prerequisites
RUN apt update && \
    apt install -y libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev