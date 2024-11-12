import { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';

import './App.css';

const MediaUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [resultFile, setResultFile] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    rating: '',
    stock: '',
    brand: '',
    category: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  console.log(resultFile,"<<<<<resultFile")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);

      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload an image or other valid file.');
      return;
    }

    const form = new FormData();
    form.append('title', "formData.title");
    form.append('description', "formData.description");
    form.append('price', "formData.price");
    form.append('rating', "5");
    form.append('stock', "formData.stock");
    form.append('brand', "formData.brand");
    form.append('category', "formData.category");
    form.append('images', file);

    try {
      setIsUploading(true);
      const response = await fetch('http://localhost:8000/api/addProduct', {
        method: 'POST',
        body: form,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if needed
        },
      });

      const result = await response.json();
      setResultFile(result.images)
      if (response.ok) {
        setUploadSuccess(true);
        alert('Product added successfully!');
      } else {
        setUploadSuccess(false);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error during product upload:', error);
      setUploadSuccess(false);
      alert('Error uploading the product.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileType(null);
  };

  return (
    <div className="media-upload">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
        </div>
        <div>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
        </div>
        <div>
          <input
            type="text"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            placeholder="Rating"
          />
        </div>
        <div>
          <input
            type="text"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Stock"
          />
        </div>
        <div>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Brand"
          />
        </div>
        <div>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category"
          />
        </div>

        <div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*,.pdf"
          />
        </div>

        {previewUrl && (
          <div>
            {fileType.startsWith('image') ? (
              <img src={previewUrl} alt="Preview" width="200" />
            ) : fileType.startsWith('video') ? (
              <video width="200" controls>
                <source src={previewUrl} type={fileType} />
                Your browser does not support the video tag.
              </video>
            ) : fileType === 'application/pdf' ? (
              <div className="preview-file">
                <h3>PDF Preview</h3>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                  <Viewer
                    fileUrl={previewUrl}
                    renderError={() => <div>Error loading PDF</div>}
                    plugins={[]}
                    initialPage={0}
                    scale={1}
                  />
                </Worker>
                {resultFile.length && 
                 <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                 <Viewer
                   fileUrl={`http://localhost:8000/${resultFile[0]}`}
                   renderError={() => <div>Error loading PDF</div>}
                   plugins={[]}
                   initialPage={0}
                   scale={1}
                 />
               </Worker>
                }
              </div>
            ) : null}
          </div>
        )}

        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      {file && <button onClick={resetFile}>Reset</button>}

      {uploadSuccess !== null && (
        <div>
          {uploadSuccess ? (
            <p>Product uploaded successfully!</p>
          ) : (
            <p>Error uploading product. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
