
CREATE DATABASE delta;

CREATE TABLE deposits(
    deposit_id SERIAL PRIMARY KEY,
    count_money INTEGER,
    type_deposit VARCHAR(255),
    date_deposit DATE
);
