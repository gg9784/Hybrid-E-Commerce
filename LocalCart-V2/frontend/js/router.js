/**
 * Simple Client-Side Router for LocalCart
 */
class Router {
  constructor() {
    this.routes = {};
    this.currentView = null;
    this.container = document.getElementById('main-content');
    
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  addRoute(path, view) {
    this.routes[path] = view;
  }

  async handleRoute() {
    const url = window.location.hash.slice(1) || '/';
    
    // Parse URL for params (e.g., #/store/1)
    let view = this.routes[url];
    let params = {};

    if (!view) {
      // Check for dynamic routes
      for (const route in this.routes) {
        if (route.includes(':')) {
          const routeParts = route.split('/');
          const urlParts = url.split('/');
          
          if (routeParts.length === urlParts.length) {
            const match = routeParts.every((part, i) => part.startsWith(':') || part === urlParts[i]);
            if (match) {
              view = this.routes[route];
              routeParts.forEach((part, i) => {
                if (part.startsWith(':')) {
                  params[part.slice(1)] = urlParts[i];
                }
              });
              break;
            }
          }
        }
      }
    }

    if (view) {
      if (this.currentView && this.currentView.unmount) {
        this.currentView.unmount();
      }
      
      this.currentView = view;
      this.container.innerHTML = '<div class="loading">Loading...</div>';
      
      try {
        await view.render(this.container, params);
      } catch (error) {
        console.error('Routing error:', error);
        this.container.innerHTML = '<div class="error">Failed to load page</div>';
      }
    } else {
      console.warn('No route found for:', url);
      window.location.hash = '#/';
    }
  }

  navigate(path) {
    window.location.hash = `#${path}`;
  }
}

export const router = new Router();
