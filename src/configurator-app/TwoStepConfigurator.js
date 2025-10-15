// TwoStepConfigurator.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductConfigurator.css";

const TwoStepConfigurator = () => {
  const [step, setStep] = useState(1);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

    // Products array (each product stores category/subcategory/color via id)
    const [products, setProducts] = useState([
      {
        id: 1,
        name: 'Product 1',
        category: '',
        subcategory: '',
        color: '',
        squareFootage: 500,
        city: '',
        isActive: true,
        previewImage: null // can be updated from option preview fields
      }
    ]);
  
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [activeProductTab, setActiveProductTab] = useState(1);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [currentInfo, setCurrentInfo] = useState({
      title: '',
      description: '',
      image: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // -- Category / Subcategory / Color data (with image/preview fields & multipliers/baseRate)
    // Main categories
    const categories = [
      {
        id: 'cat1',
        name: 'Flutes',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
        color: '#FF6B6B',
        preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        description: '## Flutes Package\n\nFluted panels provide elegant vertical lines that create visual interest and depth. Perfect for feature walls and modern interiors.',
        baseRate: 900,
      },
      {
        id: 'cat2',
        name: 'Louvers',
        image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=150&h=150&fit=crop',
        color: '#4ECDC4',
        preview: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
        description: '## Louvers Package\n\nLouvered panels offer adjustable slats for ventilation control while maintaining privacy and aesthetic appeal.',
        baseRate: 700,
      },
      {
        id: 'cat3',
        name: 'Solid Panels',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
        color: '#45B7D1',
        preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        description: '## Solid Panels Package\n\nSolid panels provide a clean, seamless look with excellent durability and weather resistance.',
        baseRate: 500,
      },
      {
        id: 'cat4',
        name: 'Shingles',
        image: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=150&h=150&fit=crop',
        color: '#96CEB4',
        preview: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=400&h=300&fit=crop',
        description: '## Shingles Package\n\nShingle-style panels create a traditional, textured appearance with overlapping elements.',
        baseRate: 300,
      },
      {
        id: 'cat5',
        name: 'Planks',
        image: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=150&h=150&fit=crop',
        color: '#FFA726',
        preview: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=400&h=300&fit=crop',
        description: '## Planks Package\n\nPlank panels offer a linear, wood-like appearance with various width options for different visual effects.',
        baseRate: 100,
      }
    ];
  
    // Subcategories organized by main category with images
    const subcategories = {
      cat1: [ // Flutes subcategories
        {
          id: 'sub1_flutes',
          name: 'Angled',
          description: 'Standard depth flutes for general applications',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          multiplier: 1.1,
        },
        {
          id: 'sub2_flutes',
          name: 'Block spaced',
          description: 'Deep profile flutes for dramatic shadow effects',
          image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
          multiplier: 1.2,
        },
        {
          id: 'sub3_flutes',
          name: 'Triangle',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
          multiplier: 1.4,
        },
  
        {
          id: 'sub4_flutes',
          name: 'Block',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub5_flutes',
          name: 'Circles',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub6_flutes',
          name: 'Step',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub7_flutes',
          name: 'Grooves',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub8_flutes',
          name: 'Mixed block',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub9_flutes',
          name: 'Concave',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub10_flutes',
          name: 'Mini block',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub11_flutes',
          name: 'Wave',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub12_flutes',
          name: 'Small block',
          description: 'Small, delicate flutes for subtle texture',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
  
  
      ],
      cat2: [ // Louvers subcategories
        {
          id: 'sub1_louvers',
          name: 'Square',
          description: 'Stationary louver blades for consistent appearance',
          image: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=400&h=300&fit=crop'
        },
        {
          id: 'sub2_louvers',
          name: 'Concave wide',
          description: 'Adjustable blades for ventilation control',
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=300&fit=crop'
        },
        {
          id: 'sub3_louvers',
          name: 'Concave slim',
          description: 'Ornamental louver designs',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          id: 'sub4_louvers',
          name: 'Slim',
          description: 'Ornamental louver designs',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub5_louvers',
          name: 'Wide',
          description: 'Ornamental louver designs',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub6_louvers',
          name: 'Convex',
          description: 'Ornamental louver designs',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub7_louvers',
          name: 'Trapezoid',
          description: 'Ornamental louver designs',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
  
        {
          id: 'sub8_louvers',
          name: 'Round',
          description: 'Ornamental louver designs',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
      ],
      cat3: [ // Solid Panels subcategories
  
      ],
      cat4: [ // Shingles subcategories
        {
          id: 'sub1_shingles',
          name: 'Hexagon',
          description: 'Classic overlapping shingle pattern',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'
        },
        {
          id: 'sub2_shingles',
          name: 'Circle',
          description: 'Contemporary shingle designs',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
        },
        {
          id: 'sub3_shingles',
          name: 'Triangle',
          description: 'Decorative scalloped edge shingles',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        }
      ],
      cat5: [ // Planks subcategories
  
      ]
    };
  
    // Colors organized by main category with images
    const colors = {
      cat1: [ // Flutes colors
        {
          id: 'color1_flutes',
          name: 'Corten',
          color: '#A52A2A',
          description: 'Rustic weathered steel appearance',
          image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop',
          multiplier: 1.4,
        },
        {
          id: 'color2_flutes',
          name: 'Wood',
          color: '#8B4513',
          description: 'Natural wood grain finish',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
        },
        {
          id: 'color3_flutes',
          name: 'Copper',
          color: '#B87333',
          description: 'Warm metallic copper finish',
          image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=300&fit=crop'
        },
        {
          id: 'color4_flutes',
          name: 'Patina',
          color: '#6B8E23',
          description: 'Aged green patina effect',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'
        },
        {
          id: 'color5_flutes',
          name: 'Grey',
          color: '#808080',
          description: 'Modern neutral grey',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        }
      ],
      cat2: [ // Louvers colors
        {
          id: 'color1_louvers',
          name: 'Corten',
          color: '#A52A2A',
          description: 'Rustic weathered steel',
          image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop'
        },
        {
          id: 'color2_louvers',
          name: 'Black',
          color: '#000000',
          description: 'Matte black finish',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
        {
          id: 'color3_louvers',
          name: 'White',
          color: '#FFFFFF',
          description: 'Clean white finish',
          image: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=400&h=300&fit=crop'
        },
        {
          id: 'color4_louvers',
          name: 'Bronze',
          color: '#CD7F32',
          description: 'Rich bronze metallic',
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=300&fit=crop'
        }
      ],
      cat3: [ // Solid Panels colors
        {
          id: 'color1_solid',
          name: 'Corten',
          color: '#A52A2A',
          description: 'Weathered steel look',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          id: 'color2_solid',
          name: 'Charcoal',
          color: '#36454F',
          description: 'Dark charcoal grey',
          image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop'
        },
        {
          id: 'color3_solid',
          name: 'Titanium',
          color: '#878681',
          description: 'Metallic titanium finish',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
        },
        {
          id: 'color4_solid',
          name: 'Onyx',
          color: '#0F0F0F',
          description: 'Deep black onyx',
          image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=300&fit=crop'
        }
      ],
      cat4: [ // Shingles colors
        {
          id: 'color1_shingles',
          name: 'Corten',
          color: '#A52A2A',
          description: 'Traditional weathered look',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'
        },
        {
          id: 'color2_shingles',
          name: 'Cedar',
          color: '#C19A6B',
          description: 'Natural cedar tone',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
        },
        {
          id: 'color3_shingles',
          name: 'Slate',
          color: '#708090',
          description: 'Slate grey appearance',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
          id: 'color4_shingles',
          name: 'Terracotta',
          color: '#E2725B',
          description: 'Warm terracotta red',
          image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop'
        }
      ],
      cat5: [ // Planks colors
        {
          id: 'color1_planks',
          name: 'Corten',
          color: '#A52A2A',
          description: 'Rustic steel finish',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        },
        {
          id: 'color2_planks',
          name: 'Walnut',
          color: '#773F1A',
          description: 'Rich walnut wood tone',
          image: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1583845112207-683c6d38c0dd?w=400&h=300&fit=crop'
        },
        {
          id: 'color3_planks',
          name: 'Oak',
          color: '#DFBE8A',
          description: 'Natural oak appearance',
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=300&fit=crop'
        },
        {
          id: 'color4_planks',
          name: 'Ebony',
          color: '#555D50',
          description: 'Dark ebony finish',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
          preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        }
      ]
    };
  
    // India states only for "city" field (user asked to show India and states)
    const indianStates = [
      'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh',
      'Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha',
      'Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttarakhand','Uttar Pradesh','West Bengal','Delhi'
    ];
  
    // Make.com webhook URL (user-provided)
    const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/sblgycvussfeiso7pbhe4mkbw8ydfaby';
  
    // Helper: finders
    const getCategoryById = (id) => categories.find(c => c.id === id) || null;
    const getSubById = (catId, subId) => (subcategories[catId] || []).find(s => s.id === subId) || null;
    const getColorById = (catId, colorId) => (colors[catId] || []).find(c => c.id === colorId) || null;
    const getCategoryName = (id) => getCategoryById(id)?.name || 'Not selected';
    const getSubName = (product, subId) => getSubById(product.category, subId)?.name || 'Not selected';
    const getColorName = (product, colorId) => getColorById(product.category, colorId)?.name || 'Not selected';
  
    // Compose summary string (for configuration_summary field)
    const formatConfiguration = (productsList) => {
      return productsList.map((p, i) => {
        return `Product ${i+1}: ${getCategoryName(p.category)} | ${getSubName(p, p.subcategory)} | ${getColorName(p, p.color)} | ${p.squareFootage} sq ft | ${p.city || 'Not selected'}`;
      }).join('; ');
    };
  
    // Submit to Make.com (single payload)
    const submitLeadToMake = async (leadData) => {
      try {
        const res = await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return text;
      } catch (err) {
        console.error('Error submitting to Make.com:', err);
        throw err;
      }
    };
  
    // Estimate calculation
  const calculateEstimateForProduct = (product) => {
    if (!product || !product.category) return 0;
    const cat = getCategoryById(product.category);
    const sub = getSubById(product.category, product.subcategory);
    const color = getColorById(product.category, product.color);
  
    const base = cat?.baseRate || 800;
    const subMult = sub?.multiplier || 1.0;
    const colorMult = color?.multiplier || 1.0;
    const sqft = Number(product.squareFootage) || 0;
  
    const cost = Math.round(base * subMult * colorMult * sqft);
    return cost;
  };
  
    const calculateTotalEstimate = (productsList) => {
      return productsList.reduce((acc, p) => acc + calculateEstimateForProduct(p), 0);
    };
  
    // Convert an image URL to data URL (via fetch -> blob -> FileReader)
    const imageUrlToDataUrl = async (url) => {
      try {
        const resp = await fetch(url, { mode: 'cors' });
        const blob = await resp.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('imageUrlToDataUrl fallback for', url, err);
        // tiny transparent PNG placeholder (base64)
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQImWNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
      }
    };
  
  // Generate PDF with dark background and white text
  const generateAndDownloadPDF = async (leadData, productsList) => {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 50;
      let y = 50;
  
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Estimate Summary', pageW / 2, y, { align: 'center' });
      y += 30;
  
      // Personal details
      doc.setFontSize(11);
      doc.text(`Name: ${leadData.name}`, margin, y); y += 16;
      doc.text(`Phone: ${leadData.phone}`, margin, y); y += 16;
      doc.text(`Email: ${leadData.email}`, margin, y); y += 25;
  
      let total = 0;
  
      for (let i = 0; i < productsList.length; i++) {
        const p = productsList[i];
        const cat = getCategoryById(p.category);
        const sub = getSubById(p.category, p.subcategory);
        const color = getColorById(p.category, p.color);
  
        const catImgUrl = p.categoryImage || cat?.preview || cat?.image || '';
        const subImgUrl = p.subcategoryImage || sub?.preview || sub?.image || '';
        const colorImgUrl = p.colorImage || color?.preview || color?.image || '';
  
        const estimate = calculateEstimateForProduct(p);
        total += estimate;
  
        doc.setFontSize(13);
        doc.text(`Product ${i + 1}`, margin, y);
        y += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageW - margin, y);
        y += 15;
  
        // Category
        if (catImgUrl) {
          const imgData = await imageUrlToDataUrl(catImgUrl);
          doc.addImage(imgData, 'JPEG', margin, y, 150, 90);
        }
        doc.setFontSize(11);
        doc.text(`Category: ${cat?.name || 'Not selected'}`, margin, y + 105);
        y += 120;
  
        // Subcategory
        if (subImgUrl) {
          const imgData = await imageUrlToDataUrl(subImgUrl);
          doc.addImage(imgData, 'JPEG', margin, y, 150, 90);
        }
        doc.text(`Subcategory: ${sub?.name || 'Not selected'}`, margin, y + 105);
        y += 120;
  
        // Color
        if (colorImgUrl) {
          const imgData = await imageUrlToDataUrl(colorImgUrl);
          doc.addImage(imgData, 'JPEG', margin, y, 150, 90);
        }
        doc.text(`Color: ${color?.name || 'Not selected'}`, margin, y + 105);
        y += 120;
  
        // Estimate
        doc.setFontSize(12);
        doc.setTextColor(40, 100, 180);
        doc.text(`Estimate: ₹ ${estimate.toLocaleString()}`, margin, y);
        y += 30;
  
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, pageW - margin, y);
        y += 25;
  
        // Page break if too long
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      }
  
      y += 10;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Grand Total Estimate: ₹ ${total.toLocaleString()}`, margin, y);
  
      const filename = `Metaguise estimate_${leadData.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Failed to generate PDF. See console for details.');
    }
  };
  
    // Handler for info modal (left image & right content)
    const handleInfoClick = (option, type, e) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentInfo({
        title: option.name,
        description: option.description || `${option.name} - ${type}`,
        image: option.preview || option.image || ''
      });
      setShowInfoModal(true);
    };
  
    const handleCloseModal = () => {
      setShowInfoModal(false);
      setCurrentInfo({ title: '', description: '', image: '' });
    };
  
    const formatDescription = (description) => {
      if (!description) return null;
      return description.split('\n').map((line, idx) => {
        if (line.startsWith('## ')) return <h4 key={idx} className="modal-subtitle">{line.replace('## ', '')}</h4>;
        if (line.startsWith('### ')) return <h5 key={idx} className="modal-section-title">{line.replace('### ', '')}</h5>;
        if (line.startsWith('- ')) return <div key={idx} className="modal-list-item"><span className="modal-bullet">•</span><span>{line.replace('- ', '')}</span></div>;
        if (line.trim() === '') return <br key={idx} />;
        return <p key={idx} className="modal-paragraph">{line}</p>;
      });
    };
  
    // Add / remove product
    const handleAddProduct = () => {
      const newProduct = {
        id: Date.now(),
        name: `Product ${products.length + 1}`,
        category: '',
        subcategory: '',
        color: '',
        squareFootage: 500,
        city: '',
        isActive: false,
        previewImage: null
      };
      setProducts([...products, newProduct]);
      setActiveProductTab(newProduct.id);
    };
  
    const handleRemoveProduct = (productId, e) => {
      e.stopPropagation();
      if (products.length === 1) { alert('You must have at least one product configuration.'); return; }
      const updated = products.filter(p => p.id !== productId);
      setProducts(updated);
      if (activeProductTab === productId) setActiveProductTab(updated[0].id);
      setSelectedOptions(prev => { const copy = { ...prev }; delete copy[productId]; return copy; });
    };
  
    const handleCategoryToggle = (categoryId) => {
      setActiveCategory(activeCategory === categoryId ? null : categoryId);
    };
  
    // Option selection (category/subcategory/color) - also store optional image urls into product for PDF
    const handleOptionSelect = (productId, type, optionId, previewImage) => {
      if (type === 'category') {
        // set category and clear subcategory/color
        setProducts(products.map(p => p.id === productId ? { ...p, category: optionId, subcategory: '', color: '', previewImage: previewImage || p.previewImage, categoryImage: previewImage || p.categoryImage } : p));
      } else if (type === 'subcategory') {
        setProducts(products.map(p => p.id === productId ? { ...p, subcategory: optionId, subcategoryImage: previewImage || p.subcategoryImage } : p));
      } else if (type === 'color') {
        setProducts(products.map(p => p.id === productId ? { ...p, color: optionId, colorImage: (getColorById(getCategoryById(p.category)?.id, optionId)?.preview) || p.colorImage } : p));
      }
  
      setSelectedOptions(prev => ({ ...prev, [productId]: { ...prev[productId], [type]: optionId } }));
    };
  
    const handleInputChange = (productId, field, value) => {
      setProducts(products.map(p => p.id === productId ? { ...p, [field]: value } : p));
    };
  
     const handlePersonalDetailsChange = (field, value) => {
      if (field === 'phoneNumber') {
        // Remove non-digits and limit to 10
        value = value.replace(/\D/g, '').slice(0, 10);
      }
      setPersonalDetails((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleTabClick = (productId) => setActiveProductTab(productId);
  
  
    // Submit: construct leadData matching user snippet (single webhook with full products array), send -> on success generate PDF
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      // Validate required personal details
  if (
    !personalDetails.fullName.trim() ||
    !personalDetails.phoneNumber.trim() ||
    !personalDetails.email.trim()
  ) {
    alert("Please fill in all required personal details (Name, Phone, Email).");
    setIsSubmitting(false);
    return;
  }
  
  // Validate product fields
  for (const p of products) {
    if (!p.squareFootage || !p.city) {
      alert("Please fill all required fields: square feet and city.");
      setIsSubmitting(false);
      return;
    }
  }
  
  
      try {
        const leadData = {
          name: personalDetails.fullName,
          phone: personalDetails.phoneNumber,
          email: personalDetails.email,
          configuration_summary: formatConfiguration(products),
          timestamp: new Date().toISOString(),
          submission_date: new Date().toLocaleDateString(),
          submission_time: new Date().toLocaleTimeString(),
          product_count: products.length,
          // keep the legacy top-level first product fields as your snippet had
          category: getCategoryName(products[0]?.category),
          subcategory: getSubName(products[0], products[0]?.subcategory),
          color: getColorName(products[0], products[0]?.color),
          square_feet: products[0]?.squareFootage || '',
          city: products[0]?.city || '',
          // complete_details with full product objects (names, images, ids, estimate)
          complete_details: {
            personal_details: personalDetails,
            products: products.map((product, index) => {
              const cat = getCategoryById(product.category);
              const sub = getSubById(product.category, product.subcategory);
              const col = getColorById(product.category, product.color);
              return {
                product_name: product.name,
                product_number: index + 1,
                category: cat ? cat.name : '',
                category_id: product.category || '',
                category_image: product.categoryImage || cat?.preview || cat?.image || '',
                subcategory: sub ? sub.name : '',
                subcategory_id: product.subcategory || '',
                subcategory_image: product.subcategoryImage || sub?.preview || sub?.image || '',
                color: col ? col.name : '',
                color_id: product.color || '',
                color_image: product.colorImage || col?.preview || col?.image || '',
                square_footage: product.squareFootage,
                city: product.city,
                estimate: calculateEstimateForProduct(product)
              };
            })
          }
        };
  
        // send single webhook with all products included
        await submitLeadToMake(leadData);
  
        // success
        alert('Configuration submitted successfully! Preparing PDF download...');
  
        // generate & download PDF using the images stored in complete_details.products
        await generateAndDownloadPDF(leadData, leadData.complete_details.products.map(p => ({
          // produce product objects compatible with calculateEstimateForProduct and pdf generator
          id: p.product_number,
          name: p.product_name,
          category: p.category_id,
          subcategory: p.subcategory_id,
          color: p.color_id,
          squareFootage: p.square_footage,
          city: p.city,
          // include direct image urls so PDF uses them
          categoryImage: p.category_image,
          subcategoryImage: p.subcategory_image,
          colorImage: p.color_image
        })));
  
            // Reset form after successful submission
      setPersonalDetails({
        fullName: '',
        phoneNumber: '',
        email: ''
      });
      
      setProducts([{
        id: 1,
        name: 'Product 1',
        category: '',
        subcategory: '',
        color: '',
        squareFootage: 500,
        city: '',
        isActive: true,
        previewImage: null
      }]);
      
      setActiveProductTab(1);
      setSelectedOptions({});
      setActiveCategory(null);
  
      } catch (err) {
        console.error('Submit error', err);
        alert('There was an error submitting your configuration. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    
   
  
    const getActiveProduct = () => products.find(p => p.id === activeProductTab) || products[0];
    const getPreviewImage = () => {
      const active = getActiveProduct();
      return active.previewImage || getCategoryById(active.category)?.preview || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop';
    };

  const handleNext = (e) => {
    e.preventDefault();
    if (
      !personalDetails.fullName.trim() ||
      !personalDetails.phoneNumber.trim() ||
      !personalDetails.email.trim()
    ) {
      alert("Please fill in all fields before continuing.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

// Animation variants (fade only, no slide)
const fadeVariants = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

  return (
 
       <div className="product-configurator-page py-4">
      <div className="container">
 

          <div
      style={{
        
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >

<AnimatePresence mode="wait">
       {step === 1 && (
  <motion.div
    key="step1"
    variants={fadeVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    style={{
      width: "100%",
      maxWidth: "1100px",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    {/* Header and title OUTSIDE the bordered box */}
    <header className="mb-3">
      <h1 className="display-4 fw-bold">Welcome to Metaguise Product Configurator</h1>
    </header>
   

    {/* Bordered box stays exactly the same as before */}
    <div
      className="card p-5 mt-5 shadow"
      style={{
        width: "100%",
        backgroundColor: "transparent",
        border: "2px solid white",
        color: "white",
        height:" 50vh",
        display:"flex",
        justifyContent:"space-between",
      }}
    >
         <h2 className="mb-4 fw-bold">Step 1: Your Details</h2>
      <form id="step1-form">
        <div className="row g-3 align-items-center text-center">
          {/* Full Name */}
          <div className="col-md-4">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-light text-center"
              value={personalDetails.fullName}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  fullName: e.target.value,
                })
              }
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Phone */}
          <div className="col-md-4">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control bg-dark text-white border-light text-center"
              pattern="[0-9]{10}"
              maxLength="10"
              value={personalDetails.phoneNumber}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              placeholder="10-digit number"
              required
            />
          </div>

          {/* Email */}
          <div className="col-md-4">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-light text-center"
              value={personalDetails.email}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  email: e.target.value,
                })
              }
              placeholder="Enter email"
              required
            />
          </div>
        </div>

    
      </form>
          <div className="d-flex justify-content-end mt-4">
      <button
    type="button"
    onClick={handleNext}
    className="btn btn-light btn-lg fw-bold px-4"
    style={{
      borderRadius: "30px",
      transition: "all 0.2s",
    }}
  >
    Next →
  </button>
        </div>
    </div>
  </motion.div>
)}
           {step === 2 && (
          <motion.div
            key="step2"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-100"
          >
            <div className="container py-4">
           

          
          <div className="product-configurator-page py-4">
      <div className="container">
        <header className="text-center mb-4">
          <h1 className="display-4 fw-bold">Welcome to Metaguise Product Configurator</h1>
        </header>

           <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-light" onClick={handleBack}>
                  ← Back
                </button>
                <h2 className="text-white mb-0">Step 2: Configure Your Products</h2>
                <div style={{ width: "90px" }}></div>
              </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body app-section">
            {/* Personal Details Table */}
           

            <div className="row g-4 mt-2">
              {/* Left Preview */}
              <div className="col-lg-6">
                <div className="card shadow-sm sticky-top preview-card">
                  <div className="card-body left-section">
                    <div className="preview-container">
                      <h3 className="card-title text-center mb-4">{getActiveProduct().name} Preview</h3>
                      <div className="preview-image mb-4">
                        <img src={getPreviewImage()} alt="Product Preview" className="img-fluid rounded shadow"
                             onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop'; }} />
                      </div>
                      <div className="preview-details">
                        <h4 className="border-bottom pb-2 mb-3">Configuration Details</h4>
                        <div className="row g-2">
                          <div className="col-12">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Category:</span>
                              <span className="text-muted">{getCategoryName(getActiveProduct().category)}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Subcategory:</span>
                              <span className="text-muted">{getSubName(getActiveProduct(), getActiveProduct().subcategory)}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Color:</span>
                              <span className="text-muted">{getColorName(getActiveProduct(), getActiveProduct().color)}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Square Footage:</span>
                              <span className="text-muted">{getActiveProduct().squareFootage} sq ft</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between py-2">
                              <span>City / State:</span>
                              <span className="text-muted">{getActiveProduct().city || 'Not selected'}</span>
                            </div>
                          </div>
                        </div>
                        <hr />
                     
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Configurator */}
              <div className="col-lg-6">
                <div className="card shadow-sm">
                  <div className="card-body right-app-section">
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {products.map(p => (
                        <div key={p.id} className="d-flex align-items-center">
                          <button className={`btn ${activeProductTab === p.id ? 'Add-product' : 'btn-outline-primary'} btn-sm position-relative`}
                                  onClick={() => handleTabClick(p.id)}>
                            {p.name}
                            {products.length > 1 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger remove-badge"
                                    onClick={(e) => handleRemoveProduct(p.id, e)} style={{ cursor: 'pointer', fontSize: '0.6rem' }}>
                                ×
                              </span>
                            )}
                          </button>
                        </div>
                      ))}
                      <button className="btn btn-success btn-sm" onClick={handleAddProduct}><i className="bi bi-plus-lg"></i> Add Product</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {products.map((product, index) => (
                        <div key={product.id} className={`product-section ${activeProductTab === product.id ? 'd-block' : 'd-none'}`}>
                          <div className="product-header mb-4">
                            <h2 className="h4 text-dark border-bottom pb-2">{product.name}</h2>
                          </div>

                          {/* Category */}
                          <div className="card mb-3">
                            <div className="card-header bg-light cursor-pointer" onClick={() => handleCategoryToggle(`${product.id}-category`)}>
                              <div className="d-flex justify-content-between align-items-center">
                                <span>{product.category ? getCategoryName(product.category) : 'Select Your Product'}</span>
                                <span>{activeCategory === `${product.id}-category` ? '−' : '+'}</span>
                              </div>
                            </div>
                            {activeCategory === `${product.id}-category` && (
                              <div className="card-body">
                                <div className="row g-2">
                                  {categories.map(category => (
                                    <div key={category.id} className="col-2">
                                      <div className={`card option-card ${product.category === category.id ? 'border-primary' : ''}`}
                                           onClick={() => handleOptionSelect(product.id, 'category', category.id, category.preview)}
                                           style={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                                        <div className="option-image rounded-top position-relative"
                                             style={{ backgroundImage: `url(${category.image})`, backgroundColor: category.color || '#eee', height: '80px', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                          <button className="btn btn-sm btn-outline-info position-absolute top-0 end-0 m-1 info-btn-overlay"
                                                  onClick={(e) => handleInfoClick(category, 'Category', e)}
                                                  onMouseDown={(e) => e.stopPropagation()} type="button"
                                                  style={{ width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)', border: '2px solid #0dcaf0', color: '#0dcaf0', fontWeight: 'bold' }}>
                                            i
                                          </button>
                                        </div>
                                        <div className="card-body text-center p-2">
                                          <small className="option-name">{category.name}</small>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Subcategory */}
                          <div className={`card mb-3 transition-section ${!product.category ? 'section-disabled' : ''}`}>
                            <div className={`card-header cursor-pointer ${!product.category ? 'bg-secondary text-muted' : 'bg-light'}`}
                                 onClick={() => product.category && handleCategoryToggle(`${product.id}-subcategory`)}>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className={!product.category ? 'text-muted' : ''}>
                                  {product.subcategory ? getSubName(product, product.subcategory) : `Select Your Type ${!product.category ? '(Select category first)' : ''}`}
                                </span>
                                <span className={!product.category ? 'text-muted' : ''}>{activeCategory === `${product.id}-subcategory` ? '−' : '+'}</span>
                              </div>
                            </div>
                            {activeCategory === `${product.id}-subcategory` && product.category && (
                              <div className="card-body">
                                <div className="row g-2">
                                  {(subcategories[product.category] || []).map(subcategory => (
                                    <div key={subcategory.id} className="col-2">
                                      <div className={`card option-card ${product.subcategory === subcategory.id ? 'border-primary' : ''}`}
                                           onClick={() => handleOptionSelect(product.id, 'subcategory', subcategory.id, subcategory.preview)}
                                           style={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                                        <div className="option-image rounded-top position-relative"
                                             style={{ backgroundImage: `url(${subcategory.image})`, height: '80px', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                          <button className="btn btn-sm btn-outline-info position-absolute top-0 end-0 m-1 info-btn-overlay"
                                                  onClick={(e) => handleInfoClick(subcategory, 'Subcategory', e)}
                                                  onMouseDown={(e) => e.stopPropagation()} type="button"
                                                  style={{ width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)', border: '2px solid #0dcaf0', color: '#0dcaf0', fontWeight: 'bold' }}>
                                            i
                                          </button>
                                        </div>
                                        <div className="card-body text-center p-2">
                                          <small className="option-name">{subcategory.name}</small>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Color */}
                          <div className={`card mb-3 transition-section ${!product.category ? 'section-disabled' : ''}`}>
                            <div className={`card-header cursor-pointer ${!product.category ? 'bg-secondary text-muted' : 'bg-light'}`}
                                 onClick={() => product.category && handleCategoryToggle(`${product.id}-color`)}>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className={!product.category ? 'text-muted' : ''}>
                                  {product.color ? getColorName(product, product.color) : `Select Your Color ${!product.category ? '(Select category first)' : ''}`}
                                </span>
                                <span className={!product.category ? 'text-muted' : ''}>{activeCategory === `${product.id}-color` ? '−' : '+'}</span>
                              </div>
                            </div>
                            {activeCategory === `${product.id}-color` && product.category && (
                              <div className="card-body">
                                <div className="row g-2">
                                  {(colors[product.category] || []).map(color => (
                                    <div key={color.id} className="col-2">
                                      <div className={`card option-card ${product.color === color.id ? 'border-primary' : ''}`}
                                           onClick={() => handleOptionSelect(product.id, 'color', color.id)}
                                           style={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                                        <div className="option-image rounded-top position-relative"
                                             style={{ backgroundImage: `url(${color.image})`, backgroundColor: color.color || '#eee', height: '80px', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                          <button className="btn btn-sm btn-outline-info position-absolute top-0 end-0 m-1 info-btn-overlay"
                                                  onClick={(e) => handleInfoClick(color, 'Color', e)}
                                                  onMouseDown={(e) => e.stopPropagation()} type="button"
                                                  style={{ width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)', border: '2px solid #0dcaf0', color: '#0dcaf0', fontWeight: 'bold' }}>
                                            i
                                          </button>
                                        </div>
                                        <div className="card-body text-center p-2">
                                          <small className="option-name">{color.name}</small>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Square Footage */}
                          <div className="mb-3">
                            <label className="form-label">Square Foot Area to Cover</label>
                            <input type="number" className="form-control" value={product.squareFootage}
                                   onChange={(e) => handleInputChange(product.id, 'squareFootage', e.target.value)} min="1" max="10000" required />
                          </div>

                          {/* City / State (India only) */}
                          <div className="mb-4">
                            <label className="form-label">City / State of Site</label>
                            <select className="form-select" value={product.city} onChange={(e) => handleInputChange(product.id, 'city', e.target.value)} required>
                              <option value="">Select a state</option>
                              {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                            </select>
                          </div>

                          {index < products.length - 1 && <hr className="my-4" />}
                        </div>
                      ))}

                      <button id="lead-button" type="submit" className="hover-button btn-lg w-100" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status"><span className="visually-hidden">Loading...</span></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            <span>Get An Estimate</span>
                          </>
                        )}
                      </button>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info modal with left image / right content */}
        {showInfoModal && (
          <div className="modal-backdrop-blur">
            <div className="modal-container-centered">
              <div className="modal-content modal-with-image">
                <div className="modal-header d-flex justify-content-between align-items-start">
                  <h5 className="modal-title">{currentInfo.title}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body d-flex gap-3" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {currentInfo.image && (
                    <div style={{ flex: '0 0 40%', minWidth: 180 }}>
                      <img src={currentInfo.image} alt={currentInfo.title} className="modal-image img-fluid rounded"
                           onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop'; }} />
                    </div>
                  )}
                  <div style={{ flex: '1 1 55%', minWidth: 200 }}>
                    {formatDescription(currentInfo.description)}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
     

      </div>
    </div>
    </div>
  );
};

export default TwoStepConfigurator;
