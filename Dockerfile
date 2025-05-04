FROM rabbitmq:management-alpine

COPY ./rabbitmq_delayed_message_exchange-4.1.0.ez /opt/rabbitmq/plugins/

COPY cluster-entrypoint.sh /cluster-entrypoint.sh

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange rabbitmq_stream rabbitmq_stream_management 

# Expose necessary ports
EXPOSE 5672 15672 15692 5552

# Ensure the entrypoint script is executable
RUN chmod +x /cluster-entrypoint.sh

# RUN RABBITMQ_NODE_PORT=5673 RABBITMQ_SERVER_START_ARGS="-rabbitmq_management listener {{port,15673}}" RABBITMQ_NODENAME=node2 rabbitmq-server -detached