import { useState } from "react";
import { AlertTriangle, Trash2, HelpCircle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // 'danger' | 'warning' | 'emerald' | 'blue'
  promptWord = "", // If set, user must type this word to enable confirm button
}) => {
  const [typedWord, setTypedWord] = useState("");

  if (!isOpen) return null;

  const isPromptMatched = !promptWord || typedWord.trim().toUpperCase() === promptWord.toUpperCase();

  const handleConfirm = () => {
    if (isPromptMatched) {
      onConfirm();
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      bgIcon: "bg-red-100 text-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white",
      Icon: Trash2,
    },
    warning: {
      bgIcon: "bg-amber-100 text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
      Icon: AlertTriangle,
    },
    emerald: {
      bgIcon: "bg-emerald-100 text-emerald-600",
      button: "bg-emerald-500 hover:bg-emerald-600 text-white",
      Icon: HelpCircle,
    },
    blue: {
      bgIcon: "bg-blue-100 text-blue-600",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
      Icon: HelpCircle,
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;
  const IconComponent = style.Icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.bgIcon}`}>
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>

            {promptWord && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Type <span className="text-red-600 font-bold">{promptWord}</span> to confirm:
                </label>
                <input
                  type="text"
                  value={typedWord}
                  onChange={(e) => setTypedWord(e.target.value)}
                  placeholder={`Type "${promptWord}"`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isPromptMatched}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
