FROM node:18.0-alpine

WORKDIR /app 
RUN mkdir frontend
WORKDIR /app/frontend 
ADD . /app/frontend
RUN npm install 
RUN npm run build 
RUN npm install -g serve 
CMD ["serve","-s","-p","3000","build"] 



# CMD ["npm", "run", "start"]

