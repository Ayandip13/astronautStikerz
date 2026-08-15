const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = async (fileBuffer, folder = 'astronaut-store') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload stream error:', error);
                    return reject(error);
                }
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                });
            }
        );
        uploadStream.end(fileBuffer);
    });
};

module.exports = {
    uploadImageToCloudinary
};
