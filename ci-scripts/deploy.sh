PROJECT="backend-developer-446300"

PROJECT_ID=$(gcloud config get-value core/project)
if [ "$PROJECT_ID" != "$PROJECT" ]
then
  echo "$PROJECT_ID mismatch"
  exit 1
fi

MIN_INSTANCES=0
MAX_INSTANCES=1

gcloud run deploy fastify-app \
  --region=us-east1 \
  --allow-unauthenticated \
  --source=. \
  --min-instances=$MIN_INSTANCES \
  --max-instances=$MAX_INSTANCES \
  --set-env-vars "TZ=America/Bogota" \
  --memory 1Gi \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest"
