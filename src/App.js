import './App.css';
import React, { useState } from 'react';
import ImagesUpload from 'react-images-upload';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);

  const onDrop = (files) => {
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // 이미지 파일들을 formData에 추가
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await axios.post('http://127.0.0.1:3306/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.message);
      // 서버 응답에 대한 처리 추가
    } catch (error) {
      console.error('Failed to upload image:', error);
      // 에러 처리 추가
    }
  };

  return (
    <div className="App">
      <ImagesUpload
        className="images-preview"
        onChange={onDrop}
        imgExtension={['.jpg', '.png', '.gif', '.jpeg']}
        maxFileSize={5242880}
        withPreview
      />
      <div className="image-list">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            {/* <img src={URL.createObjectURL(image)} alt="uploaded" /> */}
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
}

export default App;
