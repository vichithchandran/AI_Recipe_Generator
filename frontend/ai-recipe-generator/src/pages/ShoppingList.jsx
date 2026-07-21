import { useState, useEffect } from "react";
import { ShoppingCart, Plus, X, Check, Trash2, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import { shoppingListService } from "../services/shoppingListService";
import { pantryService } from "../services/pantryService";

const CATEGORIES = [
  "Produce",
  "Dairy",
  "Meat",
  "Grains",
  "Spices",
  "Beverages",
  "Other",
];

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [runningLowItems, setRunningLowItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingLowStock, setAddingLowStock] = useState(false);

  // Confirm Modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    variant: "danger",
    onConfirm: () => {},
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shoppingRes, pantryRes] = await Promise.all([
        shoppingListService.getShoppingList(),
        pantryService.getPantryItems(),
      ]);

      if (shoppingRes.success && shoppingRes.data) {
        const formattedItems = shoppingRes.data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setItems(formattedItems);
        organizeByCategory(formattedItems);
      }

      if (pantryRes.success && pantryRes.data) {
        const lowStock = pantryRes.data.filter((item) => item.is_running_low);
        setRunningLowItems(lowStock);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load shopping list data");
    } finally {
      setLoading(false);
    }
  };

  const organizeByCategory = (itemsList) => {
    const grouped = {};
    itemsList.forEach((item) => {
      const category = item.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    setGroupedItems(grouped);
  };

  const handleAddAllRunningLowToShoppingList = async () => {
    if (runningLowItems.length === 0) return;

    setAddingLowStock(true);
    let addedCount = 0;

    try {
      const existingNames = new Set(items.map((i) => i.ingredient_name.toLowerCase()));

      for (const lowItem of runningLowItems) {
        if (!existingNames.has(lowItem.name.toLowerCase())) {
          let shopCategory = lowItem.category;
          if (shopCategory === 'Vegetables' || shopCategory === 'Fruits') {
            shopCategory = 'Produce';
          } else if (!CATEGORIES.includes(shopCategory)) {
            shopCategory = 'Other';
          }

          await shoppingListService.addShoppingItem({
            ingredient_name: lowItem.name,
            quantity: lowItem.quantity || 1,
            unit: lowItem.unit || 'pieces',
            category: shopCategory,
          });
          addedCount++;
        }
      }

      if (addedCount > 0) {
        toast.success(`Added ${addedCount} low stock item${addedCount > 1 ? 's' : ''} to shopping list!`);
        loadData();
      } else {
        toast.info("All low stock items are already in your shopping list");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add low stock items");
    } finally {
      setAddingLowStock(false);
    }
  };

  const handleToggleChecked = async (id) => {
    try {
      const res = await shoppingListService.toggleCheckItem(id);
      if (res.success) {
        const updatedItems = items.map((item) =>
          (item.id === id || item._id === id)
            ? { ...item, is_checked: res.data.is_checked }
            : item
        );
        setItems(updatedItems);
        organizeByCategory(updatedItems);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update check status");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await shoppingListService.deleteShoppingItem(id);
      if (res.success) {
        const updatedItems = items.filter(
          (item) => item.id !== id && item._id !== id
        );
        setItems(updatedItems);
        organizeByCategory(updatedItems);
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleClearChecked = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Clear Checked Items",
      message: "Are you sure you want to remove all checked items from your shopping list?",
      confirmText: "Clear Items",
      variant: "warning",
      onConfirm: async () => {
        try {
          const res = await shoppingListService.clearCheckedItems();
          if (res.success) {
            toast.success(`Cleared ${res.deletedCount || ''} checked items`);
            loadData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to clear checked items");
        }
      },
    });
  };

  const handleAddToPantry = () => {
    const checkedCount = items.filter((item) => item.is_checked).length;
    if (checkedCount === 0) {
      toast.error("No items checked");
      return;
    }

    setConfirmModalConfig({
      isOpen: true,
      title: "Transfer to Pantry",
      message: `Transfer ${checkedCount} checked items directly into your pantry inventory?`,
      confirmText: "Transfer to Pantry",
      variant: "blue",
      onConfirm: async () => {
        try {
          const res = await shoppingListService.transferToPantry();
          if (res.success) {
            toast.success(`Transferred ${res.transferredCount} items to your pantry!`);
            loadData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to transfer items to pantry");
        }
      },
    });
  };

  const checkedCount = items.filter((item) => item.is_checked).length;
  const totalCount = items.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Grocery <span className="text-gradient">Shopping List</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {totalCount > 0
              ? `${checkedCount} of ${totalCount} items checked`
              : "Your grocery list is empty"}
          </p>
        </div>

        {/* Running Low Pantry Items Banner */}
        {runningLowItems.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-amber-200 font-bold text-base">
                    Pantry Items Running Low ({runningLowItems.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {runningLowItems.map((item) => (
                      <span
                        key={item._id || item.name}
                        className="px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded text-xs font-semibold"
                      >
                        {item.name} ({item.quantity} {item.unit})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddAllRunningLowToShoppingList}
                disabled={addingLowStock}
                className="shrink-0 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {addingLowStock ? "Adding..." : "Add All to Shopping List"}
              </button>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all text-xs"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          {checkedCount > 0 && (
            <>
              <button
                onClick={handleAddToPantry}
                className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 px-5 py-2.5 rounded-xl font-bold transition-all text-xs"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Pantry ({checkedCount})
              </button>
              <button
                onClick={handleClearChecked}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 px-5 py-2.5 rounded-xl font-semibold transition-all text-xs"
              >
                <Trash2 className="w-4 h-4" />
                Clear Checked
              </button>
            </>
          )}
        </div>

        {/* Shopping List Categories */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading shopping items...</div>
        ) : totalCount > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div
                key={category}
                className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden shadow-xl"
              >
                <div className="bg-slate-900/80 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-heading">{category}</h2>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md">
                    {categoryItems.length} items
                  </span>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {categoryItems.map((item) => (
                    <ShoppingListItem
                      key={item.id || item._id}
                      item={item}
                      onToggle={handleToggleChecked}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-16 text-center border border-slate-800/80">
            <ShoppingCart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-sm mb-4">Your grocery shopping list is empty</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Shopping Item
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        variant={confirmModalConfig.variant}
      />

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadData();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

const ShoppingListItem = ({ item, onToggle, onDelete }) => {
  const itemId = item.id || item._id;

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-900/40 transition-colors group">
      <button onClick={() => onToggle(itemId)} className="shrink-0">
        <div
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            item.is_checked
              ? "bg-emerald-500 border-emerald-500 text-slate-950"
              : "border-slate-700 hover:border-emerald-500"
          }`}
        >
          {item.is_checked && <Check className="w-4 h-4 font-bold" />}
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-sm ${item.is_checked ? "line-through text-slate-500" : "text-slate-100"}`}
        >
          {item.ingredient_name}
        </p>
        <p
          className={`text-xs mt-0.5 ${item.is_checked ? "text-slate-600" : "text-slate-400"}`}
        >
          {item.quantity} {item.unit}
          {item.from_meal_plan && (
            <span className="ml-2 text-[11px] font-semibold text-emerald-400">
              • From meal plan
            </span>
          )}
        </p>
      </div>

      <button
        onClick={() => onDelete(itemId)}
        className="shrink-0 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Delete Item"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const AddItemModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    ingredient_name: "",
    quantity: "",
    unit: "pieces",
    category: "Other",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const itemData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
      };

      const res = await shoppingListService.addShoppingItem(itemData);
      if (res.success) {
        toast.success("Item added to shopping list");
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add shopping list item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white font-heading">Add Shopping Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Item Name</label>
            <input
              type="text"
              value={formData.ingredient_name}
              onChange={(e) => setFormData({ ...formData, ingredient_name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm"
              placeholder="e.g. Olive Oil"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Quantity</label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
                placeholder="1"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
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
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-900 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShoppingList;
