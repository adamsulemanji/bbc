import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDBConstruct extends Construct {
  public readonly bbcTable_prod: dynamodb.Table;
  public readonly bbcTable_dev: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ******* Meals Tables *******
    this.bbcTable_prod = new dynamodb.Table(this, "bbc-prod", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "bbc_prod",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    this.bbcTable_dev = new dynamodb.Table(this, "bbc-dev", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "bbc_dev",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });
  }
}
