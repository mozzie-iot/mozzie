#!/bin/bash

exec 2>&1

INSTALL_DIR=/usr/local/bin
LOG_FILE=$INSTALL_DIR/huebot/uninstall.log

if [ "$EUID" -ne 0 ] ; then
  printf "Must be run as root.\n"
  exit 1
fi


runUninstall() {

	function error_found {
      printf "\n\n"
      printf "#### ERROR ####\n"
      printf "There was an error detected during uninstall. Please review the log at $LOG_FILE\n"
      exit 1
  	}

	# Remove stale uninstall log file if found
	if [ -f $LOG_FILE ] ; then
		if ! rm $LOG_FILE >> $LOG_FILE 2>&1 ; then
			printf "Failed to remove %s.\n" "$LOG_FILE"
			error_found
		fi
	fi
	
	# Create new uninstall log file
	if ! touch $LOG_FILE >> $LOG_FILE 2>&1 ; then
		printf "Failed to create %s.\n" "$LOG_FILE"
		error_found
	fi

  printf "Shutting down docker containers..."
	if ! docker compose -f $INSTALL_DIR/huebot/runner/docker-compose.yml down --rmi all -v >> $LOG_FILE 2>&1 ; then
		printf "Failed: Error while shutting down Docker containers"
		error_found
	fi
	printf "Done.\n"

  printf "Cleaning up Docker artifacts..."
	if ! docker system prune -f >> $LOG_FILE 2>&1 ; then
		printf "Failed: Error while cleaning up Docker artifacts"
		error_found
	fi
	printf "Done.\n"
}

runUninstall