import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ManageData.css';

const ManageData = () => {
  const [dataList, setDataList] = useState([]);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://localhost:7162/api/DataManagement')
      .then((response) => {
        setDataList(response.data);
        setLoading(false);
        if (response.data.length > 0) {
          handleViewDetails(response.data[0].id);
        } else {
          setError('Không có dữ liệu nào được tìm thấy.');
        }
      })
      .catch((error) => {
        setMessage('Không thể lấy dữ liệu từ máy chủ.');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://localhost:7162/api/DataManagement/${id}`)
      .then((response) => {
        setMessage('Xóa dữ liệu thành công.');
        const updatedDataList = dataList.filter(item => item.id !== id);
        setDataList(updatedDataList);
        if (updatedDataList.length > 0) {
          handleViewDetails(updatedDataList[0].id);
        } else {
          setDetails(null);
        }
      })
      .catch((error) => {
        setMessage('Lỗi khi xóa dữ liệu.');
      });
  };

  const handleViewDetails = (id) => {
    setSelectedId(id);
    axios.get(`https://localhost:7162/api/Spectrograms/${id}`)
      .then((response) => {
        setDetails(response.data);
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
        setMessage('Không thể lấy chi tiết dữ liệu.');
      });
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="manage-data-container">
      <div className="data-list">
        <h1>Quản lý dữ liệu</h1>
        {message && <p></p>}
        {error ? (
          <p>{error}</p>
        ) : (
          <div>
            {dataList.map((data) => (
              <div
                key={data.id}
                className={`data-item ${selectedId === data.id ? 'selected' : ''}`}
                onClick={() => handleViewDetails(data.id)}
              >
                <h3>Tên file đánh giá: {data.fileName}</h3>
                <p>Thời gian: {new Date(data.timestamp).toLocaleString()}</p>
                
                <button onClick={(e) => { e.stopPropagation(); handleDelete(data.id); }}>Xóa</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="details-view">
        {details ? (
          <div>
            <h2>Chi tiết kết quả phân loại</h2>
            <p>{message}</p>
            {details.map((detail, index) => (
              <div key={index} className="detail-item">
                <img src={`data:image/png;base64,${detail.dataBase64}`} alt={detail.class} />
                <h3>Lớp tín hiệu: {detail.class}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>Chọn một dữ liệu tín hiệu để xem chi tiết</p>
        )}
      </div>
    </div>
  );
};

export default ManageData;
