
#!/bin/bash

echo "Running database migrations"
yarn migration:run

echo "Starting server"
node dist/main.js