/** Off the Map cards. Coordinates are decimal degrees (north and east
 * positive). Country cards use the country's outline on the map: a pin
 * anywhere inside scores full marks. City and country cards hide the map's
 * names until the reveal. */
export type MapPack = "landmark" | "nature" | "country" | "city";

export interface MapCard {
  pack: MapPack;
  /** What the card asks about, e.g. "Machu Picchu". */
  name: string;
  /** Shown under the answer on the reveal. */
  where: string;
  lat: number;
  lng: number;
  fact: string;
  /** Country cards: the country's name in /public/daily/countries.json. */
  country?: string;
}

export const PACKS: Record<MapPack, { label: string; ask: string; emoji: string; tint: string }> = {
  landmark: { label: "Landmarks", ask: "Where is it?", emoji: "🏛️", tint: "bg-yellow-300" },
  nature: { label: "Wild places", ask: "Where is it?", emoji: "🌋", tint: "bg-lime-300" },
  country: { label: "Where is this country?", ask: "Where is this country?", emoji: "🗺️", tint: "bg-sky-300" },
  city: { label: "Where is this city?", ask: "Where is this city?", emoji: "🏙️", tint: "bg-pink-300" },
};

const L = (name: string, where: string, lat: number, lng: number, fact: string): MapCard => ({ pack: "landmark", name, where, lat, lng, fact });
const N = (name: string, where: string, lat: number, lng: number, fact: string): MapCard => ({ pack: "nature", name, where, lat, lng, fact });
const C = (name: string, lat: number, lng: number, fact: string, country = name): MapCard => ({ pack: "country", name, where: name, lat, lng, fact, country });
const T = (name: string, where: string, lat: number, lng: number, fact: string): MapCard => ({ pack: "city", name, where, lat, lng, fact });

export const MAP_CARDS: readonly MapCard[] = [
  // Landmarks
  L("Eiffel Tower", "Paris, France", 48.858, 2.294, "Built for the 1889 World's Fair and meant to stand for only 20 years."),
  L("Statue of Liberty", "New York, USA", 40.689, -74.045, "A gift from France, shipped across the Atlantic in pieces."),
  L("Machu Picchu", "Cusco region, Peru", -13.163, -72.545, "An Inca citadel built high on a ridge above the Urubamba valley."),
  L("Great Pyramid of Giza", "Giza, Egypt", 29.979, 31.134, "The oldest of the ancient Seven Wonders, and the only one still standing."),
  L("Taj Mahal", "Agra, India", 27.175, 78.042, "A white marble tomb built by an emperor in memory of his wife."),
  L("Sydney Opera House", "Sydney, Australia", -33.857, 151.215, "Its roof shells are covered in more than a million tiles."),
  L("Christ the Redeemer", "Rio de Janeiro, Brazil", -22.952, -43.211, "The statue stands on top of Corcovado mountain, looking over the city."),
  L("The Colosseum", "Rome, Italy", 41.89, 12.492, "Ancient Rome's biggest arena, used for gladiator fights and shows."),
  L("Petra", "Jordan", 30.329, 35.444, "A city with buildings carved straight into rose-coloured cliffs."),
  L("Angkor Wat", "Siem Reap, Cambodia", 13.412, 103.867, "One of the largest religious monuments in the world."),
  L("Golden Gate Bridge", "San Francisco, USA", 37.82, -122.478, "Its famous colour is officially called International Orange."),
  L("Stonehenge", "Wiltshire, England", 51.179, -1.826, "A ring of standing stones raised thousands of years ago."),
  L("Chichén Itzá", "Yucatán, Mexico", 20.684, -88.568, "A great Maya city with a stepped pyramid at its centre."),
  L("Burj Khalifa", "Dubai, UAE", 25.197, 55.274, "The tallest building in the world since 2010."),
  L("Sagrada Família", "Barcelona, Spain", 41.404, 2.174, "Gaudí's basilica has been under construction since 1882."),
  L("The Acropolis", "Athens, Greece", 37.972, 23.726, "The Parthenon temple sits on this rocky hill above Athens."),
  L("Red Square", "Moscow, Russia", 55.754, 37.62, "Home of the colourful onion domes of St Basil's Cathedral."),
  L("The Forbidden City", "Beijing, China", 39.916, 116.397, "China's imperial palace for almost 500 years."),
  L("Hagia Sophia", "Istanbul, Türkiye", 41.009, 28.98, "Its huge dome has stood over the city for about 1,500 years."),
  L("Times Square", "New York, USA", 40.758, -73.986, "Famous for its giant screens and the New Year's Eve ball drop."),
  L("The Hollywood Sign", "Los Angeles, USA", 34.134, -118.322, "It first read HOLLYWOODLAND and was an advert for houses."),
  L("Neuschwanstein Castle", "Bavaria, Germany", 47.558, 10.75, "A fairy-tale castle built for King Ludwig II."),
  L("Leaning Tower of Pisa", "Pisa, Italy", 43.723, 10.397, "It started leaning while it was still being built."),
  L("Big Ben", "London, England", 51.501, -0.125, "Big Ben is really the name of the great bell inside the tower."),
  L("Mount Rushmore", "South Dakota, USA", 43.879, -103.459, "Four presidents' faces carved into a granite mountain."),
  L("CN Tower", "Toronto, Canada", 43.643, -79.387, "You can walk around the outside edge, strapped to a rail, 356 m up."),
  L("Marina Bay Sands", "Singapore", 1.283, 103.86, "Three hotel towers joined at the top by a giant rooftop deck."),
  L("Petronas Towers", "Kuala Lumpur, Malaysia", 3.158, 101.712, "Twin towers linked by a sky bridge on the 41st and 42nd floors."),
  L("Moai of Easter Island", "Rapa Nui, Chile", -27.12, -109.35, "Nearly 1,000 giant stone heads stand on this remote island."),
  L("Fushimi Inari Shrine", "Kyoto, Japan", 34.967, 135.773, "Thousands of orange torii gates line its mountain paths."),
  L("Edinburgh Castle", "Edinburgh, Scotland", 55.949, -3.2, "It sits on top of an old volcanic rock in the middle of the city."),
  L("The Panama Canal", "Panama", 9.08, -79.68, "Ships are lifted through locks to cross between two oceans."),
  L("Hobbiton", "Matamata, New Zealand", -37.872, 175.683, "The film set for the Shire is now a working tourist village."),
  L("Space Needle", "Seattle, USA", 47.62, -122.349, "Built for the 1962 World's Fair."),
  L("Brandenburg Gate", "Berlin, Germany", 52.516, 13.378, "Once stuck behind the Berlin Wall, now a symbol of a united Germany."),

  // Wild places
  N("Mount Everest", "Nepal and China", 27.988, 86.925, "The highest mountain above sea level, on the border of Nepal and China."),
  N("Victoria Falls", "Zambia and Zimbabwe", -17.925, 25.857, "Locals call it the Smoke That Thunders."),
  N("Niagara Falls", "Canada and USA", 43.08, -79.074, "Three waterfalls on the river between Lake Erie and Lake Ontario."),
  N("The Grand Canyon", "Arizona, USA", 36.107, -112.113, "Carved by the Colorado River over millions of years."),
  N("Uluru", "Northern Territory, Australia", -25.344, 131.036, "A giant sandstone rock that glows red at sunset."),
  N("Mount Kilimanjaro", "Tanzania", -3.068, 37.356, "Africa's highest mountain, with snow near the equator."),
  N("Mount Fuji", "Japan", 35.361, 138.727, "Japan's highest peak, an active volcano west of Tokyo."),
  N("Iguazu Falls", "Argentina and Brazil", -25.695, -54.437, "Around 275 separate drops spread along the river's edge."),
  N("The Galápagos Islands", "Ecuador", -0.6, -90.4, "The islands whose animals helped Darwin think about evolution."),
  N("The Dead Sea", "Israel, Jordan and Palestine", 31.5, 35.5, "So salty you float without trying."),
  N("Salar de Uyuni", "Bolivia", -20.13, -67.49, "The world's largest salt flat. After rain it turns into a giant mirror."),
  N("The Great Barrier Reef", "Queensland, Australia", -18.29, 147.7, "The world's largest coral reef system, visible from space."),
  N("The Matterhorn", "Switzerland and Italy", 45.976, 7.658, "The pointy peak that inspired a famous chocolate bar's shape."),
  N("The Serengeti", "Tanzania", -2.33, 34.83, "Home of the great wildebeest migration."),
  N("Ha Long Bay", "Vietnam", 20.91, 107.18, "Thousands of limestone islands rise out of emerald water."),
  N("Milford Sound", "South Island, New Zealand", -44.641, 167.897, "A fjord with waterfalls pouring off its steep cliffs."),
  N("Cliffs of Moher", "County Clare, Ireland", 52.972, -9.426, "Sea cliffs facing the Atlantic, up to about 214 m high."),
  N("Bora Bora", "French Polynesia", -16.5, -151.74, "A volcanic island ringed by a turquoise lagoon."),
  N("Avenue of the Baobabs", "Madagascar", -20.251, 44.418, "A dirt road lined with giant baobab trees."),
  N("Cape Horn", "Chile", -55.98, -67.27, "The southern tip of South America, famous for wild seas."),
  N("Lake Baikal", "Siberia, Russia", 53.5, 108.0, "The deepest lake in the world."),
  N("The Amazon river mouth", "Pará, Brazil", -0.5, -49.5, "Where the world's biggest river pours into the Atlantic."),
  N("The Sahara's Erg Chebbi dunes", "Morocco", 31.15, -4.0, "Orange dunes up to 150 m tall at the edge of the Sahara."),
  N("Yellowstone's Old Faithful", "Wyoming, USA", 44.46, -110.828, "A geyser that erupts roughly every hour or two."),
  N("Table Mountain", "Cape Town, South Africa", -33.963, 18.41, "A flat-topped mountain often covered by a 'tablecloth' of cloud."),

  // Countries
  C("Mongolia", 46.9, 103.8, "Big, high and landlocked, between Russia and China."),
  C("Peru", -9.2, -75.0, "On the Pacific coast of South America, home of the Inca."),
  C("Kenya", 0.2, 37.9, "East Africa, on the equator, with a coast on the Indian Ocean."),
  C("Vietnam", 15.9, 105.8, "A long S-shaped country down the east side of mainland Southeast Asia."),
  C("Portugal", 39.6, -8.0, "The western edge of mainland Europe, next to Spain."),
  C("Madagascar", -19.4, 46.7, "A huge island off the south-east coast of Africa."),
  C("Kazakhstan", 48.0, 67.0, "The world's biggest landlocked country, in Central Asia."),
  C("Chile", -35.7, -71.5, "Very long and very thin, down the west coast of South America."),
  C("Iceland", 64.9, -18.6, "A volcanic island in the North Atlantic, just below the Arctic Circle."),
  C("Nepal", 28.4, 84.1, "In the Himalayas, between India and China."),
  C("Morocco", 31.8, -7.1, "North-west Africa, just across the sea from Spain."),
  C("Finland", 64.0, 26.0, "Northern Europe, between Sweden and Russia."),
  C("Colombia", 4.6, -74.1, "The north-west corner of South America, with coasts on two oceans."),
  C("Thailand", 15.1, 101.0, "Southeast Asia, with a long tail running down towards Malaysia."),
  C("Ethiopia", 8.6, 39.6, "In the Horn of Africa, one of the world's most mountainous countries."),
  C("Ukraine", 49.0, 31.3, "Eastern Europe, on the north coast of the Black Sea."),
  C("Saudi Arabia", 23.9, 45.1, "It covers most of the Arabian Peninsula."),
  C("Bolivia", -16.7, -64.7, "Landlocked, in the middle of South America, high in the Andes."),
  C("New Zealand", -41.0, 174.0, "Two main islands in the South Pacific, south-east of Australia.", "New Zealand"),
  C("Poland", 52.1, 19.4, "Central Europe, between Germany and Belarus."),
  C("Cuba", 21.5, -79.5, "The biggest island in the Caribbean."),
  C("Laos", 18.2, 103.9, "Southeast Asia's only landlocked country."),
  C("Angola", -12.3, 17.5, "South-west Africa, on the Atlantic coast."),
  C("Greece", 39.1, 22.0, "South-east Europe, with thousands of islands."),
  C("Norway", 64.5, 12.0, "A long country with a jagged coast of fjords, in northern Europe."),
  C("Philippines", 12.9, 122.0, "Over 7,000 islands in the western Pacific.", "Philippines"),
  C("Pakistan", 30.4, 69.3, "South Asia, between India, Afghanistan and Iran."),
  C("Paraguay", -23.4, -58.4, "Landlocked, in the heart of South America."),
  C("Zambia", -13.1, 27.8, "Landlocked in southern Africa, home of Victoria Falls on its southern border."),
  C("Uzbekistan", 41.4, 64.6, "Central Asia, one of only two doubly landlocked countries."),

  // Cities
  T("Toronto", "Ontario, Canada", 43.653, -79.383, "Canada's biggest city, on the shore of Lake Ontario."),
  T("Nairobi", "Kenya", -1.286, 36.817, "Kenya's capital, with a national park inside the city limits."),
  T("Lima", "Peru", -12.046, -77.043, "Peru's capital, on the dry Pacific coast."),
  T("Mumbai", "India", 19.076, 72.878, "India's biggest city and the home of Bollywood."),
  T("Istanbul", "Türkiye", 41.008, 28.978, "A city that sits in both Europe and Asia, across the Bosphorus."),
  T("Cairo", "Egypt", 30.044, 31.236, "Egypt's capital, on the Nile just south of its delta."),
  T("Buenos Aires", "Argentina", -34.604, -58.382, "Argentina's capital, on the wide River Plate."),
  T("Bangkok", "Thailand", 13.756, 100.502, "Thailand's capital, on the Chao Phraya river."),
  T("Vancouver", "British Columbia, Canada", 49.283, -123.121, "A Pacific port with mountains right behind it."),
  T("Cape Town", "South Africa", -33.925, 18.424, "Near the south-west tip of Africa, under Table Mountain."),
  T("Reykjavík", "Iceland", 64.147, -21.942, "The world's northernmost capital of a sovereign country."),
  T("Singapore", "Singapore", 1.352, 103.82, "A city-state at the southern tip of the Malay Peninsula."),
  T("Mexico City", "Mexico", 19.433, -99.133, "Built on an old lake bed, high in central Mexico."),
  T("Seoul", "South Korea", 37.567, 126.978, "South Korea's capital, on the Han River."),
  T("Lagos", "Nigeria", 6.524, 3.379, "Nigeria's biggest city, on the Gulf of Guinea."),
  T("Perth", "Western Australia", -31.951, 115.861, "One of the most isolated big cities in the world."),
  T("Honolulu", "Hawaii, USA", 21.307, -157.858, "Hawaii's capital, in the middle of the Pacific."),
  T("Anchorage", "Alaska, USA", 61.218, -149.9, "Alaska's biggest city, on Cook Inlet."),
  T("Dubai", "UAE", 25.205, 55.271, "A desert city on the Persian Gulf."),
  T("Rio de Janeiro", "Brazil", -22.907, -43.173, "Famous for Copacabana beach and Carnival."),
  T("Moscow", "Russia", 55.756, 37.617, "Russia's capital, far inland on the Moskva river."),
  T("Tokyo", "Japan", 35.676, 139.65, "The world's biggest metro area, on Honshu's east coast."),
  T("Havana", "Cuba", 23.114, -82.367, "Cuba's capital, famous for its classic cars."),
  T("Ulaanbaatar", "Mongolia", 47.886, 106.906, "The coldest national capital on Earth on average."),
  T("Auckland", "New Zealand", -36.848, 174.763, "New Zealand's biggest city, built on dozens of old volcanoes."),
  T("Casablanca", "Morocco", 33.573, -7.59, "Morocco's biggest city, on the Atlantic coast."),
];
