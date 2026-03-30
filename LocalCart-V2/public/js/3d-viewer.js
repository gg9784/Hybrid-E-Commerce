/**
 * 3D Viewer Implementation for LocalCart
 * This file implements 3D product visualization using Three.js
 */

// Initialize the 3D viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load Three.js library dynamically
  loadThreeJsLibrary();
});

/**
 * Dynamically load Three.js library
 */
function loadThreeJsLibrary() {
  // Create script elements for Three.js and OrbitControls
  const threeScript = document.createElement('script');
  threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
  threeScript.async = true;
  
  const orbitControlsScript = document.createElement('script');
  orbitControlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js';
  orbitControlsScript.async = true;
  
  // Initialize 3D viewer after libraries are loaded
  threeScript.onload = () => {
    orbitControlsScript.onload = () => {
      init3DViewer();
    };
    document.head.appendChild(orbitControlsScript);
  };
  
  document.head.appendChild(threeScript);
}

/**
 * Initialize the 3D viewer functionality
 */
function init3DViewer() {
  // Create 3D viewer elements
  create3DViewerElements();
  
  // Add 3D view buttons to products (DISABLED PER REQUEST)
  // addViewIn3DButtons();
}

/**
 * Create the 3D viewer UI elements and append to the document
 */
function create3DViewerElements() {
  // Check if 3D viewer container already exists
  if (document.querySelector('.viewer-3d-container')) {
    return;
  }
  
  // Create 3D viewer container
  const viewerContainer = document.createElement('div');
  viewerContainer.className = 'viewer-3d-container';
  
  // Create 3D viewer panel
  const viewerPanel = document.createElement('div');
  viewerPanel.className = 'viewer-3d-panel';
  
  // Create 3D viewer header
  const viewerHeader = document.createElement('div');
  viewerHeader.className = 'viewer-3d-header';
  viewerHeader.innerHTML = `
    <h3>3D Product Viewer</h3>
    <button class="viewer-3d-close"><i class="fas fa-times"></i></button>
  `;
  
  // Create 3D canvas container
  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'viewer-3d-canvas-container';
  
  // Create product info section
  const productInfo = document.createElement('div');
  productInfo.className = 'viewer-3d-product-info';
  
  // Assemble the 3D viewer elements
  viewerPanel.appendChild(viewerHeader);
  viewerPanel.appendChild(canvasContainer);
  viewerPanel.appendChild(productInfo);
  
  viewerContainer.appendChild(viewerPanel);
  
  // Add to the document
  document.body.appendChild(viewerContainer);
  
  // Set up event listeners
  setup3DViewerEventListeners();
}

/**
 * Set up event listeners for 3D viewer interactions
 */
function setup3DViewerEventListeners() {
  // Get 3D viewer elements
  const viewerPanel = document.querySelector('.viewer-3d-panel');
  const closeButton = document.querySelector('.viewer-3d-close');
  
  // Close 3D viewer when close button is clicked
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      viewerPanel.classList.remove('open');
      setTimeout(() => {
        document.querySelector('.viewer-3d-container').style.display = 'none';
      }, 300);
    });
  }
}

/**
 * Add "View in 3D" buttons to product cards
 */
function addViewIn3DButtons() {
  // Get all product cards
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    // Check if button already exists
    if (card.querySelector('.view-3d-btn')) {
      return;
    }
    
    // Get product ID and name
    const productId = card.dataset.productId;
    const productName = card.querySelector('.product-name').textContent;
    
    // Create button
    const viewButton = document.createElement('button');
    viewButton.className = 'view-3d-btn';
    viewButton.innerHTML = '<i class="fas fa-cube"></i> View in 3D';
    
    // Add click event
    viewButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      open3DViewer(productId, productName);
    });
    
    // Add button to card
    const cardActions = card.querySelector('.product-actions') || card.querySelector('.product-card-footer');
    if (cardActions) {
      cardActions.appendChild(viewButton);
    } else {
      card.appendChild(viewButton);
    }
  });
}

/**
 * Open the 3D viewer for a specific product
 * @param {string} productId - The product ID
 * @param {string} productName - The product name
 */
function open3DViewer(productId, productName) {
  // Show 3D viewer container
  const viewerContainer = document.querySelector('.viewer-3d-container');
  const viewerPanel = document.querySelector('.viewer-3d-panel');
  const canvasContainer = document.querySelector('.viewer-3d-canvas-container');
  const productInfo = document.querySelector('.viewer-3d-product-info');
  
  if (!viewerContainer || !viewerPanel || !canvasContainer || !productInfo) {
    console.error('3D viewer elements not found');
    return;
  }
  
  // Clear previous content
  canvasContainer.innerHTML = '';
  productInfo.innerHTML = `<h4>${productName}</h4><p>Rotate the model using your mouse. Zoom with the scroll wheel.</p>`;
  
  // Show the viewer
  viewerContainer.style.display = 'flex';
  setTimeout(() => {
    viewerPanel.classList.add('open');
  }, 10);
  
  // Create 3D scene
  create3DScene(canvasContainer, productId);
}

/**
 * Create a 3D scene for a product
 * @param {HTMLElement} container - The container element for the 3D canvas
 * @param {string} productId - The product ID
 */
function create3DScene(container, productId) {
  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    container.innerHTML = '<p>3D viewer is loading. Please try again in a moment.</p>';
    return;
  }
  
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Add orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Load appropriate 3D model based on product ID
  loadProductModel(scene, productId);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
}

/**
 * Load a 3D model for a product
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {string} productId - The product ID
 */
function loadProductModel(scene, productId) {
  // For this example, we'll create basic geometric shapes
  // In a real application, you would load actual 3D models (GLB/GLTF)
  
  let geometry;
  let material;
  
  // Create different geometries based on product ID
  switch (productId) {
    case '1': // Smartphone
      geometry = new THREE.BoxGeometry(2, 4, 0.2);
      material = new THREE.MeshPhongMaterial({ color: 0x000000 });
      break;
    case '2': // Laptop
      geometry = new THREE.BoxGeometry(3, 0.2, 2);
      material = new THREE.MeshPhongMaterial({ color: 0x888888 });
      break;
    case '3': // Headphones
      // Create headband
      const headband = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.1, 16, 100, Math.PI),
        new THREE.MeshPhongMaterial({ color: 0x333333 })
      );
      headband.rotation.x = Math.PI;
      scene.add(headband);
      
      // Create ear cups
      const leftCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
      );
      leftCup.position.set(-1, 0, 0);
      leftCup.rotation.z = Math.PI / 2;
      scene.add(leftCup);
      
      const rightCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
      );
      rightCup.position.set(1, 0, 0);
      rightCup.rotation.z = Math.PI / 2;
      scene.add(rightCup);
      return;
    case '4': // Coffee Maker
      // Create base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 1.5),
        new THREE.MeshPhongMaterial({ color: 0x333333 })
      );
      base.position.y = -1;
      scene.add(base);
      
      // Create body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 1),
        new THREE.MeshPhongMaterial({ color: 0x888888 })
      );
      body.position.y = 0.5;
      scene.add(body);
      
      // Create top
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.3, 0.8),
        new THREE.MeshPhongMaterial({ color: 0x333333 })
      );
      top.position.y = 1.65;
      scene.add(top);
      return;
    case '5': // Backpack
      geometry = new THREE.BoxGeometry(2, 3, 1);
      material = new THREE.MeshPhongMaterial({ color: 0x2244aa });
      break;
    case '6': // Shoes
      // Create shoe base
      const shoeBase = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 1),
        new THREE.MeshPhongMaterial({ color: 0xdddddd })
      );
      scene.add(shoeBase);
      
      // Create shoe top
      const shoeTop = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 1),
        new THREE.MeshPhongMaterial({ color: 0x2244aa })
      );
      shoeTop.position.y = 0.65;
      shoeTop.position.z = -0.2;
      scene.add(shoeTop);
      return;
    default:
      // Default cube
      geometry = new THREE.BoxGeometry(2, 2, 2);
      material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
  }
  
  // Create mesh and add to scene
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}