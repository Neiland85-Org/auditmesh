# ADR-0001: Hexagonal + Event-Driven Architecture

Contexto: servicios desacoplados; trazabilidad y auditable-by-design.
Decisión: puertos/adaptadores (hexagonal) + bus de eventos (Kafka/Redpanda).

## Status

Accepted

## Context

Los servicios requieren estar desacoplados para facilitar la trazabilidad y la auditoría desde el diseño
("auditable-by-design"). El sistema debe soportar alta observabilidad y permitir la evolución independiente de los
componentes.

## Decision

Se adopta una arquitectura hexagonal (puertos y adaptadores) combinada con un bus de eventos (Kafka/Redpanda) para la
comunicación entre servicios. Esto permite desacoplar los componentes internos de los externos y facilita la
integración de nuevas tecnologías o adaptadores.

## Consequences

- Alta observabilidad mediante OpenTelemetry (OTel).

- Escalado independiente de los servicios.

- Contratos de eventos versionados para facilitar la evolución y compatibilidad.

- Mayor facilidad para auditoría y trazabilidad de los flujos de negocio.

