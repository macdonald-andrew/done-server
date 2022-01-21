ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# variables
SERVICE_NAME=admin_service
DB_CONTAINER_NAME=postgres_db

# checks if command exists before running next command
cmd-exists-%:
	@hash $(*) > /dev/null 2>&1 || \
		(echo "ERROR: '$(*)' must be installed and available on your PATH."; exit 1)

# check if env var exists before running next command
guard-%:
	@if [ -z '${${*}}' ]; then echo 'ERROR: environment variable $* not set' && exit 1; fi


# Postgres DB
start_postgres:
	docker run -d -p 5432:5432  \
		-e POSTGRES_DB=${POSTGRES_DB}  \
		-e POSTGRES_USER=${POSTGRES_USER}  \
		-e POSTGRES_PASSWORD=${POSTGRES_PASSWORD}  \
		--name ${DB_CONTAINER_NAME} postgres:11.2-alpine -c 'shared_buffers=256MB' -c 'max_connections=200'

stop_postgres:
	-docker stop ${DB_CONTAINER_NAME}
	-docker rm ${DB_CONTAINER_NAME}

logs_postgres:
	docker logs -f ${DB_CONTAINER_NAME}

ssh_postgres:
	docker exec -it ${DB_CONTAINER_NAME} /bin/bash

psql:
	docker exec -it ${DB_CONTAINER_NAME} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}