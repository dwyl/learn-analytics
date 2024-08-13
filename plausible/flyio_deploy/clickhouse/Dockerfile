FROM clickhouse/clickhouse-server:22.6-alpine

COPY clickhouse-config.xml /etc/clickhouse-server/config.d/logging.xml
COPY clickhouse-user-config.xml /etc/clickhouse-server/users.d/logging.xml

# Set recommended ulimits: https://hub.docker.com/r/yandex/clickhouse-server
COPY ulimits.sh /docker-entrypoint-initdb.d/ulimits.sh
