import { SERVER_URL } from "../../redux/constant";
const apiRequest = async(url, sendCookies = true, options = {}) => {
    try {
        const defaultOptions = {
          credentials: sendCookies ?  'include' : 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          }
        };
        const mergedOptions = { ...defaultOptions, ...options };
        const response = await fetch(`${SERVER_URL}/${url}`, mergedOptions);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }
    
        return await response.json();
      } catch (error) {
        throw error;
      }
}
export default apiRequest