sudo docker build --build-arg ssh_pub_key"$(sudo cat ~/.ssh/id_rsa.pub)" --build-arg ssh_prv_key"$(sudo cat ~/.ssh/id_rsa)" .
