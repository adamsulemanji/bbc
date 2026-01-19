## Building and Running the Docker Container

This docker image is replicated for both ```dev``` and ```prod``` environments using cloud development. The image is built using the `Dockerfile` in the root directory of the project.  image as the base image. The image is built using the following steps:

### Build the Docker Image
```sh
docker build -t fastapi-local .
```

### Run the Docker Container
Set the environment for DynamoDB table selection at runtime:
```sh
docker run \
  -p 8000:8000 \
  -v ~/.aws:/root/.aws:ro \
  -e AWS_PROFILE=default \
  -e AWS_DEFAULT_REGION=us-east-1 \
  -e APP_ENV=dev \
  -e BBC_TABLE_PROD=bbc_prod \
  -e BBC_TABLE_DEV=bbc_dev \
  fastapi-local
```

To stop the docker image:
```sh
docker stop $(docker ps -q --filter ancestor=fastapi-lambda)
```

or Ctrl+C in the terminal.

### Access the API specifications

Visit http://localhost:8000/docs or http://localhost:8000/redoc to view the API documentation.
