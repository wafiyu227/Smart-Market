import { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Edit,
  Trash2,
  Package,
  Phone,
  MapPin,
  Share2,
  Copy,
  ExternalLink,
  Eye,
  BarChart3,
  AlertCircle,
  LogOut,
  User,
  Crown,
  Zap,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/Authcontext";
import { useSubscription } from "../hooks/useSubscription";
import UpgradeBanner from "../components/UpgradeBanner";

export default function Dashboard() {
  const { user } = useAuth();
  const { shop, refreshShop, loading: shopLoading, error: shopError } = useShop();
  const subscription = useSubscription();

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    imagePreview: null,
  });

  // Check if shop is Pro
  const isProShop = subscription.isPro;

  // Fetch shop visits
  useEffect(() => {
    const fetchVisits = async () => {
      if (!shop?.name) return;
  
      const { count, error } = await supabase
        .from("shop_visits")
        .select("*", { count: "exact", head: true })
        .eq("shop_name", shop.name);
  
      if (error) console.error("Error fetching visits:", error);
      else setVisitCount(count);
    };
  
    fetchVisits();
  }, [shop?.name]);
  
  // Generate shop URL using shop name
  const shopUrl = shop ? `${window.location.origin}/shop/${encodeURIComponent(shop.name)}` : "";
  
  // Load shop products
  useEffect(() => {
    if (shop) {
      loadProducts();
    }
  }, [shop]);
  
  const loadProducts = async () => {
    try {
      console.log('Loading products for shop:', shop.id);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", shop.id)
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error('Error loading products:', error);
        throw error;
      }
      
      console.log('Products loaded:', data);
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setMessage({ type: "error", text: "Failed to load products." });
    }
  };

  // Load reviews for shop (ONLY for Pro shops)
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

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select an image file" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase storage
  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading image to path:', filePath);

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Extract file path from Supabase storage URL
  const extractFilePathFromUrl = (url) => {
    try {
      const urlParts = url.split('/product-images/');
      if (urlParts.length > 1) {
        return urlParts[1];
      }
      return null;
    } catch (error) {
      console.error('Error extracting file path:', error);
      return null;
    }
  };

  // Delete image from storage
  const deleteImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return { success: true };

    try {
      const filePath = extractFilePathFromUrl(imageUrl);
      
      if (!filePath) {
        console.warn('Could not extract file path from URL:', imageUrl);
        return { success: false, error: 'Invalid file path' };
      }

      console.log('Deleting image from storage:', filePath);

      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (error) {
        console.error('Storage deletion error:', error);
        return { success: false, error };
      }

      console.log('Image deleted successfully from storage');
      return { success: true };
    } catch (error) {
      console.error('Error in deleteImageFromStorage:', error);
      return { success: false, error };
    }
  };

  // Handle product submission (Add/Edit)
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Check product limit for non-Pro users when adding new product
    if (!editingProduct) {
      const canAdd = await subscription.canAddProduct();
      if (!canAdd.canAdd) {
        setMessage({ 
          type: "error", 
          text: `You've reached your product limit (${canAdd.limit} products). Upgrade to Pro for unlimited products!` 
        });
        setUploadingImage(false);
        return;
      }
    }

    setUploadingImage(true);
    
    try {
      if (!shop) throw new Error("No shop found");

      let imageUrl = editingProduct?.image_url || null;
      const oldImageUrl = editingProduct?.image_url || null;

      // Upload new image if one was selected
      if (productForm.image) {
        console.log('New image selected, uploading...');
        imageUrl = await uploadImageToSupabase(productForm.image);
        
        // Delete old image from storage if we're updating and there was an old image
        if (editingProduct && oldImageUrl && oldImageUrl !== imageUrl) {
          console.log('Deleting old image...');
          await deleteImageFromStorage(oldImageUrl);
        }
      }

      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseFloat(productForm.price),
        image_url: imageUrl,
      };

      console.log('Product data to save:', productData);

      if (editingProduct) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct.id);
        
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
          .select();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Product updated successfully:', data);
        setMessage({ type: "success", text: "Product updated successfully!" });
      } else {
        // Create new product
        console.log('Creating new product...');
        
        const { data, error } = await supabase
          .from("products")
          .insert([{
            ...productData,
            shop_id: shop.id,
          }])
          .select();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Product created successfully:', data);
        setMessage({ type: "success", text: "Product added successfully!" });
      }

      // Close modal and reset form
      setShowAddProduct(false);
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", image: null, imagePreview: null });
      
      // Reload products and refresh subscription data
      console.log('Reloading products...');
      await loadProducts();
      await subscription.refresh();

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error('Product submit error:', error);
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to save product. Please check console for details." 
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete product completely (database + storage)
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setDeletingProductId(id);

    try {
      const productToDelete = products.find(p => p.id === id);
      
      if (!productToDelete) {
        throw new Error('Product not found');
      }

      console.log('Deleting product:', productToDelete);

      // Delete image from storage FIRST if it exists
      if (productToDelete.image_url) {
        console.log('Deleting product image...');
        await deleteImageFromStorage(productToDelete.image_url);
      }

      // Delete product from database
      console.log('Deleting product from database...');
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('Database deletion error:', error);
        throw error;
      }

      console.log('Product deleted successfully from database');

      // Update UI immediately (optimistic update)
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

      setMessage({ type: "success", text: "Product deleted successfully!" });
      
      // Reload products and refresh subscription to ensure sync
      setTimeout(async () => {
        await loadProducts();
        await subscription.refresh();
      }, 500);

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error('Delete product error:', error);
      setMessage({ 
        type: "error", 
        text: `Failed to delete product: ${error.message}` 
      });
      
      // Reload products on error to show correct state
      loadProducts();
    } finally {
      setDeletingProductId(null);
    }
  };

  // Share shop via WhatsApp
  const shareViaWhatsApp = () => {
    const message = `🛍️ Check out my shop *${shop.name}* on Smart Market!\n\n${shop.description || "Browse our amazing products!"}\n\n👉 ${shopUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };


  // Copy shop link
  const copyShopLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Visit shop page
  const visitShop = () => {
    window.open(`/shop/${encodeURIComponent(shop.name)}`, "_blank");
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      setMessage({ 
        type: "error", 
        text: "Failed to logout. Please try again." 
      });
    }
  };

  // Calculate average and total reviews for display (ONLY for Pro)
  const totalReviews = isProShop ? reviews.length : 0;
  const avgRating = totalReviews
    ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / totalReviews).toFixed(1)
    : null;

  if (shopLoading || subscription.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Store className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your shop...</p>
        </div>
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Shop Found
          </h1>
          <p className="text-gray-600 mb-6">
            You haven't created a shop yet. Start by creating your online store!
          </p>
          <a
            href="/create-shop"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block"
          >
            Create Your Shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img src="/pwa-192x192.png" alt="Logo" className="w-12 h-12" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                  {isProShop && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                      <Crown className="w-3 h-3" />
                      <span className="text-xs font-bold">PRO</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {isProShop ? 'Pro Account' : 'Free Account'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share Shop</span>
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show upgrade banner for standard users */}
        {subscription.isStandard && (
          <UpgradeBanner variant="compact" />
        )}
        
        {/* Product limit warning */}
        {subscription.isApproachingLimit && !subscription.isPro && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're using {subscription.productCount} of {subscription.productLimit} products. 
                  <a href="/pricing" className="font-semibold underline ml-1">Upgrade to Pro</a> for unlimited products.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product limit reached error */}
        {subscription.isAtLimit && !subscription.isPro && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  You've reached your product limit ({subscription.productLimit} products). 
                  <a href="/upgrade" className="font-semibold underline ml-1">Upgrade to Pro</a>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Alert Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {message.type === "success" ? (
                  <Package className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3 text-sm">{message.text}</div>
            </div>
          </div>
        )}

        {/* Shop Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {products.length}
                  {!isProShop && subscription.productLimit && (
                    <span className="text-base font-normal text-gray-500">
                      /{subscription.productLimit}
                    </span>
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            {!isProShop && subscription.productLimit && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      subscription.productUsagePercentage >= 100 ? 'bg-red-500' :
                      subscription.productUsagePercentage >= 80 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(subscription.productUsagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Shop Visits</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{visitCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Price</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ₵{products.length > 0 
                    ? (products.reduce((sum, p) => sum + Number(p.price), 0) / products.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Shop Info with Reviews (Reviews ONLY for Pro) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Store className="w-6 h-6 text-indigo-600" />
                {shop.name}
              </h2>
              
              {/* Reviews Badge - ONLY for Pro shops */}
              {isProShop && totalReviews > 0 && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">{avgRating}</span>
                    <span className="text-yellow-300 text-lg">⭐</span>
                  </div>
                  <div className="h-4 w-px bg-white/30"></div>
                  <span className="text-sm font-medium">
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              )}
              
              {isProShop && totalReviews === 0 && (
                <span className="inline-flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <span>⭐</span>
                  <span>No reviews yet</span>
                </span>
              )}

              {/* Upgrade prompt for Standard users */}
              {!isProShop && (
                <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  <Zap className="w-4 h-4 text-gray-500" />
                  <span>
                    <a href="/pricing" className="text-indigo-600 font-semibold hover:underline">Upgrade to Pro</a> to enable customer reviews
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={visitShop}
              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              View Shop
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">{shop.description || "No description"}</p>
          
          <div className="flex flex-wrap items-center gap-3">
            {shop.whatsapp_number && (
              <div className="flex items-center gap-2 text-gray-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">{shop.whatsapp_number}</span>
              </div>
            )}
            {shop.location && (
              <div className="flex items-center gap-2 text-gray-700 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-sm">{shop.location}</span>
              </div>
            )}
          </div>

          {/* Recent Reviews Section - ONLY for Pro shops */}
          {isProShop && totalReviews > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>⭐</span>
                Recent Reviews
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{review.customer_name}</span>
                          <div className="flex items-center gap-1 bg-indigo-100 px-2 py-0.5 rounded-full">
                            <span className="text-sm font-bold text-indigo-700">{review.rating}</span>
                            <span className="text-xs text-yellow-500">⭐</span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {totalReviews > 5 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Showing 5 of {totalReviews} reviews
                </p>
              )}
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              Products ({products.length}
              {!isProShop && subscription.productLimit && `/${subscription.productLimit}`})
            </h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: "", description: "", price: "", image: null, imagePreview: null });
                setShowAddProduct(true);
              }}
              disabled={subscription.isAtLimit && !subscription.isPro}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                subscription.isAtLimit && !subscription.isPro
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No products added yet</p>
              <p className="text-sm text-gray-400">Start by adding your first product</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 bg-white"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{p.name}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {p.description || "No description"}
                    </p>
                    <p className="text-2xl font-bold text-indigo-600 mb-4">
                      ₵{Number(p.price).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProductForm({
                            name: p.name,
                            description: p.description,
                            price: p.price,
                            image: null,
                            imagePreview: p.image_url,
                          });
                          setShowAddProduct(true);
                        }}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        disabled={deletingProductId === p.id}
                        className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingProductId === p.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="e.g., Nike Air Max"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₵) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image {editingProduct && <span className="text-indigo-600">(Leave empty to keep current image)</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max file size: 5MB. Supported: JPG, PNG, GIF, WebP
                </p>
              </div>
              
              {/* Image Preview */}
              {productForm.imagePreview && (
                <div className="relative">
                  <img
                    src={productForm.imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  {productForm.image && (
                    <button
                      type="button"
                      onClick={() =>
                        setProductForm({ 
                          ...productForm, 
                          image: null, 
                          imagePreview: editingProduct?.image_url || null 
                        })
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {editingProduct ? "Updating..." : "Adding..."}
                    </span>
                  ) : (
                    editingProduct ? "Update Product" : "Add Product"
                  )}
                </button>
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    setProductForm({ name: "", description: "", price: "", image: null, imagePreview: null });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share Your Shop</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Shop Link */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Your Shop Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shopUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={copyShopLink}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                <button
                  onClick={shareViaWhatsApp}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Phone className="w-5 h-5" />
                  Share on WhatsApp
                </button>

                <button
                  onClick={visitShop}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  Visit Shop Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout</h3>
              <p className="text-gray-600">
                Are you sure you want to logout? You'll need to sign in again to access your dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}