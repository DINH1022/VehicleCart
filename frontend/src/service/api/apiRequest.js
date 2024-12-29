import { SERVER_URL } from "../../redux/constant";
const apiRequest = async (url, sendCookies = true, options = {}) => {
  try {
    const defaultOptions = {
      credentials: sendCookies ? "include" : "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    };
    const mergedOptions = { ...defaultOptions, ...options };
    const response = await fetch(`${SERVER_URL}/${url}`, mergedOptions);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 401) {
        sessionStorage.setItem("userData");
        if (errorData?.message?.includes("admin")) {
          throw new Error("Not authorized as admin");
        } else {
          window.location.href = "/login";
        }
      }
      throw new Error(errorData?.message || "Request failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default apiRequest;
