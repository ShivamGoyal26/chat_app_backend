const asyncHandler = require("express-async-handler");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

dotenv.config();

const { assetSchema } = require("../validators/assets");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET_KEY,
  },
});

const getAsset = asyncHandler(async (req, res) => {
  try {
    const { error, value } = assetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed. Please check your input.",
        status: false,
        errors: error.details.map((err) => err.message),
      });
    }
    const { key } = value;
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, {
      // expiresIn: 20 // this will expire after 20 sec
    });
    if (url) {
      return res.status(201).json({
        message: "success",
        status: true,
        url: url,
      });
    } else {
      return res.status(404).json({
        message: "Image not found",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      error: error.message,
    });
  }
});

module.exports = { getAsset };
