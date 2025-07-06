// API Configuration
// Change these URLs as needed for different environments
const API_CONFIG = {
  // Node.js backend for user management, posts, chat
  NODE_API_BASE_URL: 'http://localhost:3000',
  
  // Django backend for video management
  DJANGO_API_BASE_URL: 'http://localhost:8000',
  
  // API endpoints
  endpoints: {
    // Node.js endpoints
    auth: {
      register: '/api/register',
      login: '/api/login',
      userInfo: '/api/user-info'
    },
    
    // Django endpoints
    videos: {
      feed: '/api/',
      videoPost: '/api/videopost/',
      createPost: '/api/create-post/',
      trackWatch: '/api/track-watch/'
    }
  }
};

// Helper functions for making API calls
export const nodeAPI = {
  baseURL: API_CONFIG.NODE_API_BASE_URL,
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Network error');
      }
      
      return data;
    } catch (error) {
      console.error('Node API Error:', error);
      throw error;
    }
  },
  
  // Auth methods
  async register(userData) {
    return this.request(API_CONFIG.endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  async login(credentials) {
    return this.request(API_CONFIG.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  async getUserInfo(userId) {
    return this.request(`${API_CONFIG.endpoints.auth.userInfo}?userId=${userId}`);
  }
};

export const djangoAPI = {
  baseURL: API_CONFIG.DJANGO_API_BASE_URL,
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Network error');
        }
        return data;
      } else {
        // For file responses (videos)
        if (!response.ok) {
          throw new Error('Network error');
        }
        return response;
      }
    } catch (error) {
      console.error('Django API Error:', error);
      throw error;
    }
  },
  
  // Video methods
  async getVideoFeed(userId) {
    return this.request(`${API_CONFIG.endpoints.videos.feed}?user_id=${userId}`);
  },
  
  async getVideo(videoId, userId = null) {
    const params = new URLSearchParams({ video_id: videoId });
    if (userId) params.append('user_id', userId);
    return this.request(`${API_CONFIG.endpoints.videos.videoPost}?${params}`);
  },
  
  async createVideoPost(formData) {
    return this.request(API_CONFIG.endpoints.videos.createPost, {
      method: 'POST',
      body: formData // FormData object
    });
  },
  
  async trackVideoWatch(videoId, userId = null) {
    return this.request(API_CONFIG.endpoints.videos.trackWatch, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_id: videoId,
        user_id: userId
      })
    });
  }
};

export default API_CONFIG;
