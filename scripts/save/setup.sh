#!/bin/bash

DIM="\033[2m"
RESET="\033[0m"
BOLD="\033[1m"
YELLOW="\033[33m"
CYAN="\033[36m"

echo -e " ${BOLD}SETUP DEVELOPMENT ENVIRONMENT${RESET}"
echo

node tools/scripts/setup-postgres.js
wait
sleep 1

CONTAINER_ID=$(sudo docker ps -a | grep localstack | awk '{print $1}')

if [ -z "$CONTAINER_ID" ]; then
  echo "Localstack container not found"
  exit 1
fi

echo -e "\nCONTAINER_ID: $CONTAINER_ID\n"

# AWS environment
AWS_PROFILE=localstack
AWS_ACCOUNT_ID=000000000000

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=TEST
AWS_SECRET_ACCESS_KEY=TEST
AWS_OUTPUT=text

echo -e "${BOLD}AWS Environment:${RESET}"
echo -e "${DIM}AWS_PROFILE${RESET}: ${YELLOW}$AWS_PROFILE${RESET}"
echo -e "${DIM}AWS_ACCOUNT_ID${RESET}: ${YELLOW}$AWS_ACCOUNT_ID${RESET}"
echo -e "${DIM}AWS_REGION${RESET}: ${YELLOW}$AWS_REGION${RESET}"
echo -e "${DIM}AWS_ACCESS_KEY_ID${RESET}: ${YELLOW}$AWS_ACCESS_KEY_ID${RESET}"
echo -e "${DIM}AWS_SECRET_ACCESS_KEY${RESET}: ${YELLOW}$AWS_SECRET_ACCESS_KEY${RESET}"
echo -e "${DIM}AWS_OUTPUT${RESET}: ${YELLOW}$AWS_OUTPUT"
echo -en "${RESET}\n"
sleep 0.5

aws configure --profile $AWS_PROFILE set aws_access_key_id $AWS_ACCOUNT_ID
aws configure --profile $AWS_PROFILE set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure --profile $AWS_PROFILE set region $AWS_REGION
aws configure --profile $AWS_PROFILE set output $AWS_OUTPUT

QUEUES=(
  'account-create-queue'
  'account-update-queue'
  'account-delete-queue'
)

TOPICS=(
  "account-create-topic"
  "account-update-topic"
  "account-delete-topic"
)

# create queues
echo -e "${BOLD}Creating SQS Queues:\n${RESET}"
for QUEUE in "${QUEUES[@]}"; do
  echo -en "$QUEUE $DIM"
  aws --profile $AWS_PROFILE --endpoint-url=http://localhost:4566 sqs create-queue --queue-name $QUEUE
done
echo -en "\n"

# create topics
echo -e "${BOLD}Creating SNS Topics:\n${RESET}"
for TOPIC in "${TOPICS[@]}"; do
  echo -en "$TOPIC $DIM"
  aws --profile $AWS_PROFILE --endpoint-url=http://localhost:4566 sns create-topic --name $TOPIC
done

# create subscriptions
echo -e "${BOLD}Creating SNS Subscriptions:\n$RESET"
for TOPIC in "${TOPICS[@]}"; do
  echo -en "$TOPIC $DIM"
  aws --profile $AWS_PROFILE --endpoint-url=http://localhost:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:$AWS_ACCOUNT_ID:$TOPIC --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:$TOPIC
done

BUCKETS=(
  "org-bucket"
)

# create buckets
for BUCKET in "${BUCKETS[@]}"; do
  echo -e "- ${DIM}Creating bucket:${RESET} ${YELLOW}$BUCKET ${RESET}"
  aws --endpoint-url="http://localhost:4566" s3 mb s3://$BUCKET --profile $AWS_PROFILE --region $AWS_REGION
done

# localstack dashboard
echo
echo -e " ${BOLD}Localstack Dashboard${RESET}"
echo -e " ${CYAN}https://app.localstack.cloud/dashboard${RESET}\n"
echo
