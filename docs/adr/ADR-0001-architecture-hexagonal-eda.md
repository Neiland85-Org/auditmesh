
# ADR-0001: Hexagonal + Event-Driven Architecture
Contexto: servicios desacoplados; trazabilidad y auditable-by-design.
Decisión: puertos/adaptadores (hexagonal) + bus de eventos (Kafka/Redpanda).
Consecuencias: alta observabilidad (OTel), escalado independiente, contratos de eventos versionados.
