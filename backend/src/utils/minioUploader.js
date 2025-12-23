const path = require("path");
const {
  uploadFileToMinio,
  deleteFileFromMinio,
} = require("../middlewares/minio");

/**
 * Generate path file di MinIO
 * contoh: nasabah/12/foto_ktp/16999999.jpg
 */
const generateObjectName = ({ folder, ownerId, field, originalname }) => {
  const ext = path.extname(originalname);
  return `${folder}/${ownerId}/${field}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}${ext}`;
};

/**
 * Upload multiple files (parallel)
 */
const uploadFiles = async ({
  files,
  folder,
  ownerId,
  totalMaxSize = 5 * 1024 * 1024, // 5MB total
}) => {
  if (!files) return {};

  let totalSize = 0;
  Object.values(files)
    .flat()
    .forEach(f => (totalSize += f.size));

  if (totalSize > totalMaxSize) {
    throw new Error("Total ukuran file melebihi batas");
  }

  const uploaded = {};
  const uploadedKeys = [];

  try {
    await Promise.all(
      Object.entries(files).map(async ([field, fileArr]) => {
        const file = fileArr[0];

        const objectName = generateObjectName({
          folder,
          ownerId,
          field,
          originalname: file.originalname,
        });

        await uploadFileToMinio(
          objectName,
          file.buffer,
          file.mimetype
        );

        uploaded[field] = objectName;
        uploadedKeys.push(objectName);
      })
    );

    return uploaded;
  } catch (err) {
    // rollback otomatis
    await Promise.all(
      uploadedKeys.map(key =>
        deleteFileFromMinio(key).catch(() => {})
      )
    );
    throw err;
  }
};

module.exports = { uploadFiles };
