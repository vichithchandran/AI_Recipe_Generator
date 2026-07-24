import { AlertCircle, Calendar, Plus, Search, X, UtensilsCrossed, AlertTriangle, ShieldCheck, Flame, Pencil, Trash2, ListPlus, FileText, PlusCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import DietSymbol from "../components/DietSymbol";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { pantryService } from "../services/pantryService";

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
  const [editItem, setEditItem] = useState(null);
  const [expiringItems, setExpiringItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [removingAllExpired, setRemovingAllExpired] = useState(false);

  // Confirm Modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchPantryData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsRes, expiringRes] = await Promise.all([
        pantryService.getPantryItems(searchQuery, selectedCategory),
        pantryService.getExpiringItems(),
      ]);

      if (itemsRes.success) {
        setItems(itemsRes.data.map(item => ({ ...item, id: item._id })));
      }

      if (expiringRes.success) {
        setExpiringItems(expiringRes.data.map(item => ({ ...item, id: item._id })));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pantry items");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchPantryData();
  }, [fetchPantryData]);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const res = await pantryService.deletePantryItem(deleteTargetId);
      if (res.success) {
        toast.success("Item deleted from pantry");
        setItems(items.filter((item) => item.id !== deleteTargetId && item._id !== deleteTargetId));
        setExpiringItems(expiringItems.filter((item) => item.id !== deleteTargetId && item._id !== deleteTargetId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Derived expired items list
  const expiredItems = items.filter(
    (item) => item.expiry_date && new Date(item.expiry_date) < new Date()
  );

  const removeAllExpired = async () => {
    if (expiredItems.length === 0) return;
    setRemovingAllExpired(true);
    let removed = 0;
    const errors = [];
    for (const item of expiredItems) {
      try {
        const res = await pantryService.deletePantryItem(item.id || item._id);
        if (res.success) removed++;
      } catch (err) {
        errors.push(item.name);
      }
    }
    setRemovingAllExpired(false);
    if (removed > 0) {
      toast.success(`Removed ${removed} expired item${removed > 1 ? "s" : ""} from pantry`);
      fetchPantryData();
    }
    if (errors.length > 0) {
      toast.error(`Failed to remove: ${errors.join(", ")}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              Pantry <span className="text-gradient">Inventory</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track ingredients, expiration alerts, and Indian Veg/Non-Veg classifications
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-5 h-5" />
            Add Pantry Item
          </button>
        </div>

        {/* Status Legend Bar */}
        <div className="glass-panel rounded-2xl p-4 mb-8 border border-slate-800/80 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Status Indicator Guide
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/80 text-red-300 font-semibold">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <span>🔴 Red: Expired</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-400/80 text-amber-300 font-semibold">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span>🟡 Yellow: Expiring Soon</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-orange-950/40 border border-orange-500/80 text-orange-300 font-semibold">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>🟠 Orange: Running Low</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-emerald-500/40 text-emerald-400 font-semibold">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span>🟢 Emerald: Fresh</span>
            </div>
          </div>
        </div>

        {/* Expired Items Section */}
        {expiredItems.length > 0 && (
          <div className="bg-red-950/30 border-2 border-red-500/70 rounded-2xl p-5 mb-6 backdrop-blur-xl shadow-lg shadow-red-500/10">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-red-200 font-bold text-base">
                    Expired Items ({expiredItems.length})
                  </h3>
                  <p className="text-xs text-red-300/70 mt-0.5">
                    These items have passed their expiry date and should be removed.
                  </p>
                </div>
              </div>
              <button
                onClick={removeAllExpired}
                disabled={removingAllExpired}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-500/50 text-red-300 font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {removingAllExpired ? "Removing..." : "Remove All Expired"}
              </button>
            </div>

            <ul className="space-y-2">
              {expiredItems.map((item) => (
                <li
                  key={item.id || item._id}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="text-sm font-semibold text-red-200 truncate">{item.name}</span>
                    <span className="text-[11px] text-slate-500 capitalize shrink-0">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-[11px] text-red-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>Expired {format(new Date(item.expiry_date), "MMM dd, yyyy")}</span>
                    </div>
                    <button
                      onClick={() => setDeleteTargetId(item.id || item._id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-colors"
                      title="Remove expired item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expiring Soon Alert */}
        {expiringItems.length > 0 && (
          <div className="bg-amber-500/10 border-2 border-amber-400/80 rounded-2xl p-5 mb-8 backdrop-blur-xl shadow-lg shadow-amber-500/10">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-amber-200 font-bold text-base">
                  Attention: Items Expiring Soon ({expiringItems.length})
                </h3>
                <p className="text-xs text-amber-300/80 mt-1">
                  {expiringItems.length} ingredient{expiringItems.length > 1 ? "s" : ""} marked with yellow borders will expire within 7 days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Category Filter */}
        <div className="glass-panel rounded-2xl p-4 mb-8 border border-slate-800/80">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute w-5 h-5 left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pantry ingredients..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
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
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading pantry inventory...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <PantryItemCard
                key={item.id || item._id}
                item={item}
                onEdit={(item) => setEditItem(item)}
                onDelete={(id) => setDeleteTargetId(id)}
                isExpiring={expiringItems.some((exp) => (exp.id || exp._id) === (item.id || item._id))}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800/80">
            <UtensilsCrossed className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-4">No pantry items found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all"
            >
              Add First Pantry Item
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Delete Pantry Item"
        message="Are you sure you want to remove this ingredient from your pantry inventory?"
        confirmText="Delete Item"
        variant="danger"
      />

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchPantryData();
          }}
        />
      )}

      {/* Edit Item Modal */}
      {editItem && (
        <EditItemModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSuccess={() => {
            fetchPantryData();
            setEditItem(null);
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
      className={`px-3.5 py-2 rounded-xl font-semibold text-xs whitespace-nowrap transition-all ${
        active
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
          : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );
};

const PantryItemCard = ({ item, onEdit, onDelete, isExpiring }) => {
  const isExpired = item.expiry_date && new Date(item.expiry_date) < new Date();
  const isRunningLow = item.is_running_low;

  let cardStyle = "border-emerald-500/30 bg-slate-900/60 shadow-md";
  let statusBadge = (
    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
      <ShieldCheck className="w-3 h-3" />
      <span>FRESH</span>
    </span>
  );

  if (isExpired) {
    cardStyle = "border-2 border-red-500 shadow-xl shadow-red-500/15 bg-red-950/30";
    statusBadge = (
      <span className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-[11px] font-extrabold flex items-center gap-1 animate-pulse">
        <AlertCircle className="w-3 h-3 text-red-400" />
        <span>EXPIRED</span>
      </span>
    );
  } else if (isExpiring) {
    cardStyle = "border-2 border-amber-400 shadow-xl shadow-amber-400/15 bg-amber-950/30";
    statusBadge = (
      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-extrabold flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        <span>EXPIRING SOON</span>
      </span>
    );
  } else if (isRunningLow) {
    cardStyle = "border-2 border-orange-500 shadow-xl shadow-orange-500/15 bg-orange-950/30";
    statusBadge = (
      <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-300 text-[11px] font-extrabold flex items-center gap-1">
        <Flame className="w-3 h-3 text-orange-400" />
        <span>RUNNING LOW</span>
      </span>
    );
  }

  return (
    <div className={`glass-panel rounded-2xl p-5 transition-all glass-panel-hover relative group flex flex-col justify-between ${cardStyle}`}>
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <DietSymbol category={item.category} name={item.name} className="w-4 h-4" />
              <h3 className="text-slate-100 font-extrabold text-base font-heading group-hover:text-emerald-400 transition-colors">
                {item.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-block px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[11px] font-medium capitalize">
                {item.category}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {item.quantity} {item.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {statusBadge}
            <button
              onClick={() => onDelete(item.id || item._id)}
              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Delete Item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Area with Expiry Info on Left & Edit Button on Bottom Right */}
      <div className="flex items-center justify-between gap-2 text-xs mt-3 pt-2.5 border-t border-slate-800/40">
        <div className="flex items-center gap-1.5 min-w-0">
          {item.expiry_date ? (
            <>
              <Calendar className="text-slate-500 w-3.5 h-3.5 shrink-0" />
              <span
                className={`truncate ${
                  isExpired
                    ? "text-red-400 font-bold"
                    : isExpiring
                    ? "text-amber-400 font-bold"
                    : "text-slate-400"
                }`}
              >
                {isExpired ? "Expired" : "Expires"}: {format(new Date(item.expiry_date), "MMM dd, yyyy")}
              </span>
            </>
          ) : (
            <span className="text-slate-500 text-[11px]">No expiry date set</span>
          )}
        </div>

        {/* Edit Button Positioned at Bottom Right */}
        <button
          onClick={() => onEdit(item)}
          className="px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition-all shrink-0 hover:scale-105"
          title="Edit Pantry Item"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};

const AddItemModal = ({ onClose, onSuccess }) => {
  const [addMode, setAddMode] = useState("single"); // 'single' | 'bulk'
  const [submitting, setSubmitting] = useState(false);

  // Single Item State
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "pieces",
    category: "Other",
    expiry_date: "",
    is_running_low: false,
  });

  // Bulk Add State
  const [bulkRawText, setBulkRawText] = useState("");
  const [bulkItems, setBulkItems] = useState([
    { name: "", quantity: 1, unit: "pieces", category: "Other" },
  ]);

  // Parse raw text into structured bulk items
  const parseBulkText = () => {
    if (!bulkRawText.trim()) return;

    // Split by newlines, commas, or semicolons
    const lines = bulkRawText
      .split(/[\n,;]+/)
      .map((l) => l.replace(/^[\s•\-\d\.]+/g, "").trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const parsed = lines.map((line) => {
      // Simple quantity/unit regex parsing e.g. "2kg Basmati Rice" -> qty:2, unit:kg, name:Basmati Rice
      const match = line.match(/^(\d+(?:\.\d+)?)\s*(kg|g|l|ml|pieces|cups|tbsp|tsp)?\s+(.+)$/i);
      if (match) {
        return {
          name: match[3].trim(),
          quantity: parseFloat(match[1]),
          unit: (match[2] || "pieces").toLowerCase(),
          category: "Other",
        };
      }
      return {
        name: line,
        quantity: 1,
        unit: "pieces",
        category: "Other",
      };
    });

    setBulkItems(parsed);
    toast.success(`Parsed ${parsed.length} items! You can review or adjust them below.`);
  };

  const handleAddBulkRow = () => {
    setBulkItems([...bulkItems, { name: "", quantity: 1, unit: "pieces", category: "Other" }]);
  };

  const handleRemoveBulkRow = (index) => {
    if (bulkItems.length === 1) {
      setBulkItems([{ name: "", quantity: 1, unit: "pieces", category: "Other" }]);
      return;
    }
    setBulkItems(bulkItems.filter((_, i) => i !== index));
  };

  const handleBulkItemChange = (index, field, value) => {
    const updated = [...bulkItems];
    updated[index][field] = value;
    setBulkItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (addMode === "single") {
        if (!formData.name.trim()) {
          toast.error("Please enter item name");
          setSubmitting(false);
          return;
        }

        const itemData = {
          ...formData,
          quantity: parseFloat(formData.quantity) || 1,
          expiry_date: formData.expiry_date || null,
        };

        const res = await pantryService.addPantryItem(itemData);
        if (res.success) {
          toast.success("Item added to pantry");
          onSuccess();
          onClose();
        }
      } else {
        // Bulk mode submit
        const validItems = bulkItems
          .filter((i) => i.name && i.name.trim().length > 0)
          .map((i) => ({
            name: i.name.trim(),
            quantity: parseFloat(i.quantity) || 1,
            unit: i.unit || "pieces",
            category: i.category || "Other",
          }));

        if (validItems.length === 0) {
          toast.error("Please enter at least one valid item name");
          setSubmitting(false);
          return;
        }

        const res = await pantryService.addPantryItem({ items: validItems });
        if (res.success) {
          toast.success(`Added ${res.count || validItems.length} items to pantry!`);
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add pantry item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel rounded-3xl max-w-xl w-full p-6 border border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Add Pantry Items</h2>
            <p className="text-xs text-slate-400">Add individual items or multiple items in one go</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setAddMode("single")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              addMode === "single"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Single Item</span>
          </button>
          <button
            type="button"
            onClick={() => setAddMode("bulk")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              addMode === "bulk"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Add Multiple (Bulk)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          {addMode === "single" ? (
            /* Single Item Form */
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm"
                  placeholder="e.g. Tomatoes"
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
                    placeholder="2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Unit</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="running-low"
                  checked={formData.is_running_low}
                  onChange={(e) => setFormData({ ...formData, is_running_low: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
                />
                <label htmlFor="running-low" className="text-xs font-medium text-slate-300 cursor-pointer">
                  Mark as running low
                </label>
              </div>
            </>
          ) : (
            /* Bulk Multiple Items Form */
            <div className="space-y-4">
              {/* Quick Paste Text Area */}
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Quick Text Paste (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={parseBulkText}
                    disabled={!bulkRawText.trim()}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Parse into List</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={bulkRawText}
                  onChange={(e) => setBulkRawText(e.target.value)}
                  placeholder={`Paste multiple items separated by commas or lines...\nExample:\nTomatoes, 2kg Rice, Garlic, Milk, 500g Sugar`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs resize-y min-h-[60px] transition-all"
                />
              </div>

              {/* Dynamic Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Pantry Items List ({bulkItems.filter((i) => i.name.trim()).length} ready)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddBulkRow}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item Row</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {bulkItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleBulkItemChange(index, "name", e.target.value)}
                        placeholder="Item name (e.g. Rice)"
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none focus:border-emerald-500"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.quantity}
                        onChange={(e) => handleBulkItemChange(index, "quantity", e.target.value)}
                        className="w-16 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none text-center"
                      />
                      <select
                        value={item.unit}
                        onChange={(e) => handleBulkItemChange(index, "unit", e.target.value)}
                        className="w-24 px-1.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none"
                      >
                        <option value="pieces">Pcs</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="cups">cups</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                      </select>
                      <select
                        value={item.category}
                        onChange={(e) => handleBulkItemChange(index, "category", e.target.value)}
                        className="w-28 px-1.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveBulkRow(index)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                        title="Remove row"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              className="flex-1 px-4 py-2.5 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-900 font-semibold text-xs transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? "Adding..."
                : addMode === "bulk"
                ? `Add ${bulkItems.filter((i) => i.name.trim()).length} Items to Pantry`
                : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditItemModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: item.name || "",
    quantity: item.quantity || "",
    unit: item.unit || "pieces",
    category: item.category || "Other",
    expiry_date: item.expiry_date ? format(new Date(item.expiry_date), "yyyy-MM-dd") : "",
    is_running_low: item.is_running_low || false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const itemData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        expiry_date: formData.expiry_date || null,
      };

      const res = await pantryService.updatePantryItem(item.id || item._id, itemData);
      if (res.success) {
        toast.success("Pantry item updated!");
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update pantry item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white font-heading">Edit Pantry Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
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
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Unit</label>
              <select
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Expiry Date (Optional)</label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="edit-running-low"
              checked={formData.is_running_low}
              onChange={(e) => setFormData({ ...formData, is_running_low: e.target.checked })}
              className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
            />
            <label htmlFor="edit-running-low" className="text-xs font-medium text-slate-300 cursor-pointer">
              Mark as running low
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              className="flex-1 px-4 py-2.5 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-900 font-semibold text-xs transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pantry;
