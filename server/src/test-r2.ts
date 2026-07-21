import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { r2 } from "./config/r2.js";

async function test() {
  try {
    const result = await r2.send(new ListBucketsCommand({}));

    console.log(result.Buckets);
  } catch (error) {
    console.log(error);
  }
}

test();
