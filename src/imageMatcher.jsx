import instagramLogo from './images/instagram.svg';
import decathlonLogo from './images/decathlon.svg';
import { useState } from 'react';

const ImageMatcher = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchUrls, setMatchUrls] = useState([]); // Array to store product images
  const [errorMessage, setErrorMessage] = useState('');
  const [productUrl, setProductUrl] = useState([]);
  const [searchResultsSummary, setSearchResultsSummary] = useState([]); // State to store dynamic JSON data
  const [imageUrls, setImageUrls] = useState([]); // State to store image URLs

  const handleImageSelect = (url) => {
    setSelectedImage(url);
    setShowModal(false);
    setShowMatch(false);
    setErrorMessage('');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setShowMatch(false);
    setMatchUrls([]); // Clear the matchUrls array
    setErrorMessage('');
  };

  const handleFindMatch = () => {
    if (!selectedImage) {
      setErrorMessage('Please select an image first.');
    } else {
      const matchItem = searchResultsSummary.find(entry => entry.searchImage === selectedImage);
      if (matchItem) {
        const urls = matchItem.searchResults.map(entry => entry.productImage);
        const product = matchItem.searchResults.map(entry => entry.productUrl);
        setProductUrl(product);
        setMatchUrls(urls);
        setShowMatch(true);
      } else {
        setErrorMessage('No matching products found.');
        setShowMatch(false);
      }
    }
  };

  const isValidJson = (data) => {
    if (!Array.isArray(data)) return false;
    // console.log(data);
              
    return data.every(item => {
      var hasValidStructure = item.hasOwnProperty('searchImage') && 
                                Array.isArray(item.searchResults) &&
                                item.searchResults.every(product => 
                                  product.hasOwnProperty('productImage') ||
                                  product.hasOwnProperty('productUrl'));
      return hasValidStructure;
    });
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (isValidJson(json)) {
            setSearchResultsSummary(json);
            setImageUrls(json.map(entry => entry.searchImage));
            setErrorMessage('');
          } else {
            setSelectedImage(null);
            setShowMatch(false);
    setMatchUrls([]);
            setImageUrls([]);
            setErrorMessage('JSON file does not match the expected format.');
          }
        } catch (error) {
          setErrorMessage('Invalid JSON file.');
        }
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read the file.');
      };
      reader.readAsText(file);
    } else {
      setErrorMessage('Please upload a valid JSON file.');
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div className="logo-box">
          <img src={instagramLogo} alt="Instagram Logo" className="logo" />
          <img src={decathlonLogo} alt="Decathlon Logo" className="logo" />
        </div>
      </div>
      <div className="content">
        <div className="upload-section">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="uploaded-image" />
          ) : (
            <div className="placeholder-image">No image selected</div>
          )}
          <input type="file" className="custom-file-upload" label="Upload File" onChange={handleFile} />
          <button className="custom-file-upload" onClick={toggleModal}>Choose Image</button>
          <button className="find-match-button" onClick={handleFindMatch}>Find the Match</button>
          <button className="reset-button" onClick={handleReset}>Reset</button>
          <div className="image-modal" style={{ display: showModal ? 'block' : 'none' }}>
            <button className="close-modal" onClick={toggleModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '24px' }}>X</button>
            {imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Choice ${index + 1}`} className="modal-image" onClick={() => handleImageSelect(url)} />
            ))}
          </div>
        </div>
        <div className="matching-products">
          <h2>Matching Products</h2>
          {showMatch && (
            matchUrls.map((url, index) => (
              <div style={{alignItems:'center',justifyContent:'center'}} key={index}>
                <img style={{width: '200px', height: '200px',margin:'10px'}} src={url} alt={`Matching Product ${index + 1}`} className="product-image" />
                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <a style={{cursor:'pointer',textDecoration:'underline',color:'Blue'}} href={productUrl[index]} target="_blank">Product-link</a>
                </div>
              </div>
            ))
          )}
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default ImageMatcher;