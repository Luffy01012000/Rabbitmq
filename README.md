# rabbitmq

### This repo was created only to learn about rabbitmq concept with practical examples.

To install dependencies:

```bash
bun install
```
docker command to run rabbitmq locally

```docker
docker run --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

management dashboard can be accessed on localhost:15672

This project was created using `bun init` in bun v1.2.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
