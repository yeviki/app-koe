// middlewares/minio.js
const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const getPresignedUrlFromMinio = (fileName, expiryInSeconds = 300) => {
  return new Promise((resolve, reject) => {
    minioClient.presignedGetObject(
      process.env.MINIO_BUCKET_NAME,
      `${fileName}`,
      expiryInSeconds,
      (err, presignedUrl) => {
        if (err) {
          return reject(new Error(`Minio ${err}`));
        }
        resolve(presignedUrl);
      },
    );
  });
};

const uploadFileToMinio = (fileName, fileBuffer, mimeType) => {
  return new Promise((resolve, reject) => {
    minioClient.putObject(
      process.env.MINIO_BUCKET_NAME,
      `${fileName}`,
      fileBuffer,
      {
        'Content-Type': mimeType,
      },
      (err, etag) => {
        if (err) {
          return reject(new Error(`Minio ${err}`));
        }
        resolve(etag);
      },
    );
  });
};

const getFileFromMinio = (fileName) => {
  return new Promise((resolve, reject) => {
    minioClient.getObject(process.env.MINIO_BUCKET_NAME, `${fileName}`, (err, dataStream) => {
      if (err) {
        return reject(new Error(`Minio ${err}`));
      }
      resolve(dataStream);
    });
  });
};

const getBase64FromMinio = (fileName) => {
  return new Promise((resolve, reject) => {
    let data = [];

    minioClient.getObject(process.env.MINIO_BUCKET_NAME, `${fileName}`, (err, dataStream) => {
      if (err) return reject(new Error(`Minio ${err}`));

      dataStream.on('data', (chunk) => data.push(chunk));
      dataStream.on('end', () => {
        const buffer = Buffer.concat(data);
        const base64 = buffer.toString('base64');
        resolve(base64);
      });
      dataStream.on('error', (err) => reject(err));
    });
  });
};

const deleteFileFromMinio = (fileName) => {
  return new Promise((resolve, reject) => {
    minioClient.removeObject(process.env.MINIO_BUCKET_NAME, `${fileName}`, (err) => {
      if (err) {
        return reject(new Error(`Minio ${err}`));
      }
      resolve('success remove objects');
    });
  });
};

module.exports = {
  uploadFileToMinio,
  getFileFromMinio,
  getBase64FromMinio,
  getPresignedUrlFromMinio,
  deleteFileFromMinio,
};
