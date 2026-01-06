const { PutObjectCommand } = require('@aws-sdk/client-s3')
const s3 = require('../config/s3')

const uploadToS3 = async (file, userId, jobId) => {
  const key = `cvs/${userId}-${jobId}.pdf`

  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: 'application/pdf'
  }))

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}

module.exports = uploadToS3
