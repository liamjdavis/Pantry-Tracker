"use client";

import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { db } from './firebase.js';

export default function Home() {
  const [items, setItems] = useState([]); // Initialize with an empty array
  const [total, setTotal] = useState(0); // Initialize total with 0
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const nameRef = useRef(null);
  const quantityRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const itemsList = [];
        let totalQuantity = 0;
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          itemsList.push({ id: doc.id, ...item });
          totalQuantity += item.quantity;
        });
        setItems(itemsList);
        setTotal(totalQuantity);
      } catch (e) {
        console.error("Error fetching items: ", e);
      }
    };

    fetchItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const newItem = { 
      name: nameRef.current.value, 
      quantity: parseInt(quantityRef.current.value) 
    };
    try {
      const docRef = await addDoc(collection(db, "items"), newItem);
      console.log("Document written with ID: ", docRef.id);
      setItems([...items, { id: docRef.id, ...newItem }]); // Update the state with the new item
      setTotal(total + newItem.quantity); // Update the total quantity
      nameRef.current.value = ''; // Clear the name input
      quantityRef.current.value = ''; // Clear the quantity input
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const deleteItem = async (id, quantity) => {
    try {
      await deleteDoc(doc(db, "items", id));
      setItems(items.filter(item => item.id !== id));
      setTotal(total - quantity);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }

  const clearList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      setItems([]);
      setTotal(0);
    } catch (e) {
      console.error("Error clearing list: ", e);
    }
  }

  const incrementQuantity = async (id, quantity) => {
    try {
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, { quantity: quantity + 1 });
      setItems(items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      setTotal(total + 1);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }

  const decrementQuantity = async (id, quantity) => {
    if (quantity > 1) {
      try {
        const itemRef = doc(db, "items", id);
        await updateDoc(itemRef, { quantity: quantity - 1 });
        setItems(items.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item));
        setTotal(total - 1);
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    } else if (quantity === 1) {
      deleteItem(id, quantity);
    }
  }

  // Filter items based on search query
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className='text-4xl p-4 text-center'>Pantry Tracker</h1>

        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className="grid grid-cols-6 " onSubmit={addItem}>
            <input className='col-span-3 p-3 border' type="text" name="name" placeholder="Enter Item" ref={nameRef} required />
            <input className='col-span-2 p-3 border' type="number" name="quantity" placeholder="Enter Quantity" ref={quantityRef} required />
            <button className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl' type="submit">+</button>
          </form>

          {/* Search Input */}
          <div className="mt-4">
            <input
              className='p-3 border w-1/4' // Adjust width here
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul>
            {filteredItems.map((item) => (
              <li key={item.id} className='my-4 w-full flex justify-between items-center'>
                <div className='p-4 w-full flex justify-between text-white'>
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
                <div className='flex items-center'>
                  <button className='text-white mx-2' onClick={() => incrementQuantity(item.id, item.quantity)}>+</button>
                  <button className='text-white mx-2' onClick={() => decrementQuantity(item.id, item.quantity)}>-</button>
                  <button className='text-white mx-2' onClick={() => deleteItem(item.id, item.quantity)}>X</button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className='mt-4 text-white'>
            <span>Total Quantity: {total}</span>
          </div>

          <button className='mt-4 text-white bg-red-600 hover:bg-red-700 p-3 text-xl' onClick={clearList}>Clear List</button>
        </div>
      </div>
    </main>
  );
}
