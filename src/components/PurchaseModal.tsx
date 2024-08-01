import React, { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    quantity: number;
    imageUrl: string;
    price: number;
    description: string;
  }
  
  interface Seller {
    id: string;
    name: string;
  }
  
  interface PurchaseModalProps {
    product: Product;
    onClose: () => void;
    onPurchase: (product: Product, quantity: number, sellerId: string) => void;
  }

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch('/api/sellers');
        const data = await response.json();
        setSellers(data);
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };

    fetchSellers();
  }, []);

  const handlePurchase = () => {
    if (quantity > 0 && quantity <= product.quantity && selectedSeller) {
      onPurchase(product, quantity, selectedSeller);
      onClose();
    } else {
      alert('Invalid quantity or seller');
    }
  };

  return (
    <div
      id="progress-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5">
            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
              Purchase Product
            </h3>
            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="seller"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select Seller
              </label>
              <select
                id="seller"
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              >
                <option value="">Select a seller</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={handlePurchase}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Purchase
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
