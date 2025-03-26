# Distributed Transaction Management with WSO2 Micro Integrator

This project demonstrates distributed transaction management capabilities using WSO2 Micro Integrator, showcasing how to maintain data consistency across multiple services and databases.

## Project Overview

The implementation showcases several enterprise integration patterns and transaction management capabilities:

- Database transaction control (begin/commit/rollback)
- Parallel processing with aggregation
- Data transformation using DataMapper
- Response caching for performance optimization
- Error handling with transaction rollback

## Architecture

### Components

- **APIs**:
  - [`OrderAPI`](src/main/wso2mi/artifacts/apis/OrderAPI.xml) - Handles order submission with transaction management
  - [`MetricsAPI`](src/main/wso2mi/artifacts/apis/MetricsAPI.xml) - Provides metrics with response caching
  - [`InventoryAPI`](src/main/wso2mi/artifacts/apis/InventoryAPI.xml) - Manages inventory data

- **Backend Connections**:
  - [`OrdersDBCon`](src/main/wso2mi/artifacts/local-entries/OrdersDBCon.xml) - MySQL database connection
  - [`SalesforceCon`](src/main/wso2mi/artifacts/local-entries/SalesforceCon.xml) - Salesforce REST API connection
  - [`InventoryCon`](src/main/wso2mi/artifacts/local-entries/InventoryCon.xml) - Inventory service connection
  - [`InventoryAvailability`](src/main/wso2mi/artifacts/local-entries/InventoryAvailability.xml) - External availability check

- **Services**:
  - [`InvokeSalesforce`](src/main/wso2mi/artifacts/sequences/InvokeSalesforce.xml) - Sequence to invoke Salesforce operations
  - [`CurrencyConversion`](src/main/wso2mi/artifacts/proxy-services/CurrencyConversion.xml) - Service for currency conversion

## Transaction Flow

1. **Order Submission**: Client submits an order to `OrderAPI`
2. **Begin Transaction**: A database transaction begins
3. **Data Transformation**: Order data is transformed to XML format using DataMapper
4. **Inventory Check**: Order is validated against the inventory service
5. **Database Operation**: Order details are stored in MySQL
6. **Salesforce Integration**: Customer account is created in Salesforce
7. **Transaction Completion**: On success, the transaction is committed; on failure, it's rolled back
8. **Response**: Order confirmation or failure message is returned to the client

## Prerequisites

- WSO2 Micro Integrator 4.4.0
- MySQL database (with 'orders' schema)
- Salesforce developer account (for Salesforce connector)

## Configuration

### Database Setup

1. Create a MySQL database named `orders`
2. Configure the database connection in [`OrdersDBCon.xml`](src/main/wso2mi/artifacts/local-entries/OrdersDBCon.xml):

```xml
<dbUrl>jdbc:mysql://localhost:3306/orders</dbUrl>
<dbUser>root</dbUser>
<dbPassword>root</dbPassword>
```

3. Create the required tables:

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId VARCHAR(50) NOT NULL,
    paymentMethod VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Salesforce Configuration

The Salesforce credentials are stored in the [`.env`](.env) file. Update them with your own Salesforce credentials:

```
sf_access_token=YOUR_ACCESS_TOKEN
sf_refresh_token=YOUR_REFRESH_TOKEN
sf_client_secret=YOUR_CLIENT_SECRET
sf_client_id=YOUR_CLIENT_ID
```

## Building the Project

Use Maven to build the project:

```bash
# Using Maven wrapper
./mvnw clean install

# Or with Maven directly
mvn clean install
```

The build will generate a Carbon Application (CAR) file in the `target` directory.

## Deployment

### Local Deployment

Deploy the generated CAR file to WSO2 Micro Integrator:

1. Copy the CAR file to the deployment directory:
```bash
cp target/DistributedTransactions_1.0.0.car /path/to/wso2mi/repository/deployment/server/carbonapps/
```

2. Start the WSO2 Micro Integrator server:
```bash
/path/to/wso2mi/bin/micro-integrator.sh
```

## Testing the APIs

### Order API

Submit an order:

```bash
curl -X POST http://localhost:8290/order \
  -H "Content-Type: application/json" \
  -d '{
    "id": "C12345",
    "items": [
      {"productId": "1001", "quantity": 2},
      {"productId": "2003", "quantity": 1}
    ],
    "payment": "VISA"
  }'
```

### Metrics API

Get metrics data:

```bash
curl -X POST http://localhost:8290/metrics \
  -H "Content-Type: application/json" \
  -d '[
    {"productId": "1001", "value": 90.6},
    {"productId": "2003", "value": 86.6}
  ]'
```
