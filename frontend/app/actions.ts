"use server";

import { db } from "@/db";
import { tokens } from "@/db/schema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

type Token = {
  tokenName: string;
  tokenSymbol: string;
  imageUri: string;
  txHash: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  website?: string;
};

export async function saveToken(formData: FormData) {
  // Save the token to the database

  const image = formData.get("file") as File;
  const data = JSON.parse(formData.get("data") as string) as Token;

  const client = new S3Client({ region: process.env.AWS_REGION });
  const Body = (await image.arrayBuffer()) as Buffer;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `tokens/${data.imageUri}`,
      Body,
      ContentType: image.type
    })
  );

  const token = await db
    .insert(tokens)
    .values({
      id: randomUUID(),
      name: data.tokenName,
      symbol: data.tokenSymbol.toUpperCase(),
      txHash: data.txHash,
      image: data.imageUri,
      twitter: data.twitter,
      telegram: data.telegram,
      discord: data.discord,
      website: data.website,
      confirmed: false,
      address: null,
      marketCap: "1000_000_000",
      createdAt: new Date().toISOString()
    })
    .returning();

  return token[0];
}
