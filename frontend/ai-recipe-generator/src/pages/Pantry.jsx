import { AlertCircle, Calendar, Plus, Search, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { dummyPantryItems, getExpiringItems } from "../data/dummyData";

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Grains",
  "Spices",
  "Other",
];

const Pantry = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expiringItems, setExpiringItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setItems(dummyPantryItems);
    setExpiringItems(getExpiringItems());
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, selectedCategory]);

  const filterItems = () => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setItems(items.filter((item) => item.id !== id));
    toast.success("Item deleted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pantry</h1>
            <p className="text-gray-600 mt-1">
              Manage your ingredients and track expiry dates
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Expiring Soon Alert */}
        {expiringItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="text-amber-900 font-medium">
                  Items Expiring Soon
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  {expiringItems.length} item
                  {expiringItems.length > 1 ? "s" : ""} expiring within 7 days
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ingredients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              <CategoryButton
                label="All"
                active={selectedCategory === "All"}
                onClick={() => setSelectedCategory("All")}
              />
              {CATEGORIES.map((category) => (
                <CategoryButton
                  key={category}
                  label={category}
                  active={selectedCategory === category}
                  onClick={() => {
                    setSelectedCategory(category);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <PantryItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isExpiring={expiringItems.some((exp) => exp.id === item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(newItem) => {
            setItems([...items, newItem]);
            setExpiringItems(getExpiringItems());
          }}
        />
      )}
    </div>
  );
};

const CategoryButton = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${active ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
    >
      {label}
    </button>
  );
};

const PantryItemCard = ({ item, onDelete, isExpiring }) => {
  const isExpired = item.expiry_date && new Date(item.expiry_date) < new Date();

  return (
    <div
      className={`bg-white rounded-lg broder p-4 hover:shodow-md transition-shadow ${isExpired ? "border-amber-300" : "border-gray-200"} `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className=" text-grey-900">{item.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
        </div>

        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium text-gray-900">
            {item.quantity} {item.unit}
          </span>
        </div>
      </div>

      {item.expiry_date && (
        <div className="flex items-center gap-2 text-sm mt-2">
          <Calendar className="text-gray-400 2-4 h-4" />
          <span
            className={`${isExpired ? "text-red-600 font-medium" : isExpiring ? "text-amber-600 font-medium" : "text-gray-600"}`}
          >
            {isExpired ? "Expired" : "Expires"}:{" "}
            {format(new Date(item.expiry_date), "MMM dd, yyyy")}
          </span>
        </div>
      )}
      {item.is_running_low && (
        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded mt-2">
          Running Low
        </span>
      )}
    </div>
  );
};

const AddItemModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "pieces",
    category: "Other",
    expiry_date: "",
    is_running_low: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      user_id: 1,
      ...formData,
      quantity: parseFloat(formData.quantity),
      expiry_date: formData.expiry_date || null,
      created_at: new Date().toString(),
    };

    toast.success("Item added to pantry");
    onSuccess(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className=" flex justify-between items-center mb-6">
          <h2 className=" text-xl font-bold text-gray-900">Add Pantry Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              >
                <option value="pieces">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="g">Grams</option>
                <option value="l">Liters</option>
                <option value="ml">Milliliters</option>
                <option value="cups">Cups</option>
                <option value="tbsp">Tablespoons</option>
                <option value="tsp">Teaspoons</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) =>
                setFormData({ ...formData, expiry_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="running-low"
              value={formData.is_running_low}
              onChange={(e) =>
                setFormData({ ...formData, is_running_low: e.target.checked })
              }
              className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="running-low" className="text-sm text-gray-700">
              Mark as running low
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pantry;
