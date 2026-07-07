import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Slider } from 'antd';
import { getCroppedImg } from '@/share/ComponentCustom/CropIMG/cropimg';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (base64String: string) => void;
  onError?: (errorMsg: string) => void;
}

const ImageCropModal = ({ isOpen, imageSrc, onClose, onConfirm, onError }: ImageCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const reader = new FileReader();
      reader.readAsDataURL(croppedFile);
      reader.onloadend = () => {
        onConfirm(reader.result as string); // Trả chuỗi base64 về cho component cha
        onClose(); // Đóng modal
      };
    } catch (e) {
      console.error(e);
      if (onError) onError('Có lỗi xảy ra khi xử lý hình ảnh.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    onClose();
  };

  return (
    <Modal
      title="Chỉnh sửa hình ảnh"
      open={isOpen}
      onOk={handleConfirmCrop}
      onCancel={handleCancel}
      okText={isProcessing ? "Đang xử lý..." : "Xác nhận ảnh"}
      cancelText="Hủy"
      confirmLoading={isProcessing}
      destroyOnClose
    >
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} 
            cropShape="round" // Có thể truyền prop aspect/cropShape nếu muốn dùng lại cho ảnh chữ nhật
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )}
      </div>
      <div className="mt-4 px-4">
        <p className="text-sm text-gray-500 mb-2">Thu phóng:</p>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(value) => setZoom(value)}
        />
      </div>
    </Modal>
  );
};

export default ImageCropModal;