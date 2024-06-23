import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, HStack, VStack, useColorModeValue } from '@chakra-ui/react';
import Module from './Module';
import './CourseBuilder.css';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [draggedResource, setDraggedResource] = useState(null); // Track the dragged resource

  // Load modules from localStorage on component mount
  useEffect(() => {
    const savedModules = JSON.parse(localStorage.getItem('modules')) || [];
    setModules(savedModules);
  }, []);

  // Save modules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('modules', JSON.stringify(modules));
  }, [modules]);

  const addModule = () => {
    const newModule = { id: Date.now(), name: `Module ${modules.length + 1}`, resources: [] };
    setModules([...modules, newModule]);
  };

  const updateModule = (updatedModule) => {
    const updatedModules = modules.map(mod => mod.id === updatedModule.id ? updatedModule : mod);
    setModules(updatedModules);
  };

  const deleteModule = (moduleId) => {
    const updatedModules = modules.filter(mod => mod.id !== moduleId);
    setModules(updatedModules);
  };

  const moveModule = (currentIndex, newIndex) => {
    const updatedModules = [...modules];
    const movedModule = updatedModules.splice(currentIndex, 1)[0];
    updatedModules.splice(newIndex, 0, movedModule);
    setModules(updatedModules);
  };

  const handleDragStart = (resource, moduleId) => {
    setDraggedResource({ resource, moduleId });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (targetModuleId) => {
    const { resource, moduleId } = draggedResource;

    if (moduleId !== targetModuleId) {
      // Find the source and target modules
      const sourceModuleIndex = modules.findIndex(mod => mod.id === moduleId);
      const targetModuleIndex = modules.findIndex(mod => mod.id === targetModuleId);

      // Ensure both modules are found
      if (sourceModuleIndex !== -1 && targetModuleIndex !== -1) {
        // Remove resource from source module
        const updatedSourceModule = { ...modules[sourceModuleIndex] };
        updatedSourceModule.resources = updatedSourceModule.resources.filter(res => res.id !== resource.id);

        // Add resource to target module
        const updatedTargetModule = { ...modules[targetModuleIndex] };
        updatedTargetModule.resources.push(resource);

        // Update modules state
        const updatedModules = [...modules];
        updatedModules[sourceModuleIndex] = updatedSourceModule;
        updatedModules[targetModuleIndex] = updatedTargetModule;
        setModules(updatedModules);
      }
    }

    setDraggedResource(null);
  };

  return (
    <Box className="course-builder" p={4} bg={useColorModeValue('white', 'gray.800')} borderRadius="md" boxShadow="md" textAlign="center">
      <Heading mb={4} color={useColorModeValue('black', 'white')}>Course Builder</Heading>
      <HStack spacing={4} justify="center" className="modules-container">
        {modules.map((module, index) => (
          <Module
            key={module.id}
            module={module}
            index={index}
            updateModule={updateModule}
            deleteModule={deleteModule}
            moveModule={moveModule}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </HStack>
      <Box className="add-module-container" mt={4}>
        <Button onClick={addModule} colorScheme="blue">
          Add Module
        </Button>
      </Box>
    </Box>
  );
};

export default CourseBuilder;
