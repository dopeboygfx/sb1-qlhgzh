import * as tf from '@tensorflow/tfjs';
import exifr from 'exifr';

async function getImageMetadata(file: File) {
  if (!file.type.startsWith('image/')) {
    return {};
  }

  try {
    // Configure exifr to only parse the metadata we need
    const metadata = await exifr.parse(file, {
      // Specify exactly which tags to extract for better performance
      pick: [
        'DateTimeOriginal',
        'CreateDate',
        'Make',
        'Model',
        'ImageDescription',
        'Description',
        'GPSLatitude',
        'GPSLongitude',
        'GPSAltitude'
      ],
      // Skip unnecessary parsing
      skipBitmap: true,
      skipThumbnail: true,
    });

    return {
      dateTime: metadata?.DateTimeOriginal || metadata?.CreateDate,
      location: {
        latitude: metadata?.GPSLatitude,
        longitude: metadata?.GPSLongitude,
        altitude: metadata?.GPSAltitude
      },
      camera: {
        make: metadata?.Make,
        model: metadata?.Model
      },
      description: metadata?.ImageDescription || metadata?.Description
    };
  } catch (error) {
    // More specific error handling
    if (error instanceof Error) {
      console.warn('Metadata extraction warning:', error.message);
    } else {
      console.warn('Unknown metadata extraction issue');
    }
    return {};
  }
}

function getTimeTags(dateTime?: Date): string[] {
  if (!dateTime || !(dateTime instanceof Date) || isNaN(dateTime.getTime())) {
    return [];
  }

  const tags: string[] = [];
  const hours = dateTime.getHours();

  // Time of day
  if (hours >= 5 && hours < 12) tags.push('morning');
  else if (hours >= 12 && hours < 17) tags.push('afternoon');
  else if (hours >= 17 && hours < 20) tags.push('evening');
  else tags.push('night');

  // Day of week
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  tags.push(days[dateTime.getDay()]);

  // Season
  const month = dateTime.getMonth();
  if (month >= 2 && month <= 4) tags.push('spring');
  else if (month >= 5 && month <= 7) tags.push('summer');
  else if (month >= 8 && month <= 10) tags.push('autumn');
  else tags.push('winter');

  return tags;
}

export async function analyzeImage(file: File): Promise<{
  tags: string[];
  metadata: any;
}> {
  try {
    // Get basic file type tag
    const tags = new Set([file.type.split('/')[0]]);
    
    // Only process metadata for images
    if (!file.type.startsWith('image/')) {
      return {
        tags: Array.from(tags),
        metadata: {}
      };
    }

    // Extract metadata
    const metadata = await getImageMetadata(file);
    
    // Add time-based tags if we have a valid date
    if (metadata.dateTime) {
      const timeTags = getTimeTags(new Date(metadata.dateTime));
      timeTags.forEach(tag => tags.add(tag));
    }

    // Add location-based tags if we have coordinates
    if (metadata.location?.latitude && metadata.location?.longitude) {
      const locationTags = await getLocationContext(
        metadata.location.latitude,
        metadata.location.longitude
      );
      locationTags.forEach(tag => tags.add(tag));
    }

    // Add camera-based tags
    if (metadata.camera?.make) {
      tags.add(metadata.camera.make.toLowerCase());
    }
    if (metadata.camera?.model) {
      tags.add(metadata.camera.model.toLowerCase());
    }

    return {
      tags: Array.from(tags),
      metadata
    };
  } catch (error) {
    // Fallback to basic file type tag if anything fails
    console.warn('Image analysis warning:', error);
    return {
      tags: [file.type.split('/')[0]],
      metadata: {}
    };
  }
}

async function getLocationContext(lat: number, lng: number): Promise<string[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CompressAI/1.0' // Proper user agent for OpenStreetMap
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Location API error: ${response.status}`);
    }
    
    const data = await response.json();
    const tags = new Set<string>();
    
    if (data.address) {
      // Process each address component
      Object.entries(data.address).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          tags.add(value.toLowerCase().trim());
        }
      });
    }
    
    return Array.from(tags);
  } catch (error) {
    console.warn('Location context warning:', error);
    return [];
  }
}