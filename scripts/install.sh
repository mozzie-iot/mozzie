#!/bin/bash

exec 2>&1

INSTALL_DIR=/usr/local/bin
LOG_STATUS=$INSTALL_DIR/huebot/.install
LOG_FILE=$INSTALL_DIR/huebot/install.log

if [ "$EUID" -ne 0 ] ; then
  printf "Must be run as root.\n"
  exit 1
fi

runInstall() {

	function error_found {
    		echo '2' > $LOG_STATUS
    		printf "\n\n"
    		printf "#### ERROR ####\n"
    		printf "There was an error detected during the install. Please review the log at /usr/local/bin/huebot/install.log\n"
    		exit 1
  	}

	function password_generator {
		local password=$(tr -cd '[:alnum:]' < /dev/urandom | fold -w${1} | head -n 1)
		echo $password
	}

	
	if [ ! -f $LOG_STATUS ] ; then
		if ! touch $LOG_STATUS ; then
			printf "Failed: Error while trying to create %s.\n" "$LOG_STATUS"
			error_found
		fi
	else 
		INSTALL_STATUS=$(<$LOG_STATUS)
		if [ $INSTALL_STATUS == 0 ]; then
			printf "Huebot already installed.\n"
			exit 1
		fi
	fi

	echo '1' > $LOG_STATUS
	
	# Remove stale install log file if found
	if [ -f $LOG_FILE ] ; then
		if ! rm $LOG_FILE >> $LOG_FILE 2>&1 ; then
			printf "Failed to remove %s.\n" "$LOG_FILE"
			error_found
		fi
	fi
	
	# Create new install log file
	
	if ! touch $LOG_FILE >> $LOG_FILE 2>&1 ; then
		printf "Failed to create %s.\n" "$LOG_FILE"
		error_found
	fi

	if [ -f "/etc/needrestart/needrestart.conf" ] ; then
		printf "Disabling interactive prompts..."
		if ! sed -i "/^#\$nrconf{restart} = 'i';/ c\$nrconf{restart} = 'a';" /etc/needrestart/needrestart.conf >> $LOG_FILE 2>&1; then
			printf "Failed to disable interactive prompt\n"
			error_found
		fi
		printf "Done.\n"
	fi

	printf "Installing required packages. This could take a while..."

	if ! apt-get update >> $LOG_FILE 2>&1 ; then
     		printf "Update failed"
		error_found
	fi

	if ! apt-get -y upgrade >> $LOG_FILE 2>&1 ; then 
		printf "Upgrade failed"
		error_found
	fi

	PACKAGES=$(apt-get install -y docker docker-compose ufw >> $LOG_FILE 2>&1)
	
	if ! $PACKAGES ; then
		printf "Install packages failed\n"
		error_found
	fi
	printf "Done.\n"

	NON_ROOT_USER=$(logname)
	printf "Add user (%s) to Docker group..." "${NON_ROOT_USER}"
	if ! usermod -aG docker $NON_ROOT_USER >> $LOG_FILE 2>&1 ; then
		printf "Failed: Error while adding user to Docker group.\n"
		error_found
	fi
	printf "Done.\n"

	printf "Create host db dir..."
	HOST_DB_DIR=$INSTALL_DIR/huebot/db
	if [ -d "${HOST_DB_DIR}" ] ; then
		printf "Already exists..."
	else
		if ! mkdir "${HOST_DB_DIR}" ; then
			printf "Failed: Error while trying to create %s.\n" "${HOST_DB_DIR}"
			error_found
		fi
	fi
	printf "Done.\n"

	printf "Set environment variables..."
	ENV_FILE=$INSTALL_DIR/huebot/.env

	if [ ! -f $ENV_FILE ] >> $LOG_FILE 2>&1 ; then
		if ! touch $ENV_FILE >> $LOG_FILE 2>&1 ; then
			printf "Failed: Error while trying to create %s\n" "$ENV_FILE"
			error_found
		fi
	fi

	if ! grep -q ACCESS_TOKEN_SECRET $ENV_FILE >> $LOG_FILE 2>&1 ; then
		ACCESS_TOKEN_SECRET=$(password_generator 30)
		if ! echo "ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}" >> $ENV_FILE ; then
			printf "Failed: Error when attempting to set environment variable: ACCESS_TOKEN_SECRET\n"
			error_found
		fi
	fi

	if ! grep -q REFRESH_TOKEN_SECRET $ENV_FILE >> $LOG_FILE 2>&1 ; then
		REFRESH_TOKEN_SECRET=$(password_generator 30)
		if ! echo "REFRESH_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}" >> $ENV_FILE ; then
			printf "Failed: Error when attempting to set environment variable: REFRESH_TOKEN_SECRET\n"
			error_found
		fi
	fi

	if ! grep -q ACCESS_TOKEN_EXP $ENV_FILE >> $LOG_FILE 2>&1 ; then
		ACCESS_TOKEN_EXP='15m'
		if ! echo "ACCESS_TOKEN_EXP=${ACCESS_TOKEN_EXP}" >> $ENV_FILE ; then
			printf "Failed: Error when attempting to set environment variable: ACCESS_TOKEN_EXP\n"
			error_found
		fi
	fi

	if ! grep -q REFRESH_TOKEN_EXP $ENV_FILE >> $LOG_FILE 2>&1 ; then
		REFRESH_TOKEN_EXP='7m'
		if ! echo "REFRESH_TOKEN_EXP=${REFRESH_TOKEN_EXP}" >> $ENV_FILE ; then
			printf "Failed: Error when attempting to set environment variable: REFRESH_TOKEN_EXP\n"
			error_found
		fi
	fi

	if ! grep -q MQTT_USERNAME $ENV_FILE >> $LOG_FILE 2>&1 ; then
		MQTT_USERNAME=$(password_generator 20)
		if ! echo "MQTT_USERNAME=${MQTT_USERNAME}" >> $ENV_FILE ; then
			printf "Failed: Error when attempting to set environment variable: MQTT_USERNAME\n"
			error_found
		fi
	fi

	if ! grep -q MQTT_PASSWORD $ENV_FILE >> $LOG_FILE 2>&1 ; then
		MQTT_PASSWORD=$(password_generator 30)
		if ! echo "MQTT_PASSWORD=${MQTT_PASSWORD}" >> $ENV_FILE ; then
			printf "Failed: Error when attempting to set environment variable: MQTT_PASSWORD\n"
			error_found
		fi
	fi

	# Set soft symlink
	ln -s $ENV_FILE $INSTALL_DIR/huebot/runner/.env
	printf "Done.\n"

	printf "Setting up Mosquitto host configuration..."
	MQTT_DIR=$INSTALL_DIR/mosquitto

	if [ ! -d "${MQTT_DIR}" ] ; then
		if ! mkdir "${MQTT_DIR}" ; then
			printf "Failed: Error while trying to create %s.\n" "${MQTT_DIR}"
			error_found
		fi
	fi

	if [ ! -d "${MQTT_DIR}/data" ] ; then
		if ! mkdir "${MQTT_DIR}/data" ; then
			printf "Failed: Error while trying to create %s.\n" "${MQTT_DIR}/data"
			error_found
		fi
	fi

	if [ ! -f "${MQTT_DIR}/data/mosquitto.db" ] ; then
		if ! touch $MQTT_DIR/data/mosquitto.db ; then
			printf "Failed: Error while trying to create %s.\n" "${MQTT_DIR}/data/mosquitto.db"
			error_found
		fi
	fi

	if [ ! -d "${MQTT_DIR}/log" ] ; then
		if ! mkdir "${MQTT_DIR}/log" ; then
			printf "Failed: Error while trying to create %s.\n" "${MQTT_DIR}/log"
			error_found
		fi
	fi

	if [ ! -f "${MQTT_DIR}/log/mosquitto.log" ] ; then
		if ! touch $MQTT_DIR/log/mosquitto.log ; then
			printf "Failed: Error while trying to create %s.\n" "${MQTT_DIR}/log/mosquitto.log"
			error_found
		fi
	fi

	if [ ! -d "${MQTT_DIR}/conf.d" ] ; then
		if ! mkdir "${MQTT_DIR}/conf.d" ; then
			printf "Failed: Error while trying to create %s.\n" "${MQTT_DIR}/conf.d"
			error_found
		fi
	fi

	if [ ! -f "${MQTT_DIR}/conf.d/huebot.conf" ] ; then
		if ! touch $MQTT_DIR/conf.d/huebot.conf ; then
			printf "Failed: Error while trying to create %s.\n" "${MQTT_DIR}/conf.d/huebot.conf"
			error_found
		fi
	fi

	if [ $(chown -R 1883:1883 "$MQTT_DIR") ] ; then 
		printf "Failed: Error while trying to chown %s.\n" "${MQTT_DIR}"
		error_found
	fi
	printf "Done.\n"


	printf "Configuring port access..."
	if ! ufw allow 22,80,1883/tcp >> $LOG_FILE 2>&1 ; then
		printf "Failed: ufw allow 22,80,1883/tcp.\n"
		error_found
	fi

	if ! ufw --force enable >> $LOG_FILE 2>&1 ; then
		printf "Failed: ufw --force enable.\n"
		error_found
	fi
	printf "Done.\n"

	printf "Installing and starting docker containers..."
	if ! docker-compose -f $INSTALL_DIR/huebot/runner/docker-compose.yml up -d >> $LOG_FILE 2>&1 ; then
		printf "Failed: Error while pulling/starting Docker containers"
		error_found
	fi
	printf "Done.\n"

	echo '0' > $LOG_STATUS

	printf "\n\n\n************************ INSTALL COMPLETE ************************\n\n\n"
	printf "Huebot successfully installed!\n"
	printf "Install log: %s\n" "$LOG_FILE"
	printf "\n\n******************************************************************\n\n\n"	
}

runInstall
