import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../../config/firebaseConfig'; // Đảm bảo import storage từ file cấu hình Firebase của bạn

const ImageUploader = ({ name, value, onChange }) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          onChange({ target: { name, value: url } });
          console.log('Image uploaded successfully. Download URL:', url);
        });
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button type="button" onClick={handleSubmit}>Upload</button>
      {value && <img src={value} alt="Uploaded" />}
    </div>
  );
};

export default ImageUploader;