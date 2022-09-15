# LOGIN TO RESCUE MODE
installimage

# INSTALL CONFIG
SWRAID  1
SWRAIDLEVEL   1
hostname asr{#-fi|de}
PART /   ext4    all

# REBOOT & SSH

# FIREWALL - HETZNER
22 tcp accept
80 tcp accept
443 tcp accept
23232 tcp accept
!!! https://docs.hetzner.com/robot/dedicated-server/firewall/#Out-going_TCP_connections
TCP_OUT_MANDATORY, Destination ports: 32768-65535, Protocol: tcp, TCP flags: ack, Action: accept


# SSH & USER
# https://community.hetzner.com/tutorials/securing-ssh
    useradd -m -U -s /bin/bash -G sudo evios
    passwd evios
    nano /etc/ssh/sshd_config
        PermitRootLogin no
        Port 23232
        ClientAliveInterval 300
        ClientAliveCountMax 1
        #AllowUsers evios  # if restrict also by users
    systemctl restart sshd
    # ON LOCAL MACHINE
        # import key to server
            ssh-copy-id -i .ssh/id_rsa.pub evios@{ip-address}
        # create config
            nano .ssh/config
            Host asr{#-fi|de}
                Hostname ip-address
                User evios
                Port 23232
                IdentityFile ~/.ssh/id_rsa
                #StrictHostKeyChecking no  # if host change keys periodically
                #UserKnownHostsFile /dev/null  # where to store pub key

# OS level FW
TODO

# DNS setup
    # https://developers.cloudflare.com/1.1.1.1/setup-1.1.1.1/linux
    1.1.1.1
    1.0.0.1
    2606:4700:4700::1111
    2606:4700:4700::1001


apt update
apt upgrade



# Server setup
    apt update && apt install -y tmux certbot apache2-utils python3-pip git ffmpeg curl jq
    pip3 install docker-auto-labels websockets
    hostname enderturing
    nano /etc/hostname


set -x
set -e

# SWAP - !!! only for non-K8S servers
if grep -Fxq "/swapfile swap swap defaults 0 0" /etc/fstab
then
    # code if found
    echo "SWAP already set up"
else
    # code if not found
    # SWAP
    sudo fallocate -l 8G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap -L swap /swapfile
    sudo swapon /swapfile
    sudo echo "/swapfile swap swap defaults 0 0" | tee -a /etc/fstab
fi

# DOCKER ENGINE
### https://docs.docker.com/engine/install/ubuntu/
sudo apt update
#sudo apt upgrade
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    auditd \
    python3-pip
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# DOCKER COMPOSE
#### https://docs.docker.com/compose/install/
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
#
### https://docs.docker.com/compose/install/compose-plugin/
# DOCKER_CONFIG=/usr/local/lib/docker
# mkdir -p $DOCKER_CONFIG/cli-plugins
# curl -SL https://github.com/docker/compose/releases/download/v2.9.0/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
# chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose


# SPEECHENGINE
# System
sudo apt install -y tmux python3-pip git curl jq auditd
sudo pip3 install PyYAML==5.4.1 docker-auto-labels
sudo hostname enderturing
sudo echo enderturing > /etc/hostname
wget -q --user  --password  https://cr.enderturing.com/speechengine-install/v0/install-speech-engine
chmod +x install-speech-engine
sudo ./install-speech-engine
