#######################################################################################
###                                                                                 ###
### IMPORTANT NOTICE:                                                               ###
### This is not the docker file used by gitlab runners to build docker images.      ###
### In order to modify the Dockerfile used by gitlab CICD , please refer:           ###
### https://gitlab.bbdev.team/vh/ci_templates/-/blob/master/Dockerfile-react        ###
###                                                                                 ###
#######################################################################################
FROM node:21 AS builder

ARG PUBLIC_URL="/admin/payments"
ARG REACT_APP_COMMIT_SHA="dev"
ARG IS_STAGING_BUILD="true"

ENV PUBLIC_URL=${PUBLIC_URL}
ENV REACT_APP_STAGING="${IS_STAGING_BUILD}"
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
