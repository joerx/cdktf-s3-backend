# CDK for Terraform - S3 Backend Example

Since CDK for Terraform (supposedly) supports everything Terraform can do, you can use all the other supported backends as well - it's just not too well documented. (HashiCorp for some reason seems to prefer us to use Terraform Cloud...). This stack creates the S3 backend bucket and also uses it as a state backend.

Since that entails a chicken-and-egg problem, the code won't run as is the first time. The process is:

- Comment out the backend declaration in `main.ts`, deploy stack using local state
- Uncomment the backend, migrate state

The `cdktf` CLI does not seem to have a built-in way to migrate the state, it will just fail when you change the backend. Luckily the synthesized stack is valid Terraform so we can do this:

```sh
cdktf synth
terraform --chdir=cdktf.out/stacks/cdktf-s3-backend init -migrate-state
```
