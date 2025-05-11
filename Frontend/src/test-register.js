const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration with provided credentials...');
    
    // Log the request data
    const requestData = {
      name: 'Kim Sang Huynh',
      email: 'samiching2910@gmail.com',
      password: '123456789'
    };
    console.log('Request data:', requestData);

    const response = await axios.post('http://localhost:5000/api/users/register', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Registration failed!');
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
  }
}

// Run the test
console.log('Starting registration test...');
testRegistration(); 