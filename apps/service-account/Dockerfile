FROM node:18 as development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn nx build service-account

CMD ["yarn", "nx", "serve", "service-account"]


FROM node:18 as production

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn nx build service-account --configuration=production

CMD ["yarn", "nx", "serve", "service-account", "--configuration=production"]

