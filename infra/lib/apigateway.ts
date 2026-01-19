import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class ApiGatewayConstruct extends Construct {
	public readonly api_prod: apigateway.LambdaRestApi;
	public readonly api_dev: apigateway.LambdaRestApi;
	constructor(scope: Construct, id: string, lambdas: lambda.Function[]) {
		super(scope, id);

		this.api_prod = new apigateway.LambdaRestApi(this, "bbc-prod", {
			handler: lambdas[0],
			proxy: true,
			description:
				"APIGateway Proxy service for BBC API for Production",
			deployOptions: {
				stageName: "prod",
				tracingEnabled: true,
				throttlingRateLimit: 100,
				throttlingBurstLimit: 200,
			},
		});

		this.api_dev = new apigateway.LambdaRestApi(this, "bbc-dev", {
			handler: lambdas[1],
			proxy: true,
			description:
				"APIGateway Proxy service for BBC API for Development",
			deployOptions: {
				stageName: "dev",
				tracingEnabled: true,
				throttlingRateLimit: 10,
				throttlingBurstLimit: 20,
			},
		});
	}
}
