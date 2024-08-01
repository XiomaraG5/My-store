'use client'
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import React, { useState } from "react";

interface Product {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  imageUrl: string;
  price: number;
  description: string;
}

function Seller({user}:{user:any}) {
    
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleSave = async (product: Product) => {
    console.log('====================================');
    console.log(product);
    console.log('====================================');
    const method = product.id !==undefined ? 'PUT' : 'POST';
    const url = product.id ? `/api/products/${product.id}` : '/api/products';
    
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    setShowModal(false);
  }

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Add New Product</button>
      <ProductList onEdit={handleEdit} user={user}/>
      {showModal && (
        <ProductForm
          product={currentProduct}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default Seller;
