import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ecrAssets from "aws-cdk-lib/aws-ecr-assets";
import * as path from "path";

export class LambdaConstruct extends Construct {
  public readonly bbcTable_prod: dynamodb.Table;
  public readonly bbcTable_dev: dynamodb.Table;
  public readonly bbc_lambda_dev: lambda.Function;
  public readonly bbc_lambda_prod: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    dynamos: dynamodb.Table[],
  ) {
    super(scope, id);

    // ******* Get the DynamoDB table name *******
    const bbcTableProd = dynamos[0].tableName;
    const bbcTableDev = dynamos[1].tableName;
    const backendPath = path.join(__dirname, "../../backend");

    this.bbc_lambda_prod = new lambda.DockerImageFunction(
      this,
      "bbcFunction-prod",
      {
        code: lambda.DockerImageCode.fromImageAsset(backendPath, {
          platform: ecrAssets.Platform.LINUX_AMD64,
        }),
        memorySize: 512,
        timeout: cdk.Duration.seconds(30),
        environment: {
          APP_ENV: "prod",
          BBC_TABLE_PROD: bbcTableProd,
          BBC_TABLE_DEV: bbcTableDev,
        },
        architecture: lambda.Architecture.X86_64,
        tracing: lambda.Tracing.ACTIVE,
      }
    );

    this.bbc_lambda_dev = new lambda.DockerImageFunction(
      this,
      "bbcFunction-dev",
      {
        code: lambda.DockerImageCode.fromImageAsset(backendPath, {
          platform: ecrAssets.Platform.LINUX_AMD64,
        }),
        memorySize: 512,
        timeout: cdk.Duration.seconds(30),
        environment: {
          APP_ENV: "dev",
          BBC_TABLE_PROD: bbcTableProd,
          BBC_TABLE_DEV: bbcTableDev,
        },
        architecture: lambda.Architecture.X86_64,
        tracing: lambda.Tracing.ACTIVE,
      }
    );
  }
}
