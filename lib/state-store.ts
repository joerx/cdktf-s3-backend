import { Construct } from "constructs";
import { TerraformOutput, TerraformStack } from "cdktf";
import { s3, kms, AwsProvider } from "@cdktf/provider-aws";

export interface StateStoreStackProps {
  readonly bucketPrefix: string,
  readonly encrypt?: boolean
}

export class StateStoreStack extends TerraformStack {
  constructor(scope: Construct, name: string, props: StateStoreStackProps) {
    super(scope, name);

    new AwsProvider(this, 'aws', {
      region: 'ap-southeast-1'
    });

    let sseConfig : s3.S3BucketServerSideEncryptionConfiguration | undefined
    if (props.encrypt) {
      const keyAlias = new kms.DataAwsKmsAlias(this, 's3-default-key', {
        name: 'alias/aws/s3'
      });

      sseConfig ={
        rule: {
          applyServerSideEncryptionByDefault: {
            sseAlgorithm: "aws:kms",
            kmsMasterKeyId: keyAlias.targetKeyId
          }
        }
      }
    }

    const bucket = new s3.S3Bucket(this, 'state-store', {
      bucketPrefix: props.bucketPrefix,
      forceDestroy: true,
      serverSideEncryptionConfiguration: sseConfig
    });

    new s3.S3BucketPublicAccessBlock(this, 'statelock-public-access-block', {
      bucket: bucket.bucket,
    });

    new TerraformOutput(this, 'state-bucket',  {
      value: bucket.bucket
    });
  }
}