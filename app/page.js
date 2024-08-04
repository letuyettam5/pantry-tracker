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
    // Calculate total items
    const total = inventoryList.reduce((acc, item) => acc + (item.quantity || 0), 0);
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

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box className="outer-box">
      <TopContainer className="grid grid-cols-3 gap-3">
      <Box display='flex'
      alignItems='center'
      className='col-span-1'>
        <Typography className="text-green-500 pl-11"
          fontSize='40px'
        >
          Pantry Management
        </Typography>
      </Box>
        <Box className='col-span-1'
          display="flex"
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
        >
        <Typography>Total items: {totalItems}</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
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
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack width="100vw" height="maxContent" spacing={2} overflow="auto">
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f0f0f0"
            spacing={1}
            padding={5}
            className='grid grid-cols-3'
          >
            <Typography variant="h5" color="#333" textAlign='center'>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h5" color="#333" textAlign="center">{quantity}</Typography>
            <Button variant="contained" onClick={()=> removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
