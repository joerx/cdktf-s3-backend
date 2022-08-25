import {App, S3Backend} from "cdktf";
import {StateStoreStack } from "./lib/state-store";

const app = new App();

const stack = new StateStoreStack(app, "cdktf-s3-backend", {
  bucketPrefix: "cdkft-tfstate",
  encrypt: true
});

new S3Backend(stack, {
  bucket: "cdkft-tfstate20220825021455818300000001",
  key: "alias/aws/s3",
  encrypt: true
});

app.synth();
