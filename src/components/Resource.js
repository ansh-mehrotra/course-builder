import React, { useState } from 'react';
import { Box, Button, HStack, Link, useColorModeValue } from '@chakra-ui/react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './Resource.css';

const Resource = ({ resource, deleteResource, updateResource }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(resource.name);

  const bg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(resource.name); // Reset edited name to original on cancel
  };

  const handleSaveEdit = () => {
    updateResource(resource.id, { ...resource, name: editedName });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedName(e.target.value);
  };

  return (
    <Box className="resource" p={2} borderWidth="1px" borderRadius="md" bg={bg} color={textColor} borderColor={borderColor}>
      <HStack justify="space-between">
        <Box>
          {resource.type === 'File' ? (
            <Link href={resource.url} isExternal>
              {isEditing ? (
                <input type="text" value={editedName} onChange={handleChange} />
              ) : (
                resource.name
              )}
            </Link>
          ) : (
            isEditing ? (
              <input type="text" value={editedName} onChange={handleChange} />
            ) : (
              resource.name
            )
          )}
        </Box>
        <HStack>
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" onClick={handleCancelEdit}>Cancel</Button>
            </>
          ) : (
            <>
              <FaEdit onClick={handleEditClick} cursor="pointer" />
              <FaTrash onClick={() => deleteResource(resource.id)} cursor="pointer" />
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default Resource;
