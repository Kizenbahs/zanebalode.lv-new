export type Artwork = {
  id: string;
  title: string;
  year: string;
  description: string;
  src: string;      // High Res
  thumbnail: string; // Optimized for grid
  aspect: "portrait" | "landscape" | "square";
  heightRatio: number; // For layout calculations if needed
};

export type Gallery = {
  id: string;
  title: string;
  year: string;
  coverImage: string;
  artworks: Artwork[];
};
