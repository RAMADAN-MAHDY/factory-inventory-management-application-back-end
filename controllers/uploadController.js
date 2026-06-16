import axios from 'axios';
import FormData from 'form-data';

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64'));
    formData.append('key', process.env.IMGBB_API_KEY);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders()
    });

    res.json({ imageUrl: response.data.data.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

export { uploadImage };
