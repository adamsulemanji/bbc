import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { FrontendConstruct } from "./cloudfront";
import { DynamoDBConstruct } from "./ddb";
import { LambdaConstruct } from "./lambda";
import { ApiGatewayConstruct } from "./apigateway";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamo = new DynamoDBConstruct(this, "DynamoDB");
    const lambdas = new LambdaConstruct(this, "Lambda", [
      dynamo.bbcTable_prod,
      dynamo.bbcTable_dev,
    ]);

    dynamo.bbcTable_prod.grantReadWriteData(lambdas.bbc_lambda_prod);
    dynamo.bbcTable_dev.grantReadWriteData(lambdas.bbc_lambda_dev);

    const apis = new ApiGatewayConstruct(this, "ApiGateway", [
      lambdas.bbc_lambda_prod,
      lambdas.bbc_lambda_dev,
    ]);

    new FrontendConstruct(this, "Frontend", [apis.api_prod, apis.api_dev]);
  }
}
