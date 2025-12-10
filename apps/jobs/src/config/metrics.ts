export type MetricType = 'counter' | 'gauge' | 'histogram';

export interface Metric {
  name: string;
  type: MetricType;
  value: number;
  labels?: Record<string, string>;
  timestamp: string;
}

export class MetricsCollector {
  private metrics: Metric[] = [];

  increment(name: string, labels?: Record<string, string>): void {
    this.record('counter', name, 1, labels);
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    this.record('gauge', name, value, labels);
  }

  histogram(name: string, value: number, labels?: Record<string, string>): void {
    this.record('histogram', name, value, labels);
  }

  private record(
    type: MetricType,
    name: string,
    value: number,
    labels?: Record<string, string>
  ): void {
    const metric: Metric = {
      name,
      type,
      value,
      labels,
      timestamp: new Date().toISOString(),
    };

    this.metrics.push(metric);

    // Log métrica como JSON estruturado
    console.log(
      JSON.stringify({
        metric: true,
        ...metric,
      })
    );
  }

  get_metrics(): Metric[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}
