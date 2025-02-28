
# Define the Docker image and container names
IMAGE_NAME = photoboof
CONTAINER_NAME = photoboof_container
CONTAINER_PORT = 443
HOST_PORT = 4200

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
	docker run -d --name $(CONTAINER_NAME) -p ${HOST_PORT}:${CONTAINER_PORT}  $(IMAGE_NAME)


# Stop the Docker container
stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

# Remove the Docker image
clean:
	docker rmi $(IMAGE_NAME)

.PHONY: build run stop clean