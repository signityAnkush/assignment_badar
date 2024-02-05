# Node.js Express MongoDB Docker GeoJSON API

This project demonstrates a simple RESTful API service using Node.js, Express.js, and MongoDB, containerized with Docker and orchestrated with Docker Compose.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Build and Run

1. Clone this repository and make build:

   ```bash
   git clone https://github.com/your-username/assignment_badar.git
   ```

   ```bash
   cd assignment_badar
   ```

   ```bash
   docker compose up --build
   ```

2. Create Index in items table in assignmentDB for geospatial

   ```bash

   sudo docker ps

   docker exec -it <mongo_container_id> bash

   mongosh

   use assignmentDB

   db.items.getIndexes()

   db.items.createIndex({location: "2dsphere"})

   ```

   ```bash
   [
       { v: 2, key: { _id: 1 }, name: '_id_' },
       {
           v: 2,
           key: { location: '2dsphere' },
           name: 'location_2dsphere',
           '2dsphereIndexVersion': 3
       }
   ]

   ```

Access the API at http://localhost:3000.

API Endpoints

1. Data Import

   Method: POST
   URL: /import
   Request Payload: Upload a JSON file containing location data with latitude and longitude.

   Response Format: Success message or error message.

2. Query Nearby Locations

   Method: GET
   URL: /nearby
   Query Parameters:
   latitude: Latitude of the origin.
   longitude: Longitude of the origin.

   Response Format: List of locations within a 5000-meter radius from the specified coordinates in GeoJSON format.
