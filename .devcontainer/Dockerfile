FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

RUN apt-get update && apt-get install -y \
  libwebkit2gtk-4.1-0=2.44.0-2 \
  libwebkit2gtk-4.1-dev=2.44.0-2 \
  libjavascriptcoregtk-4.1-0=2.44.0-2 \
  libjavascriptcoregtk-4.1-dev=2.44.0-2 \
  gir1.2-javascriptcoregtk-4.1=2.44.0-2 \
  gir1.2-webkit2-4.1=2.44.0-2 \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*