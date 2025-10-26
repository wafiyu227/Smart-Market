import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Search,
  MapPin,
  Package,
  TrendingUp,
  Tag,
  ArrowRight,
  Grid,
  Star,
  Crown,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = [
  { name: "Electronics & Gadgets", icon: "💻" },
  { name: "Fashion & Clothing", icon: "👔" },
  { name: "Beauty & Cosmetics", icon: "💄" },
  { name: "Food & Beverages", icon: "🍔" },
  { name: "Home & Furniture", icon: "🛋️" },
  { name: "Sports & Fitness", icon: "⚽" },
  { name: "Books & Stationery", icon: "📚" },
  { name: "Toys & Games", icon: "🎮" },
  { name: "Jewelry & Accessories", icon: "💍" },
  { name: "Health & Wellness", icon: "⚕️" },
  { name: "Automotive", icon: "🚗" },
  { name: "Art & Crafts", icon: "🎨" },
];

export default function HomeSearch() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [locations, setLocations] = useState([]);
  const [shopRatings, setShopRatings] = useState({});

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase.from("shops").select("location");
      if (error) throw error;

      // Extract unique locations, filter out empty/null, and sort alphabetically
      const uniqueLocations = [
        ...new Set(
          data
            .map((s) => s.location)
            .filter((loc) => loc && loc.trim() !== "")
            .map((loc) => loc.trim()) // Trim whitespace from each location
        ),
      ].sort((a, b) => a.localeCompare(b)); // Sort alphabetically
      
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  // Fetch ratings for multiple shops (ONLY Pro shops)
  const loadRatingsForShops = async (shops) => {
    try {
      // Filter only Pro shops
      const proShops = shops.filter(shop => 
        shop.subscription_plan === 'pro' && shop.subscription_status === 'active'
      );
      
      if (proShops.length === 0) {
        setShopRatings({});
        return;
      }

      const proShopIds = proShops.map(s => s.id);

      const { data, error } = await supabase
        .from("reviews")
        .select("shop_id, rating")
        .in("shop_id", proShopIds);

      if (error) throw error;

      // Calculate average rating for each Pro shop
      const ratingsMap = {};
      
      proShopIds.forEach(shopId => {
        const shopReviews = data.filter(r => r.shop_id === shopId);
        if (shopReviews.length > 0) {
          const avgRating = shopReviews.reduce((sum, r) => sum + Number(r.rating), 0) / shopReviews.length;
          ratingsMap[shopId] = {
            average: avgRating.toFixed(1),
            count: shopReviews.length
          };
        } else {
          ratingsMap[shopId] = {
            average: null,
            count: 0
          };
        }
      });

      setShopRatings(ratingsMap);
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim() && !selectedLocation) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // --- Search by category ---
      const { data: categoryMatches, error: catError } = await supabase
        .from("shops")
        .select("*, products!fk_products_shop(*)")
        .ilike("category", `%${searchQuery}%`);
    
      if (catError) throw catError;
    
      let categoryShops = categoryMatches || [];
    
      // --- Search by product name ---
      const { data: productMatches, error: prodError } = await supabase
        .from("products")
        .select("*, shops!fk_products_shop(*)")
        .ilike("name", `%${searchQuery}%`);
    
      if (prodError) throw prodError;

      const productShops =
        productMatches
          ?.map((p) =>
            p.shops
              ? {
                  ...p.shops,
                  matchingProduct: p.name,
                  matchType: "product",
                }
              : null
          )
          .filter(Boolean) || [];

      // --- Merge and deduplicate ---
      const seen = new Set();
      const combined = [];

      categoryShops.forEach((shop) => {
        if (!seen.has(shop.id)) {
          seen.add(shop.id);
          combined.push({
            ...shop,
            matchType: "category",
            productCount: shop.products?.length || 0,
            sampleProducts: shop.products?.slice(0, 2) || [],
          });
        }
      });

      productShops.forEach((shop) => {
        if (!seen.has(shop.id)) {
          seen.add(shop.id);
          combined.push(shop);
        }
      });

      // --- Filter by location if selected ---
      const filteredResults = selectedLocation
        ? combined.filter((shop) => 
            shop.location && 
            shop.location.trim().toLowerCase() === selectedLocation.trim().toLowerCase()
          )
        : combined;

      // --- Sort by match type (category > product) ---
      filteredResults.sort((a, b) => {
        if (a.matchType === "category" && b.matchType !== "category") return -1;
        if (a.matchType !== "category" && b.matchType === "category") return 1;
        return b.productCount - a.productCount;
      });

      setSearchResults(filteredResults);

      // Load ratings for all Pro shops in results
      if (filteredResults.length > 0) {
        await loadRatingsForShops(filteredResults);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSearchQuery(category);
    setTimeout(() => {
      document.getElementById("search-form")?.requestSubmit();
    }, 100);
  };

  const visitShop = (shopName) => {
    navigate(`/shop/${encodeURIComponent(shopName)}`);
  };

  const viewAllResults = () => {
    navigate(
      `/search-results?q=${encodeURIComponent(
        searchQuery
      )}&location=${encodeURIComponent(selectedLocation)}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Local Shops & Products
            </h1>
            <p className="text-xl text-indigo-100">
              Find the best shops in your area
            </p>
          </div>

          {/* Search Bar */}
          <form
            id="search-form"
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-3">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products or categories..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-white border border-gray-200"
                  />
                </div>

                {/* Location Filter & Search Button */}
                <div className="flex gap-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="flex-1 min-w-[150px] px-4 py-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-white border border-gray-200 appearance-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 md:px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="hidden sm:inline">Searching</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 sm:hidden" />
                        <span className="hidden sm:inline">Search</span>
                        <span className="sm:hidden">Go</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasSearched ? (
          <>
            {/* Categories Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Grid className="w-6 h-6 text-indigo-600" />
                Browse by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                  >
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Popular Searches
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Electronics", "Fashion", "Beauty", "Food", "Furniture"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => handleCategoryClick(term)}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 rounded-xl font-medium transition-all"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        ) : loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Store className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Searching...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No shops found
            </h3>
            <p className="text-gray-600 mb-6">
              Try different search terms or browse categories above
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("");
                setHasSearched(false);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Store className="w-6 h-6 text-indigo-600" />
                Search Results ({searchResults.length})
              </h2>
              {searchResults.length >= 6 && (
                <button
                  onClick={viewAllResults}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  onVisit={visitShop}
                  highlightProduct={shop.matchingProduct}
                  rating={shopRatings[shop.id]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ShopCard Component with Rating (ONLY for Pro shops)
function ShopCard({ shop, onVisit, highlightProduct, rating }) {
  const isProShop = shop.subscription_plan === 'pro' && shop.subscription_status === 'active';
  
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors truncate">
                  {shop.name}
                </h3>
                {/* Pro Badge */}
                {isProShop && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                    <span className="text-xs font-bold">PRO</span>
                  </div>
                )}
              </div>
              {shop.location && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{shop.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category and Rating Badges - Rating ONLY for Pro shops */}
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          {shop.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
              <Tag className="w-3 h-3 mr-1" />
              {shop.category}
            </span>
          )}
          
          {/* Show rating ONLY if shop is Pro AND has reviews */}
          {isProShop && rating && rating.count > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full shadow-sm">
              <Star className="w-3.5 h-3.5 fill-white" />
              <span className="text-sm font-bold">{rating.average}</span>
              <span className="text-xs opacity-90">({rating.count})</span>
            </div>
          )}
        </div>

        {shop.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {shop.description}
          </p>
        )}

        {highlightProduct && (
          <p className="text-sm text-green-600 font-medium mb-2">
            ✓ Sells: {highlightProduct}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-indigo-600 font-medium">
            <Package className="w-4 h-4" />
            <span>
              {shop.productCount || 0}{" "}
              {shop.productCount === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>
      </div>

      {shop.sampleProducts && shop.sampleProducts.length > 0 && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Featured Products
          </p>
          <div className="grid grid-cols-2 gap-3">
            {shop.sampleProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group/product"
              >
                {product.image_url ? (
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    <Package className="w-10 h-10 text-indigo-300" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-900 truncate mb-1">
                    {product.name}
                  </p>
                  <p className="text-base font-bold text-indigo-600">
                    ₵{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white">
        <button
          onClick={() => onVisit(shop.name)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
        >
          View Shop
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}