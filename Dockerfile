FROM node:21 AS builder

ARG PUBLIC_URL="/admin/payments"
ARG REACT_APP_COMMIT_SHA="dev"

ENV PUBLIC_URL=${PUBLIC_URL}
ENV REACT_APP_COMMIT_SHA="${REACT_APP_COMMIT_SHA}"

WORKDIR /vh-app
ADD . /vh-app

RUN yarn install && \
    npm run-script build --output-path=build

FROM nginx:1.25

COPY nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /vh-app/build /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
