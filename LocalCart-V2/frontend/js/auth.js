import { fetchCart, showNotification } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Modal Elements
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navRegisterBtn = document.getElementById('nav-register-btn');
  const authModal = document.getElementById('auth-modal');
  const authClose = document.getElementById('auth-close');
  const authTabs = document.querySelectorAll('.auth-tab');
  
  // Forms & Errors
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  
  // Headers context
  const unauthenticatedNav = document.getElementById('unauthenticated-nav');
  const authenticatedNav = document.getElementById('authenticated-nav');
  const navAvatar = document.getElementById('nav-avatar');
  const navUsername = document.getElementById('nav-username');
  const navLogoutBtn = document.getElementById('nav-logout-btn');

  // Initialization styling protection
  if (registerForm) registerForm.style.display = 'none';

  // 1. Session Management Function
  const checkAuthState = () => {
    const userJson = localStorage.getItem('localcart_user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (unauthenticatedNav) unauthenticatedNav.style.display = 'none';
      if (authenticatedNav) authenticatedNav.style.display = 'flex';
      if (navUsername) navUsername.textContent = user.username || user.fullname;
      if (navAvatar && user.avatar) navAvatar.src = user.avatar;
    } else {
      if (unauthenticatedNav) unauthenticatedNav.style.display = 'flex';
      if (authenticatedNav) authenticatedNav.style.display = 'none';
    }
  };
  checkAuthState();

  // 2. Modal Interface Logic
  const openModal = (tabStr) => {
    if (!authModal) return;
    authModal.style.display = 'block';
    switchTab(tabStr);
  };
  
  const closeModal = () => {
    if (!authModal) return;
    authModal.style.display = 'none';
    if(loginError) loginError.textContent = '';
    if(registerError) registerError.textContent = '';
  };

  const switchTab = (tabStr) => {
    authTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabStr) {
        tab.classList.add('active');
        if (tabStr === 'login') {
          if (loginForm) { loginForm.classList.add('active'); loginForm.style.display = 'block'; }
          if (registerForm) { registerForm.classList.remove('active'); registerForm.style.display = 'none'; }
        } else {
          if (registerForm) { registerForm.classList.add('active'); registerForm.style.display = 'block'; }
          if (loginForm) { loginForm.classList.remove('active'); loginForm.style.display = 'none'; }
        }
      } else {
        tab.classList.remove('active');
      }
    });
  };

  // Connect click listeners
  if (navLoginBtn) navLoginBtn.addEventListener('click', () => openModal('login'));
  if (navRegisterBtn) navRegisterBtn.addEventListener('click', () => openModal('register'));
  if (authClose) authClose.addEventListener('click', closeModal);
  
  window.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
  });

  authTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      switchTab(e.target.getAttribute('data-tab'));
    });
  });

  // 3. Form Submit - LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('login-identifier').value;
      const password = document.getElementById('login-password').value;
      
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: identifier, // Handled implicitly by backend
            email: identifier,
            password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        localStorage.setItem('localcart_user', JSON.stringify(data.data.user));
        checkAuthState();
        fetchCart(); // Refresh cart after login
        closeModal();
        showNotification(`Welcome back, ${data.data.user.username}!`);
      } catch (err) {
        if (loginError) {
          loginError.textContent = err.message;
          loginError.style.color = 'red';
        }
      }
    });
  }

  // 4. Form Submit - SIGN UP
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fullname = document.getElementById('reg-fullname').value;
      const username = document.getElementById('reg-username').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const avatarFile = document.getElementById('reg-avatar').files[0];
      const coverFile = document.getElementById('reg-cover')?.files[0];

      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (avatarFile) formData.append('avatar', avatarFile);
      if (coverFile) formData.append('coverimage', coverFile);

      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          body: formData 
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        registerError.textContent = "Sign up successful! Re-directing to logic...";
        registerError.style.color = 'green';
        
        setTimeout(() => {
          switchTab('login');
          document.getElementById('login-identifier').value = username;
        }, 1200);

      } catch (err) {
        if (registerError) {
          registerError.textContent = err.message;
          registerError.style.color = 'red';
        }
      }
    });
  }

  // 5. Logout Handling
  if (navLogoutBtn) {
    navLogoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/users/logout', { method: 'POST' });
        localStorage.removeItem('localcart_user');
        checkAuthState();
        fetchCart(); // Refresh (clear) cart after logout
        showNotification('Logged out successfully');
      } catch (err) {
        console.error('Logout error:', err);
      }
    });
  }
});
