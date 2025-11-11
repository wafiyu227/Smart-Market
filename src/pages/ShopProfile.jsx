import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Store,
  Phone,
  MapPin,
  ArrowLeft,
  Search,
  Filter,
  ShoppingCart,
  MessageCircle,
  Share2,
  Heart,
  Star,
  Package,
  Clock,
  CheckCircle,
  Crown,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function ShopProfile() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    reviewer_name: "",
    rating: 0,
    comment: "",
  });

  // Avoid double-recording visits in StrictMode: useRef to persist across renders
  const visitRecordedRef = useRef(false);

  // Check if shop is Pro
  const isProShop = shop?.subscription_plan === 'pro' && shop?.subscription_status === 'active';

  // --------------------------
  // Load reviews for shop (ONLY if Pro)
  // --------------------------
  useEffect(() => {
    if (shop && isProShop) {
      loadReviews();
    }
  }, [shop, isProShop]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("shop_id", shop.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading reviews:", error);
        return;
      }
      setReviews(data || []);
    } catch (err) {
      console.error("Unexpected error loading reviews:", err);
    }
  };

  // --------------------------
  // Submit review (ONLY for Pro shops)
  // --------------------------
  const submitReview = async () => {
    // Check if shop is Pro
    if (!isProShop) {
      alert("Reviews are only available for Pro shops.");
      setIsReviewModalOpen(false);
      return;
    }

    // basic validation
    if (!newReview.reviewer_name.trim()) {
      alert("Please provide your name.");
      return;
    }
    if (!newReview.rating || newReview.rating < 1) {
      alert("Please select a rating.");
      return;
    }
    if (!newReview.comment.trim()) {
      alert("Please write a comment.");
      return;
    }

    try {
      // get visitor IP (best-effort)
      const visitorIP = await getVisitorIP();
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // fetch recent reviews for this shop in last 24h
      const { data: recent, error: recentError } = await supabase
        .from("reviews")
        .select("*")
        .eq("shop_id", shop.id)
        .gte("created_at", oneDayAgo);

      if (recentError) {
        console.error("Error fetching recent reviews:", recentError);
      }

      const normalizedName = newReview.reviewer_name.trim().toLowerCase();

      // Check in fetched recent results in JS
      const duplicate = (recent || []).some((r) => {
        const rName = (r.reviewer_name || "").toLowerCase();
        const rIp = r.visitor_ip || "";
        return rName === normalizedName || (visitorIP && rIp === visitorIP);
      });

      if (duplicate) {
        alert("You have already left a review for this shop in the last 24 hours.");
        return;
      }

      // Insert review
      const insertPayload = {
        shop_id: shop.id,
        customer_name: newReview.reviewer_name.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      };

      const { error: insertError } = await supabase.from("reviews").insert([insertPayload]);

      if (insertError) {
        console.error("Error inserting review:", insertError);
        alert("Failed to submit review.");
        return;
      }

      // success — refresh reviews
      setNewReview({ reviewer_name: "", rating: 0, comment: "" });
      setIsReviewModalOpen(false);
      await loadReviews();
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Unexpected error submitting review:", err);
      alert("Failed to submit review.");
    }
  };

  // --------------------------
  // Record shop visits
  // --------------------------
  useEffect(() => {
    const recordVisit = async () => {
      if (!name) return;
      if (visitRecordedRef.current) return;
      visitRecordedRef.current = true;

      try {
        const visitorIP = await getVisitorIP();
        const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60).toISOString();

        const { data: existing, error: selectError } = await supabase
          .from("shop_visits")
          .select("id")
          .eq("shop_name", name)
          .eq("visitor_ip", visitorIP)
          .gte("visited_at", oneHourAgo);

        if (selectError) throw selectError;

        if (!existing?.length) {
          const { error: insertError } = await supabase.from("shop_visits").insert([
            {
              shop_name: name,
              visitor_ip: visitorIP,
              user_agent: navigator.userAgent,
            },
          ]);
          if (insertError) throw insertError;
        }
      } catch (err) {
        console.error("Error recording visit:", err?.message || err);
      }
    };

    recordVisit();
  }, [name]);

  // helper to get visitor IP
  const getVisitorIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const d = await response.json();
      return d.ip;
    } catch {
      return "unknown";
    }
  };

  // --------------------------
  // Load shop and products
  // --------------------------
  useEffect(() => {
    loadShopAndProducts();
  }, [name]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy]);

  const loadShopAndProducts = async () => {
    try {
      setLoading(true);
      const decodedName = decodeURIComponent(name);

      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("name", decodedName)
        .single();

      if (shopError) throw shopError;
      setShop(shopData);

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", shopData.id)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (err) {
      console.error("Error loading shop:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    setFilteredProducts(filtered);
  };

  const contactSeller = (productName = null) => {
    if (!shop?.whatsapp_number) {
      alert("Seller's WhatsApp contact not available");
      return;
    }

    const phone = shop.whatsapp_number.replace(/[^0-9]/g, "");
    let message = `Hi! I'm interested in products from your shop *${shop.name}* on Smart Market`;

    if (productName) {
      message = `Hi! I'm interested in *${productName}* from your shop *${shop.name} on Smart Market*`;
    }

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareShop = () => {
    const shareUrl = window.location.href;
    const message = `Check out ${shop.name} on Smart Market! ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: message,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Shop link copied to clipboard!");
    }
  };

  // Calculate average and total reviews for display (ONLY for Pro shops)
  const totalReviews = isProShop ? reviews.length : 0;
  const avgRating = totalReviews
    ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / totalReviews).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Store className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading shop...</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Not Found</h1>
          <p className="text-gray-600 mb-6">The shop you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <button onClick={shareShop} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shop Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold">{shop.name}</h1>
                    
                    {/* Pro Badge */}
                    {isProShop && (
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full shadow-lg">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm font-bold">PRO</span>
                      </div>
                    )}
                    
                    {/* Rating Badge - ONLY for Pro shops */}
                    {isProShop && totalReviews > 0 && (
                      <div className="flex items-center gap-2 bg-white bg-opacity-10 px-3 py-1 rounded-full">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-semibold">{avgRating}</span>
                        <span className="text-sm text-white/90">·</span>
                        <span className="text-sm text-white/90">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white text-opacity-90">Verified Seller</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-white text-opacity-90 mb-6 max-w-2xl">{shop.description || "Welcome to our shop!"}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {shop.location && (
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur px-4 py-2 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur px-4 py-2 rounded-lg">
                  <Package className="w-4 h-4" />
                  <span>{products.length} Products</span>
                </div>
              </div>

              {shop.whatsapp_number && (
                <button onClick={() => contactSeller()} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg">
                  <MessageCircle className="w-5 h-5" />
                  Chat with Seller
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{searchQuery ? "No products found" : "No products available"}</h3>
            <p className="text-gray-600">{searchQuery ? "Try adjusting your search terms" : "This shop hasn't added any products yet"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || "No description available"}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">₵{Number(product.price).toFixed(2)}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); contactSeller(product.name); }} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section - ONLY for Pro shops */}
      {isProShop && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <button 
              onClick={() => setIsReviewModalOpen(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
            >
              Leave a Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to leave one!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white shadow-sm rounded-xl p-5 border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{rev.customer_name || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 mt-3">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="relative">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-96 object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      In Stock
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-4xl font-bold text-indigo-600 mb-2">₵{Number(selectedProduct.price).toFixed(2)}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description || "No detailed description available for this product."}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Sold by</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{shop.name}</p>
                          {isProShop && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                              <Crown className="w-3 h-3" />
                              <span className="text-xs font-bold">PRO</span>
                            </div>
                          )}
                        </div>
                        {shop.location && <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3" />{shop.location}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => contactSeller(selectedProduct.name)} className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5" />
                    Chat with Seller
                  </button>
                  <button onClick={() => setSelectedProduct(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal - ONLY for Pro shops */}
      {isReviewModalOpen && isProShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setIsReviewModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h3>

            {/* Reviewer name */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
              <input
                type="text"
                value={newReview.reviewer_name}
                onChange={(e) => setNewReview((p) => ({ ...p, reviewer_name: e.target.value }))}
                placeholder="e.g., Ama, Kofi..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 cursor-pointer transition-colors ${i < newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                    onClick={() => setNewReview((prev) => ({ ...prev, rating: i + 1 }))}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your review</label>
              <textarea
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                rows="4"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsReviewModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Contact Button (Mobile) */}
      {shop.whatsapp_number && (
        <button onClick={() => contactSeller()} className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl md:hidden z-40 transition-transform hover:scale-110">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}