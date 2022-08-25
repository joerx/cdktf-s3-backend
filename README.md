# CDK for Terraform - S3 Backend Example

Since CDK for Terraform (supposedly) supports everything Terraform can do, you can use all the other supported backends as well - it's just not too well documented. (HashiCorp for some reason seems to prefer us to use Terraform Cloud...). This stack creates the S3 backend bucket and also uses it as a state backend.

Official doc for the S3 backend is here: https://www.terraform.io/language/settings/backends/s3. Since the CDK code is generated from Terraform itself, it has the exact same properties:

```ts
new S3Backend(stack, {
  bucket: "<some-bucket-name>",
  key: "alias/aws/s3",
  encrypt: true
});
```

## Usage

Since this entails a chicken-and-egg problem, the backend does not exist initially and the code won't run as is the first time. To work around this:

- Comment out the backend declaration in `main.ts`, deploy stack using local state
- Uncomment the backend, update the `bucket` property with the bucket name from the output 
- Migrate Terraform state

The `cdktf` CLI does not seem to have a built-in way to migrate the state, it will just fail when we change the backend. Luckily the synthesized stack is valid Terraform so we can do this:

```sh
cdktf synth
terraform --chdir=cdktf.out/stacks/cdktf-s3-backend init -migrate-state
```

When destroying, you will get an error in end: `Error saving state: failed to upload state: NoSuchBucket` - since Terraform tried to write back the state to the bucket it just destroyed. Simply ignore that, the bucket is gone and that's what was intended.
