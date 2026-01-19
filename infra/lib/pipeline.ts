import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as iam from "aws-cdk-lib/aws-iam";

export interface PipelineStackProps extends cdk.StackProps {
  repoOwner: string;
  repoName: string;
  branch?: string;
}

export class Pipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    // ********** ARTIFACTS **********
    const sourceOutput = new codepipeline.Artifact("SourceOutput");
    const synthOutput = new codepipeline.Artifact("SynthOutput");

    // ********** GITHUB SOURCE ACTION **********
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: "GitHub_Source",
      owner: props.repoOwner,
      repo: props.repoName,
      oauthToken: cdk.SecretValue.secretsManager("github_token2"),
      output: sourceOutput,
      branch: props.branch ?? "main",
      trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
    });

    // ********** SYNTH PROJECT **********
    const synthProject = new codebuild.PipelineProject(this, "SynthProject", {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: "0.2",
        phases: {
          install: {
            runtimeVersions: {
              nodejs: "20",
            },
            commands: [
              "npm ci --prefix infra",
              "npm ci --prefix frontend",
            ],
          },
          build: {
            commands: [
              "npm --prefix frontend run build",
              "cd infra",
              "npx cdk synth -o dist",
            ],
          },
        },
        artifacts: {
          "base-directory": "infra/dist",
          files: ["**/*"],
        },
      }),
    });

    const synthAction = new codepipeline_actions.CodeBuildAction({
      actionName: "CDK_Synth",
      project: synthProject,
      input: sourceOutput,
      outputs: [synthOutput],
    });

    // ********** DEPLOY PROJECT **********
    const deployProject = new codebuild.PipelineProject(this, "DeployProject", {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: "0.2",
        phases: {
          install: {
            runtimeVersions: {
              nodejs: "20",
            },
            commands: [
              "npm ci --prefix infra",
              "npm ci --prefix frontend",
            ],
          },
          build: {
            commands: [
              "npm --prefix frontend run build",
              "cd infra",
              "npx cdk deploy InfraStack --require-approval never",
            ],
          },
        },
      }),
    });

    deployProject.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );

    const deployAction = new codepipeline_actions.CodeBuildAction({
      actionName: "CDK_Deploy",
      project: deployProject,
      input: sourceOutput,
    });

    // ********** PIPELINE DEFINITION **********
    new codepipeline.Pipeline(this, "BbcPipeline", {
      pipelineName: "BbcPipeline",
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction],
        },
        {
          stageName: "Synth",
          actions: [synthAction],
        },
        {
          stageName: "Deploy",
          actions: [deployAction],
        },
      ],
    });
  }
}
