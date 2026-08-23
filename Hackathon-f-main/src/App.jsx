import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import Workforce from "./pages/Workforce";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Logistics from "./pages/Logistics";
import Customers from "./pages/Customers";
import Backups from "./pages/Backups";
import Copilot from "./pages/Copilot";
import OperationsDashboard from "./pages/OperationsDashboard";
import SplashScreen from "./components/SplashScreen";
import { auth } from "./googleDrive";
import { signOut } from "firebase/auth";

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("bizpilot_splash_shown");
  });
  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("bizpilot_splash_shown", "true");
  };

  const defaultProfile = {
    email: "gamigrrider18@gmail.com",
    name: "Siddu",
    businessName: "BizPilot",
    businessType: "Clean Energy Systems & Green Technology",
    currency: "INR"
  };
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bizpilot_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.businessName) return parsed;
      } catch (e) {}
    }
    return null;
  });
  const theme = "emerald";
  const crtEnabled = false;
  const handleToggleCrt = () => {};
  const handleUpdateTheme = () => {};
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reports, setReports] = useState([]);
  const [compileLoading, setCompileLoading] = useState(false);
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthorized or session expired");
      })
      .then((data) => {
        if (data && data.businessName) {
          setUser(data);
          localStorage.setItem("bizpilot_profile", JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.warn("Backend profile sync error on load", err);
      });
  }, []);
  const loadFallbackData = () => {
    // 1. Products
    let productsLoaded = false;
    try {
      const savedProducts = localStorage.getItem("bizpilot_products_fallback");
      if (savedProducts && savedProducts !== "undefined" && savedProducts !== "null") {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          productsLoaded = true;
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved products fallback", e);
    }
    if (!productsLoaded) {
      const initialProducts = [
        {
          id: "p1",
          name: "Printer Paper A4",
          category: "Office Supplies",
          quantity: 18,
          currentStock: 18,
          minStock: 30,
          reorderThreshold: 30,
          cost: 240.0,
          unitCost: 240.0,
          price: 360.0,
          sku: "PAP-A4-XYZ",
          description: "High-quality 80gsm white A4 printing paper.",
          supplier: "Global Paper Co"
        },
        {
          id: "p2",
          name: "Ponds Powder",
          category: "Cosmetics",
          quantity: 3,
          currentStock: 3,
          minStock: 10,
          reorderThreshold: 10,
          cost: 90.0,
          unitCost: 90.0,
          price: 130.0,
          sku: "PND-PWD-100",
          description: "Sandalwood talcum powder 100g.",
          supplier: "ABC Foods"
        },
        {
          id: "p3",
          name: "USB-C Cable",
          category: "Electronics",
          quantity: 42,
          currentStock: 42,
          minStock: 20,
          reorderThreshold: 20,
          cost: 120.0,
          unitCost: 120.0,
          price: 200.0,
          sku: "USB-C-3FT",
          description: "3ft fast charging braided USB-C cable.",
          supplier: "Apex Power"
        },
        {
          id: "p4",
          name: "Wireless Mouse",
          category: "Electronics",
          quantity: 24,
          currentStock: 24,
          minStock: 15,
          reorderThreshold: 15,
          cost: 350.0,
          unitCost: 350.0,
          price: 600.0,
          sku: "MSE-WRL-OPT",
          description: "Ergonomic 2.4GHz wireless optical mouse.",
          supplier: "Apex Power"
        },
        {
          id: "p5",
          name: "LED Bulb 12W",
          category: "Electronics",
          quantity: 65,
          currentStock: 65,
          minStock: 25,
          reorderThreshold: 25,
          cost: 80.0,
          unitCost: 80.0,
          price: 140.0,
          sku: "LED-12W-WHT",
          description: "Energy-efficient warm white 12W LED bulb.",
          supplier: "Apex Power"
        },
        {
          id: "p6",
          name: "Notebook A5",
          category: "Office Supplies",
          quantity: 25,
          currentStock: 25,
          minStock: 15,
          reorderThreshold: 15,
          cost: 40.0,
          unitCost: 40.0,
          price: 70.0,
          sku: "NTB-A5-RUL",
          description: "Ruled A5 notebook, 160 pages.",
          supplier: "Global Paper Co"
        },
        {
          id: "p7",
          name: "Keyboard",
          category: "Electronics",
          quantity: 28,
          currentStock: 28,
          minStock: 15,
          reorderThreshold: 15,
          cost: 400.0,
          unitCost: 400.0,
          price: 750.0,
          sku: "KBD-USB-STD",
          description: "Standard full-size USB wired keyboard.",
          supplier: "Apex Power"
        },
        {
          id: "p8",
          name: "Ball Pen Pack",
          category: "Office Supplies",
          quantity: 95,
          currentStock: 95,
          minStock: 30,
          reorderThreshold: 30,
          cost: 50.0,
          unitCost: 50.0,
          price: 90.0,
          sku: "PEN-BLU-10P",
          description: "Pack of 10 blue ink fine-point ball pens.",
          supplier: "ABC Foods"
        },
        {
          id: "p9",
          name: "Thermal Paper Roll",
          category: "Office Supplies",
          quantity: 6,
          currentStock: 6,
          minStock: 15,
          reorderThreshold: 15,
          cost: 20.0,
          unitCost: 20.0,
          price: 35.0,
          sku: "THM-PR-3IN",
          description: "3-inch thermal POS receipt paper roll.",
          supplier: "Speedy Logistics"
        },
        {
          id: "p10",
          name: "Cleaning Spray",
          category: "Cleaning Utilities",
          quantity: 22,
          currentStock: 22,
          minStock: 12,
          reorderThreshold: 12,
          cost: 100.0,
          unitCost: 100.0,
          price: 160.0,
          sku: "CLN-SPR-500",
          description: "Multi-surface disinfectant cleaning spray 500ml.",
          supplier: "Unilever Wholesale"
        },
        {
          id: "p11",
          name: "Power Adapter",
          category: "Electronics",
          quantity: 9,
          currentStock: 9,
          minStock: 18,
          reorderThreshold: 18,
          cost: 250.0,
          unitCost: 250.0,
          price: 450.0,
          sku: "PWR-AD-20W",
          description: "20W USB-C PD fast charger wall adapter.",
          supplier: "Apex Power"
        },
        {
          id: "p12",
          name: "Packaging Boxes",
          category: "Packaging",
          quantity: 35,
          currentStock: 35,
          minStock: 40,
          reorderThreshold: 40,
          cost: 20.0,
          unitCost: 20.0,
          price: 40.0,
          sku: "BOX-MED-BRN",
          description: "Medium corrugated brown shipping boxes.",
          supplier: "Unknown Supplier"
        }
      ];
      setProducts(initialProducts);
      localStorage.setItem("bizpilot_products_fallback", JSON.stringify(initialProducts));
    }

    // 2. Invoices
    let invoicesLoaded = false;
    try {
      const savedInvoices = localStorage.getItem("bizpilot_invoices_fallback");
      if (savedInvoices && savedInvoices !== "undefined" && savedInvoices !== "null") {
        const parsed = JSON.parse(savedInvoices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInvoices(parsed);
          invoicesLoaded = true;
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved invoices fallback", e);
    }
    if (!invoicesLoaded) {
      const initialInvoices = [
        { id: "inv_1", invoiceNumber: "INV-20260810-001", clientName: "General Office Stores", issueDate: "2026-08-10", total: 68000.0, status: "paid" },
        { id: "inv_2", invoiceNumber: "INV-20260811-002", clientName: "City Tech Hub", issueDate: "2026-08-11", total: 87500.0, status: "paid" },
        { id: "inv_3", invoiceNumber: "INV-20260812-003", clientName: "Vance Cosmetics", issueDate: "2026-08-12", total: 52000.0, status: "paid" },
        { id: "inv_4", invoiceNumber: "INV-20260814-004", clientName: "Bright Lights Retail", issueDate: "2026-08-14", total: 70000.0, status: "paid" },
        { id: "inv_5", invoiceNumber: "INV-20260815-005", clientName: "Alpha Logistics", issueDate: "2026-08-15", total: 57500.0, status: "paid" },
        { id: "inv_6", invoiceNumber: "INV-20260816-006", clientName: "Standard Stationers", issueDate: "2026-08-16", total: 57000.0, status: "paid" },
        { id: "inv_7", invoiceNumber: "INV-20260818-007", clientName: "Electronics Plaza", issueDate: "2026-08-18", total: 65000.0, status: "paid" },
        { id: "inv_8", invoiceNumber: "INV-20260820-008", clientName: "Clean & Safe Wholesale", issueDate: "2026-08-20", total: 28800.0, status: "paid" },
        { id: "inv_unpaid_1", invoiceNumber: "INV-20260821-009", clientName: "City Office Supplies", issueDate: "2026-08-21", total: 36000.0, status: "unpaid" },
        { id: "inv_unpaid_2", invoiceNumber: "INV-20260822-010", clientName: "Apex Tech Distributors", issueDate: "2026-08-22", total: 14000.0, status: "unpaid" }
      ];
      setInvoices(initialInvoices);
      localStorage.setItem("bizpilot_invoices_fallback", JSON.stringify(initialInvoices));
    }

    // 3. Transactions
    let transactionsLoaded = false;
    try {
      const savedTransactions = localStorage.getItem("bizpilot_transactions_fallback");
      if (savedTransactions && savedTransactions !== "undefined" && savedTransactions !== "null") {
        const parsed = JSON.parse(savedTransactions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
          transactionsLoaded = true;
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved transactions fallback", e);
    }
    if (!transactionsLoaded) {
      const initialTransactions = [
        { id: "tx_inv_1", date: "2026-08-10", type: "revenue", category: "Sales", amount: 68000.0, description: "Invoice collection: General Office Stores (INV-20260810-001)" },
        { id: "tx_inv_2", date: "2026-08-11", type: "revenue", category: "Sales", amount: 87500.0, description: "Invoice collection: City Tech Hub (INV-20260811-002)" },
        { id: "tx_inv_3", date: "2026-08-12", type: "revenue", category: "Sales", amount: 52000.0, description: "Invoice collection: Vance Cosmetics (INV-20260812-003)" },
        { id: "tx_inv_4", date: "2026-08-14", type: "revenue", category: "Sales", amount: 70000.0, description: "Invoice collection: Bright Lights Retail (INV-20260814-004)" },
        { id: "tx_inv_5", date: "2026-08-15", type: "revenue", category: "Sales", amount: 57500.0, description: "Invoice collection: Alpha Logistics (INV-20260815-005)" },
        { id: "tx_inv_6", date: "2026-08-16", type: "revenue", category: "Sales", amount: 57000.0, description: "Invoice collection: Standard Stationers (INV-20260816-006)" },
        { id: "tx_inv_7", date: "2026-08-18", type: "revenue", category: "Sales", amount: 65000.0, description: "Invoice collection: Electronics Plaza (INV-20260818-007)" },
        { id: "tx_inv_8", date: "2026-08-20", type: "revenue", category: "Sales", amount: 28800.0, description: "Invoice collection: Clean & Safe Wholesale (INV-20260820-008)" },
        { id: "tx_inv_unpaid_1", date: "2026-08-21", type: "revenue", category: "Sales", amount: 36000.0, description: "Invoice collection: City Office Supplies (INV-20260821-009)" },
        { id: "tx_inv_unpaid_2", date: "2026-08-22", type: "revenue", category: "Sales", amount: 14000.0, description: "Invoice collection: Apex Tech Distributors (INV-20260822-010)" },
        { id: "tx_bill_1", date: "2026-08-01", type: "expense", category: "Materials", amount: 95000.0, description: "Bill Confirmed: Global Paper Co" },
        { id: "tx_bill_2", date: "2026-08-02", type: "expense", category: "Materials", amount: 110000.0, description: "Bill Confirmed: Apex Power" },
        { id: "tx_bill_3", date: "2026-08-03", type: "expense", category: "Materials", amount: 75000.0, description: "Bill Confirmed: ABC Foods" },
        { id: "tx_bill_4", date: "2026-08-04", type: "expense", category: "Materials", amount: 65000.0, description: "Bill Confirmed: Unilever Wholesale" },
        { id: "tx_bill_5", date: "2026-08-05", type: "expense", category: "Materials", amount: 35000.0, description: "Bill Confirmed: Speedy Logistics" },
        { id: "tx_bill_wages", date: "2026-08-15", type: "expense", category: "Wages", amount: 10000.0, description: "Bill Confirmed: Ravi Kumar" },
        { id: "tx_bill_other", date: "2026-08-10", type: "expense", category: "Other", amount: 3000.0, description: "Bill Confirmed: Cloud Services" },
        { id: "tx_bill_transport", date: "2026-08-12", type: "expense", category: "Transport", amount: 2000.0, description: "Bill Confirmed: DTDC Courier" }
      ];
      setTransactions(initialTransactions);
      localStorage.setItem("bizpilot_transactions_fallback", JSON.stringify(initialTransactions));
    }
  };

  const refreshData = async () => {
    try {
      const [pRes, iRes, tRes, rRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/invoices"),
        fetch("/api/transactions"),
        fetch("/api/reports")
      ]);
      
      let hasError = false;
      
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
        localStorage.setItem("bizpilot_products_fallback", JSON.stringify(pData));
      } else {
        hasError = true;
      }
      
      if (iRes.ok) {
        const iData = await iRes.json();
        setInvoices(iData);
        localStorage.setItem("bizpilot_invoices_fallback", JSON.stringify(iData));
      } else {
        hasError = true;
      }
      
      if (tRes.ok) {
        const tData = await tRes.json();
        setTransactions(tData);
        localStorage.setItem("bizpilot_transactions_fallback", JSON.stringify(tData));
      } else {
        hasError = true;
      }
      
      if (rRes.ok) {
        setReports(await rRes.json());
      } else {
        hasError = true;
      }
      
      if (hasError) {
        loadFallbackData();
      }
    } catch (err) {
      console.warn("Express backend connection not active yet. Fallback to client state memory.", err);
      loadFallbackData();
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);
  const handleLoginSuccess = (profile) => {
    setUser(profile);
  };
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout sync failed:", err);
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Firebase signout error:", err);
    }
    localStorage.removeItem("bizpilot_profile");
    localStorage.removeItem("bizpilot_chat");
    setUser(null);
  };
  const handleUpdateProfile = (profile) => {
    setUser(profile);
    localStorage.setItem("bizpilot_profile", JSON.stringify(profile));
  };
  const handleAddProduct = async (prodPayload) => {
    const newProduct = {
      ...prodPayload,
      id: "prod_" + Date.now()
    };
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem("bizpilot_products_fallback", JSON.stringify(updated));
      return updated;
    });
    try {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditProduct = async (id, partial) => {
    setProducts((prev) => {
      const updated = prev.map((p) => p.id === id ? { ...p, ...partial } : p);
      localStorage.setItem("bizpilot_products_fallback", JSON.stringify(updated));
      return updated;
    });
    try {
      await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial)
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteProduct = async (id) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("bizpilot_products_fallback", JSON.stringify(updated));
      return updated;
    });
    try {
      await fetch(`/api/inventory/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddInvoice = async (invPayload) => {
    const newInvoice = {
      ...invPayload,
      id: "inv_" + Date.now()
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    const txPayload = {
      description: `Invoice collection: ${invPayload.clientName} (${invPayload.invoiceNumber})`,
      amount: invPayload.total,
      type: invPayload.status === "paid" ? "revenue" : "revenue",
      // pending accounts receivable are still recorded
      category: "Invoice Collection",
      date: invPayload.issueDate
    };
    await handleAddTransaction(txPayload);
    try {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice)
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditInvoice = async (id, partial) => {
    setInvoices((prev) => prev.map((i) => i.id === id ? { ...i, ...partial } : i));
    try {
      await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial)
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteInvoice = async (id) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/invoices/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddTransaction = async (txPayload) => {
    const newTx = {
      ...txPayload,
      id: "tx_" + Date.now()
    };
    setTransactions((prev) => [newTx, ...prev]);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTx)
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleCompileReport = async () => {
    setCompileLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error("Advisory compiler failed");
      }
      const newReport = await response.json();
      setReports((prev) => [newReport, ...prev]);
    } catch (err) {
      console.error("Report compilation error:", err);
      const mockReport = {
        id: "rep_" + Date.now(),
        title: `Strategic Trade Audit (${(/* @__PURE__ */ new Date()).toLocaleDateString()})`,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
        summary: "Operations are within optimal limits.",
        revenue: 0,
        expense: 0,
        profit: 0,
        lowStockItemsCount: 0,
        topProducts: [],
        recommendations: [],
        content: `### Executive Operations Summary
* **Gross margin levels**: Product profitability averages healthy margin levels.
* **Inventory restock triggers**: Review procurement logs for items that have breached minimal stock limits.`
      };
      setReports((prev) => [mockReport, ...prev]);
    } finally {
      setCompileLoading(false);
    }
  };
  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.quantity <= p.minStock).length;
  }, [products]);
  return <BrowserRouter>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      <Routes>
        {
    /* Landing Page Route */
  }
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        
        {
    /* Authentication Mode */
  }
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} user={user} />} />
        <Route path="/signup" element={<SignUp onLoginSuccess={handleLoginSuccess} user={user} />} />

        {
    /* Protected BizPilot Platform Routes */
  }
        <Route
    path="/dashboard"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <Dashboard
       user={user}
       products={products}
       invoices={invoices}
       transactions={transactions}
       theme={theme}
       crtEnabled={crtEnabled}
       onAddProduct={handleAddProduct}
       onEditProduct={handleEditProduct}
       onRefreshData={refreshData}
     />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/copilot"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <Copilot
       user={user}
       products={products}
       invoices={invoices}
       transactions={transactions}
       theme={theme}
       crtEnabled={crtEnabled}
       onRefreshData={refreshData}
      />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/inventory"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <Inventory
                  products={products}
                  user={user}
                  onAddProduct={handleAddProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onRefreshData={refreshData}
                />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/invoices"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <Invoices
                  user={user}
                  invoices={invoices}
                  products={products}
                  onAddInvoice={handleAddInvoice}
                  onEditInvoice={handleEditInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/workforce"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <OperationsDashboard view="staff" user={user} crtEnabled={crtEnabled} />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/reports"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <OperationsDashboard view="reports" user={user} crtEnabled={crtEnabled} />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/logistics"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <Logistics crtEnabled={crtEnabled} />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/customers"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <Customers user={user} crtEnabled={crtEnabled} />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/backups"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <Backups crtEnabled={crtEnabled} />
              </Layout> : <Navigate to="/login" replace />}
  />

        <Route
    path="/settings"
    element={user ? <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
                <SettingsPage
      user={user}
      onUpdateProfile={handleUpdateProfile}
      theme={theme}
      onChangeTheme={handleUpdateTheme}
      crtEnabled={crtEnabled}
    />
              </Layout> : <Navigate to="/login" replace />}
  />

        {
    /* Fallbacks */
  }
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>;
}
