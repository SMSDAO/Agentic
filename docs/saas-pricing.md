# SaaS Pricing Model

## Tiers

### Free — $0/month
- 2 API keys
- 5,000 API requests/month
- 60 requests/minute
- Community support

### Pro — $99/month
- 20 API keys
- 500,000 API requests/month
- 600 requests/minute
- Priority email support
- Advanced task retry policies

### Enterprise — Custom
- Unlimited API keys
- Custom request volume SLA
- Dedicated rate limits + isolated runtime
- SSO/SAML + audit export
- Dedicated support channel

## Overage Model

- Free: hard cap at monthly quota
- Pro: $0.25 per 1,000 requests over quota
- Enterprise: contract-defined usage blocks

## Metering Units

Primary billable dimensions:

1. API Requests
2. Task Executions
3. Message Dispatches (email/SMS hooks)

## Suggested Billing Implementation

- Capture per-key usage events from API layer
- Persist daily aggregates to billing table
- Invoice monthly using Stripe subscriptions + metered usage records
