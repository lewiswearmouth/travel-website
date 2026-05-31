export type CountryPhoto = {
  file: string;
  caption?: string;
  locationId?: string;
  locationLabel?: string;
  date?: string;
  cover?: boolean;
};

export type CountryPhotoAlbum = {
  folder: string;
  photos: CountryPhoto[];
};

// Example:
// Spain: {
//   folder: "spain",
//   photos: [
//     {
//       file: "atletico-game.jpg",
//       caption: "Atletico game",
//       locationId: "madrid",
//       locationLabel: "Madrid",
//       cover: true,
//     },
//   ],
// },
export const COUNTRY_PHOTO_ALBUMS: Record<string, CountryPhotoAlbum> = {
  Albania: { folder: "albania", photos: [] },
  Argentina: {
    folder: "argentina",
    photos: [
      { file: "IMG_1504.HEIC", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1506.HEIC", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1579.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1602.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1652.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024", cover: true },
      { file: "IMG_1684.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1691.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1694.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1695.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1696.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1707.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_1708.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_7586.jpeg", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_7806.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
      { file: "IMG_9701.JPG", locationId: "buenos-aires", locationLabel: "Buenos Aires", caption: "December 2024" },
    ],
  },
  Austria: { folder: "austria", photos: [] },
  "Bosnia and Herzegovina": { folder: "bosnia-and-herzegovina", photos: [] },
  Cambodia: { folder: "cambodia", photos: [] },
  Chile: {
    folder: "chile",
    photos: [
      { file: "IMG_1605.HEIC", locationId: "valparaiso", caption: "January 2025" },
      { file: "IMG_1758.JPG", locationId: "valparaiso", caption: "January 2025" },
      { file: "IMG_1761.JPG", locationId: "valparaiso", caption: "January 2025" },
      { file: "IMG_1792.JPG", locationId: "valparaiso", caption: "January 2025" },
      { file: "IMG_1608.HEIC", locationId: "olmue", caption: "January 2025" },
      { file: "IMG_1723.JPG", locationId: "olmue", caption: "January 2025" },
      { file: "IMG_1725.JPG", locationId: "olmue", caption: "January 2025" },
      { file: "IMG_1578.jpg", locationId: "santiago", locationLabel: "Santiago", caption: "January 2025" },
      { file: "IMG_1626.jpg", locationId: "santiago", locationLabel: "Santiago", caption: "January 2025" },
      { file: "IMG_1628.jpg", locationId: "santiago", locationLabel: "Santiago", caption: "January 2025", cover: true },
      { file: "IMG_1730.JPG", locationId: "santiago", locationLabel: "Santiago", caption: "January 2025" },
      { file: "IMG_1733.JPG", locationId: "santiago", locationLabel: "Santiago", caption: "January 2025" },
      { file: "IMG_1749.JPG", locationId: "santiago", locationLabel: "Santiago", caption: "January 2025" },
    ],
  },
  Croatia: { folder: "croatia", photos: [] },
  France: { folder: "france", photos: [] },
  Germany: { folder: "germany", photos: [] },
  Hungary: { folder: "hungary", photos: [] },
  Ireland: { folder: "ireland", photos: [] },
  Italy: { folder: "italy", photos: [] },
  Monaco: { folder: "monaco", photos: [] },
  Montenegro: { folder: "montenegro", photos: [] },
  Morocco: { folder: "morocco", photos: [] },
  Peru: {
    folder: "peru",
    photos: [
      { file: "IMG_1998.JPG", caption: "May 2025", locationId: "cusco" },
      { file: "IMG_3394.jpg", caption: "May 2025", locationId: "cusco" },
      { file: "IMG_3390.jpg", caption: "May 2025", locationId: "cusco" },
      { file: "IMG_3423.jpg", caption: "Salkantay Trek May 2025", cover: true },
      { file: "IMG_3441.jpg", caption: "Salkantay Trek May 2025" },
      { file: "IMG_3447.jpg", caption: "Salkantay Trek May 2025" },
      { file: "IMG_3474.jpg", caption: "Salkantay Trek May 2025" },
      { file: "IMG_3521.jpg", caption: "Salkantay Trek May 2025" },
      { file: "IMG_0026.jpg", caption: "Salkantay Trek May 2025" },
      { file: "IMG_0060.JPG", caption: "Salkantay Trek May 2025" },
      { file: "IMG_2453.JPG", caption: "Salkantay Trek May 2025" },
      { file: "IMG_2216.JPG", caption: "Machu Picchu May 2025" },
      { file: "IMG_2596.JPG", caption: "Machu Picchu May 2025" },
      { file: "IMG_3547.jpg", caption: "Machu Picchu May 2025" },
      { file: "machu-picchu.jpg", caption: "Machu Picchu May 2025" },
      { file: "IMG_3663.jpg", caption: "May 2025", locationId: "arequipa" },
      { file: "IMG_3669.jpg", caption: "May 2025", locationId: "arequipa" },
      { file: "IMG_3673.jpg", caption: "May 2025", locationId: "arequipa" },
      { file: "IMG_3690.jpg", caption: "May 2025", locationId: "huacachina" },
      { file: "IMG_3711.jpg", caption: "May 2025", locationId: "huacachina" },
      { file: "IMG_3714.jpg", caption: "May 2025", locationId: "huacachina" },
      { file: "IMG_3717.jpg", caption: "May 2025", locationId: "huacachina" },
      { file: "IMG_3752.jpg", caption: "May 2025", locationId: "lima" },
      { file: "IMG_3754.jpg", caption: "May 2025", locationId: "lima" },
    ],
  },
  Portugal: { folder: "portugal", photos: [] },
  Slovenia: { folder: "slovenia", photos: [] },
  Spain: { folder: "spain", photos: [] },
  Switzerland: { folder: "switzerland", photos: [] },
  Thailand: { folder: "thailand", photos: [] },
  "United Kingdom": { folder: "united-kingdom", photos: [] },
  "United States": { folder: "united-states", photos: [] },
  Uruguay: {
    folder: "uruguay",
    photos: [
      { file: "IMG_1675.JPG", locationId: "colonia-del-sacramento", locationLabel: "Colonia del Sacramento", caption: "December 2024", cover: true },
      { file: "IMG_1684(1).JPG", locationId: "colonia-del-sacramento", locationLabel: "Colonia del Sacramento", caption: "December 2024" },
      { file: "IMG_7752.JPG", locationId: "colonia-del-sacramento", locationLabel: "Colonia del Sacramento", caption: "December 2024" },
      { file: "IMG_1694(1).JPG", locationId: "montevideo", locationLabel: "Montevideo", caption: "December 2024" },
    ],
  },
  Vietnam: { folder: "vietnam", photos: [] },
};
