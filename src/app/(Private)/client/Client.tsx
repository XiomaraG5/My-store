'use client'

import ProductList from '@/components/ProductList';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

const Client = ({user}:{user:any}) => {
   
    const [isEditing, setIsEditing] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
 
   const handleEdit = (product:any) => {
    setProductToEdit(product);
    setIsEditing(true);
  };
  return (
    <div>
      <ProductList onEdit={handleEdit} user={user}/>
    </div>
  )
}

export default Client