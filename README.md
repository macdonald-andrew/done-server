Make sure you have docker installed in order to run the local postgresDB

To start the server run the following commands in order

- make start_postgres

- yarn install

- yarn migrate

- yarn seed

- yarn start

Once you have the server running, you will have two test logins (one user and one admin). User the standard user to submit the patient form and user the admin user to see all patients. Feel free to create more users if needed.

User1

- email: test@gmail.com
- password: 12345678
- role: user

User2

- email: admin@gmail.com
- password: 12345678
- role: admin
