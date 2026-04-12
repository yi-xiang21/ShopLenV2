import { API_CONFIG, getApiUrl } from '../config/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



const ProfileUser = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const logoutUrl = getApiUrl(API_CONFIG.ENDPOINTS.LOGOUT);
    try {
      const response = await axios.post(logoutUrl);
      logout();
      console.log("Logout success:", response.data);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout failed:", error.response?.data || error.message);
        return;
      }
      console.error("Logout failed:", error);
    }
  };
  return (
    <div>
      <h1>Profile User</h1>
      <p>This is the user profile page.</p>
        <button onClick={handleLogout}>
          Logout
        </button>

    </div>
  )
}

export default ProfileUser
