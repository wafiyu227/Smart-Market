// src/context/ShopContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./Authcontext";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shop info for the logged-in user (includes category now)
  useEffect(() => {
    const fetchShop = async () => {
      if (!user) {
        setShop(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("shops")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error; // PGRST116 = No rows found
        setShop(data || null);
        setError(null);
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [user]);

  // Refresh function (call after shop creation/update)
  const refreshShop = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setShop(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new shop with category
  const createShop = async (shopData) => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .insert({
          name: shopData.name,
          category: shopData.category,
          description: shopData.description,
          whatsapp_number: shopData.whatsapp_number,
          location: shopData.location,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setShop(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error creating shop:", err);
      return { data: null, error: err.message };
    }
  };

  // Update existing shop
  const updateShop = async (updates) => {
    if (!shop) return { data: null, error: "No shop to update" };
    
    try {
      const { data, error } = await supabase
        .from("shops")
        .update(updates)
        .eq("id", shop.id)
        .select()
        .single();

      if (error) throw error;
      setShop(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error updating shop:", err);
      return { data: null, error: err.message };
    }
  };

  return (
    <ShopContext.Provider 
      value={{ 
        shop, 
        setShop, 
        refreshShop, 
        createShop,
        updateShop,
        loading, 
        error 
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook for easy use
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};