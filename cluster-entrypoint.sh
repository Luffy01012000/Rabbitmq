#!/bin/bash

# Start RabbitMQ in the background
rabbitmq-server -detached

# Wait for RabbitMQ to start (increased timeout for reliability)
for i in {1..30}; do
  if rabbitmqctl wait /var/lib/rabbitmq/mnesia/rabbit@`hostname`.pid --timeout 60; then
    break
  fi
  echo "Waiting for RabbitMQ to start on $(hostname)..."
  sleep 2
done

# If this is not rabbitmq1, join the cluster
if [ "$(hostname)" != "rabbitmq1" ]; then
  # Wait for rabbitmq1 to be reachable
  for i in {1..30}; do
    if ping -c 1 rabbitmq1 >/dev/null 2>&1; then
      echo "rabbitmq1 is reachable from $(hostname)"
      break
    fi
    echo "Waiting for rabbitmq1 to be reachable from $(hostname)..."
    sleep 2
  done

  # Stop the app to allow cluster join
  rabbitmqctl stop_app

  # Attempt to join the cluster with retries
  for i in {1..5}; do
    if rabbitmqctl join_cluster rabbit@rabbitmq1; then
      echo "Successfully joined cluster on $(hostname)"
      break
    else
      echo "Failed to join cluster on $(hostname), retrying ($i/5)..."
      sleep 5
    fi
  done

  # Start the app again
  rabbitmqctl start_app
fi

# Keep container running (use sleep instead of tail to avoid log file dependency)
exec sleep infinity