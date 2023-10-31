const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const asyncHandler = require("express-async-handler");
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
        message: error.details.map((err) => err.message),
        status: false,
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
      return res.status(200).json({
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
      message: error.message,
      status: false,
    });
  }
});

const putAsset = asyncHandler(async (req, res) => {
  try {
    const { filename, contentType, path } = req.body;

    if (!filename || !contentType || !path) {
      return res.status(400).json({
        message: "Please check the request body",
        status: false,
      });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: `${path}${filename}`,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, {});
    if (url) {
      return res.status(200).json({
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
      message: error.message,
      status: false,
    });
  }
});

const listAllObject = asyncHandler(async (req, res) => {
  try {
    const { key } = req.body;

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });

    const result = await s3Client.send(command);
    if (result) {
      return res.status(200).json({
        message: "success",
        status: true,
        data: result,
      });
    } else {
      return res.status(404).json({
        message: "Image not found",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

const deleteAsset = asyncHandler(async (req, res) => {
  try {
    const { key } = req.body;

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });

    const result = await s3Client.send(command);
    if (result) {
      return res.status(200).json({
        message: "success",
        status: true,
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

module.exports = { getAsset, putAsset };
