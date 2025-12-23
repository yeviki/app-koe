const { deleteFileFromMinio } = require("../middlewares/minio");

const deleteFiles = async (files = []) => {
  await Promise.all(
    files.filter(Boolean).map(f =>
      deleteFileFromMinio(f).catch(() => {})
    )
  );
};

module.exports = { deleteFiles };
