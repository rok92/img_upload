import './App.css';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import ImagesUpload from 'react-images-upload';


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

  return (
    <div className="App">
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>이미지를 업로드하려면 클릭하거나 여기에 이미지를 끌어다 놓으세요.</p>
          </div>
        )}
      </Dropzone>
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
            <img src={URL.createObjectURL(image)} alt="uploaded" />
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
