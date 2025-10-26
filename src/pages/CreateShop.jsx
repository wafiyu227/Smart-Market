import { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Package,
  Phone,
  MapPin,
  DollarSign,
  Image,
  X,
  CheckCircle,
  Camera,
  Tag,
  AlertCircle,
  Crown,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = [
  "Electronics & Gadgets",
  "Fashion & Clothing",
  "Beauty & Cosmetics",
  "Food & Beverages",
  "Home & Furniture",
  "Sports & Fitness",
  "Books & Stationery",
  "Toys & Games",
  "Jewelry & Accessories",
  "Health & Wellness",
  "Automotive",
  "Art & Crafts",
  "Other",
];

const POPULAR_LOCATIONS = [
  "Accra",
  "Kumasi",
  "Takoradi",
  "Tamale",
  "Cape Coast",
  "Tema",
  "Sunyani",
  "Koforidua",
  "Ho",
  "Wa",
  "Other (Type Below)",
];

// Standard plan product limit
const STANDARD_PRODUCT_LIMIT = 10;

export default function CreateShop() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [shopData, setShopData] = useState({
    name: "",
    category: "",
    description: "",
    whatsapp_number: "",
    location: "",
    customLocation: "",
  });
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    imagePreview: null,
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setIsAuthenticated(false);
        return;
      }

      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    }
  };

  const handleShopChange = (e) => {
    const { name, value } = e.target;
    setShopData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select an image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }

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

  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const addProduct = async () => {
    // Check product limit for Standard plan
    if (products.length >= STANDARD_PRODUCT_LIMIT) {
      setMessage({
        type: "error",
        text: `You've reached the limit of ${STANDARD_PRODUCT_LIMIT} products for the free plan. Upgrade to Pro for unlimited products!`,
      });
      return;
    }

    if (!productForm.name || !productForm.price) {
      setMessage({
        type: "error",
        text: "Product name and price are required",
      });
      return;
    }

    if (isNaN(productForm.price) || parseFloat(productForm.price) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid price" });
      return;
    }

    setUploadingImage(true);
    try {
      let imageUrl = null;

      if (productForm.image) {
        imageUrl = await uploadImageToSupabase(productForm.image);
      }

      const newProduct = {
        id: Date.now(),
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        image_url: imageUrl,
        imagePreview: productForm.imagePreview,
      };

      setProducts((prev) => [...prev, newProduct]);
      setProductForm({
        name: "",
        description: "",
        price: "",
        image: null,
        imagePreview: null,
      });
      setShowProductForm(false);
      setMessage({ type: "success", text: "Product added!" });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({
        type: "error",
        text: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleSubmit = async () => {
    if (!shopData.name) {
      setMessage({ type: "error", text: "Shop name is required" });
      return;
    }

    if (!shopData.category) {
      setMessage({ type: "error", text: "Please select a shop category" });
      return;
    }

    if (products.length === 0) {
      setMessage({ type: "error", text: "Please add at least one product" });
      return;
    }

    // Determine final location
    // In handleSubmit function, before saving:
    const finalLocation =
      shopData.location === "Other (Type Below)"
        ? shopData.customLocation.trim() // Trim custom location
        : shopData.location.trim(); // Trim selected location

    // Then convert to Title Case for consistency:
    const standardizedLocation = finalLocation
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (!finalLocation) {
      setMessage({ type: "error", text: "Please select or enter a location" });
      return;
    }

    setSubmitLoading(true);

    try {
      // Create shop with Standard plan by default
      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .insert({
          name: shopData.name,
          category: shopData.category,
          description: shopData.description,
          whatsapp_number: shopData.whatsapp_number,
          location: finalLocation,
          user_id: currentUser.id,
          subscription_plan: "standard", // Default to standard
          subscription_status: "active",
        })
        .select()
        .single();

      if (shopError) {
        console.error("Shop creation error:", shopError);
        throw new Error(shopError.message || "Failed to create shop");
      }

      const productsToInsert = products.map((product) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        shop_id: shop.id,
      }));

      const { error: productsError } = await supabase
        .from("products")
        .insert(productsToInsert);

      if (productsError) {
        console.error("Products creation error:", productsError);
        throw new Error(productsError.message || "Failed to create products");
      }

      setMessage({
        type: "success",
        text: "🎉 Shop created successfully! Redirecting to dashboard...",
      });

      setTimeout(() => {
        window.location.href = `/dashboard`;
      }, 2000);
    } catch (error) {
      console.error("Error creating shop:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to create shop. Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Calculate product usage percentage
  const productUsagePercentage =
    (products.length / STANDARD_PRODUCT_LIMIT) * 100;
  const isApproachingLimit = products.length >= 8;
  const isAtLimit = products.length >= STANDARD_PRODUCT_LIMIT;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to create a shop.
          </p>
          <a
            href="/login"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Your Shop
                </h1>
                <p className="text-gray-600">
                  Set up your online store and add products
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                Free Plan
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Limit Warning */}
        {isApproachingLimit && !isAtLimit && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're using {products.length} of {STANDARD_PRODUCT_LIMIT}{" "}
                  products.
                  <a href="/pricing" className="font-semibold underline ml-1">
                    Upgrade to Pro
                  </a>{" "}
                  after creating your shop for unlimited products.
                </p>
              </div>
            </div>
          </div>
        )}

        {isAtLimit && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  You've reached your product limit ({STANDARD_PRODUCT_LIMIT}{" "}
                  products).
                  <a href="/pricing" className="font-semibold underline ml-1">
                    Upgrade to Pro
                  </a>{" "}
                  after creating your shop to add unlimited products.
                </p>
              </div>
            </div>
          </div>
        )}

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
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
              </div>
              <div className="ml-3 text-sm">{message.text}</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Store className="w-5 h-5 mr-2 text-indigo-600" />
              Shop Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={shopData.name}
                  onChange={handleShopChange}
                  placeholder="Enter your shop name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Shop Category *
                </label>
                <select
                  name="category"
                  value={shopData.category}
                  onChange={handleShopChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <select
                  name="location"
                  value={shopData.location}
                  onChange={handleShopChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select your location</option>
                  {POPULAR_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {shopData.location === "Other (Type Below)" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Your Location *
                  </label>
                  <input
                    type="text"
                    name="customLocation"
                    value={shopData.customLocation}
                    onChange={handleShopChange}
                    placeholder="e.g., Osu, Accra"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={shopData.description}
                  onChange={handleShopChange}
                  placeholder="Tell customers about your shop"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={shopData.whatsapp_number}
                  onChange={handleShopChange}
                  placeholder="+233 XX XXX XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-indigo-600" />
                  Products ({products.length}/{STANDARD_PRODUCT_LIMIT})
                </h2>
                {/* Progress Bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      productUsagePercentage >= 100
                        ? "bg-red-500"
                        : productUsagePercentage >= 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(productUsagePercentage, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                disabled={isAtLimit}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isAtLimit
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {showProductForm && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductChange}
                      placeholder="Product name *"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductChange}
                      placeholder="Product description"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          ₵
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={productForm.price}
                          onChange={handleProductChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="imageUpload"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="flex items-center justify-center w-full h-10 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <Camera className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">
                            {productForm.image
                              ? productForm.image.name
                              : "Choose Image"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {productForm.imagePreview && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </label>
                      <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={productForm.imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm((prev) => ({
                              ...prev,
                              image: null,
                              imagePreview: null,
                            }))
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={addProduct}
                      disabled={uploadingImage}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-1 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {uploadingImage ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-2"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        "Add Product"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowProductForm(false);
                        setProductForm({
                          name: "",
                          description: "",
                          price: "",
                          image: null,
                          imagePreview: null,
                        });
                      }}
                      disabled={uploadingImage}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No products added yet</p>
                  <p className="text-sm">Click "Add Product" to get started</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Free plan: Up to {STANDARD_PRODUCT_LIMIT} products
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {product.imagePreview || product.image_url ? (
                        <img
                          src={product.imagePreview || product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </h4>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        ₵{product.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={
              submitLoading ||
              !shopData.name ||
              !shopData.category ||
              products.length === 0
            }
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all ${
              submitLoading ||
              !shopData.name ||
              !shopData.category ||
              products.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
            }`}
          >
            {submitLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Shop...
              </span>
            ) : (
              "Create My Shop"
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Starting with the Free plan - {STANDARD_PRODUCT_LIMIT} products
            included
          </p>
          <p className="text-xs text-gray-400 mt-1">
            You can{" "}
            <a
              href="/pricing"
              className="text-indigo-600 hover:underline font-medium"
            >
              upgrade to Pro
            </a>{" "}
            anytime for unlimited products and reviews
          </p>
        </div>
      </div>
    </div>
  );
}
