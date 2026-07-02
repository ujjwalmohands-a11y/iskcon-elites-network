export const runtime = 'edge';
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    // Zero-Trust Role Verification
    // Ensure the user is logged in and possesses the 'admin' role in their metadata
    const metadata = sessionClaims?.metadata as { role?: string } | undefined;
    if (!userId || metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    // Isolate file path securely using UUID or timestamp prefix
    const safeFilename = `${crypto.randomUUID()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const objectKey = `uploads/${safeFilename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: objectKey,
      ContentType: contentType,
    });

    // Sign the URL, expiring in 60 seconds
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return NextResponse.json({
      url: signedUrl,
      key: objectKey,
    });
  } catch (error) {
    console.error("Presigned URL Generation Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
