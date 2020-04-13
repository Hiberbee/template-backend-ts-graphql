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
ARG key=1051f206-3b7b-4dd0-9919-d70f4a4f7900
ARG token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6WyJST0xFX0FQUCJdLCJ1c2VybmFtZSI6ImhpYmVyYmVlIn0.Owbyn2mgOPR1kGFuoglo3VqdGufxDyhwkL1T3V9BxaH9jWTyoWGR6aFh3-H7syIjCZ6M0LlH5-qokS0RFPc8GQ
ENV API_KEY=${key} \
    API_TOKEN=${token} \
    API_USER_CLAIM_ID=username \
    API_USER_CLAIM_ROLES=roles \
    APP_NAME=hiberbee-graphql \
    APP_VERSION=1.0.0 \
    ENGINE_SCHEMA_TAG=development \
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
EXPOSE 4000
STOPSIGNAL SIGTERM
ENTRYPOINT ["yarn"]
CMD ["start:server"]

