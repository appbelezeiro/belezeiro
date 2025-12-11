#!/usr/bin/env node

/**
 * Seed Amenities Script
 *
 * This script seeds predefined amenities into the database
 * Run: node seed-amenities.js
 */

const PREDEFINED_AMENITIES = [
  { code: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
  { code: 'parking', name: 'Estacionamento', icon: 'car' },
  { code: 'coffee', name: 'Café / Água', icon: 'coffee' },
  { code: 'ac', name: 'Ar-condicionado', icon: 'wind' },
  { code: 'snacks', name: 'Snacks', icon: 'cookie' },
  { code: 'waiting-room', name: 'Sala de espera', icon: 'sofa' },
  { code: 'accessibility', name: 'Acessibilidade', icon: 'accessibility' },
];

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function seedAmenities() {
  console.log('🌱 Starting amenities seeding...\n');

  try {
    const response = await fetch(`${API_URL}/api/amenities/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seeds: PREDEFINED_AMENITIES,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    console.log('✅ Amenities seeded successfully!\n');
    console.log(`📊 Created ${result.count} amenities:\n`);

    result.items.forEach((amenity, index) => {
      console.log(`  ${index + 1}. ${amenity.name} (${amenity.code})`);
    });

    console.log('\n🎉 Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding amenities:', error.message);
    process.exit(1);
  }
}

seedAmenities();
