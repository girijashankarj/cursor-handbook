---
name: opensearch-dashboard
description: Generate OpenSearch Dashboards (Kibana) saved objects — index patterns, visualizations, and dashboards as JSON. Use when the user asks to create dashboards, charts, or visualizations for OpenSearch/Elasticsearch/Kibana.
---

# Skill: OpenSearch Dashboard & Visualization Generator

Generate exportable OpenSearch Dashboards / Kibana saved objects (index patterns, visualizations, dashboards) as NDJSON for import.

## Trigger
When the user asks to create, generate, or design OpenSearch/Kibana dashboards, visualizations, or index patterns.

## Prerequisites
- [ ] Index name or pattern known (e.g., `logs-*`, `orders-*`)
- [ ] Field names and types known (or mapping available)
- [ ] Visualization requirements identified (chart type, metrics, dimensions)

## Steps

### Step 1: Identify Index Pattern
- [ ] Get the index name or pattern from the user
- [ ] List key fields and their types (keyword, text, date, long, float, boolean, geo_point)
- [ ] Identify the time field (usually `@timestamp` or `created_at`)
- [ ] Note any nested or object fields

```json
{
  "type": "index-pattern",
  "attributes": {
    "title": "logs-*",
    "timeFieldName": "@timestamp",
    "fields": "[]"
  }
}
```

### Step 2: Determine Visualization Types

| Chart Type | Best For | OpenSearch Vis Type |
|-----------|----------|-------------------|
| **Line chart** | Trends over time | `line` |
| **Bar chart** | Comparisons, distributions | `histogram` |
| **Pie chart** | Proportions | `pie` |
| **Area chart** | Cumulative trends | `area` |
| **Data table** | Detailed breakdowns | `table` |
| **Metric** | Single KPI value | `metric` |
| **Gauge** | Value against threshold | `gauge` |
| **Heat map** | Density / correlation | `heatmap` |
| **Markdown** | Text panels, notes | `markdown` |
| **TSVB** | Advanced time series | `metrics` |
| **Vega** | Custom visualizations | `vega` |

### Step 3: Design Each Visualization

For each visualization:
- [ ] Choose chart type from the table above
- [ ] Define metric aggregation (count, sum, avg, min, max, cardinality, percentiles)
- [ ] Define bucket aggregation (date_histogram, terms, range, histogram, filters)
- [ ] Set appropriate time intervals
- [ ] Define split series or sub-aggregations if needed
- [ ] Choose colors and labels

#### Metric Aggregations
```json
{
  "id": "1",
  "enabled": true,
  "type": "count",
  "params": {},
  "schema": "metric"
}
```

Common metrics:
- `count` — number of documents
- `avg` / `sum` / `min` / `max` — field statistics
- `cardinality` — unique count
- `percentiles` — p50, p95, p99
- `top_hits` — sample documents

#### Bucket Aggregations
```json
{
  "id": "2",
  "enabled": true,
  "type": "date_histogram",
  "params": {
    "field": "@timestamp",
    "interval": "auto",
    "min_doc_count": 1
  },
  "schema": "segment"
}
```

Common buckets:
- `date_histogram` — time buckets (interval: 1m, 5m, 1h, 1d, auto)
- `terms` — top N values of a field
- `range` — custom numeric ranges
- `filters` — named query filters
- `histogram` — fixed-width numeric buckets

### Step 4: Generate Visualization JSON

Template for a visualization saved object:
```json
{
  "type": "visualization",
  "id": "[unique-id]",
  "attributes": {
    "title": "[Visualization Title]",
    "visState": "{\"title\":\"[title]\",\"type\":\"[vis-type]\",\"aggs\":[...],\"params\":{...}}",
    "uiStateJSON": "{}",
    "description": "[what this shows]",
    "kibanaSavedObjectMeta": {
      "searchSourceJSON": "{\"index\":\"[index-pattern-id]\",\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
    }
  }
}
```

### Step 5: Compose Dashboard Layout
- [ ] Arrange visualizations in a grid layout
- [ ] Group related metrics together
- [ ] Place summary/KPI panels at the top
- [ ] Place detailed breakdowns below
- [ ] Add markdown panels for section headers or notes

Dashboard saved object:
```json
{
  "type": "dashboard",
  "id": "[dashboard-id]",
  "attributes": {
    "title": "[Dashboard Title]",
    "description": "[what this dashboard monitors]",
    "panelsJSON": "[{\"gridData\":{\"x\":0,\"y\":0,\"w\":24,\"h\":15,\"i\":\"1\"},\"panelIndex\":\"1\",\"embeddableConfig\":{},\"panelRefName\":\"panel_0\"}]",
    "optionsJSON": "{\"hidePanelTitles\":false,\"useMargins\":true}",
    "timeRestore": true,
    "timeTo": "now",
    "timeFrom": "now-24h",
    "refreshInterval": {
      "pause": false,
      "value": 30000
    },
    "kibanaSavedObjectMeta": {
      "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
    }
  },
  "references": [
    {"name": "panel_0", "type": "visualization", "id": "[vis-id]"}
  ]
}
```

### Step 6: Generate NDJSON Export
- [ ] Combine all saved objects (index pattern + visualizations + dashboard)
- [ ] Output as NDJSON (one JSON object per line)
- [ ] Include references between objects

```
{"type":"index-pattern","id":"...","attributes":{...}}
{"type":"visualization","id":"...","attributes":{...},"references":[...]}
{"type":"dashboard","id":"...","attributes":{...},"references":[...]}
```

### Step 7: Provide Import Instructions
- [ ] Instructions for importing via Dashboards UI: **Stack Management → Saved Objects → Import**
- [ ] Instructions for importing via API:
```bash
curl -X POST "[OPENSEARCH_DASHBOARDS_URL]/api/saved_objects/_import" \
  -H "osd-xsrf: true" \
  --form file=@dashboard-export.ndjson
```

## Common Dashboard Recipes

### Application Monitoring Dashboard
- **Row 1:** Request rate (metric), Error rate (metric), P99 latency (metric)
- **Row 2:** Request rate over time (line), Error rate over time (line)
- **Row 3:** Top endpoints by latency (bar), Status code distribution (pie)
- **Row 4:** Recent errors table (data table)

### Business Metrics Dashboard
- **Row 1:** Total orders (metric), Revenue (metric), Conversion rate (metric)
- **Row 2:** Orders over time (area), Revenue over time (line)
- **Row 3:** Top products (bar), Order status distribution (pie)
- **Row 4:** Orders by region (heat map or data table)

### Infrastructure Dashboard
- **Row 1:** CPU avg (gauge), Memory avg (gauge), Disk usage (gauge)
- **Row 2:** CPU over time (area), Memory over time (area)
- **Row 3:** Network in/out (line), Container restarts (bar)
- **Row 4:** Top processes by CPU (data table)

## Rules
- **NEVER** include real cluster URLs, credentials, or internal hostnames
- **ALWAYS** use `[OPENSEARCH_DASHBOARDS_URL]` as placeholder
- **ALWAYS** generate valid NDJSON format
- **ALWAYS** include unique IDs for saved objects (use UUIDs or descriptive slugs)
- Use meaningful visualization titles and descriptions
- Default time range to `now-24h` unless user specifies otherwise
- Set reasonable refresh intervals (30s for ops, 5m for business)

## Completion
Exportable NDJSON file with index pattern, visualizations, and dashboard. Ready to import via UI or API.

## If a Step Fails
- **Unknown fields:** Ask the user for the index mapping or run `GET [index]/_mapping`
- **Complex aggregation:** Start with a simple version, iterate
- **Too many visualizations:** Group into multiple dashboards by concern (ops vs business)
- **Import fails:** Verify NDJSON format (one object per line, valid JSON), check index pattern exists
