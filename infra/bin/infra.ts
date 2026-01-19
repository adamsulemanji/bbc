#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";
import { Pipeline } from "../lib/pipeline";

const app = new cdk.App();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new InfraStack(app, "InfraStack", { env });

new Pipeline(app, "BbcPipelineStack", {
  env,
  repoOwner: "adamsulemanji",
  repoName: "bbc",
  branch: "main",
});
