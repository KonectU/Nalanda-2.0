FROM node:slim
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

ARG SEARXNG_API_URL

WORKDIR /home/perplexica

COPY src /home/perplexica/src
COPY tsconfig.json /home/perplexica/
COPY config.toml /home/perplexica/
COPY drizzle.config.ts /home/perplexica/
COPY package.json /home/perplexica/
COPY yarn.lock /home/perplexica/

RUN sed -i "s|SEARXNG = \".*\"|SEARXNG = \"${SEARXNG_API_URL}\"|g" /home/perplexica/config.toml

RUN mkdir /home/perplexica/data

RUN yarn install --frozen-lockfile
RUN yarn build

CMD ["yarn", "start"]
