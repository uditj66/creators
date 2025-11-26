import ImageKit from "imagekit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName");

    if (!file) {
      return NextResponse.json(
        {
          error: "No file Provided",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timeStamp = Date.now();
    const sanitizedFileName =
      fileName.replace(/[^a-zA-Z0-9.-]/g, "_") || "upload";

    const uniqueFileName = `${userId}/${timeStamp}_${sanitizedFileName}`;
    // Upload to ImageKit-Simple server side upload

    const uploadResponse = await imageKit.upload({
      file: buffer,
      fileName: uniqueFileName,
      folder: "/blog_images",
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      width: uploadResponse.width,
      height: uploadResponse.height,
      size: uploadResponse.size,
      name: uploadResponse.name,
    });
  } catch (error) {
    console.error("ImageKit UploadError", error);
    return NextResponse.json(
      {
        success: false,

        error: "Failed to upload Image",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
