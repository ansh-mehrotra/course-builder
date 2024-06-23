import React, { useState } from 'react';
import { Box, Button, Heading, VStack, useColorModeValue } from '@chakra-ui/react';
import Module from './Module';
import './CourseBuilder.css';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);

  const addModule = () => {
    const newModule = { id: Date.now(), name: `Module ${modules.length + 1}`, resources: [] };
    setModules([...modules, newModule]);
  };

  const updateModule = (updatedModule) => {
    const updatedModules = modules.map(mod => mod.id === updatedModule.id ? updatedModule : mod);
    setModules(updatedModules);
  };

  const deleteModule = (moduleId) => {
    setModules(modules.filter(mod => mod.id !== moduleId));
  };

  return (
    <Box className="course-builder" p={4} bg={useColorModeValue('white', 'gray.800')} borderRadius="md" boxShadow="md">
      <Heading mb={4} color={useColorModeValue('black', 'white')}>Course Builder</Heading>
      <VStack spacing={4} className="modules-container">
        {modules.map(module => (
          <Module
            key={module.id}
            module={module}
            updateModule={updateModule}
            deleteModule={deleteModule}
          />
        ))}
      </VStack>
      <Box className="add-module-container" mt={4}>
        <Button onClick={addModule} colorScheme="blue">
          Add Module
        </Button>
      </Box>
    </Box>
  );
};

export default CourseBuilder;
