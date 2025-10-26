import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Store,
  Search,
  MapPin,
  Package,
  Tag,
  ArrowRight,
  ArrowLeft,
  Filter,
  X,
  Loader,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("location") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [filterByType, setFilterByType] = useState("all"); // all, category, product
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadLocations();
    performSearch();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allResults, sortBy, filterByType]);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .select("location");

      if (error) throw error;

      const uniqueLocations = [...new Set(
        data.map(s => s.location).filter(loc => loc && loc.trim() !== "")
      )];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  const performSearch = async () => {
    setLoading(true);

    try {
      // Search for shops by category
      let categoryShops = [];
      if (searchQuery.trim()) {
        const { data: catData, error: catError } = await supabase
          .from("shops")
          .select(`
            *,
            products (*)
          `)
          .ilike("category", `%${searchQuery}%`);

        if (catError) throw catError;
        categoryShops = catData || [];
      }

      // Search for shops by products
      let productShops = [];
      if (searchQuery.trim()) {
        const { data: prodData, error: prodError } = await supabase
          .from("products")
          .select(`
            *,
            shops (*)
          `)
          .ilike("name", `%${searchQuery}%`);

        if (prodError) throw prodError;

        const shopIds = new Set();
        prodData?.forEach(product => {
          if (product.shops && !shopIds.has(product.shops.id)) {
            shopIds.add(product.shops.id);
            productShops.push({
              ...product.shops,
              matchingProduct: product.name
            });
          }
        });
      }

      // Apply location filter
      if (selectedLocation) {
        categoryShops = categoryShops.filter(shop => shop.location === selectedLocation);
        productShops = productShops.filter(shop => shop.location === selectedLocation);
      }

      // Process all shops
      const processCategoryShops = await Promise.all(
        categoryShops.map(async (shop) => {
          const { data: products } = await supabase
            .from("products")
            .select("*")
            .eq("shop_id", shop.id)
            .limit(2);

          const { data: allProducts } = await supabase
            .from("products")
            .select("id")
            .eq("shop_id", shop.id);

          return {
            ...shop,
            productCount: allProducts?.length || 0,
            sampleProducts: products || [],
            matchType: "category",
            relevanceScore: 10
          };
        })
      );

      const processProductShops = await Promise.all(
        productShops.map(async (shop) => {
          const { data: products } = await supabase
            .from("products")
            .select("*")
            .eq("shop_id", shop.id)
            .limit(2);

          const { data: allProducts } = await supabase
            .from("products")
            .select("id")
            .eq("shop_id", shop.id);

          return {
            ...shop,
            productCount: allProducts?.length || 0,
            sampleProducts: products || [],
            matchType: "product",
            relevanceScore: 5
          };
        })
      );

      // Combine and remove duplicates
      const shopIds = new Set();
      const combined = [];

      processCategoryShops.forEach(shop => {
        if (!shopIds.has(shop.id)) {
          shopIds.add(shop.id);
          combined.push(shop);
        }
      });

      processProductShops.forEach(shop => {
        if (!shopIds.has(shop.id)) {
          shopIds.add(shop.id);
          combined.push(shop);
        }
      });

      setAllResults(combined);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...allResults];

    // Filter by type
    if (filterByType !== "all") {
      results = results.filter(shop => shop.matchType === filterByType);
    }

    // Sort results
    switch (sortBy) {
      case "relevance":
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
      case "products":
        results.sort((a, b) => b.productCount - a.productCount);
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredResults(results);
  };

  const handleNewSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`);
    performSearch();
  };

  const visitShop = (shopName) => {
    navigate(`/shop/${encodeURIComponent(shopName)}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSortBy("relevance");
    setFilterByType("all");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Search Results</h1>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleNewSearch} className="mb-4">
            <div className="grid md:grid-cols-3 gap-2">
              <div className="md:col-span-2 relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or categories..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            {/* Type Filter */}
            <select
              value={filterByType}
              onChange={(e) => setFilterByType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
            >
              <option value="all">All Results</option>
              <option value="category">Category Matches</option>
              <option value="product">Product Matches</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
            >
              <option value="relevance">Most Relevant</option>
              <option value="products">Most Products</option>
              <option value="name">Name (A-Z)</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredResults.length} {filteredResults.length === 1 ? "shop" : "shops"} found
                {initialQuery && ` for "${initialQuery}"`}
                {selectedLocation && ` in ${selectedLocation}`}
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {filterByType === "all" ? "all results" : 
                  filterByType === "category" ? "category matches" : "product matches"}
              </p>
            </div>

            {/* Results Grid */}
            {filteredResults.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No shops found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Start New Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((shop) => (
                  <ShopCard 
                    key={shop.id} 
                    shop={shop} 
                    onVisit={visitShop}
                    highlightProduct={shop.matchingProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Shop Card Component (Same as HomePage but extracted)
function ShopCard({ shop, onVisit, highlightProduct }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Shop Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                {shop.name}
              </h3>
              {shop.location && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {shop.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {shop.category && (
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
              <Tag className="w-3 h-3 mr-1" />
              {shop.category}
            </span>
            {shop.matchType === "category" && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Category Match
              </span>
            )}
          </div>
        )}

        {shop.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {shop.description}
          </p>
        )}

        {highlightProduct && (
          <div className="mb-3">
            <p className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Package className="w-4 h-4" />
              Sells: {highlightProduct}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-indigo-600 font-medium">
            <Package className="w-4 h-4" />
            <span>{shop.productCount} {shop.productCount === 1 ? "Product" : "Products"}</span>
          </div>
        </div>
      </div>

      {/* Product Preview */}
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

      {/* Action Button */}
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