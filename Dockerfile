ARG nodeVersion=13
ARG date
FROM node:${nodeVersion}-alpine
LABEL org.opencontainers.image.authors="Vlad Volkov <vlad@hiberbee.com>" \
      org.opencontainers.image.description="Includes Apollo Server Gateway with schema federation and Faker API instance" \
      org.opencontainers.image.documentation="https://github.com/hiberbee/graphql-kit/wiki" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.sources="https://github.com/hiberbee/graphql-kit/wiki" \
      org.opencontainers.image.title="GraphQL API Server Toolkit" \
      org.opencontainers.image.url="https://hub.docker.com/r/hiberbee/graphql-kit" \
      org.opencontainers.image.vendor="Hiberbee"
ARG ENGINE_SCHEMA_TAG=master
ARG ENGINE_API_KEY
ARG API_KEY
ARG API_TOKEN
ARG APP_VERSION=master
ENV API_KEY=${API_KEY} \
    API_TOKEN=${API_TOKEN} \
    API_USER_CLAIM_ID=username \
    API_USER_CLAIM_ROLES=roles \
    APP_NAME=hiberbee-graphql \
    APP_VERSION=${version} \
    ENGINE_API_KEY=${ENGINE_API_KEY} \
    ENGINE_SCHEMA_TAG=${ENGINE_SCHEMA_TAG} \
    JWT_ALGORITHM=HS512
WORKDIR /usr/local/src
ADD package.json yarn.lock /tmp/
RUN cd /tmp \
 && yarn --ignore-scripts --prefer-offline \
 && cd /usr/local/src \
 && ln -s /tmp/node_modules
COPY . .
RUN yarn build \
 && yarn install --production --ignore-scripts --prefer-offline

FROM node:${nodeVersion}-alpine
EXPOSE 4000
STOPSIGNAL SIGTERM
ENTRYPOINT ["yarn"]
CMD ["start"]

