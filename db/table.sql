CREATE TABLE nfts (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(255) NOT NULL,
    created_timestamp TIMESTAMP NOT NULL,
    delegating_spender VARCHAR(255),
    deleted BOOLEAN NOT NULL,
    metadata TEXT,
    modified_timestamp TIMESTAMP NOT NULL,
    serial_number INTEGER NOT NULL,
    spender VARCHAR(255),
    token_id VARCHAR(255) NOT NULL
);
