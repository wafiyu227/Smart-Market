// src/pages/admin/AdminShops.jsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Eye,
  Package,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { Link } from "react-router-dom";

export default function AdminShops() {
  const { getShops, deleteShop } = useAdmin();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(null);

  const limit = 20;

  useEffect(() => {
    loadShops();
  }, [currentPage, searchTerm]);

  const loadShops = async () => {
    try {
      setLoading(true);
      const { shops: shopsData, total } = await getShops(currentPage, limit, searchTerm);
      setShops(shopsData);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error("Error loading shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteShop = async (shopId, shopName) => {
    if (confirm(`Are you sure you want to delete "${shopName}"? This action cannot be undone.`)) {
      const result = await deleteShop(shopId);
      if (result.success) {
        alert("Shop deleted successfully");
        loadShops();
        setShowMenu(null);
      } else {
        alert("Failed to delete shop");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shops</h1>
          <p className="text-gray-600 mt-1">Manage all shops on the platform</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Shops Grid/Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading shops...</p>
            </div>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No shops found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {shop.name?.charAt(0) || "S"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {shop.name}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {shop.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {shop.profiles?.name || shop.profiles?.full_name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">{shop.profiles?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{shop.products?.[0]?.count || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.location || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(shop.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowMenu(showMenu === shop.id ? null : shop.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {showMenu === shop.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <Link
                                to={`/shop/${shop.id}`}
                                target="_blank"
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Shop</span>
                              </Link>
                              <Link
                                to={`/shop/${shop.id}`}
                                target="_blank"
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Open in New Tab</span>
                              </Link>
                              <button
                                onClick={() => handleDeleteShop(shop.id, shop.shop_name)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Shop</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {shops.map((shop) => (
                <div key={shop.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">
                          {shop.shop_name?.charAt(0) || "S"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {shop.shop_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {shop.profiles?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMenu(showMenu === shop.id ? null : shop.id)}
                      className="text-gray-400"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Products</p>
                      <p className="font-medium">{shop.products?.[0]?.count || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{shop.location || "N/A"}</p>
                    </div>
                  </div>
                  {showMenu === shop.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                      <Link
                        to={`/shop/${shop.id}`}
                        className="flex items-center space-x-2 text-sm text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Shop</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteShop(shop.id, shop.shop_name)}
                        className="flex items-center space-x-2 text-sm text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Shop</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}