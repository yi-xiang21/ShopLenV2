import { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, Spin, Row, Col, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { ShipperPortalApi } from '@/pages/Shipper/api/shipper_api';
import type { ShipperProfileUpdate } from '@/pages/Shipper/types/shipper';
import ImageCropModal from '@/share/ComponentCustom/CropIMG/ImageCropModal'; 

const ShipperProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await ShipperPortalApi.getProfile();
        const profile = res.data?.data.profile;
        
        if (profile) {
          form.setFieldsValue({
            full_name: `${profile.first_name} ${profile.last_name}`.trim(),
            phone: profile.phone_number, 
            personal_address: profile.personal_address,
            cccd: profile.cccd,
            license_plate: profile.license_plate,
            avatar : profile.avatar,
          });
          setPreviewAvatar(profile.avatar);
        }
      } catch (error: any) {
        message.error("Không thể tải thông tin hồ sơ!", error.response?.data?.message || error.message || error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [form]);

  const onFinish = async (values: ShipperProfileUpdate) => {
    try {
      setLoading(true);
      console.log(values);
      await ShipperPortalApi.updateProfile(values);
      message.success('Cập nhật thông tin cá nhân thành công!');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
      e.target.value = ''; 
    }
  };

  if (fetching) return <Spin className="w-full mt-20 flex justify-center" size="large" />;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Thông tin cá nhân Shipper</h2>
      
      <div className="flex justify-center mb-8">
        <div 
          className="relative group cursor-pointer w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewAvatar ? (
            <img src={previewAvatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              Chưa có ảnh
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <CameraOutlined className="text-white text-xl mb-1" />
            <span className="text-xs text-white font-medium">Đổi ảnh</span>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={onFileChange} 
      />

      <ImageCropModal 
        isOpen={isCropModalOpen}
        imageSrc={imageSrc}
        onClose={() => {
          setIsCropModalOpen(false);
          setImageSrc(null);
        }}
        onConfirm={(base64String) => {
          setPreviewAvatar(base64String);
          form.setFieldsValue({ avatar: base64String });
        }}
        onError={(msg) => message.error(msg)}
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="avatar" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="full_name" label="Họ và Tên" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="personal_address" label="Địa chỉ thường trú" rules={[{ required: true }]}>
          <Input.TextArea size="large" rows={3} />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="cccd" label="Số CCCD" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="license_plate" label="Biển số xe" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit" loading={loading} size="large" className="w-full mt-2">
          Lưu thay đổi
        </Button>
      </Form>
    </div>
  );
};

export default ShipperProfile;