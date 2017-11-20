FROM node:4

MAINTAINER Matthew Vanderwerf (matthewv@iastate.edu)

# Gitlabs Keys
ARG ssh_pub_key
ARG ssh_prv_key

# Shell Script to pull git
RUN mkdir -p /home/matthewv/.ssh
WORKDIR /home/matthewv
ADD gitPull.sh /script.sh
RUN mkdir -p .ssh/ && \
	chmod 700 .ssh

# Copying Keys to Image then pull GitLabs
WORKDIR /home/matthewv/.ssh
RUN 	echo $ssh_pub_key > id_rsa.pub && \
	echo $ssh_prv_key > id_rsa && \
	chmod 600 id_rsa.pub && \
	chmod 600 id_rsa

WORKDIR /home/matthewv
RUN	/script.sh	

# Install Dependencies
WORKDIR SD_B_1_ProjectName/REST/
RUN npm install && \
	npm install body-parser


# Start REST API
EXPOSE 8080
#CMD ["node /home/matthew/SD_B_1_ProjectName/REST/main.js"]
CMD ["npm", "start"]
