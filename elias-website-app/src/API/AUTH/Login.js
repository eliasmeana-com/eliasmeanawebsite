import { BASE_URL } from '../baseUrl';

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      return { success: true, token: data.token };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}
