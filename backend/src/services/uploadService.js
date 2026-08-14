const fs = require('fs');
const path = require('path');

const uploadImageToCloudinary = async (fileBuffer, folder = 'astronaut-store') => {
    return new Promise((resolve, reject) => {
        try {
            // Create uploads directory if it doesn't exist
            const uploadDir = path.join(__dirname, '../../uploads', folder);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generate a unique filename
            const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
            const filePath = path.join(uploadDir, filename);

            // Write buffer to file
            fs.writeFileSync(filePath, fileBuffer);

            // Construct relative URL
            const secure_url = `/uploads/${folder}/${filename}`;

            resolve({
                secure_url,
                public_id: `${folder}/${filename}`
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    uploadImageToCloudinary
};
