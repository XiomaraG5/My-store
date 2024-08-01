import { useState, useEffect } from 'react';
import PurchaseModal from './PurchaseModal'; // Asegúrate de que la ruta es correcta

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  imageUrl: string;
  price: number;
  description: string;
}

interface User {
  id: string;
  role: string;
}

export default function ProductList({ onEdit, user }: { onEdit: (product: Product) => void; user: User }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);
console.log('====================================');
console.log(products);
console.log('====================================');
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to remove the product?")) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        setProducts(products.filter(product => product.id !== id));
        alert("The product was removed")
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handlePurchase = async (product: Product, quantity: number, sellerId: string) => {
    if (confirm("Do you want to purchase this product?")) {
      try {
        const updatedProduct = { ...product, quantity: product.quantity - quantity };
  
        
        const response = await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        });
  
        if (!response.ok) {
          throw new Error('Error updating product');
        }
  
       
        const saleResponse = await fetch('/api/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity,
            productId: product.id,
            userId: user.id, 
            sellerId: Number(sellerId), 
          }),
        });
  
        if (!saleResponse.ok) {
          throw new Error('Error creating sale');
        }
        
        setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
        alert("Thank you for purchasing")
      } catch (error) {
        console.error('Error purchasing product:', error);
      }
    }
  };
  

  return (
    <div>
      <h1>Product List</h1>
      <ul className="flex flex-wrap gap-3 items-stretch justify-center p-10">
        {products.map(product => (
          <li key={product.id} className="w-80 flex flex-col items-stretch justify-between bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img className="rounded-t-lg h-96" src={product.imageUrl} alt="product image" />
            <div className="px-5 flex flex-col items-stretch justify-stretch">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{product.price}</span>
                <span className="text-lg text-gray-900 dark:text-white">Unit: {product.quantity}</span>
              </div>
              <p className="text-lg text-gray-900 dark:text-white text-wrap">{product.description}</p>
            </div>
            <div className='flex w-full gap-4 p-1'>
                {user.role === "seller" &&
                    <button className="text-white w-full bg-gradient-to-br from-violet-600 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-violet-800 dark:focus:ring-violet-900 font-medium rounded-lg text-basem h-12 
                      align-bottom text-center " onClick={() => handleDelete(product.id)}>
                        Delete
                    </button>
                  }
                <button className="text-white w-full bg-gradient-to-br from-violet-600 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-violet-800 dark:focus:ring-violet-900 font-medium rounded-lg text-basem h-12 align-bottom text-center"
                  onClick={() => {
                    if (user.role === "seller") {
                      onEdit(product);
                    } else {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }
                  }}
                >
                  {user.role === "seller" ? "Edit" : "Purchase"}
                </button>
            </div>
          </li>
        ))}
      </ul>
      {showModal && selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
}
