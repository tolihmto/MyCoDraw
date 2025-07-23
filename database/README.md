# CoDraw Database Documentation

## Introduction

This document provides an overview of the database structure and setup for the CoDraw application. The database is essential for storing user profiles, game servers, and drawings created during collaborative sessions.

## Database Schema

The database schema is defined in the `schema.sql` file located in this directory. It includes the following tables:

- **Users**: Stores user information such as username, email, password hash, and profile image.
- **Servers**: Contains details about game servers, including server name, creator, and current player count.
- **Drawings**: Holds information about drawings, including the drawing data, associated user, and timestamp.

## Setup Instructions

1. **Database Creation**: 
   - Use the SQL commands in `schema.sql` to create the necessary tables in your database management system (e.g., MySQL, PostgreSQL).

2. **Configuration**:
   - Ensure that your backend application is configured to connect to the database. This typically involves setting environment variables for the database URL, username, and password.

3. **Running Migrations**:
   - If you are using a migration tool, ensure to run the migrations to keep your database schema up to date.

## Usage

The database is accessed through the backend API, which provides endpoints for user registration, server management, and drawing storage. Ensure that the backend is running to interact with the database effectively.

## Conclusion

This README serves as a guide for setting up and using the database for the CoDraw application. For further details on the API endpoints and usage, refer to the backend documentation.