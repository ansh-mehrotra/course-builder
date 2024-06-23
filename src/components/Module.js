import React, { useState } from 'react';
import { Box, Button, Heading, HStack, Input, VStack, useColorModeValue, Image, Text } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Resource from './Resource';
import './Module.css';

const Module = ({ module, updateModule, deleteModule }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newModuleName, setNewModuleName] = useState(module.name);
  const [previews, setPreviews] = useState([]);

  const [{ isOver }, drop] = useDrop({
    accept: NativeTypes.FILE,
    drop: (item) => handleFileDrop(item),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleFileDrop = (item) => {
    const file = item.files[0];
    if (file) {
      addResource('File', file);
      addPreview(file);
    }
  };

  const addResource = (type, file) => {
    const resource = { id: Date.now(), type, name: file ? file.name : `New ${type}`, url: '' };
    if (file) {
      resource.url = URL.createObjectURL(file);
    }
    const updatedModule = { ...module, resources: [...module.resources, resource] };
    updateModule(updatedModule);
  };

  const addPreview = (file) => {
    const fileType = file.type.split('/')[0];
    const preview = { id: Date.now(), url: URL.createObjectURL(file), type: fileType, file };
    setPreviews([...previews, preview]);
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
      addPreview(file);
    }
  };

  // Define color variables for light and dark modes
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box className="module" p={4} borderWidth="1px" borderRadius="md" bg={bg} color={textColor} borderColor={borderColor}>
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
      <Box
        ref={drop}
        className={`drop-area ${isOver ? 'drag-over' : ''}`}
        p={4}
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="md"
        mt={4}
        textAlign="center"
      >
        {isOver ? 'Release to drop the files here' : 'Drag and drop files here or click to select files'}
        <Input
          id={`fileInput-${module.id}`}
          type="file"
          display="none"
          onChange={handleFileInput}
        />
      </Box>
      <HStack justify="space-between" mt={4}>
        <Button onClick={() => document.getElementById(`fileInput-${module.id}`).click()} colorScheme="teal">
          Add File
        </Button>
        <Button onClick={() => addResource('Link')} colorScheme="teal">
          Add Link
        </Button>
      </HStack>
      <Box mt={8} />
      <Box mt={4} p={2} borderWidth="1px" borderRadius="md" borderColor={borderColor} bg={inputBg}>
        <Heading size="sm" mb={2} color={textColor}>File Preview:</Heading>
        {previews.length > 0 ? (
          <HStack spacing={4} wrap="wrap">
            {previews.map(preview => (
              <Box key={preview.id} p={2} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                {preview.type === 'image' ? (
                  <Image boxSize="200px" objectFit="cover" src={preview.url} alt="Preview" />
                ) : preview.type === 'application' && preview.file.type === 'application/pdf' ? (
                  <Box boxSize="200px">
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}>
                      <Viewer fileUrl={preview.url} />
                    </Worker>
                  </Box>
                ) : (
                  <Box boxSize="200px" display="flex" alignItems="center" justifyContent="center">
                    <Text color={textColor}>File</Text>
                  </Box>
                )}
              </Box>
            ))}
          </HStack>
        ) : (
          <Text color={textColor}>No files attached</Text>
        )}
      </Box>
    </Box>
  );
};

export default Module;
