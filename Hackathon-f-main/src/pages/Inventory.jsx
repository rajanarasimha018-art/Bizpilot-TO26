import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Package,
  DollarSign,
  Sparkles,
  Camera,
  Activity,
  RefreshCw,
  AlertCircle,
  X,
  Mail,
  MessageSquare,
  Check
} from "lucide-react";
import { formatAmount } from "../types";

const mockProductDatabase = [
  {
    name: "Cadbury Dairy Milk Silk",
    barcode: "8901234567890",
    brand: "Cadbury",
    category: "Chocolate",
    mrp: 95,
    price: 90,
    cost: 70,
    quantity: 25,
    minStock: 10,
    supplier: "ABC Foods",
    warehouse: "Hyderabad",
    expiry: "2026-12-12",
    sku: "CAD-SILK-95",
    description: "Premium smooth Cadbury Dairy Milk Silk chocolate bar.",
    image: "🍫"
  },
  {
    name: "Maggi 2-Minute Noodles",
    barcode: "8901058001207",
    brand: "Nestlé",
    category: "Instant Noodles",
    mrp: 18,
    price: 18,
    cost: 14,
    quantity: 120,
    minStock: 20,
    supplier: "Nestlé Wholesale",
    warehouse: "Bangalore",
    expiry: "2026-08-20",
    sku: "NES-MAG-18",
    description: "Classic instant masala noodles.",
    image: "🍜"
  },
  {
    name: "Coca-Cola 750ml",
    barcode: "8901764012278",
    brand: "Coca-Cola",
    category: "Soft Drink",
    mrp: 45,
    price: 40,
    cost: 30,
    quantity: 85,
    minStock: 15,
    supplier: "Coke Distributors",
    warehouse: "Mumbai",
    expiry: "2026-09-15",
    sku: "COKE-750ML",
    description: "Refreshing carbonated soft drink.",
    image: "🥤"
  },
  {
    name: "Pepsi 500ml",
    barcode: "8901200003412",
    brand: "PepsiCo",
    category: "Soft Drink",
    mrp: 35,
    price: 32,
    cost: 24,
    quantity: 60,
    minStock: 12,
    supplier: "Pepsi Wholesale",
    warehouse: "Chennai",
    expiry: "2026-10-05",
    sku: "PEPSI-500ML",
    description: "Sparkling cola soft drink.",
    image: "🥤"
  },
  {
    name: "Parle-G Biscuit",
    barcode: "8901109001421",
    brand: "Parle",
    category: "Biscuits",
    mrp: 10,
    price: 10,
    cost: 7.5,
    quantity: 200,
    minStock: 30,
    supplier: "Parle Agency",
    warehouse: "Pune",
    expiry: "2027-01-10",
    sku: "PARLE-G-10",
    description: "India's favorite glucose biscuits.",
    image: "🍪"
  },
  {
    name: "Good Day Cashew Biscuit",
    barcode: "8901063004521",
    brand: "Britannia",
    category: "Biscuits",
    mrp: 30,
    price: 28,
    cost: 20,
    quantity: 110,
    minStock: 25,
    supplier: "Britannia Distributors",
    warehouse: "Delhi",
    expiry: "2026-11-30",
    sku: "BRIT-GD-30",
    description: "Cashew cookies baked to perfection.",
    image: "🍪"
  },
  {
    name: "Amul Pasteurised Butter 500g",
    barcode: "8901262010214",
    brand: "Amul",
    category: "Dairy",
    mrp: 275,
    price: 270,
    cost: 240,
    quantity: 40,
    minStock: 8,
    supplier: "Amul Dairy Corp",
    warehouse: "Gujarat",
    expiry: "2026-07-30",
    sku: "AMUL-BUTTER-500",
    description: "Pasteurised salted butter.",
    image: "🧈"
  },
  {
    name: "Tata Salt 1kg",
    barcode: "8901058895028",
    brand: "Tata",
    category: "Edible Salt",
    mrp: 28,
    price: 28,
    cost: 22,
    quantity: 95,
    minStock: 15,
    supplier: "Tata Consumer Products",
    warehouse: "Kolkata",
    expiry: "2028-12-31",
    sku: "TATA-SALT-1KG",
    description: "Iodised vacuum evaporated salt.",
    image: "🧂"
  },
  {
    name: "Aashirvaad Whole Wheat Atta 5kg",
    barcode: "8901725181227",
    brand: "ITC",
    category: "Flour",
    mrp: 290,
    price: 275,
    cost: 230,
    quantity: 35,
    minStock: 6,
    supplier: "ITC Wholesale Agency",
    warehouse: "Lucknow",
    expiry: "2026-10-25",
    sku: "ITC-ATTA-5KG",
    description: "100% pure whole wheat flour.",
    image: "🌾"
  },
  {
    name: "Surf Excel Easy Wash 1kg",
    barcode: "8901030753049",
    brand: "Hindustan Unilever",
    category: "Detergent",
    mrp: 140,
    price: 130,
    cost: 105,
    quantity: 50,
    minStock: 10,
    supplier: "HUL Distribution",
    warehouse: "Indore",
    expiry: "2028-05-15",
    sku: "HUL-SURF-1KG",
    description: "Washing powder for easy stain removal.",
    image: "🧼"
  },
  {
    name: "Vim Bar 300g",
    barcode: "8901030656111",
    brand: "Hindustan Unilever",
    category: "Dishwash",
    mrp: 20,
    price: 20,
    cost: 16,
    quantity: 150,
    minStock: 25,
    supplier: "HUL Distribution",
    warehouse: "Nagpur",
    expiry: "2028-09-01",
    sku: "HUL-VIM-300G",
    description: "Dishwash bar with power of lemons.",
    image: "🧼"
  },
  {
    name: "Colgate Toothpaste 200g",
    barcode: "8901123000417",
    brand: "Colgate-Palmolive",
    category: "Oral Care",
    mrp: 120,
    price: 110,
    cost: 85,
    quantity: 75,
    minStock: 15,
    supplier: "Colgate Agency",
    warehouse: "Patna",
    expiry: "2027-11-20",
    sku: "COLG-TOOTH-200G",
    description: "Calcium-boost toothpaste for strong teeth.",
    image: "🪥"
  },
  {
    name: "Clinic Plus Shampoo 340ml",
    barcode: "8901030702047",
    brand: "Hindustan Unilever",
    category: "Hair Care",
    mrp: 195,
    price: 185,
    cost: 145,
    quantity: 45,
    minStock: 10,
    supplier: "HUL Distribution",
    warehouse: "Guwahati",
    expiry: "2027-04-18",
    sku: "HUL-CLINIC-340ML",
    description: "Milk protein formula shampoo for strong hair.",
    image: "🧴"
  },
  {
    name: "Nescafe Coffee 100g",
    barcode: "8901058002471",
    brand: "Nestlé",
    category: "Beverages",
    mrp: 320,
    price: 300,
    cost: 240,
    quantity: 30,
    minStock: 8,
    supplier: "Nestlé Distributors",
    warehouse: "Jaipur",
    expiry: "2027-02-28",
    sku: "NES-COFFEE-100G",
    description: "100% pure instant coffee powder.",
    image: "☕"
  },
  {
    name: "Red Bull Energy Drink 250ml",
    barcode: "9002490100117",
    brand: "Red Bull GmbH",
    category: "Beverages",
    mrp: 125,
    price: 120,
    cost: 95,
    quantity: 90,
    minStock: 20,
    supplier: "Red Bull India",
    warehouse: "Mumbai",
    expiry: "2027-06-15",
    sku: "RB-250ML",
    description: "Vitalizes body and mind energy drink.",
    image: "🔋"
  }
];
export default function Inventory({ products, user, onAddProduct, onEditProduct, onDeleteProduct, onRefreshData }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activeRestocks, setActiveRestocks] = useState(() => {
    return JSON.parse(localStorage.getItem("bizpilot_active_restocks") || "{}");
  });

  useEffect(() => {
    if (location.state?.autoOpenScanner) {
      handleStartScanner();
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.prefillBarcode) {
      setEditingProduct(null);
      setName("");
      setSku("SKU-" + Math.floor(1e3 + Math.random() * 9e3));
      setCategory("Solar Panels");
      setPrice("");
      setCost("");
      setQuantity("10");
      setMinStock("5");
      setDescription("Scanned Barcode: " + location.state.prefillBarcode);
      setSupplier("Unknown Supplier");
      setModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.autoOpenRestock) {
      const { product, qty } = location.state.autoOpenRestock;
      handleRequestRestock(product, qty);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Solar Panels");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("");
  const [description, setDescription] = useState("");
  const [supplier, setSupplier] = useState("");

  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [showDemoSelector, setShowDemoSelector] = useState(false);
  const [highlightedProductId, setHighlightedProductId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const [tempSupplierName, setTempSupplierName] = useState("");
  const [tempSupplierEmail, setTempSupplierEmail] = useState("");
  const [tempSupplierPhone, setTempSupplierPhone] = useState("");
  const [isEditingSupplier, setIsEditingSupplier] = useState(false);

  const demoSuppliers = {
    "ABC Foods": {
      name: "ABC Foods Supply",
      email: "orders@abcfoods.com",
      phone: "+919876543210"
    },
    "Nestlé Wholesale": {
      name: "Nestlé Wholesale Supply",
      email: "procurement@nestle-dist.com",
      phone: "+918765432109"
    },
    "Waaree": {
      name: "Waaree Solar Technologies",
      email: "fulfillment@waaree.com",
      phone: "+919988776655"
    },
    "Apex Power": {
      name: "Apex Power Distribution",
      email: "sales@apexpower.com",
      phone: "+917766554433"
    }
  };

  const getSupplierDetails = (supplierName) => {
    const name = supplierName || "";
    if (!name || name === "Unknown Supplier" || name === "Local supplier") {
      return {
        name: name || "Unknown Supplier",
        email: "",
        phone: ""
      };
    }

    // Check localStorage first
    const customSuppliers = JSON.parse(localStorage.getItem("bizpilot_custom_suppliers") || "{}");
    if (customSuppliers[name]) {
      return customSuppliers[name];
    }

    if (demoSuppliers[name]) {
      return demoSuppliers[name];
    }

    // Do NOT generate fake email or phone numbers.
    return {
      name: name,
      email: "",
      phone: ""
    };
  };

  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedRestockProduct, setSelectedRestockProduct] = useState(null);
  const [recommendedQty, setRecommendedQty] = useState(100);

  useEffect(() => {
    if (selectedRestockProduct) {
      const info = getSupplierDetails(selectedRestockProduct.supplier);
      setTempSupplierName(info.name || "");
      setTempSupplierEmail(info.email || "");
      setTempSupplierPhone(info.phone || "");
    } else {
      setIsEditingSupplier(false);
    }
  }, [selectedRestockProduct]);

  const handleRequestRestock = (product, recommendedAmount = null) => {
    setSelectedRestockProduct(product);
    const qty = recommendedAmount !== null ? recommendedAmount : (product.minStock ? Math.max(50, product.minStock * 5) : 100);
    setRecommendedQty(qty);
    setRestockModalOpen(true);
  };

  const initiateRestock = async (product, qty, communicationType) => {
    const requestId = `req_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    const dateString = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const fullTime = `${dateString} ${timestamp}`;
    
    const activeRestock = {
      id: requestId,
      productId: product.id,
      productName: product.name,
      qty: qty,
      dealer: product.supplier || "Local Supplier",
      status: "Request Initiated",
      communication: `${communicationType} Draft Created`,
      timestamp: fullTime
    };
    
    const restocks = JSON.parse(localStorage.getItem("bizpilot_active_restocks") || "{}");
    restocks[product.id] = activeRestock;
    localStorage.setItem("bizpilot_active_restocks", JSON.stringify(restocks));
    setActiveRestocks(restocks);
    
    const auditLogs = JSON.parse(localStorage.getItem("bizpilot_audit_trail") || "[]");
    const newLogs = [
      {
        time: timestamp,
        type: "AI detected low stock",
        message: `${product.name}: ${qty} units recommended`
      },
      {
        time: timestamp,
        type: "Restock request initiated",
        message: `Dealer: ${product.supplier || "Local Supplier"} | Comm: ${communicationType}`
      },
      ...auditLogs
    ];
    localStorage.setItem("bizpilot_audit_trail", JSON.stringify(newLogs));
    
    try {
      await fetch("/api/stock-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          requestedQty: qty,
          requestedBy: user?.name || "Business Owner",
          note: `AI Recommended Restock via ${communicationType}`
        })
      });
    } catch (err) {
      console.warn("Backend restock request sync failed (offline demo mode fallback):", err);
    }

    if (onRefreshData) {
      try {
        await onRefreshData();
      } catch (e) {
        console.warn("Data refresh failed:", e);
      }
    }
  };

  const handleMarkReceived = async (req) => {
    try {
      const res = await fetch(`/api/stock-requests/${req.id}/receive`, {
        method: "PATCH"
      });
      
      if (res.ok) {
        const timestamp = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        
        const restocks = JSON.parse(localStorage.getItem("bizpilot_active_restocks") || "{}");
        if (restocks[req.productId]) {
          restocks[req.productId].status = "Received";
          localStorage.setItem("bizpilot_active_restocks", JSON.stringify(restocks));
          setActiveRestocks(restocks);
        }
        
        const auditLogs = JSON.parse(localStorage.getItem("bizpilot_audit_trail") || "[]");
        const newLogs = [
          {
            time: timestamp,
            type: "Restock received",
            message: `+${req.qty} units added to inventory (${req.productName})`
          },
          ...auditLogs
        ];
        localStorage.setItem("bizpilot_audit_trail", JSON.stringify(newLogs));
        
        triggerToast("Restock received — inventory updated successfully.");
        
        if (onRefreshData) {
          await onRefreshData();
        }
      }
    } catch (err) {
      console.error("Failed to mark request received in backend:", err);
    }
  };

  const handleDraftEmail = async () => {
    if (!selectedRestockProduct) return;
    const supplierInfo = getSupplierDetails(selectedRestockProduct.supplier);
    if (!supplierInfo.email) {
      triggerToast("Supplier email is missing. Please configure it first.");
      return;
    }
    const subject = encodeURIComponent(`Restock Request – ${selectedRestockProduct.name}`);
    const body = encodeURIComponent(
`Hello ${supplierInfo.name},

We would like to request a restock for the following product:

Product: ${selectedRestockProduct.name}
SKU: ${selectedRestockProduct.sku || "N/A"}
Current Stock: ${selectedRestockProduct.quantity || 0} units
Requested Quantity: ${recommendedQty} units

Please confirm availability and expected delivery date.

Regards,
BizPilot Procurement Team`
    );
    const mailtoUrl = `mailto:${supplierInfo.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    
    await initiateRestock(selectedRestockProduct, recommendedQty, "Email");
    
    setRestockModalOpen(false);
    triggerToast("Restock email draft opened.");
  };

  const handleDraftWhatsApp = async () => {
    if (!selectedRestockProduct) return;
    const supplierInfo = getSupplierDetails(selectedRestockProduct.supplier);
    if (!supplierInfo.phone) {
      triggerToast("Supplier phone is missing. Please configure it first.");
      return;
    }
    const text = encodeURIComponent(
`Hello ${supplierInfo.name},
BizPilot would like to request a restock:

Product: ${selectedRestockProduct.name}
SKU: ${selectedRestockProduct.sku || "N/A"}
Current Stock: ${selectedRestockProduct.quantity || 0} units
Requested Quantity: ${recommendedQty} units

Please confirm availability and delivery timeline.
Thank you.`
    );
    const cleanedPhone = supplierInfo.phone.replace(/[^0-9+]/g, "");
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${text}`;
    window.open(whatsappUrl, "_blank");
    
    await initiateRestock(selectedRestockProduct, recommendedQty, "WhatsApp");
    
    setRestockModalOpen(false);
    triggerToast("WhatsApp restock message opened.");
  };

  const handleSaveSupplierDetails = async () => {
    const name = tempSupplierName.trim();
    if (!name) {
      triggerToast("Supplier name cannot be empty.");
      return;
    }

    const customSuppliers = JSON.parse(localStorage.getItem("bizpilot_custom_suppliers") || "{}");
    customSuppliers[name] = {
      name: name,
      email: tempSupplierEmail.trim(),
      phone: tempSupplierPhone.trim()
    };
    localStorage.setItem("bizpilot_custom_suppliers", JSON.stringify(customSuppliers));

    // Update the product's supplier name if it was changed
    if (selectedRestockProduct.supplier !== name) {
      try {
        await onEditProduct(selectedRestockProduct.id, {
          ...selectedRestockProduct,
          supplier: name
        });
        setSelectedRestockProduct(prev => ({
          ...prev,
          supplier: name
        }));
      } catch (err) {
        console.error("Failed to update product supplier name:", err);
      }
    }

    setIsEditingSupplier(false);
    triggerToast(`Supplier details updated for "${name}".`);
  };
  const [scanSuccessFlash, setScanSuccessFlash] = useState(false);
  const [scanHistory, setScanHistory] = useState([
    { name: "Nescafe Coffee 100g", barcode: "8901058002471", time: "11:42 AM", status: "Success" },
    { name: "Vim Bar 300g", barcode: "8901030656111", time: "11:30 AM", status: "Success" }
  ]);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [showNotFoundDialog, setShowNotFoundDialog] = useState(false);
  const [notFoundBarcode, setNotFoundBarcode] = useState("");
  const [scannerStatus, setScannerStatus] = useState("Position Barcode in Center");
  
  
  const html5QrCodeRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const getStockStatusBadge = (stock, minS) => {
    if (stock === 0) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">🔴 Out of Stock</span>;
    if (stock <= minS) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20 animate-pulse">🟡 Low Stock</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">🟢 In Stock</span>;
  };

  const addToScanHistory = (nameVal, barcodeVal, statusVal) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setScanHistory(prev => [
      { name: nameVal, barcode: barcodeVal, time: timeStr, status: statusVal },
      ...prev
    ]);
  };

  const handleLookupBarcode = async (barcodeVal) => {
    // 1. Search local active catalog
    let found = products.find(p => p.description && p.description.includes(barcodeVal));
    if (!found) {
      found = products.find(p => p.sku === barcodeVal || p.name.toLowerCase().includes(barcodeVal.toLowerCase()));
    }

    if (found) {
      const mappedProduct = {
        name: found.name,
        barcode: barcodeVal,
        brand: found.brand || "Active Catalog",
        category: found.category || "General Goods",
        mrp: Math.round(found.price * 1.15),
        price: found.price,
        cost: found.cost,
        quantity: found.quantity,
        minStock: found.minStock || 5,
        supplier: found.supplier || "Local Supplier",
        warehouse: "Central Warehouse",
        expiry: "2026-12-31",
        sku: found.sku,
        description: found.description || "",
        image: "📦",
        isAlreadyInInventory: true
      };
      setScannedProduct(mappedProduct);
      setScannerStatus("Barcode Detected");
      addToScanHistory(mappedProduct.name, barcodeVal, "Success");
      
      // Highlight the product row
      setHighlightedProductId(found.id);
      setTimeout(() => {
        const row = document.getElementById("product-row-" + found.id);
        if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
      setTimeout(() => setHighlightedProductId(null), 5000);
      return;
    }

    // 2. Search OpenFoodFacts public registry as fallback to help add new products
    setScannerStatus("Querying public database...");
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcodeVal}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 1 && data.product) {
          const prod = data.product;
          const name = prod.product_name || prod.product_name_en || "Unknown Barcode Item";
          const brand = prod.brands || "Public Registry";
          const category = prod.categories_tags?.[0]?.replace("en:", "") || "General Goods";
          const mappedApiProduct = {
            name: name,
            barcode: barcodeVal,
            brand: brand,
            category: category,
            mrp: 150,
            price: 130,
            cost: 95,
            quantity: 10,
            minStock: 5,
            supplier: "Import Distributors",
            warehouse: "Central Warehouse",
            expiry: "2027-12-31",
            sku: `OFF-${barcodeVal.substring(0, 6)}`,
            description: prod.generic_name || "Product retrieved from OpenFoodFacts public database.",
            image: "🛒",
            isAlreadyInInventory: false
          };
          
          setScannedProduct(mappedApiProduct);
          setScannerStatus("Barcode Detected");
          addToScanHistory(name, barcodeVal, "Success");
          return;
        }
      }
    } catch (err) {
      console.warn("Public API query failed", err);
    }

    // 3. Fallback to Unknown Product flow
    setNotFoundBarcode(barcodeVal);
    setShowNotFoundDialog(true);
    setScannerStatus("Product Not Found");
    addToScanHistory("Unknown Product", barcodeVal, "Failed");
  };
  const handleStartScanner = () => {
    setScannedProduct(null);
    setShowScannerModal(true);
    setIsScanningActive(true);
    setScanningProgress(0);
    setShowDemoSelector(false);
  };

  const cleanupScanner = async () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (html5QrCodeRef.current) {
      const scanner = html5QrCodeRef.current;
      html5QrCodeRef.current = null;
      
      console.log("Scanner Stopped");
      
      if (scanner.isScanning) {
        try {
          await scanner.stop();
        } catch (e) {
          console.error("Error stopping scanner stream:", e);
        }
      }
      
      if (document.getElementById("inventory-scanner-reader")) {
        try {
          scanner.clear();
        } catch (e) {
          console.warn("Error clearing scanner canvas container:", e);
        }
      }
    }
  };

  const startCameraScanning = () => {
    cleanupScanner();

    setScannerStatus("Initializing Camera...");
    console.log("Scanner Started");
    
    const html5QrCode = new Html5Qrcode("inventory-scanner-reader");
    html5QrCodeRef.current = html5QrCode;

    const qrCodeSuccessCallback = (decodedText) => {
      console.log("Barcode:", decodedText);
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      setScanSuccessFlash(true);
      setScannerStatus(`✓ Barcode Detected: ${decodedText}`);
      setToastMessage("Barcode scanned successfully!");
      
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          console.log("Scanner Stopped");
        }).catch(e => console.error(e));
      }

      setTimeout(() => {
        cleanupScanner();
        setShowScannerModal(false);
        setIsScanningActive(false);
        setScanSuccessFlash(false);
        handleLookupBarcode(decodedText);
      }, 600);
    };

    const config = {
      fps: 10,
      qrbox: 280,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.QR_CODE
      ]
    };

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length > 0) {
        let backCamera = devices.find(device => 
          device.label.toLowerCase().includes("back") || 
          device.label.toLowerCase().includes("rear") || 
          device.label.toLowerCase().includes("environment")
        );
        const cameraId = backCamera ? backCamera.id : devices[devices.length - 1].id;
        
        return html5QrCode.start(
          cameraId,
          config,
          qrCodeSuccessCallback
        );
      } else {
        throw new Error("No cameras detected.");
      }
    })
    .then(() => {
      setIsScanningActive(true);
      setScanningProgress(100);
      setScannerStatus("Scanning...");
    })
    .catch((err) => {
      console.error(err);
      setScannerStatus("Camera permission denied or camera unavailable. Please check your browser permissions.");
      setToastMessage("Camera access denied or no camera found.");
      setShowDemoSelector(true);
    });
  };

  const handleStopScanner = async () => {
    await cleanupScanner();
    setShowScannerModal(false);
    setIsScanningActive(false);
  };

  const handleSimulateScan = (barcodeVal) => {
    cleanupScanner();

    setScanningProgress(0);
    setIsScanningActive(true);
    setScannedProduct(null);
    setShowScannerModal(true);

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setScanningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsScanningActive(false);
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      setScanSuccessFlash(true);
      setScannerStatus(`✓ Barcode Detected: ${barcodeVal}`);
      setToastMessage("Barcode scanned successfully!");

      setTimeout(() => {
        cleanupScanner();
        setShowScannerModal(false);
        setScanSuccessFlash(false);
        if (barcodeVal === "not_found_123") {
          setNotFoundBarcode("8909999999999");
          setShowNotFoundDialog(true);
          addToScanHistory("Unknown Product", "8909999999999", "Failed");
        } else {
          handleLookupBarcode(barcodeVal);
        }
      }, 600);
    }, 1600);
  };

  const handleCreateProductFromScan = () => {
    setEditingProduct(null);
    setName(notFoundBarcode ? "New Product (" + notFoundBarcode + ")" : "");
    setSku("SKU-" + Math.floor(1e3 + Math.random() * 9e3));
    setCategory("Solar Panels");
    setPrice("");
    setCost("");
    setQuantity("10");
    setMinStock("5");
    setDescription("Scanned Barcode: " + notFoundBarcode);
    setSupplier("Unknown Supplier");
    setShowNotFoundDialog(false);
    setModalOpen(true);
  };

  useEffect(() => {
    if (showScannerModal) {
      const timer = setTimeout(() => {
        startCameraScanning();
      }, 350);
      return () => clearTimeout(timer);
    } else {
      cleanupScanner();
    }
  }, [showScannerModal]);

  useEffect(() => {
    return () => {
      cleanupScanner();
    };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(["Solar Panels", "Inverters", "Batteries", "Mounting Kits", "Controllers", "Chocolate", "Instant Noodles", "Soft Drink", "Biscuits", "Dairy", "Edible Salt", "Flour", "Detergent", "Dishwash", "Oral Care", "Hair Care", "Beverages", ...products.map(p => p.category)]);
    return Array.from(cats);
  }, [products]);
  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.quantity * p.price, 0);
  }, [products]);
  const totalAssetCost = useMemo(() => {
    return products.reduce((sum, p) => sum + p.quantity * p.cost, 0);
  }, [products]);
  const potentialProfitMargin = totalStockValue > 0 ? (totalStockValue - totalAssetCost) / totalStockValue * 100 : 0;
  const lowStockCount = products.filter((p) => p.quantity <= p.minStock).length;
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.supplier && p.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSku("SKU-" + Math.floor(1e3 + Math.random() * 9e3));
    setCategory("Solar Panels");
    setPrice("");
    setCost("");
    setQuantity("");
    setMinStock("10");
    setDescription("");
    setSupplier("");
    setModalOpen(true);
  };
  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setPrice(String(p.price));
    setCost(String(p.cost));
    setQuantity(String(p.quantity));
    setMinStock(String(p.minStock));
    setDescription(p.description || "");
    setSupplier(p.supplier || "");
    setModalOpen(true);
  };
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productPayload = {
      name,
      sku,
      category,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      quantity: Number(quantity) || 0,
      minStock: Number(minStock) || 0,
      description,
      supplier
    };
    if (editingProduct) {
      onEditProduct(editingProduct.id, productPayload);
    } else {
      onAddProduct(productPayload);
    }
    setModalOpen(false);
  };
  return <div className="space-y-8 animate-fade-in">
      
      {
    /* Title block */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-teal-700 font-mono">Enterprise Assets</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">Inventory Intelligence</h1>
          <p className="text-xs text-gray-500 mt-1">Audit stock quantities, predict reorders, and optimize procurement margins.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStartScanner}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-850 text-xs font-semibold text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Smart Product Scanner</span>
          </button>
          <button
            id="btn-add-product"
            onClick={handleOpenAddModal}
            className="bg-white hover:bg-gray-50 text-xs border border-gray-250 text-gray-700 px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add SKU Product</span>
          </button>
        </div>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {
    /* Total tracked products */
  }
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total SKUs Tracked</p>
          <p className="font-display font-bold text-2xl text-gray-900 mt-1">{products.length} Items</p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-550">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            <span>Across categories</span>
          </div>
        </div>

        {
    /* Low Stock count */
  }
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Safety Threshold Breaches</p>
          <p className="font-display font-bold text-2xl text-gray-900 mt-1">{lowStockCount} items</p>
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${lowStockCount > 0 ? "text-amber-705" : "text-green-700"}`}>
            {lowStockCount > 0 ? <>
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                <span>Requires restock orders</span>
              </> : <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>All SKUs stable</span>
              </>}
          </div>
        </div>

        {
    /* Total Stock value asset */
  }
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Retail Valuation</p>
          <p className="font-display font-bold text-2xl text-teal-700 mt-1">{formatAmount(totalStockValue, user?.currency)}</p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
            <span>Liquid trade value</span>
          </div>
        </div>

        {
    /* Cost margin asset */
  }
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Potential Gross Profit</p>
          <p className="font-display font-bold text-2xl text-gray-900 mt-1">{formatAmount(totalStockValue - totalAssetCost, user?.currency)}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-green-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-650" />
            <span>Avg {potentialProfitMargin.toFixed(1)}% margins</span>
          </div>
        </div>

      </div>

      {/* Smart Product Scanner section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Scanner Control & Results */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col justify-between border-l-4 border-l-teal-650 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <Camera className="w-16 h-16 text-teal-650" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-850 tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
                BizPilot Smart Scanner
              </span>
              <h3 className="text-sm font-bold text-gray-900">Smart Product Scanner</h3>
              <p className="text-xs text-gray-500 mt-1">Scan any product barcode to instantly identify products and manage inventory.</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 items-center">
              <button
                onClick={handleStartScanner}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-850 text-xs font-semibold text-white rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{scannedProduct ? "Scan Another Product" : "Scan Barcode"}</span>
              </button>

              {/* Simulation Select Dropdown */}
              <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-gray-50 border border-gray-200 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">Simulate Scan:</span>
                <select
                  onChange={(e) => handleSimulateScan(e.target.value)}
                  value=""
                  className="bg-transparent text-xs text-gray-700 font-semibold outline-none w-full cursor-pointer"
                >
                  <option value="" disabled className="bg-white text-gray-400">Select Mock Product...</option>
                  {mockProductDatabase.map((p) => (
                    <option key={p.barcode} value={p.barcode} className="bg-white text-gray-750">
                      {p.name} ({p.barcode})
                    </option>
                  ))}
                  <option value="not_found_123" className="bg-white text-gray-750">
                    Unknown Barcode (Simulate Error)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Scanned product result cards */}
          {scannedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {/* Product Info Card */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Identified Asset</span>
                      <h3 className="text-sm font-bold text-gray-900 mt-0.5">{scannedProduct.name}</h3>
                    </div>
                    {getStockStatusBadge(scannedProduct.quantity, scannedProduct.minStock)}
                  </div>

                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-50 flex items-center justify-center text-4xl shadow-inner shrink-0 border border-gray-200">
                      {scannedProduct.image || "📦"}
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <span className="text-gray-400 block font-semibold text-[9px] uppercase tracking-wider">Barcode</span>
                        <span className="text-gray-805 font-mono font-bold">{scannedProduct.barcode}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold text-[9px] uppercase tracking-wider">Brand</span>
                        <span className="text-gray-805 font-bold">{scannedProduct.brand}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold text-[9px] uppercase tracking-wider">SKU</span>
                        <span className="text-gray-805 font-mono font-bold">{scannedProduct.sku}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold text-[9px] uppercase tracking-wider">Warehouse</span>
                        <span className="text-gray-805 font-bold">{scannedProduct.warehouse}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold text-[9px] uppercase tracking-wider">Price (MRP / Sell)</span>
                        <span className="text-gray-805 font-bold">₹{scannedProduct.mrp} / ₹{scannedProduct.price}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold text-[9px] uppercase tracking-wider">Stock</span>
                        <span className="text-gray-805 font-bold font-mono">{scannedProduct.quantity} Units</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Supplier: <span className="text-gray-600 font-semibold">{scannedProduct.supplier}</span></span>
                  <span>Expiry: <span className="text-gray-600 font-semibold">{scannedProduct.expiry}</span></span>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm border-l-4 border-l-teal-650 flex flex-col justify-between relative overflow-hidden">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider flex items-center gap-1 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
                    AI Insights & Predictive Analysis
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-gray-500 block font-medium">Avg Daily Sales:</span>
                      <span className="text-gray-900 font-bold font-mono">8 Units</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block font-medium">Current Stock:</span>
                      <span className="text-gray-900 font-bold font-mono">{scannedProduct.quantity} Units</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block font-medium">Estimated Stockout:</span>
                      <span className={`${scannedProduct.quantity <= scannedProduct.minStock ? "text-red-700 font-semibold" : "text-gray-800"} font-bold font-mono`}>
                        {Math.ceil(scannedProduct.quantity / 8)} Days
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block font-medium">Demand Trend:</span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-150 font-bold text-[9px] w-fit block mt-0.5">
                        High
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 bg-teal-50/50 rounded-lg p-2.5 border border-teal-100 text-[10px] text-teal-850 font-medium leading-relaxed flex flex-col gap-2">
                  <div>
                    <span className="font-bold text-teal-900 block mb-0.5 uppercase tracking-widest text-[8px]">AI Recommendation</span>
                    Restock {scannedProduct.quantity <= scannedProduct.minStock ? "100" : "50"} units within 48 hours to secure high seasonal margins.
                  </div>
                  {scannedProduct.quantity <= scannedProduct.minStock && (
                    <button
                      onClick={() => handleRequestRestock(scannedProduct, 100)}
                      className="mt-1 w-full bg-teal-700 hover:bg-teal-850 text-white font-bold py-1.5 px-3 rounded text-[10px] cursor-pointer text-center"
                    >
                      Request Restock
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Scan History List */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col justify-between h-full min-h-[220px] relative overflow-hidden">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5 mb-3.5">
                <Activity className="w-3.5 h-3.5 text-teal-650 animate-pulse" />
                Recent Scan Logs
              </span>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {scanHistory.length > 0 ? (
                  scanHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs border-b border-gray-100 pb-2">
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 block truncate" title={item.name}>
                          {item.name}
                        </span>
                        <span className="text-[9px] text-gray-450 font-mono font-medium block mt-0.5">
                          {item.barcode} • {item.time}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                        item.status === "Success" 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No recent scans performed.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {
    /* Filters & Search controls */
  }
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by SKU name, code, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-gray-250 rounded-lg py-2 pl-10 pr-4 text-xs focus:border-teal-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-450 uppercase tracking-widest shrink-0">Category:</span>
          {categories.map((cat) => <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${selectedCategory === cat ? "bg-teal-700 text-white shadow-sm" : "bg-gray-50 border border-gray-200 text-gray-650 hover:bg-gray-100"}`}
          >
              {cat}
            </button>)}
        </div>
      </div>

      {
    /* Inventory Products Table */
  }
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-4 px-6">Product details</th>
                <th className="py-4 px-4">SKU / Code</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-right">Unit Price</th>
                <th className="py-4 px-4 text-right">Unit Cost</th>
                <th className="py-4 px-4 text-center">In Stock</th>
                <th className="py-4 px-4">Supplier</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? filteredProducts.map((p) => {
    const isLow = p.quantity <= p.minStock;
    return <tr key={p.id} className="hover:bg-gray-50 group">
                      <td className="py-3.5 px-6">
                        <div className="max-w-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-gray-900">{p.name}</span>
                            {(() => {
                              const activeRequest = activeRestocks[p.id];
                              if (activeRequest) {
                                if (activeRequest.status === "Received") {
                                  return (
                                    <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-705 border border-green-200 text-[8px] font-bold uppercase tracking-wider font-mono">
                                      RESTOCK RECEIVED
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-705 border border-amber-200 text-[8px] font-bold uppercase tracking-wider font-mono">
                                      RESTOCK REQUESTED
                                    </span>
                                  );
                                }
                              }
                              return null;
                            })()}
                          </div>
                          <p className="text-[10px] text-gray-450 mt-0.5 truncate">{p.description || "No description provided."}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">{p.sku}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] font-medium uppercase tracking-wider">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-gray-900">{formatAmount(p.price, user?.currency)}</td>
                      <td className="py-3.5 px-4 text-right text-gray-550">{formatAmount(p.cost, user?.currency)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1 justify-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${isLow ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" : "bg-green-50 text-green-700 border-green-200"}`}>
                            {p.quantity} left
                          </span>
                          {isLow && <span className="text-[9px] text-amber-705 font-semibold uppercase tracking-wider">Reorder trigger</span>}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{p.supplier || "Local supplier"}</td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isLow && !activeRestocks[p.id] && (
                            <button
                              onClick={() => handleRequestRestock(p)}
                              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-705 hover:text-amber-800 text-[10px] font-bold rounded-lg cursor-pointer shadow-2xs transition-all flex items-center gap-1 shrink-0"
                              title="Request Restock"
                            >
                              <RefreshCw className="w-3 h-3 animate-spin-hover" />
                              <span>Request Restock</span>
                            </button>
                          )}
                          {activeRestocks[p.id] && activeRestocks[p.id].status === "Request Initiated" && (
                            <button
                              onClick={() => handleMarkReceived(activeRestocks[p.id])}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 hover:border-emerald-300 text-emerald-700 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1 shrink-0 text-[10px] font-bold"
                              title="Mark as Received"
                            >
                              <Check className="w-3 h-3 font-bold" />
                              <span>Mark Received</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 bg-white hover:bg-gray-50 border border-gray-250 text-gray-450 hover:text-teal-700 rounded-md transition-colors cursor-pointer shadow-sm"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 bg-white hover:bg-red-50 border border-gray-250 hover:border-red-200 text-gray-450 hover:text-red-650 rounded-md transition-colors cursor-pointer shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>;
  }) : <tr>
                  <td colSpan={8} className="text-center py-16">
                    <Package className="w-12 h-12 text-gray-205 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No SKU items found</p>
                    <p className="text-xs text-gray-550 mt-1">Try refining your search keyword or add a new product.</p>
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Product ADD / EDIT Modal Overlay */
  }
      {modalOpen && <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-xl rounded-lg overflow-hidden shadow-sm relative">
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-teal-700 to-transparent" />
            
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900">{editingProduct ? "Edit SKU Asset" : "Register New Product"}</h3>
                <p className="text-[11px] text-gray-400">All fields automatically adjust trade profit estimates.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-550 hover:text-gray-950 transition-colors font-semibold text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {
    /* Name */
  }
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Product SKU Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 450W Monocrystalline Solar Panel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                />
              </div>

              {
    /* SKU & Category */
  }
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="SOL-PAN-450"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-700"
                  >
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {
    /* Price & Cost */
  }
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="24.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Procurement Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="12.50"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                  />
                </div>
              </div>

              {
    /* Quantity & Safety Limit */
  }
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Initial Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Safety stock limit (min)</label>
                  <input
                    type="number"
                    required
                    placeholder="15"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                  />
                </div>
              </div>

              {
    /* Supplier */
  }
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Procurement Supplier</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Solar Energy"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                />
              </div>

              {
    /* Description */
  }
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">SKU Description</label>
                <textarea
                  rows={2}
                  placeholder="Add custom features, origins, or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-transparent border border-gray-250 rounded-lg py-2 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-800 resize-none"
                />
              </div>

              {
    /* Submit button */
  }
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-850 py-2.5 rounded-lg font-semibold text-xs text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{editingProduct ? "Save Changes" : "Create Product SKU"}</span>
              </button>
            </form>
          </div>
        </div>}

      {/* Smart Product Scanner Camera Overlay Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-lg rounded-lg overflow-hidden shadow-sm relative flex flex-col">
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-teal-700 to-transparent" />
            
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900">Camera Viewfinder</h3>
                <p className="text-[11px] text-gray-400">Hold barcode in front of the camera viewport.</p>
              </div>
              <button
                onClick={handleStopScanner}
                className="text-gray-550 hover:text-gray-950 transition-colors font-semibold text-sm cursor-pointer"
              >
                Close Scanner
              </button>
            </div>

            <div className="p-6 flex flex-col items-center space-y-4">
              {/* CRT Camera Viewfinder */}
              <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden border flex items-center justify-center shadow-inner transition-all duration-300 ${
                scanSuccessFlash ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]" : "border-gray-200"
              }`}>
                <div id="inventory-scanner-reader" className="w-full h-full object-cover" />

                {/* Laser scan lines */}
                {!scanSuccessFlash && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.85)] pointer-events-none animate-bounce z-10" />
                )}

                {/* Success checkmark overlay */}
                {scanSuccessFlash && (
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-20 animate-fade-in">
                    <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
                    <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest font-mono">Success!</span>
                  </div>
                )}

                {scannerStatus.includes("Initializing") && (
                  <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center gap-2 z-20">
                    <RefreshCw className="w-8 h-8 text-teal-700 animate-spin" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{scannerStatus}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30 pointer-events-none z-10" />
                <div className="crt-scanlines opacity-40 z-10" />
              </div>

              {/* Progress and status */}
              <div className="w-full text-center space-y-2">
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-widest font-mono">
                  {scannerStatus}
                </span>
                <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden border border-gray-200">
                  <div 
                    className="h-full bg-teal-700 transition-all duration-150"
                    style={{ width: `${scanningProgress}%` }}
                  />
                </div>
                <div className="text-[9px] text-gray-450 font-bold font-mono">
                  SUPPORTED: EAN-13 • UPC • QR CODE • CODE-128
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Not Found Modal Dialog */}
      {showNotFoundDialog && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 w-full max-w-sm rounded-lg overflow-hidden shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <span className="p-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-display font-bold text-sm text-gray-900">Unknown Product</h3>
                <p className="text-[10px] text-gray-450 font-mono mt-0.5">Scanned: {notFoundBarcode}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              No matching inventory item was found in your warehouse catalog.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleCreateProductFromScan}
                className="w-full py-2 bg-teal-700 hover:bg-teal-850 text-xs font-semibold text-white rounded-lg transition-all shadow-sm cursor-pointer text-center"
              >
                Register New Product
              </button>
              <button
                onClick={() => {
                  setShowNotFoundDialog(false);
                  handleStartScanner();
                }}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg transition-all cursor-pointer text-center shadow-sm"
              >
                Scan Again
              </button>
              <button
                onClick={() => setShowNotFoundDialog(false)}
                className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-655 transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Confirmation Modal */}
      {restockModalOpen && selectedRestockProduct && (() => {
        const supplierInfo = getSupplierDetails(selectedRestockProduct.supplier);
        return (
          <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative p-6 space-y-4">
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-teal-700 to-transparent" />
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-750 tracking-wider font-mono">Procurement Draft</span>
                  <h3 className="font-display font-bold text-base text-gray-900 mt-0.5">Restock Request Confirmation</h3>
                </div>
                <button
                  onClick={() => {
                    setRestockModalOpen(false);
                    setSelectedRestockProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-650 transition-colors font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-2.5 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-gray-550 font-medium">Product:</span>
                  <span className="text-gray-900 font-bold">{selectedRestockProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-550 font-medium">Current Stock:</span>
                  <span className="text-gray-900 font-bold font-mono">{selectedRestockProduct.quantity || 0} Units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-550 font-medium">Recommended Qty:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={recommendedQty}
                      onChange={(e) => setRecommendedQty(Math.max(1, Number(e.target.value)))}
                      className="w-16 bg-white border border-gray-250 rounded py-0.5 px-1.5 text-xs text-right font-mono font-bold text-teal-700 focus:border-teal-500 focus:outline-none"
                    />
                    <span className="text-teal-700 font-bold font-mono">Units</span>
                  </div>
                </div>
                <div className="flex justify-between border-t border-gray-250/50 pt-2.5 mt-2.5">
                  <span className="text-gray-550 font-medium">Dealer Name:</span>
                  <span className="text-gray-900 font-semibold">{supplierInfo.name || <span className="text-gray-400 italic">None</span>}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-550 font-medium">Dealer Email:</span>
                  {supplierInfo.email ? (
                    <span className="text-gray-800 font-mono">{supplierInfo.email}</span>
                  ) : (
                    <span className="text-rose-500 font-bold italic">Missing Email</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-550 font-medium">Dealer Phone:</span>
                  {supplierInfo.phone ? (
                    <span className="text-gray-800 font-mono">{supplierInfo.phone}</span>
                  ) : (
                    <span className="text-rose-500 font-bold italic">Missing Phone</span>
                  )}
                </div>
                <div className="pt-2 border-t border-gray-250/50 flex justify-end">
                  <button
                    onClick={() => setIsEditingSupplier(true)}
                    className="text-teal-750 hover:text-teal-900 font-bold text-[10px] cursor-pointer flex items-center gap-1"
                  >
                    <span>✎</span>
                    <span>{(!supplierInfo.email || !supplierInfo.phone) ? "Add Supplier Contact Info" : "Edit Supplier Contact Info"}</span>
                  </button>
                </div>
              </div>

              {/* Editing Supplier Info form */}
              {isEditingSupplier && (
                <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-white shadow-inner animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <h4 className="font-bold text-xs text-gray-800">Configure Supplier Contact</h4>
                    <span className="text-[9px] font-mono text-gray-400">Updates saved locally</span>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Supplier/Dealer Name</label>
                    <input
                      type="text"
                      value={tempSupplierName}
                      onChange={(e) => setTempSupplierName(e.target.value)}
                      className="w-full bg-transparent border border-gray-250 rounded-lg py-1.5 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-805"
                      placeholder="e.g. Waaree Solar Technologies"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={tempSupplierEmail}
                      onChange={(e) => setTempSupplierEmail(e.target.value)}
                      className="w-full bg-transparent border border-gray-250 rounded-lg py-1.5 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-805"
                      placeholder="e.g. orders@supplier.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={tempSupplierPhone}
                      onChange={(e) => setTempSupplierPhone(e.target.value)}
                      className="w-full bg-transparent border border-gray-250 rounded-lg py-1.5 px-3 text-xs focus:border-teal-500 focus:outline-none text-gray-805"
                      placeholder="e.g. +919988776655"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => setIsEditingSupplier(false)}
                      className="px-2.5 py-1.5 bg-gray-55 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-md font-semibold text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSupplierDetails}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-850 text-white rounded-md font-bold text-[10px] cursor-pointer shadow-sm"
                    >
                      Save Supplier
                    </button>
                  </div>
                </div>
              )}

              {/* AI Explainer Segment */}
              <div className="bg-teal-50/50 border border-teal-150 p-3.5 rounded-xl text-left mt-3">
                <span className="text-[9px] font-bold text-teal-800 uppercase tracking-widest font-mono block">Why this action?</span>
                <p className="text-xs text-teal-900 mt-1 leading-normal font-sans">
                  Current stock ({selectedRestockProduct.quantity || 0} units) is below the safety threshold of {selectedRestockProduct.minStock || 5} units. BizPilot recommends replenishing {recommendedQty} units to reduce stock-out risk.
                </p>
              </div>

              {(!supplierInfo.email || !supplierInfo.phone) && (
                <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-lg text-left text-[10px] text-rose-700 font-medium space-y-1">
                  {!supplierInfo.email && <p>⚠️ Email drafting is disabled because the supplier email is missing.</p>}
                  {!supplierInfo.phone && <p>⚠️ WhatsApp drafting is disabled because the supplier phone number is missing.</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                {supplierInfo.email ? (
                  <button
                    onClick={handleDraftEmail}
                    className="w-full bg-gradient-to-tr from-teal-750 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-bold py-2.5 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Draft Email</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSupplier(true)}
                    className="w-full bg-gray-50 border border-dashed border-gray-300 hover:bg-gray-100 text-gray-450 font-bold py-2.5 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>Add Supplier Email</span>
                  </button>
                )}

                {supplierInfo.phone ? (
                  <button
                    onClick={handleDraftWhatsApp}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-bold py-2.5 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                    <span>Draft WhatsApp</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSupplier(true)}
                    className="w-full bg-gray-50 border border-dashed border-gray-300 hover:bg-gray-100 text-gray-450 font-bold py-2.5 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    <span>Add Supplier Phone</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Toast alert popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-slate-900/90 border border-teal-500/30 text-slate-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm backdrop-blur-md">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div className="text-xs font-semibold leading-relaxed">
              {toastMessage}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-white transition-colors ml-auto cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

    </div>;
}
