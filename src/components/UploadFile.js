import React, { useState, useRef } from 'react';
import axios from 'axios';
import './css/UploadFile.css'; // Import file CSS

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [numImages, setNumImages] = useState(2);
    const [fs, setFs] = useState(10e6);
    const [time, setTime] = useState(10);
    const [message, setMessage] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [images, setImages] = useState([]);
    const [signalDataId, setSignalDataId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showResults, setShowResults] = useState(false); // State để quản lý hiển thị kết quả

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleNumImagesChange = (event) => {
        setNumImages(event.target.value);
    };

    const handleFsChange = (event) => {
        setFs(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handleFileUpload = async () => {
        setIsUploading(true);

        if (!file) {
            setMessage('Vui lòng chọn tệp để tải lên.');
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('numImages', numImages);
        formData.append('fs', fs);
        formData.append('time', time);
        formData.append('fileName', file.name);

        const token = localStorage.getItem('token');

        if (!token) {
            setMessage('Không có token. Vui lòng đăng nhập lại.');
            setIsUploading(false);
            return;
        }

        try {
            const response = await axios.post('https://localhost:7162/api/FileUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Thêm token vào header
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 0
            });

            if (response.status === 200) {
                setMessage('Xử lý thành công');
                setSignalDataId(response.data.signalDataId);
                setShowResults(true); // Hiển thị kết quả sau khi tải lên thành công
            } else if (response.status === 202) {
                setMessage('Tệp đang được xử lý. Vui lòng kiểm tra lại sau.');
                setShowResults(true); // Hiển thị kết quả sau khi tải lên thành công
            } else {
                setMessage('Phản hồi không mong đợi từ máy chủ: ' + response.status);
            }
        } catch (error) {
            if (error.response) {
                setMessage('Lỗi khi tải tệp lên: ' + error.response.data);
            } else if (error.request) {
                setMessage('Lỗi khi tải tệp lên: Không nhận được phản hồi từ máy chủ');
            } else {
                setMessage('Lỗi khi tải tệp lên: ' + error.message);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleViewDetails = () => {
        axios.get(`https://localhost:7162/api/Spectrograms/${signalDataId}`)
          .then((response) => {
            setImages(response.data);
            setShowDetails(true); // Hiển thị chi tiết khi nhận được dữ liệu
      
            // Danh sách các class cần theo dõi
            const jammingClasses = ['NB', 'DME', 'SingleAM', 'SingleChirp', 'SingleFM'];
            const counts = {};
            let hasJammingSignal = false;
      
            // Thống kê số lượng từng loại tín hiệu
            response.data.forEach(image => {
              counts[image.class] = (counts[image.class] || 0) + 1;
              if (jammingClasses.includes(image.class)) {
                hasJammingSignal = true; // Xác định có tín hiệu phá sóng
              }
            });
      
            // Xây dựng thông điệp kết quả
            if (!hasJammingSignal) {
              setMessage("Không có tín hiệu phá sóng");
            } else {
              const totalCount = response.data.length;
              let resultMessage = "Có tín hiệu phá sóng\n";
              jammingClasses.forEach(key => {
                if (counts[key]) { // Chỉ thêm vào message nếu có tín hiệu
                  resultMessage += `\n• ${counts[key]}/${totalCount} spectrogram tín hiệu ${key}`;
                }
              });
              setMessage(resultMessage); // Lưu danh sách các mục vào state
            }
          })
          .catch((error) => {
            setMessage('Error fetching images: ' + error.message);
          });
      };
    
      
      

    const handleToggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleReset = () => {
        setFile(null);
        setNumImages(2);
        setFs(10e6);
        setTime(10);
        setMessage('');
        setShowDetails(false);
        setImages([]);
        setSignalDataId(null);
        setIsUploading(false);
        setShowResults(false);

        // Reset input file
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    
      
    return (
        <div>
            <h1>Phát hiện, phân loại tín hiệu phá sóng GPS</h1>
            <div className="results-container">
                <div className="left-panel">
                    <div>
                        <label>Chọn tệp cần phân tích:</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            disabled={isUploading || showResults} 
                            ref={fileInputRef} 
                        />
                    </div>
                    <div>
                        <label>Số lượng ảnh cần tạo từ tín hiệu:</label>
                        <input 
                            type="number" 
                            value={numImages} 
                            onChange={handleNumImagesChange} 
                            placeholder="Số lượng ảnh" 
                            disabled={isUploading || showResults} 
                        />
                    </div>
                    <div>
                        <label>Tần số lấy mẫu (Hz):</label>
                        <input 
                            type="number" 
                            value={fs} 
                            onChange={handleFsChange} 
                            placeholder="Tần số lấy mẫu (Hz)" 
                            disabled={isUploading || showResults} 
                        />
                    </div>
                    <div>
                        <label>Thời gian phân tích (s):</label>
                        <input 
                            type="number" 
                            value={time} 
                            onChange={handleTimeChange} 
                            placeholder="Thời gian phân tích (s)" 
                            disabled={isUploading || showResults} 
                        />
                    </div>
                    {!showResults ? (
                        <button onClick={handleFileUpload} disabled={isUploading}>Tải tệp lên</button>
                    ) : (
                        <button onClick={handleReset}>Đặt lại</button>
                    )}
                    {showResults && (
                        <>
                            <h2>Kết quả phát hiện</h2>
                            {Array.isArray(message) ? (
                            <ul>
                                {message.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                            ) : (
                            <p>{message}</p>
                            )}
                            {showDetails ? (
                                <button onClick={handleToggleDetails}>Ẩn chi tiết</button>
                            ) : (
                                <button onClick={handleViewDetails}>Xem chi tiết</button>
                            )}
                        </>
                    )}
                </div>
                {showDetails && (
                    <div className="right-panel">
                        {images.map((image, index) => (
                            <div key={index}>
                                <img src={`data:image/png;base64,${image.dataBase64}`} alt={image.class} />
                                <p>Lớp tín hiệu: {image.class}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadFile;