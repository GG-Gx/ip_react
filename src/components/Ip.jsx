import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Image, Center, List, Stack, Button, Icon } from '@chakra-ui/react';
import { Card} from '@chakra-ui/react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DateTime } from "luxon";
import pinImg from '../assets/pin.svg';
import L from 'leaflet';




const Ip = () => {



  const [data, setData] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${import.meta.env.VITE_API_KEY}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <Center h="100vh" bg="black"><Text color={'white'}>Error: {error}</Text></Center>;
  }

  if (!data) {
    return <Center h="100vh" bg="black"><Text color={'white'}>Loading...</Text></Center>;
  }

  const { ip, location, proxy } = data;
  const { region, lat, lng, country, city } = location;
  const isVpnUsed = proxy?.vpn || false;
  const flag = `https://flagcdn.com/w20/${country.toLowerCase()}.png`;
  const localNowString = DateTime.local().toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
  const position = [lat, lng];


  return (

<Center h="100vh"
bg = "black"
  >
<Card.Root maxW="sm" overflow="hidden">
<MapContainer center={position} zoom={13} style={{ height: '200px', width: '100%' }}>

  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
  <Marker position={position}>
    <Popup>
      {position}
    </Popup>
  </Marker>
</MapContainer>
      <Card.Body gap="2">
        <Card.Title>What is my IP?</Card.Title>
        <Card.Description> 
            {ip}
        </Card.Description>
        <Card.Description>
            {isVpnUsed ? 'VPN Detected' : 'No VPN Detected'}
        </Card.Description>
          <Card.Description>
            {localNowString}
         </Card.Description>
      
        <Text textStyle="1xl" fontWeight="medium" letterSpacing="tight" mt="1">
        {city}, {country}, {region} <Image src={flag} alt={country} display="inline" boxSize="15px" />
        </Text>
        
      </Card.Body>
      
      <Card.Footer gap="2">
        <Button size="sm" colorScheme="blue" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)}>
          Open in Google Maps
    </Button>
    </Card.Footer>
    </Card.Root>
    </Center>
  );
};

export default Ip;
