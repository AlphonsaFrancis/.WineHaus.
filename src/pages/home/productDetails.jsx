


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import './product-detail.css';
// import Navbar from '../../components/Navbar';

// const ProductDetail = () => {
//   const { id } = useParams(); // Get the product ID from the URL
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState({});
//   const [brands, setBrands] = useState({});
//   const [countries, setCountries] = useState({});
//   const [materials, setMaterials] = useState({});
//   const token = localStorage.getItem('authToken');

//   const BASE_URL = 'http://127.0.0.1:8000';

//   useEffect(() => {
//     // Fetch product details
//     axios.get(`http://127.0.0.1:8000/api/v1/products/details/${id}/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(response => {
//         setProduct(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         setError(error.message);
//         setLoading(false);
//       });

//     // Fetch category data
//     axios.get('http://127.0.0.1:8000/api/v1/products/category-list/', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(response => {
//         const categoryMap = response.data.reduce((acc, category) => {
//           acc[category.id] = category.name;
//           return acc;
//         }, {});
//         setCategories(categoryMap);
//       });

//     // Fetch brand data
//     axios.get('http://127.0.0.1:8000/api/v1/products/brand-list/', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(response => {
//         const brandMap = response.data.reduce((acc, brand) => {
//           acc[brand.brand_id] = brand.name;
//           return acc;
//         }, {});
//         setBrands(brandMap);
//       });

//     // Fetch country data
//     axios.get('http://127.0.0.1:8000/api/v1/products/country-list/', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(response => {
//         const countryMap = response.data.reduce((acc, country) => {
//           acc[country.country_id] = country.name;
//           return acc;
//         }, {});
//         setCountries(countryMap);
//       });

//     // Fetch material data
//     axios.get('http://127.0.0.1:8000/api/v1/products/madeof-list/', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(response => {
//         const materialMap = response.data.reduce((acc, material) => {
//           acc[material.madeof_id] = material.name;
//           return acc;
//         }, {});
//         setMaterials(materialMap);
//       });

//   }, [id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!product) {
//     return <div>Product not found</div>;
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="product-detail-page">
//         {product && (
//           <>
//             <nav className="product-detail-breadcrumb">
//               <a href="/products">Home</a> / {categories[product.category]} / {product.name}
//             </nav>

//             <div className="product-detail-container">
//               <div className="product-detail-image-container">
//                 <img
//                   src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/400'}
//                   alt={product.name}
//                   className="product-detail-image"
//                 />
//               </div>
//               <div className="product-detail-info">
//                 <h1 className="product-detail-name">{product.name}</h1>
//                 <p className="product-detail-price">₹ {product.price}</p>
//                 <p className="product-detail-description">{product.description}</p>
//                 <p className="product-detail-brand"><strong>Brand:</strong> {brands[product.brand]}</p>
//                 <p className="product-detail-category"><strong>Category:</strong> {categories[product.category]}</p>
//                 <p className="product-detail-material"><strong>Made Of:</strong> {materials[product.made_of]}</p>
//                 <p className="product-detail-country"><strong>Country:</strong> {countries[product.country]}</p>
//                 <p className="product-detail-stock"><strong>In Stock:</strong> {product.stock_quantity}</p>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './product-detail.css';
import Navbar from '../../components/Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [countries, setCountries] = useState({});
  const [materials, setMaterials] = useState({});
  const token = localStorage.getItem('authToken');

  const BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/products/details/${id}/`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });

    axios.get('http://127.0.0.1:8000/api/v1/products/category-list/')
      .then(response => {
        const categoryMap = response.data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        setCategories(categoryMap);
      });

    axios.get('http://127.0.0.1:8000/api/v1/products/brand-list/')
      .then(response => {
        const brandMap = response.data.reduce((acc, brand) => {
          acc[brand.brand_id] = brand.name;
          return acc;
        }, {});
        setBrands(brandMap);
      });

    axios.get('http://127.0.0.1:8000/api/v1/products/country-list/')
      .then(response => {
        const countryMap = response.data.reduce((acc, country) => {
          acc[country.country_id] = country.name;
          return acc;
        }, {});
        setCountries(countryMap);
      });

    axios.get('http://127.0.0.1:8000/api/v1/products/madeof-list/')
      .then(response => {
        const materialMap = response.data.reduce((acc, material) => {
          acc[material.madeof_id] = material.name;
          return acc;
        }, {});
        setMaterials(materialMap);
      });

  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <div>
      <Navbar/>
     
      <div className="product-detail-page">
        {product && (
          <>
            <nav className="product-detail-breadcrumb">
              <a href="/products">Home</a> / {categories[product.category]} / {product.name}
            </nav>
  
            <div className="product-detail-container">
              <div className="product-detail-image-container">
                <img
                  src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="product-detail-image"
                />
              </div>
              <div className="product-detail-info">
                <h1 className="product-detail-name">{product.name}</h1>
                <p className="product-detail-price">₹ {product.price}</p>
                <p className="product-detail-description">{product.description}</p>
                <p className="product-detail-brand"><strong>Brand:</strong> {brands[product.brand]}</p>
                <p className="product-detail-category"><strong>Category:</strong> {categories[product.category]}</p>
                <p className="product-detail-material"><strong>Made Of:</strong> {materials[product.made_of]}</p>
                <p className="product-detail-country"><strong>Country:</strong> {countries[product.country]}</p>
                <p className="product-detail-stock"><strong>In Stock:</strong> {product.stock_quantity}</p>
                <div className="product-detail-actions">
                  <button className="add-to-cart-button">Add to Cart</button>
                  <button className="wishlist-button">Wishlist</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    
  );
}  

export default ProductDetail;
