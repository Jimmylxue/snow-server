export OTEL_TRACES_EXPORTER="otlp" 
export OTEL_RESOURCE_ATTRIBUTES='token=ODCeIORbtRSemFQlFQTI,host.name=43.139.76.237' 
export OTEL_EXPORTER_OTLP_PROTOCOL='grpc' 
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="http://ap-guangzhou.apm.tencentcs.com:4317" 
export OTEL_SERVICE_NAME="quickApp"  
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register" 
pnpm start:dev