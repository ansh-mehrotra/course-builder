import React from 'react';
import { Box, Button, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { CiDark } from "react-icons/ci";
import CourseBuilder from './components/CourseBuilder';
import './App.css';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box className="App" p={4} bg={useColorModeValue('gray.100', 'gray.900')} color={useColorModeValue('black', 'white')}>
      <div className='toggleColorMode'>
        <Button onClick={toggleColorMode} mb={4}>
        <CiDark />
        </Button>
      </div>
      <CourseBuilder />
    </Box>
  );
}

export default App;
