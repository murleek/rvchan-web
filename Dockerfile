FROM debian:bullseye

LABEL maintainer="r4v3c4t@pm.me"
ARG git_personal_token
ENV HOME /usr/src/
WORKDIR $HOME

COPY ["yarn-offline-mirror", "$HOME/yarn-offline-mirror/"]
COPY ["package.json", "yarn.lock", ".yarnrc", "$HOME/"]

# SERVER INSTALLING
RUN apt update && apt upgrade && apt install nodejs npm
RUN npm install --global yarn

COPY . $HOME
RUN yarn --offline --frozen-lockfile --link-duplicates

RUN git config --global url."https://${git_personal_token}:@github.com/".insteadOf "https://github.com/"
RUN git clone https://github.com/murleek/rvchan-web.git /rvchan-web

CMD next build && next start