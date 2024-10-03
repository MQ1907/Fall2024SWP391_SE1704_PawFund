"use client";
import React, { useState } from 'react';

import { Button, Form, Input, Select, Switch } from 'antd';
import { createPet } from '../../lib/features/pet/petSlice'; // Import the createPet action
import { useAppDispatch, useAppSelector } from '@/lib/hook';

const { TextArea } = Input;

const AddPet: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.pets);
  const [petData, setPetData] = useState({
    id: '',
    
    shelterId: '',
    petCode: '',
    name: '',
    description: '',
    image: '',
    color: '',
    breed: '',
    age: '',
    species: '',
    isVacinted: false,
    isVerified: false,
    deliveryStatus: '',
    isAdopted: false,
    note: '',
    rescueBy: '',
    rescueFee: '',
    locationFound: '',
    petStatus: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['age', 'shelterId', 'rescueBy', 'species', 'rescueFee','id'].includes(name)
      ? parseInt(value, 10)
      : value;

    setPetData({ ...petData, [name]: parsedValue });
    console.log('Updated petData:', { ...petData, [name]: parsedValue });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    // Log the checked value directly
    console.log(`Switch ${name} changed to:`, checked);
    
    // Update state with the new checked value
    setPetData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting petData:', petData);
    dispatch(createPet(petData));
  };
  
 

  return (
    <div className='w-[100%] mx-[10%] mt-[10px]'>
      <Form>
        <Form.Item label="Name">
          <Input name="name" value={petData.name} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="ID">
          <Input name="id" value={petData.id} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Shelter ID">
          <Input name="shelterId" value={petData.shelterId} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Pet Code">
          <Input name="petCode" value={petData.petCode} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Color">
          <Input name="color" value={petData.color} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Breed">
          <Input name="breed" value={petData.breed} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Age">
          <Input name="age" value={petData.age} onChange={handleChange} />
        </Form.Item>
         <Form.Item label="species">
          <Input name="species" value={petData.species} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Description">
          <TextArea name="description" value={petData.description} onChange={handleChange} rows={4} />
        </Form.Item>

        <Form.Item label="Vaccinated" valuePropName="checked">
          <Switch checked={petData.isVacinted} onChange={(checked) => handleSwitchChange('isVacinted', checked)} />
        </Form.Item>

        <Form.Item label="Verified" valuePropName="checked">
          <Switch checked={petData.isVerified} onChange={(checked) => handleSwitchChange('isVerified', checked)} />
        </Form.Item>

        <Form.Item label="Delivery Status">
          <Select
            onChange={(value) => setPetData({ ...petData, deliveryStatus: value })}
            value={petData.deliveryStatus}
          >
            <Select.Option value="PENDING">PENDING</Select.Option>
            <Select.Option value="COMPLETED">COMPLETED</Select.Option>
            <Select.Option value="CANCELED">CANCELED</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Adopted" valuePropName="checked">
          <Switch checked={petData.isAdopted} onChange={(checked) => handleSwitchChange('isAdopted', checked)} />
        </Form.Item>

        <Form.Item label="Rescue By">
          <Input name="rescueBy" value={petData.rescueBy} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Rescue Fee">
          <Input name="rescueFee" value={petData.rescueFee} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Location Found">
          <Input name="locationFound" value={petData.locationFound} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Pet Status">
          <Select
            onChange={(value) => setPetData({ ...petData, petStatus: value })}
            value={petData.petStatus}
          >
            <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
            <Select.Option value="ADOPTED">ADOPTED</Select.Option>
            <Select.Option value="LOST">LOST</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Note">
          <Input name="note" value={petData.note} onChange={handleChange} />
        </Form.Item>

         <Form.Item label="Upload" >
        <Input name="image" value={petData.image} onChange={handleChange} />
        </Form.Item>

        <Button type="primary" onClick={handleSubmit}>Submit</Button>

        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
      </Form>
    </div>
  );
};

export default AddPet;
