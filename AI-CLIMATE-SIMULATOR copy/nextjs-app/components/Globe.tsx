'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface GlobeProps {
  pollutionLevel: number
  metrics: {
    co2Level: number
    toxicityLevel: number
    temperature: number
    humanPopulation: number
    animalPopulation: number
    plantPopulation: number
    oceanAcidity: number
    iceCapMelting: number
  }
  specialEvent?: string | null
}

interface EarthProps extends GlobeProps {
  isAutoRotating: boolean
}

// Major population centers with lat/lon coordinates (expanded from global-datacenter-visualization CSV data)
const MAJOR_CITIES = [
  // North America - Major Cities
  { lat: 40.7128, lon: -74.0060, name: 'New York' },
  { lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
  { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
  { lat: 41.8781, lon: -87.6298, name: 'Chicago' },
  { lat: 29.7604, lon: -95.3698, name: 'Houston' },
  { lat: 33.7490, lon: -84.3880, name: 'Atlanta' },
  { lat: 42.3601, lon: -71.0589, name: 'Boston' },
  { lat: 47.6062, lon: -122.3321, name: 'Seattle' },
  { lat: 39.9526, lon: -75.1652, name: 'Philadelphia' },
  { lat: 38.9072, lon: -77.0369, name: 'Washington D.C.' },
  { lat: 36.1699, lon: -115.1398, name: 'Las Vegas' },
  { lat: 25.7617, lon: -80.1918, name: 'Miami' },
  { lat: 32.7157, lon: -117.1611, name: 'San Diego' },
  { lat: 45.5234, lon: -122.6762, name: 'Portland' },
  { lat: 39.7392, lon: -104.9903, name: 'Denver' },
  { lat: 33.4484, lon: -112.0740, name: 'Phoenix' },
  { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
  { lat: 45.5017, lon: -73.5673, name: 'Montreal' },
  { lat: 49.2827, lon: -123.1207, name: 'Vancouver' },
  { lat: 51.0447, lon: -114.0719, name: 'Calgary' },
  { lat: 53.5461, lon: -113.4938, name: 'Edmonton' },
  { lat: 45.4215, lon: -75.6972, name: 'Ottawa' },
  { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
  { lat: 20.6597, lon: -103.3496, name: 'Guadalajara' },
  { lat: 25.6866, lon: -100.3161, name: 'Monterrey' },
  
  // South America - Major Cities
  { lat: -23.5505, lon: -46.6333, name: 'São Paulo' },
  { lat: -22.9068, lon: -43.1729, name: 'Rio de Janeiro' },
  { lat: -15.7801, lon: -47.9292, name: 'Brasília' },
  { lat: -12.9714, lon: -38.5014, name: 'Salvador' },
  { lat: -3.7319, lon: -38.5267, name: 'Fortaleza' },
  { lat: -19.9167, lon: -43.9345, name: 'Belo Horizonte' },
  { lat: -30.0346, lon: -51.2177, name: 'Porto Alegre' },
  { lat: -25.4284, lon: -49.2733, name: 'Curitiba' },
  { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires' },
  { lat: -32.9468, lon: -60.6393, name: 'Rosario' },
  { lat: -31.4135, lon: -64.1811, name: 'Córdoba' },
  { lat: -34.9011, lon: -56.1645, name: 'Montevideo' },
  { lat: -25.2867, lon: -57.3333, name: 'Asunción' },
  { lat: -33.4489, lon: -70.6693, name: 'Santiago' },
  { lat: -12.0464, lon: -77.0428, name: 'Lima' },
  { lat: -16.5000, lon: -68.1500, name: 'La Paz' },
  { lat: -0.1807, lon: -78.4678, name: 'Quito' },
  { lat: -2.1962, lon: -79.8862, name: 'Guayaquil' },
  { lat: 4.7110, lon: -74.0721, name: 'Bogotá' },
  { lat: 10.4683, lon: -66.9726, name: 'Caracas' },
  
  // Europe - Major Cities
  { lat: 51.5074, lon: -0.1278, name: 'London' },
  { lat: 48.8566, lon: 2.3522, name: 'Paris' },
  { lat: 52.5200, lon: 13.4050, name: 'Berlin' },
  { lat: 41.9028, lon: 12.4964, name: 'Rome' },
  { lat: 40.4168, lon: -3.7038, name: 'Madrid' },
  { lat: 55.7558, lon: 37.6173, name: 'Moscow' },
  { lat: 50.1109, lon: 8.6821, name: 'Frankfurt' },
  { lat: 45.4642, lon: 9.1900, name: 'Milan' },
  { lat: 59.3293, lon: 18.0686, name: 'Stockholm' },
  { lat: 55.6761, lon: 12.5683, name: 'Copenhagen' },
  { lat: 47.3769, lon: 8.5417, name: 'Zurich' },
  { lat: 43.6047, lon: 1.4442, name: 'Toulouse' },
  { lat: 46.2044, lon: 6.1432, name: 'Geneva' },
  { lat: 53.3498, lon: -6.2603, name: 'Dublin' },
  { lat: 52.2297, lon: 21.0122, name: 'Warsaw' },
  { lat: 50.0755, lon: 14.4378, name: 'Prague' },
  { lat: 47.4979, lon: 19.0402, name: 'Budapest' },
  { lat: 44.4268, lon: 26.1025, name: 'Bucharest' },
  { lat: 42.6977, lon: 23.3219, name: 'Sofia' },
  { lat: 41.0082, lon: 28.9784, name: 'Istanbul' },
  { lat: 37.9838, lon: 23.7275, name: 'Athens' },
  { lat: 38.7223, lon: -9.1393, name: 'Lisbon' },
  { lat: 59.4370, lon: 24.7536, name: 'Tallinn' },
  { lat: 56.9496, lon: 24.1052, name: 'Riga' },
  { lat: 54.6872, lon: 25.2797, name: 'Vilnius' },
  { lat: 60.1699, lon: 24.9384, name: 'Helsinki' },
  { lat: 64.1355, lon: -21.8954, name: 'Reykjavik' },
  { lat: 55.9533, lon: -3.1883, name: 'Edinburgh' },
  { lat: 54.5973, lon: -5.9301, name: 'Belfast' },
  { lat: 53.4808, lon: -2.2426, name: 'Manchester' },
  { lat: 52.4862, lon: -1.8904, name: 'Birmingham' },
  { lat: 41.3851, lon: 2.1734, name: 'Barcelona' },
  { lat: 43.8563, lon: 18.4131, name: 'Sarajevo' },
  { lat: 42.4304, lon: 19.2594, name: 'Podgorica' },
  { lat: 41.9981, lon: 21.4254, name: 'Skopje' },
  { lat: 41.3275, lon: 19.8187, name: 'Tirana' },
  { lat: 46.0569, lon: 14.5058, name: 'Ljubljana' },
  { lat: 45.8150, lon: 15.9819, name: 'Zagreb' },
  { lat: 44.7866, lon: 20.4489, name: 'Belgrade' },
  { lat: 47.8095, lon: 13.0550, name: 'Salzburg' },
  { lat: 43.7102, lon: 7.2620, name: 'Monaco' },
  { lat: 43.9424, lon: 4.8055, name: 'Avignon' },
  
  // Asia - Major Cities
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
  { lat: 37.5665, lon: 126.9780, name: 'Seoul' },
  { lat: 39.9042, lon: 116.4074, name: 'Beijing' },
  { lat: 31.2304, lon: 121.4737, name: 'Shanghai' },
  { lat: 22.3193, lon: 114.1694, name: 'Hong Kong' },
  { lat: 25.0330, lon: 121.5654, name: 'Taipei' },
  { lat: 14.5995, lon: 120.9842, name: 'Manila' },
  { lat: 13.7563, lon: 100.5018, name: 'Bangkok' },
  { lat: 21.0285, lon: 105.8542, name: 'Hanoi' },
  { lat: 11.5564, lon: 104.9282, name: 'Phnom Penh' },
  { lat: 3.1390, lon: 101.6869, name: 'Kuala Lumpur' },
  { lat: -6.2088, lon: 106.8456, name: 'Jakarta' },
  { lat: 18.7883, lon: 98.9853, name: 'Chiang Mai' },
  { lat: 16.8409, lon: 96.1735, name: 'Yangon' },
  { lat: 17.9757, lon: 102.6331, name: 'Vientiane' },
  { lat: 28.6139, lon: 77.2090, name: 'New Delhi' },
  { lat: 18.9667, lon: 72.8333, name: 'Mumbai' },
  { lat: 22.5726, lon: 88.3639, name: 'Kolkata' },
  { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
  { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
  { lat: 17.3850, lon: 78.4867, name: 'Hyderabad' },
  { lat: 23.8103, lon: 90.4125, name: 'Dhaka' },
  { lat: 27.7172, lon: 85.3240, name: 'Kathmandu' },
  { lat: 33.7294, lon: 73.0931, name: 'Islamabad' },
  { lat: 24.8607, lon: 67.0011, name: 'Karachi' },
  { lat: 31.5204, lon: 74.3587, name: 'Lahore' },
  { lat: 34.5553, lon: 69.2075, name: 'Kabul' },
  { lat: 35.6892, lon: 51.3890, name: 'Tehran' },
  { lat: 33.3152, lon: 44.3661, name: 'Baghdad' },
  { lat: 24.4539, lon: 54.3773, name: 'Abu Dhabi' },
  { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
  { lat: 26.2285, lon: 50.5860, name: 'Manama' },
  { lat: 25.2854, lon: 51.5310, name: 'Doha' },
  { lat: 23.6345, lon: 58.1823, name: 'Muscat' },
  { lat: 29.3759, lon: 47.9774, name: 'Kuwait City' },
  { lat: 24.7136, lon: 46.6753, name: 'Riyadh' },
  { lat: 21.5433, lon: 39.1728, name: 'Jeddah' },
  { lat: 15.3694, lon: 44.1910, name: 'Sana\'a' },
  { lat: 31.9454, lon: 35.9284, name: 'Amman' },
  { lat: 33.8938, lon: 35.5018, name: 'Beirut' },
  { lat: 33.5138, lon: 36.2765, name: 'Damascus' },
  { lat: 32.0853, lon: 34.7818, name: 'Tel Aviv' },
  { lat: 34.6937, lon: 135.5023, name: 'Osaka' },
  { lat: 35.1796, lon: 129.0756, name: 'Busan' },
  { lat: 18.5204, lon: 73.8567, name: 'Pune' },
  { lat: 24.9056, lon: 67.0822, name: 'Karachi' },
  
  // Australia/Oceania - Major Cities
  { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
  { lat: -37.8136, lon: 144.9631, name: 'Melbourne' },
  { lat: -27.4698, lon: 153.0251, name: 'Brisbane' },
  { lat: -31.9505, lon: 115.8605, name: 'Perth' },
  { lat: -34.9285, lon: 138.6007, name: 'Adelaide' },
  { lat: -42.8821, lon: 147.3272, name: 'Hobart' },
  { lat: -35.2809, lon: 149.1300, name: 'Canberra' },
  { lat: -12.4634, lon: 130.8456, name: 'Darwin' },
  { lat: -16.9186, lon: 145.7781, name: 'Cairns' },
  { lat: -32.9283, lon: 151.7817, name: 'Newcastle' },
  { lat: -34.4278, lon: 150.8931, name: 'Wollongong' },
  { lat: -37.5622, lon: 143.8503, name: 'Ballarat' },
  { lat: -36.7564, lon: 144.2787, name: 'Bendigo' },
  { lat: -38.1499, lon: 144.3617, name: 'Geelong' },
  { lat: -32.2315, lon: 148.6330, name: 'Dubbo' },
  { lat: -30.3080, lon: 153.0877, name: 'Coffs Harbour' },
  { lat: -41.4332, lon: 147.1572, name: 'Launceston' },
  { lat: -19.2590, lon: 146.8169, name: 'Townsville' },
  { lat: -23.3791, lon: 150.5100, name: 'Rockhampton' },
  { lat: -21.1441, lon: 149.1862, name: 'Mackay' },
  { lat: -28.0167, lon: 153.4000, name: 'Gold Coast' },
  { lat: -26.6031, lon: 153.0918, name: 'Sunshine Coast' },
  { lat: -40.9006, lon: 174.8860, name: 'Wellington' },
  { lat: -41.2865, lon: 174.7762, name: 'Wellington NZ' },
  
  // Africa - Major Cities
  { lat: -33.9249, lon: 18.4241, name: 'Cape Town' },
  { lat: -26.2041, lon: 28.0473, name: 'Johannesburg' },
  { lat: -25.7479, lon: 28.2293, name: 'Pretoria' },
  { lat: -29.8587, lon: 31.0218, name: 'Durban' },
  { lat: 30.0444, lon: 31.2357, name: 'Cairo' },
  { lat: 31.2001, lon: 29.9187, name: 'Alexandria' },
  { lat: 36.8065, lon: 10.1815, name: 'Tunis' },
  { lat: 36.7538, lon: 3.0588, name: 'Algiers' },
  { lat: 33.9716, lon: -6.8498, name: 'Rabat' },
  { lat: 32.8872, lon: 13.1913, name: 'Tripoli' },
  { lat: 14.6928, lon: -17.4467, name: 'Dakar' },
  { lat: 5.3600, lon: -4.0083, name: 'Abidjan' },
  { lat: 6.5244, lon: 3.3792, name: 'Lagos' },
  { lat: 9.0765, lon: 7.3986, name: 'Abuja' },
  { lat: 5.5557, lon: -0.1963, name: 'Accra' },
  { lat: 6.3350, lon: 2.4183, name: 'Cotonou' },
  { lat: 12.6392, lon: -8.0029, name: 'Bamako' },
  { lat: 13.5127, lon: 2.1128, name: 'Niamey' },
  { lat: 12.3714, lon: -1.5197, name: 'Ouagadougou' },
  { lat: 3.8480, lon: 11.5021, name: 'Yaoundé' },
  { lat: 0.3476, lon: 9.4520, name: 'Libreville' },
  { lat: -4.2634, lon: 15.2429, name: 'Kinshasa' },
  { lat: -1.9403, lon: 30.0596, name: 'Kigali' },
  { lat: 0.3476, lon: 32.5825, name: 'Kampala' },
  { lat: -1.2921, lon: 36.8219, name: 'Nairobi' },
  { lat: -6.8235, lon: 39.2695, name: 'Dar es Salaam' },
  { lat: -13.9626, lon: 33.7741, name: 'Lilongwe' },
  { lat: -15.3875, lon: 28.3228, name: 'Lusaka' },
  { lat: -17.8252, lon: 31.0335, name: 'Harare' },
  { lat: -24.6282, lon: 25.9231, name: 'Gaborone' },
  { lat: -22.5597, lon: 17.0832, name: 'Windhoek' },
  { lat: -18.8792, lon: 47.5079, name: 'Antananarivo' },
  { lat: -20.1609, lon: 57.5012, name: 'Port Louis' },
  { lat: -4.6167, lon: 55.4500, name: 'Victoria' },
]

// Major forest/plant regions (expanded for more plant coverage)
const FOREST_REGIONS = [
  // Amazon Rainforest - Multiple points
  { lat: -3.4653, lon: -58.3804, name: 'Amazon Basin' },
  { lat: -2.5297, lon: -60.0233, name: 'Amazon Forest' },
  { lat: -1.4554, lon: -48.4898, name: 'Amazon Delta' },
  { lat: -4.2634, lon: -69.9386, name: 'Amazon Peru' },
  { lat: -2.1962, lon: -79.8862, name: 'Amazon Ecuador' },
  { lat: 4.7110, lon: -74.0721, name: 'Amazon Colombia' },
  { lat: 10.4683, lon: -66.9726, name: 'Amazon Venezuela' },
  { lat: -15.7801, lon: -47.9292, name: 'Amazon Brazil' },
  
  // Congo Rainforest - Multiple points
  { lat: 0.2280, lon: 15.8277, name: 'Congo Basin' },
  { lat: -0.2280, lon: 15.8277, name: 'Congo Forest' },
  { lat: -4.2634, lon: 15.2429, name: 'Congo Kinshasa' },
  { lat: 0.3476, lon: 9.4520, name: 'Congo Gabon' },
  { lat: 3.8480, lon: 11.5021, name: 'Congo Cameroon' },
  { lat: -1.9403, lon: 30.0596, name: 'Congo Rwanda' },
  { lat: 0.3476, lon: 32.5825, name: 'Congo Uganda' },
  { lat: -1.2921, lon: 36.8219, name: 'Congo Kenya' },
  
  // Southeast Asian Forests - Multiple points
  { lat: 1.3521, lon: 103.8198, name: 'Southeast Asia Forest' },
  { lat: 13.7563, lon: 100.5018, name: 'Thailand Forest' },
  { lat: 14.5995, lon: 120.9842, name: 'Philippines Forest' },
  { lat: 18.7883, lon: 98.9853, name: 'Chiang Mai Forest' },
  { lat: 16.8409, lon: 96.1735, name: 'Myanmar Forest' },
  { lat: 17.9757, lon: 102.6331, name: 'Laos Forest' },
  { lat: 21.0285, lon: 105.8542, name: 'Vietnam Forest' },
  { lat: 11.5564, lon: 104.9282, name: 'Cambodia Forest' },
  { lat: 3.1390, lon: 101.6869, name: 'Malaysia Forest' },
  { lat: -6.2088, lon: 106.8456, name: 'Indonesia Forest' },
  
  // North American Forests - Multiple points
  { lat: 45.5017, lon: -73.5673, name: 'Canadian Forest' },
  { lat: 44.0582, lon: -121.3153, name: 'Pacific Northwest Forest' },
  { lat: 35.7796, lon: -78.6382, name: 'Appalachian Forest' },
  { lat: 49.2827, lon: -123.1207, name: 'Vancouver Forest' },
  { lat: 51.0447, lon: -114.0719, name: 'Calgary Forest' },
  { lat: 53.5461, lon: -113.4938, name: 'Edmonton Forest' },
  { lat: 45.4215, lon: -75.6972, name: 'Ottawa Forest' },
  { lat: 43.6532, lon: -79.3832, name: 'Toronto Forest' },
  { lat: 45.5234, lon: -122.6762, name: 'Portland Forest' },
  { lat: 47.6062, lon: -122.3321, name: 'Seattle Forest' },
  { lat: 39.7392, lon: -104.9903, name: 'Denver Forest' },
  { lat: 42.3601, lon: -71.0589, name: 'Boston Forest' },
  { lat: 39.9526, lon: -75.1652, name: 'Philadelphia Forest' },
  { lat: 38.9072, lon: -77.0369, name: 'Washington Forest' },
  
  // European Forests - Multiple points
  { lat: 52.5200, lon: 13.4050, name: 'European Forest' },
  { lat: 55.7558, lon: 37.6176, name: 'Russian Taiga' },
  { lat: 51.5074, lon: -0.1278, name: 'London Forest' },
  { lat: 48.8566, lon: 2.3522, name: 'Paris Forest' },
  { lat: 50.1109, lon: 8.6821, name: 'Frankfurt Forest' },
  { lat: 45.4642, lon: 9.1900, name: 'Milan Forest' },
  { lat: 59.3293, lon: 18.0686, name: 'Stockholm Forest' },
  { lat: 55.6761, lon: 12.5683, name: 'Copenhagen Forest' },
  { lat: 47.3769, lon: 8.5417, name: 'Zurich Forest' },
  { lat: 53.3498, lon: -6.2603, name: 'Dublin Forest' },
  { lat: 52.2297, lon: 21.0122, name: 'Warsaw Forest' },
  { lat: 50.0755, lon: 14.4378, name: 'Prague Forest' },
  { lat: 47.4979, lon: 19.0402, name: 'Budapest Forest' },
  { lat: 44.4268, lon: 26.1025, name: 'Bucharest Forest' },
  { lat: 42.6977, lon: 23.3219, name: 'Sofia Forest' },
  { lat: 41.0082, lon: 28.9784, name: 'Istanbul Forest' },
  { lat: 37.9838, lon: 23.7275, name: 'Athens Forest' },
  { lat: 38.7223, lon: -9.1393, name: 'Lisbon Forest' },
  { lat: 59.4370, lon: 24.7536, name: 'Tallinn Forest' },
  { lat: 56.9496, lon: 24.1052, name: 'Riga Forest' },
  { lat: 54.6872, lon: 25.2797, name: 'Vilnius Forest' },
  { lat: 60.1699, lon: 24.9384, name: 'Helsinki Forest' },
  { lat: 64.1355, lon: -21.8954, name: 'Reykjavik Forest' },
  { lat: 55.9533, lon: -3.1883, name: 'Edinburgh Forest' },
  { lat: 54.5973, lon: -5.9301, name: 'Belfast Forest' },
  { lat: 53.4808, lon: -2.2426, name: 'Manchester Forest' },
  { lat: 52.4862, lon: -1.8904, name: 'Birmingham Forest' },
  { lat: 41.3851, lon: 2.1734, name: 'Barcelona Forest' },
  
  // Asian Forests - Multiple points
  { lat: 35.6762, lon: 139.6503, name: 'Japanese Forest' },
  { lat: 31.2304, lon: 121.4737, name: 'Chinese Forest' },
  { lat: 19.0760, lon: 72.8777, name: 'Indian Forest' },
  { lat: 39.9042, lon: 116.4074, name: 'Beijing Forest' },
  { lat: 37.5665, lon: 126.9780, name: 'Seoul Forest' },
  { lat: 22.3193, lon: 114.1694, name: 'Hong Kong Forest' },
  { lat: 25.0330, lon: 121.5654, name: 'Taipei Forest' },
  { lat: 14.5995, lon: 120.9842, name: 'Manila Forest' },
  { lat: 13.7563, lon: 100.5018, name: 'Bangkok Forest' },
  { lat: 21.0285, lon: 105.8542, name: 'Hanoi Forest' },
  { lat: 11.5564, lon: 104.9282, name: 'Phnom Penh Forest' },
  { lat: 3.1390, lon: 101.6869, name: 'Kuala Lumpur Forest' },
  { lat: -6.2088, lon: 106.8456, name: 'Jakarta Forest' },
  { lat: 28.6139, lon: 77.2090, name: 'New Delhi Forest' },
  { lat: 18.9667, lon: 72.8333, name: 'Mumbai Forest' },
  { lat: 22.5726, lon: 88.3639, name: 'Kolkata Forest' },
  { lat: 13.0827, lon: 80.2707, name: 'Chennai Forest' },
  { lat: 12.9716, lon: 77.5946, name: 'Bangalore Forest' },
  { lat: 17.3850, lon: 78.4867, name: 'Hyderabad Forest' },
  { lat: 23.8103, lon: 90.4125, name: 'Dhaka Forest' },
  { lat: 27.7172, lon: 85.3240, name: 'Kathmandu Forest' },
  { lat: 33.7294, lon: 73.0931, name: 'Islamabad Forest' },
  { lat: 24.8607, lon: 67.0011, name: 'Karachi Forest' },
  { lat: 31.5204, lon: 74.3587, name: 'Lahore Forest' },
  { lat: 34.5553, lon: 69.2075, name: 'Kabul Forest' },
  { lat: 35.6892, lon: 51.3890, name: 'Tehran Forest' },
  { lat: 33.3152, lon: 44.3661, name: 'Baghdad Forest' },
  { lat: 24.4539, lon: 54.3773, name: 'Abu Dhabi Forest' },
  { lat: 25.2048, lon: 55.2708, name: 'Dubai Forest' },
  { lat: 26.2285, lon: 50.5860, name: 'Manama Forest' },
  { lat: 25.2854, lon: 51.5310, name: 'Doha Forest' },
  { lat: 23.6345, lon: 58.1823, name: 'Muscat Forest' },
  { lat: 29.3759, lon: 47.9774, name: 'Kuwait Forest' },
  { lat: 24.7136, lon: 46.6753, name: 'Riyadh Forest' },
  { lat: 21.5433, lon: 39.1728, name: 'Jeddah Forest' },
  { lat: 15.3694, lon: 44.1910, name: 'Sana\'a Forest' },
  { lat: 31.9454, lon: 35.9284, name: 'Amman Forest' },
  { lat: 33.8938, lon: 35.5018, name: 'Beirut Forest' },
  { lat: 33.5138, lon: 36.2765, name: 'Damascus Forest' },
  { lat: 32.0853, lon: 34.7818, name: 'Tel Aviv Forest' },
  { lat: 34.6937, lon: 135.5023, name: 'Osaka Forest' },
  { lat: 35.1796, lon: 129.0756, name: 'Busan Forest' },
  { lat: 18.5204, lon: 73.8567, name: 'Pune Forest' },
  { lat: 24.9056, lon: 67.0822, name: 'Karachi Forest 2' },
  
  // Australian Forests - Multiple points
  { lat: -33.8688, lon: 151.2093, name: 'Sydney Forest' },
  { lat: -37.8136, lon: 144.9631, name: 'Melbourne Forest' },
  { lat: -27.4698, lon: 153.0251, name: 'Brisbane Forest' },
  { lat: -31.9505, lon: 115.8605, name: 'Perth Forest' },
  { lat: -34.9285, lon: 138.6007, name: 'Adelaide Forest' },
  { lat: -42.8821, lon: 147.3272, name: 'Hobart Forest' },
  { lat: -35.2809, lon: 149.1300, name: 'Canberra Forest' },
  { lat: -12.4634, lon: 130.8456, name: 'Darwin Forest' },
  { lat: -16.9186, lon: 145.7781, name: 'Cairns Forest' },
  { lat: -32.9283, lon: 151.7817, name: 'Newcastle Forest' },
  { lat: -34.4278, lon: 150.8931, name: 'Wollongong Forest' },
  { lat: -37.5622, lon: 143.8503, name: 'Ballarat Forest' },
  { lat: -36.7564, lon: 144.2787, name: 'Bendigo Forest' },
  { lat: -38.1499, lon: 144.3617, name: 'Geelong Forest' },
  { lat: -32.2315, lon: 148.6330, name: 'Dubbo Forest' },
  { lat: -30.3080, lon: 153.0877, name: 'Coffs Harbour Forest' },
  { lat: -41.4332, lon: 147.1572, name: 'Launceston Forest' },
  { lat: -19.2590, lon: 146.8169, name: 'Townsville Forest' },
  { lat: -23.3791, lon: 150.5100, name: 'Rockhampton Forest' },
  { lat: -21.1441, lon: 149.1862, name: 'Mackay Forest' },
  { lat: -28.0167, lon: 153.4000, name: 'Gold Coast Forest' },
  { lat: -26.6031, lon: 153.0918, name: 'Sunshine Coast Forest' },
  { lat: -40.9006, lon: 174.8860, name: 'Wellington Forest' },
  { lat: -41.2865, lon: 174.7762, name: 'Wellington NZ Forest' },
  
  // African Forests - Multiple points
  { lat: -33.9249, lon: 18.4241, name: 'Cape Town Forest' },
  { lat: -26.2041, lon: 28.0473, name: 'Johannesburg Forest' },
  { lat: -25.7479, lon: 28.2293, name: 'Pretoria Forest' },
  { lat: -29.8587, lon: 31.0218, name: 'Durban Forest' },
  { lat: 30.0444, lon: 31.2357, name: 'Cairo Forest' },
  { lat: 31.2001, lon: 29.9187, name: 'Alexandria Forest' },
  { lat: 36.8065, lon: 10.1815, name: 'Tunis Forest' },
  { lat: 36.7538, lon: 3.0588, name: 'Algiers Forest' },
  { lat: 33.9716, lon: -6.8498, name: 'Rabat Forest' },
  { lat: 32.8872, lon: 13.1913, name: 'Tripoli Forest' },
  { lat: 14.6928, lon: -17.4467, name: 'Dakar Forest' },
  { lat: 5.3600, lon: -4.0083, name: 'Abidjan Forest' },
  { lat: 6.5244, lon: 3.3792, name: 'Lagos Forest' },
  { lat: 9.0765, lon: 7.3986, name: 'Abuja Forest' },
  { lat: 5.5557, lon: -0.1963, name: 'Accra Forest' },
  { lat: 6.3350, lon: 2.4183, name: 'Cotonou Forest' },
  { lat: 12.6392, lon: -8.0029, name: 'Bamako Forest' },
  { lat: 13.5127, lon: 2.1128, name: 'Niamey Forest' },
  { lat: 12.3714, lon: -1.5197, name: 'Ouagadougou Forest' },
  { lat: 3.8480, lon: 11.5021, name: 'Yaoundé Forest' },
  { lat: 0.3476, lon: 9.4520, name: 'Libreville Forest' },
  { lat: -4.2634, lon: 15.2429, name: 'Kinshasa Forest' },
  { lat: -1.9403, lon: 30.0596, name: 'Kigali Forest' },
  { lat: 0.3476, lon: 32.5825, name: 'Kampala Forest' },
  { lat: -1.2921, lon: 36.8219, name: 'Nairobi Forest' },
  { lat: -6.8235, lon: 39.2695, name: 'Dar es Salaam Forest' },
  { lat: -13.9626, lon: 33.7741, name: 'Lilongwe Forest' },
  { lat: -15.3875, lon: 28.3228, name: 'Lusaka Forest' },
  { lat: -17.8252, lon: 31.0335, name: 'Harare Forest' },
  { lat: -24.6282, lon: 25.9231, name: 'Gaborone Forest' },
  { lat: -22.5597, lon: 17.0832, name: 'Windhoek Forest' },
  { lat: -18.8792, lon: 47.5079, name: 'Antananarivo Forest' },
  { lat: -20.1609, lon: 57.5012, name: 'Port Louis Forest' },
  { lat: -4.6167, lon: 55.4500, name: 'Victoria Forest' },
]

// Land-based coordinates for better distribution (using verified land coordinates)
const LAND_COORDINATES = [
  // North America
  { lat: 45.0, lon: -100.0 }, { lat: 35.0, lon: -90.0 }, { lat: 40.0, lon: -80.0 },
  { lat: 30.0, lon: -85.0 }, { lat: 25.0, lon: -100.0 }, { lat: 50.0, lon: -120.0 },
  
  // South America
  { lat: -10.0, lon: -60.0 }, { lat: -20.0, lon: -50.0 }, { lat: -30.0, lon: -60.0 },
  { lat: -15.0, lon: -70.0 }, { lat: -25.0, lon: -55.0 }, { lat: -5.0, lon: -80.0 },
  
  // Europe
  { lat: 50.0, lon: 10.0 }, { lat: 45.0, lon: 15.0 }, { lat: 55.0, lon: 20.0 },
  { lat: 40.0, lon: 5.0 }, { lat: 60.0, lon: 25.0 }, { lat: 35.0, lon: 0.0 },
  
  // Asia
  { lat: 35.0, lon: 100.0 }, { lat: 25.0, lon: 110.0 }, { lat: 45.0, lon: 90.0 },
  { lat: 20.0, lon: 80.0 }, { lat: 30.0, lon: 120.0 }, { lat: 40.0, lon: 130.0 },
  
  // Africa
  { lat: 10.0, lon: 20.0 }, { lat: -10.0, lon: 30.0 }, { lat: 5.0, lon: 10.0 },
  { lat: -20.0, lon: 25.0 }, { lat: 15.0, lon: 5.0 }, { lat: 0.0, lon: 15.0 },
  
  // Australia
  { lat: -25.0, lon: 135.0 }, { lat: -30.0, lon: 145.0 }, { lat: -20.0, lon: 125.0 },
  { lat: -35.0, lon: 150.0 }, { lat: -15.0, lon: 130.0 }, { lat: -40.0, lon: 140.0 },
]

function Earth({ pollutionLevel, metrics, specialEvent, isAutoRotating }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [meteorPosition, setMeteorPosition] = useState<[number, number, number]>([0, 20, 0])
  const [explosionActive, setExplosionActive] = useState(false)
  const [moonPosition, setMoonPosition] = useState<[number, number, number]>([0, 30, 0])
  const [moonCrashActive, setMoonCrashActive] = useState(false)
  const [moonDebrisActive, setMoonDebrisActive] = useState(false)

  // Load better Earth textures
  const earthTextures = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    return {
      colorMap: textureLoader.load('/global-datacenter-visualization/src/00_earthmap1k.jpg'),
      bumpMap: textureLoader.load('/global-datacenter-visualization/src/01_earthbump1k.jpg'),
      specularMap: textureLoader.load('/global-datacenter-visualization/src/02_earthspec1k.jpg'),
      lightsMap: textureLoader.load('/global-datacenter-visualization/src/03_earthlights1k.jpg')
    }
  }, [])

  // Convert lat/lon to 3D position on Earth surface (exact copy from global-datacenter-visualization)
  const latLonToVector3 = (lat: number, lon: number, radius: number = 5.01) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const z = -radius * Math.sin(phi) * Math.sin(theta)
    const y = radius * Math.cos(phi)
    return new THREE.Vector3(x, y, z)
  }

  // Calculate population dots based on actual metrics - EXACTLY like global-datacenter-visualization
  const getPopulationDots = useMemo(() => {
    // Humans: Show dots at major cities, number based on population - NO RANDOM OFFSETS
    const humanDotCount = Math.min(Math.floor(metrics.humanPopulation / 500000000), MAJOR_CITIES.length) // Max based on available cities
    const humanDots = MAJOR_CITIES.slice(0, humanDotCount).map(city => ({
      position: latLonToVector3(city.lat, city.lon, 5.01),
      color: 0xFFC0CB, // Piggy pink for humans
      size: 0.03
    }))

    // Animals: Show dots at major cities (like datacenters) - NO RANDOM OFFSETS
    const animalDotCount = Math.min(Math.floor(metrics.animalPopulation / 2000000000), MAJOR_CITIES.length)
    const animalDots = MAJOR_CITIES.slice(0, animalDotCount).map(city => ({
      position: latLonToVector3(city.lat, city.lon, 5.01),
      color: 0xD2691E, // Caramel color for animals
      size: 0.02
    }))

    // Plants: Show dots at forest regions - NO RANDOM OFFSETS
    const plantDotCount = Math.min(Math.floor(metrics.plantPopulation / 20000000000), FOREST_REGIONS.length)
    const plantDots = FOREST_REGIONS.slice(0, plantDotCount).map(forest => ({
      position: latLonToVector3(forest.lat, forest.lon, 5.01),
      color: 0x228B22, // Green for plants
      size: 0.015
    }))

    return { humanDots, animalDots, plantDots }
  }, [metrics.humanPopulation, metrics.animalPopulation, metrics.plantPopulation])

  useFrame(() => {
    if (earthRef.current && isAutoRotating) {
      earthRef.current.rotation.y += 0.003
    }
    if (atmosphereRef.current && isAutoRotating) {
      atmosphereRef.current.rotation.y += 0.002
    }

    if (specialEvent === 'meteor' && meteorPosition[1] > -5) {
      setMeteorPosition(prev => [prev[0], prev[1] - 0.5, prev[2]])
      if (meteorPosition[1] <= -5 && !explosionActive) {
        setExplosionActive(true)
      }
    }

    // Moon crash animation
    if (specialEvent === 'moon' && moonPosition[1] > -5) {
      setMoonPosition(prev => [prev[0], prev[1] - 0.08, prev[2]]) // 10x slower
      if (moonPosition[1] <= -5 && !moonCrashActive) {
        setMoonCrashActive(true)
        setMoonDebrisActive(true)
      }
    }
  })

  useEffect(() => {
    if (specialEvent !== 'meteor') {
      setMeteorPosition([0, 20, 0])
      setExplosionActive(false)
    }
    if (specialEvent !== 'moon') {
      setMoonPosition([0, 30, 0])
      setMoonCrashActive(false)
      setMoonDebrisActive(false)
    }
  }, [specialEvent])

  const getAtmosphereColor = () => {
    const baseColor = new THREE.Color(0x87CEEB)
    const toxicColor = new THREE.Color(0x32CD32)
    const pollutionFactor = metrics.toxicityLevel / 100
    
    const finalColor = new THREE.Color()
    finalColor.lerp(baseColor, 1 - pollutionFactor)
    finalColor.lerp(toxicColor, pollutionFactor)
    
    return finalColor
  }

  return (
    <>
      {/* Stars background */}
      <group>
        {Array.from({ length: 2000 }, (_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
          ]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
        ))}
      </group>
      
      {/* Earth with proper textures and population dots as children */}
      <mesh ref={earthRef}>
        <icosahedronGeometry args={[5, 16]} />
        <meshStandardMaterial 
          map={earthTextures.colorMap}
          bumpMap={earthTextures.bumpMap}
          bumpScale={0.1}
          roughness={0.8}
          metalness={0.1}
        />

        {/* Population dots as children of Earth mesh - they will rotate with the Earth */}
        <group>
          {/* Human population dots - fixed to Earth surface */}
          {getPopulationDots.humanDots.map((dot, i) => (
            <mesh key={`human-${i}`} position={dot.position}>
              <sphereGeometry args={[dot.size, 4, 4]} />
              <meshBasicMaterial color={dot.color} />
            </mesh>
          ))}

          {/* Animal population dots - fixed to Earth surface */}
          {getPopulationDots.animalDots.map((dot, i) => (
            <mesh key={`animal-${i}`} position={dot.position}>
              <sphereGeometry args={[dot.size, 4, 4]} />
              <meshBasicMaterial color={dot.color} />
            </mesh>
          ))}

          {/* Plant population dots - fixed to Earth surface */}
          {getPopulationDots.plantDots.map((dot, i) => (
            <mesh key={`plant-${i}`} position={dot.position}>
              <sphereGeometry args={[dot.size, 4, 4]} />
              <meshBasicMaterial color={dot.color} />
            </mesh>
          ))}
        </group>
      </mesh>

      {/* Ocean pollution overlay */}
      {metrics.oceanAcidity < 8.0 && (
        <mesh>
          <sphereGeometry args={[5.02, 64, 64]} />
          <meshStandardMaterial 
            color={0x8B0000}
            transparent
            opacity={0.3 * (1 - metrics.oceanAcidity / 8.0)}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[5.3, 64, 64]} />
        <meshStandardMaterial 
          color={getAtmosphereColor()}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Pollution particles */}
      {pollutionLevel > 0 && (
        <group>
          {Array.from({ length: Math.floor(pollutionLevel / 15) }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 12,
              (Math.random() - 0.5) * 12,
              (Math.random() - 0.5) * 12
            ]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial 
                color={0x8B0000}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Temperature heat waves */}
      {metrics.temperature > 35 && (
        <group>
          {Array.from({ length: 15 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 15
            ]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial 
                color={0xFF4500}
                transparent
                opacity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Meteor */}
      {specialEvent === 'meteor' && (
        <mesh position={meteorPosition}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color={0x696969} />
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.6, 4]} />
            <meshStandardMaterial color={0xFF6347} />
          </mesh>
        </mesh>
      )}

      {/* Explosion effect */}
      {explosionActive && (
        <group>
          {Array.from({ length: 40 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8
            ]}>
              <sphereGeometry args={[0.15, 4, 4]} />
              <meshStandardMaterial 
                color={0xFF4500}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Nuclear explosion - persists when toxicity is high */}
      {(specialEvent === 'nuclear' || metrics.toxicityLevel > 80) && (
        <group>
          <mesh>
            <sphereGeometry args={[6, 16, 16]} />
            <meshStandardMaterial 
              color={0xFFD700}
              transparent
              opacity={0.4}
            />
          </mesh>
          {Array.from({ length: 80 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 16,
              (Math.random() - 0.5) * 16,
              (Math.random() - 0.5) * 16
            ]}>
              <sphereGeometry args={[0.25, 4, 4]} />
              <meshStandardMaterial 
                color={0xFF4500}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Volcanic eruption */}
      {specialEvent === 'volcano' && (
        <group>
          {Array.from({ length: 30 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 10,
              Math.random() * 8,
              (Math.random() - 0.5) * 10
            ]}>
              <sphereGeometry args={[0.2, 4, 4]} />
              <meshStandardMaterial 
                color={0xFF4500}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Moon - approaching Earth or crashed on Earth */}
      {specialEvent === 'moon' && (
        <mesh position={moonCrashActive ? [0, -4, 0] : moonPosition}>
          <sphereGeometry args={[1.7, 16, 16]} />
          <meshStandardMaterial 
            color={moonCrashActive ? 0x8B4513 : 0xC0C0C0} // Brown when crashed, silver when approaching
            roughness={0.8}
            metalness={0.1}
          />
          {/* Moon craters */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 1.5,
              (Math.random() - 0.5) * 1.5,
              (Math.random() - 0.5) * 1.5
            ]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial 
                color={moonCrashActive ? 0x654321 : 0x808080} // Darker brown when crashed
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </mesh>
      )}

      {/* Moon crash impact */}
      {moonCrashActive && (
        <group>
          {/* Massive explosion sphere */}
          <mesh>
            <sphereGeometry args={[8, 32, 32]} />
            <meshStandardMaterial 
              color={0xFF4500}
              transparent
              opacity={0.6}
            />
          </mesh>
          {/* Fire and debris particles */}
          {Array.from({ length: 200 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20
            ]}>
              <sphereGeometry args={[0.3, 4, 4]} />
              <meshStandardMaterial 
                color={0xFF6347}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Moon debris field - persists after crash */}
      {moonDebrisActive && (
        <group>
          {Array.from({ length: 150 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 25,
              (Math.random() - 0.5) * 25,
              (Math.random() - 0.5) * 25
            ]}>
              <sphereGeometry args={[0.1, 4, 4]} />
              <meshStandardMaterial 
                color={0x696969}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* God saves the Earth - divine healing aura */}
      {specialEvent === 'god' && (
        <group>
          {/* Divine white glow aura */}
          <mesh>
            <sphereGeometry args={[7, 32, 32]} />
            <meshStandardMaterial 
              color={0xFFFFFF}
              transparent
              opacity={0.3}
              emissive={0xFFFFFF}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Angelic light particles */}
          {Array.from({ length: 100 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 15
            ]}>
              <sphereGeometry args={[0.1, 4, 4]} />
              <meshStandardMaterial 
                color={0xFFFFFF}
                transparent
                opacity={0.8}
                emissive={0xFFFFFF}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  )
}

export default function Globe({ pollutionLevel, metrics, specialEvent }: GlobeProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        
        <Earth 
          pollutionLevel={pollutionLevel} 
          metrics={metrics} 
          specialEvent={specialEvent} 
          isAutoRotating={isAutoRotating} 
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          onStart={() => setIsAutoRotating(false)}
          onEnd={() => setIsAutoRotating(true)}
        />
      </Canvas>
    </div>
  )
}