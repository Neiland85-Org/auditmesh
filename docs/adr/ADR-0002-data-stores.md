
# ADR-0002: Data Stores
PostgreSQL (transaccional/series temporales), MinIO (S3 objetos), Qdrant (vector), Neo4j (grafo).

## Status
Accepted

## Context
The system requires multiple types of data stores to support different data models and workloads, including transactional data, time series, object storage, vector search, and graph relationships. Security and configuration management must be handled appropriately for both development and production environments.

## Decision
We will use the following data stores:
- **PostgreSQL**: For transactional data and time series.
- **MinIO**: For S3-compatible object storage.
- **Qdrant**: For vector search and similarity queries.
- **Neo4j**: For graph data and relationships.

For development, credentials and ports will be managed via `.env` files. For production, secrets will be stored in Vault or managed with SealedSecrets, and all connections will use TLS for security.

## Consequences
- The system will be able to handle a variety of data workloads efficiently.
- Developers will have a simple setup using environment files, while production will benefit from secure secret management.
- Additional operational complexity due to multiple data stores.
- Need to ensure proper backup, monitoring, and maintenance for each data store.
