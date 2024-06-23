import React, { useState } from 'react';
import { Box, Button, Heading, HStack, Input, VStack, useColorModeValue } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Resource from './Resource';
import './Module.css';

const Module = ({ module, updateModule, deleteModule }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newModuleName, setNewModuleName] = useState(module.name);

  const [, drop] = useDrop({
    accept: 'RESOURCE',
    drop: (item) => moveResource(item.id, module.id),
  });

  const addResource = (type, file) => {
    const resource = { id: Date.now(), type, name: file ? file.name : `New ${type}`, url: '' };
    if (file) {
      // Create a URL for the file
      resource.url = URL.createObjectURL(file);
    }
    const updatedModule = { ...module, resources: [...module.resources, resource] };
    updateModule(updatedModule);
  };

  const moveResource = (resourceId, targetModuleId) => {
    // Logic to move resource between modules
  };

  const renameModule = () => {
    const updatedModule = { ...module, name: newModuleName };
    updateModule(updatedModule);
    setIsEditing(false);
  };

  const deleteResource = (resourceId) => {
    const updatedModule = { ...module, resources: module.resources.filter(res => res.id !== resourceId) };
    updateModule(updatedModule);
  };

  const updateResource = (resourceId, updatedResource) => {
    const updatedResources = module.resources.map(res => res.id === resourceId ? updatedResource : res);
    const updatedModule = { ...module, resources: updatedResources };
    updateModule(updatedModule);
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      addResource('File', file);
    }
  };

  // Define color variables for light and dark modes
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box className="module" ref={drop} p={4} borderWidth="1px" borderRadius="md" bg={bg} color={textColor} borderColor={borderColor}>
      <HStack justify="space-between" mb={4}>
        {isEditing ? (
          <Input
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            onBlur={renameModule}
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        ) : (
          <Heading size="md" color={textColor}>{module.name}</Heading>
        )}
        <HStack>
          <FaEdit onClick={() => setIsEditing(true)} cursor="pointer" />
          <FaTrash onClick={() => deleteModule(module.id)} cursor="pointer" />
        </HStack>
      </HStack>
      <VStack spacing={2} className="resource-list">
        {module.resources.map(resource => (
          <Resource
            key={resource.id}
            resource={resource}
            deleteResource={deleteResource}
            updateResource={updateResource}
          />
        ))}
      </VStack>
      <HStack justify="space-between" mt={4}>
        <Button onClick={() => document.getElementById(`fileInput-${module.id}`).click()} colorScheme="teal">
          Add File
        </Button>
        <Input
          id={`fileInput-${module.id}`}
          type="file"
          display="none"
          onChange={handleFileInput}
        />
        <Button onClick={() => addResource('Link')} colorScheme="teal">
          Add Link
        </Button>
      </HStack>
    </Box>
  );
};

export default Module;
