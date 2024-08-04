"use client";
import React from "react";
import {useState, useEffect} from 'react'
import { collection, doc, query, getDocs, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Typography, Box, Modal, Stack, TextField, Button } from "@mui/material";
import { firestore } from "./firebase";
import '../app/globals.css';
import TopContainer from "./components/topBar";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [totalItems, setTotalItems] = useState(0);
  const [category, setCategory] = useState("")
  const [filter, setFilter] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList);
    // Calculate total items
    const total = inventoryList.length;
    setTotalItems(total);
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  const addItem = async (item, inputCategory) => {
    if (!item || !inputCategory) return; // Prevent adding item with empty name or category
  
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const { quantity, category } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, category: category.toLowerCase() });
    } else {
      await setDoc(docRef, { quantity: 1, category: inputCategory.toLowerCase() });
    }
    await updateInventory();
  };
  

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName(''); // Reset item name
    setCategory(''); // Reset item category
  };

  const filterItems = () => {
    if (!filter) {
      setFilteredInventory(inventory);
    } else {
      const lowerFilter = filter.toLowerCase();
      const filtered = inventory.filter(item =>
        (item.category && item.category.toLowerCase().includes(lowerFilter)) ||
        (item.name && item.name.toLowerCase().includes(lowerFilter))
      );
      setFilteredInventory(filtered);
    }
  };

  const resetFilter = () => {
    setFilter(''); // Clear the filter text
    setFilteredInventory(inventory); // Reset to show all items
  };
  
  

  return (
    <Box className="outer-box">
      <TopContainer className='grid grid-cols-3'>
        <Box display='flex'
        alignItems='center'
        >
          <Typography className="text-green-600 pl-10"
            variant="h3"
          >
            Pantry Inventory
          </Typography>
        </Box>
        <Box 
            className='pl-5'
            display="flex"
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
          <Typography className="pb-5 text-gray-700" variant="h5">Total unique items: {totalItems}</Typography>
          <Button variant="contained" className='bg-green-600' onClick={handleOpen}>
            Add New Item
          </Button>
        </Box>
        <Box className='flex flex-col items-center'>
        <TextField
            className=""
            variant="outlined"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            placeholder="Filter by category or name"
          />
          <Box>
          <Button
              className="m-2"
              variant="outlined"
              onClick={() => {
                filterItems();
                handleClose();
              }}
            >
              Filter
          </Button>
          <Button
              variant="outlined"
              onClick={() => {
                resetFilter();
                handleClose();
              }}
            >
              Clear
          </Button>
          </Box>
        </Box>
      </TopContainer>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName.toLowerCase(), category);
                setItemName('');
                setCategory('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack width="100vw" height="maxContent" overflow="auto">
        {filteredInventory.map(({ name, category, quantity }) => (
          <Box
            key={name}
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f0f0f0"
            spacing={1}
            padding={2}
            className='grid grid-cols-4 odd:bg-white even:bg-slate-50'
          >
            <Typography variant="h7" color="#333" textAlign='center'>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h7" color="#333" textAlign='center'>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'No Category'}
            </Typography>
            <Typography variant="h7" color="#333" textAlign="center">{quantity}</Typography>
            <Button variant="contained" onClick={()=> removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
