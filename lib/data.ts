
import { Gallery, Artwork } from "../types";

// Curated Real Unsplash Image IDs for Art Themes
const ART_IDS: Record<string, string[]> = {
  neon: [
    "1565214975484-3cfa9e56f914", // Tokyo street night
    "1555680299-edbec617887e",     // Neon Portrait
    "1550751827-4bd374c3f58b",     // Cyberpunk city
    "1514300383375-9c90964d479e",  // Bokeh lights
    "1496564203457-11bb12075d90",  // Night city
    "1534224039826-c7a8efe82f04",  // Neon alley
    "1518640027989-d54d824d77dd",  // Purple neon
    "1577083552792-7104b9015ba6",  // Cyberpunk red
    "1561494916895-46727289552f",  // Blue neon sign
    "1495616811223-4d98c6e9d856",  // Glass reflection
    "1504701950209-645806c09374",  // Pink lights
    "1605629920063-e574c776e01a"   // Futuristic
  ],
  minimal: [
    "1494438639946-1ebd1d20bf85", // White texture
    "1507646227248-01b94669e3ce", // Grey minimal
    "1460661411355-4f040712faea", // Soft shadows
    "1459755486867-27e2f52ba193", // Concrete
    "1499346030926-9a72daac6c63", // White wall
    "1500043397897-ca5e369304a8", // Plants shadow
    "1449247709948-9a42dad183e2", // Marble
    "1478760329108-5c3ed9d495a0", // Paper texture
    "1431631927486-6603c868ce5e", // Fog
    "1496715976403-7e36dc43f17b"  // White geometric
  ],
  chaos: [
    "1541701494-87ox5d9737bc",    // Abstract paint
    "1561214115-37c2849430dd",    // Dark fluid
    "1550684848-fac1c5b4e853",    // Liquid color
    "1569982175971-d6c66bd4f3ea", // Ink swirl
    "1485627658391-e3f7262974f5", // Red smoke
    "1544084944-15a3ad96e940",    // Dark texture
    "1492684223066-81342ee5ff30", // Explosion
    "1543857774911-9faa63b87a53", // Abstract fire
    "1515462277126-2dd0c43f0aa3", // Paint splatter
    "1549490349886-91f964778502"  // Color cloud
  ],
  roots: [
    "1441974231531-c6227db76b6e", // Forest mist
    "1470071459604-3b5ec3a7fe05", // Deep forest
    "1502082553048-f009c371b9b5", // Leaves
    "1479660656269-197e9cb293d9", // Branches
    "1518531933037-88bbb539c71e", // Moss
    "1447752875204-b9152f55b3a4", // Trees
    "1462143338528-eca9936a4d09", // Green texture
    "1518105779142-d975f22f1b0a", // Ferns
    "1483794344563-d27a8d9adcea", // Wood texture
    "1500829243546-954cfa52b71e"  // Dark nature
  ],
  water: [
    "1551094056-b06f1d26391a",    // Blue water
    "1505118380757-91f5f5632de0", // Ocean waves
    "1476673132021-6949a3f9ba63", // Deep sea
    "1530053984702-c4e8da197202", // Blue abstract
    "1550684847-713e51d451cb",    // Liquid blue
    "1576302764793-7695ffd24177", // Water drops
    "1500375599374-0653051a1f78", // Pool texture
    "1421789665209-c9b2a435e3dc", // Blue ice
    "1522069169874-c586d817c2ae", // Underwater
    "1498026808560-5f3a5a814167"  // Blue gradient
  ]
};

// Specific Cover Images for Home Page (Splash Images)
const GALLERY_COVERS: Record<string, string> = {
    "g1": "1565214975484-3cfa9e56f914", // Neon Dreams: Tokyo Night
    "g2": "1494438639946-1ebd1d20bf85", // Silence: White Minimalist
    "g3": "1492684223066-81342ee5ff30", // Chaos: Explosion/Powder
    "g4": "1441974231531-c6227db76b6e", // Roots: Misty Trees
    "g5": "1550684848-fac1c5b4e853"    // Blue Depth: Deep Paint Swirl
};

const getRealImageUrl = (theme: string, index: number, width: number, height: number) => {
    let key = 'chaos';
    if (theme.includes('neon')) key = 'neon';
    else if (theme.includes('minimal') || theme.includes('white')) key = 'minimal';
    else if (theme.includes('nature') || theme.includes('roots')) key = 'roots';
    else if (theme.includes('blue') || theme.includes('ocean')) key = 'water';
    else if (theme.includes('chaos') || theme.includes('fire')) key = 'chaos';

    const ids = ART_IDS[key];
    const id = ids[index % ids.length];
    
    // Added version param to bust cache
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${width}&h=${height}&v=3`;
}

// Mock Data Generator
const generateGallery = (id: string, year: string, title: string, count: number, theme: string): Gallery => {
  const artworks: Artwork[] = Array.from({ length: count }).map((_, i) => {
    const aspectRoll = Math.random();
    let aspect: "portrait" | "landscape" | "square" = "square";
    let width = 1000;
    let height = 1000;
    let heightRatio = 1;
    let thumbWidth = 500;
    let thumbHeight = 500;

    if (aspectRoll < 0.4) {
        aspect = "portrait";
        width = 1000;
        height = 1500;
        thumbWidth = 500;
        thumbHeight = 750;
        heightRatio = 1.5;
    } else if (aspectRoll > 0.7) {
        aspect = "landscape";
        width = 1500;
        height = 1000;
        thumbWidth = 750;
        thumbHeight = 500;
        heightRatio = 0.66;
    }

    return {
      id: `${id}-art-${i}`,
      title: `${title} No. ${i + 1}`,
      year,
      description: "Mixed media on canvas. A deep dive into the emotions of the era.",
      src: getRealImageUrl(theme, i, 1600, Math.floor(1600 * heightRatio)),
      thumbnail: getRealImageUrl(theme, i, thumbWidth, thumbHeight),
      aspect,
      heightRatio
    };
  });

  // Explicitly grab cover ID from map
  const coverId = GALLERY_COVERS[id];
  // Ensure we fall back to first artwork if map fails (unlikely)
  const coverImage = coverId 
      ? `https://images.unsplash.com/photo-${coverId}?auto=format&fit=crop&q=85&w=1200&h=1600&v=3`
      : artworks[0].src;

  return {
    id,
    title,
    year,
    coverImage,
    artworks,
  };
};

export const galleries: Gallery[] = [
  generateGallery("g1", "2024", "Neon Dreams", 24, "neon,cyberpunk,vibrant,lights,city,rain,abstract"),
  generateGallery("g2", "2023", "Silence", 20, "minimalist,white,grey,fog,calm,zen,texture,abstract"),
  generateGallery("g3", "2022", "Chaos", 22, "chaos,explosion,red,black,fire,energy,abstract,dark"),
  generateGallery("g4", "2021", "Roots", 18, "nature,roots,earth,green,forest,detailed,organic,moss"),
  generateGallery("g5", "2020", "Blue Depth", 16, "ocean,blue,underwater,deep,liquid,abstract,waves"),
];
