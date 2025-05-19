import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MorphingScene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    
    // Update renderer size
    const updateSize = () => {
      if (!canvasRef.current) return;
      const { clientWidth: width, clientHeight: height } = canvasRef.current;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Append canvas
    canvasRef.current.appendChild(renderer.domElement);

    // Central morphing blob
    const centralBlob = createMorphingBlob();
    scene.add(centralBlob);

    // Create satellite objects
    const satelliteObjects: THREE.Object3D[] = [];
    const satelittes = createSatelliteObjects();
    satelliteObjects.push(...satelittes);
    satelittes.forEach(obj => scene.add(obj));

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xfdfbd4, 0.3);
    scene.add(ambientLight);

    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(1, 1, 2);
    scene.add(dirLight);

    // Animation loop
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame += 0.005;

      // Animate central blob - subtle pulsing and rotation
      if (centralBlob) {
        centralBlob.rotation.x = Math.sin(frame * 0.4) * 0.1;
        centralBlob.rotation.y += 0.002;
        centralBlob.scale.set(
          1 + Math.sin(frame) * 0.04,
          1 + Math.sin(frame * 1.3) * 0.04,
          1 + Math.sin(frame * 0.7) * 0.04
        );
      }
      
      // Animate satellite objects
      satelliteObjects.forEach((obj, i) => {
        const speed = 0.2 + (i % 5) * 0.05;
        const radius = 2 + (i % 3);
        
        // Orbit around the central object
        obj.position.x = Math.cos(frame * speed) * radius;
        obj.position.y = Math.sin(frame * speed) * radius * 0.6;
        obj.position.z = Math.sin(frame * speed * 0.7) * (radius * 0.3);
        
        // Rotate the object itself
        obj.rotation.x += 0.003 * (i % 3 + 1);
        obj.rotation.y += 0.002 * (i % 2 + 1);
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // GSAP ScrollTrigger setup for scroll-based transformations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: canvasRef.current,
        start: "top top",
        end: "bottom center",
        scrub: 1
      }
    });

    // Morph the central object on scroll
    tl.to(centralBlob.position, {
      x: -2,
      y: -1,
      z: -1,
      scale: 0.5,
      duration: 3,
      ease: "power2.inOut"
    })
    .to(camera.position, {
      x: 2,
      y: 1,
      z: 7,
      duration: 3,
      ease: "power1.inOut"
    }, "<");

    // Change camera angle on scroll
    tl.to(camera.rotation, {
      x: -0.2,
      y: 0.2,
      duration: 3,
      ease: "power1.inOut"
    }, "<");

    // Satellite objects transition
    satelliteObjects.forEach((obj, i) => {
      tl.to(obj.position, {
        x: obj.position.x * (i % 2 === 0 ? 3 : -3),
        y: obj.position.y * (i % 3 === 0 ? 2 : -2),
        z: obj.position.z - (i % 5),
        duration: 3,
        ease: "power1.inOut"
      }, "<" + (i * 0.1));
    });
    
    // Helper function to create morphing blob
    function createMorphingBlob() {
      // Create an icosahedron geometry as the base
      const geometry = new THREE.IcosahedronGeometry(1.2, 3);
      
      // Create noise for vertices to create organic look
      const positionAttribute = geometry.getAttribute('position');
      const vertices = [];
      
      // Store original vertices for animation
      for(let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        
        // Add slight noise to vertex
        const noise = (Math.random() - 0.5) * 0.2;
        positionAttribute.setXYZ(i, x + noise, y + noise, z + noise);
        
        // Store original for animation reference
        vertices.push({ x, y, z });
      }
      
      // Material with subtle gradient
      const material = new THREE.MeshPhongMaterial({
        color: 0xfdfbd4,
        specular: 0xffffff,
        shininess: 20,
        transparent: true,
        opacity: 0.6,
        flatShading: true
      });
      
      const blob = new THREE.Mesh(geometry, material);
      return blob;
    }
    
    // Helper function to create satellite objects
    function createSatelliteObjects() {
      const objects: THREE.Object3D[] = [];
      const geometries = [
        new THREE.TorusGeometry(0.5, 0.2, 16, 32),
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.TetrahedronGeometry(0.5, 0),
        new THREE.RingGeometry(0.3, 0.5, 16)
      ];
      
      // Create a few satellite objects
      for (let i = 0; i < 6; i++) {
        const geometry = geometries[i % geometries.length];
        const material = new THREE.MeshPhongMaterial({
          color: 0xfdfbd4,
          transparent: true,
          opacity: 0.4,
          wireframe: i % 3 === 0,
          side: THREE.DoubleSide
        });
        
        const object = new THREE.Mesh(geometry, material);
        
        // Initial positions
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2 + (i % 3);
        object.position.x = Math.cos(angle) * radius;
        object.position.y = Math.sin(angle) * radius * 0.6;
        object.position.z = (Math.random() - 0.5) * 2;
        
        // Scale variations
        const scale = 0.5 + Math.random() * 0.5;
        object.scale.set(scale, scale, scale);
        
        objects.push(object);
      }
      
      return objects;
    }
    
    // Cleanup
    return () => {
      if (canvasRef.current) {
        if (canvasRef.current.contains(renderer.domElement)) {
          canvasRef.current.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener('resize', updateSize);
      
      // Kill ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Dispose resources
      if (centralBlob) {
        if (centralBlob.geometry) centralBlob.geometry.dispose();
        if (centralBlob.material instanceof THREE.Material) {
          centralBlob.material.dispose();
        }
      }
      
      satelliteObjects.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) {
            obj.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={canvasRef} className="w-full h-full absolute inset-0 flex items-center justify-center">
      {/* Three.js canvas will be appended here */}
    </div>
  );
}
