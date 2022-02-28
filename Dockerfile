FROM node:14.12.0-stretch as builder
# this will be passed in as  --build-arg, when building docker image
# default value will be localhost
ARG PUBLIC_URL="/complete"
# below environment variable will be considered when npm building 
# production assets / html
ENV PUBLIC_URL=${PUBLIC_URL}

ARG IS_STAGING_BUILD="true"

ENV REACT_APP_STAGING="${IS_STAGING_BUILD}"

ENV REACT_APP_COMMIT_SHA="${REACT_APP_COMMIT_SHA}"

RUN mkdir vh-app && chown -R node:node vh-app

WORKDIR /vh-app

ADD . /vh-app

RUN echo "staging ? : ${REACT_APP_STAGING} , public url : ${PUBLIC_URL}"

RUN npm install

RUN npm run-script build --output-path=build

FROM nginx:1.15

COPY nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /vh-app/build /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]