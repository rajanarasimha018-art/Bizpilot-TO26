import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Logistics from "./pages/Logistics";
import Customers from "./pages/Customers";
import Backups from "./pages/Backups";
import Copilot from "./pages/Copilot";
import OperationsDashboard from "./pages/OperationsDashboard";
import SplashScreen from "./components/SplashScreen";

const DEFAULT_USER = {
  email: "gamigrrider18@gmail.com",
  name: "Siddu",
  businessName: "BizPilot",
  businessType: "Clean Energy Systems & Green Technology",
  currency: "INR"
};

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("bizpilot_splash_shown");
  });
  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("bizpilot_splash_shown", "true");
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bizpilot_profile");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
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
        console.warn("Backend profile sync error on load, using default/cached profile", err);
      });
  }, []);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        const [pRes, iRes, tRes, rRes] = await Promise.all([
          fetch("/api/inventory"),
          fetch("/api/invoices"),
          fetch("/api/transactions"),
          fetch("/api/reports")
        ]);
        if (pRes.ok) setProducts(await pRes.json());
        if (iRes.ok) setInvoices(await iRes.json());
        if (tRes.ok) setTransactions(await tRes.json());
        if (rRes.ok) setReports(await rRes.json());
      } catch (err) {
        console.warn("Express backend connection not active yet. Fallback to client state memory.");
      }
    };
    if (user) {
      loadEntities();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout sync failed:", err);
    }
    localStorage.removeItem("bizpilot_profile");
    localStorage.removeItem("bizpilot_chat");
    setUser(DEFAULT_USER);
    window.location.reload();
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
    setProducts((prev) => [newProduct, ...prev]);
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

  const handleEditProduct = async (prodPayload) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodPayload.id ? prodPayload : p))
    );
    try {
      await fetch(`/api/inventory/${prodPayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodPayload)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    try {
      await fetch(`/api/inventory/${prodId}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddInvoice = async (invoicePayload) => {
    const newInvoice = {
      ...invoicePayload,
      id: "inv_" + Date.now()
    };
    setInvoices((prev) => [newInvoice, ...prev]);
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

  const handleEditInvoice = async (invoicePayload) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoicePayload.id ? invoicePayload : i))
    );
    try {
      await fetch(`/api/invoices/${invoicePayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
    try {
      await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompileDailyReport = async (date) => {
    setCompileLoading(true);
    try {
      const res = await fetch(`/api/reports/daily?date=${date}`);
      if (!res.ok) throw new Error("Failed to compile operations data");
      const reportData = await res.json();
      const newReport = {
        id: "rep_" + date.replace(/-/g, ""),
        title: `Strategic Report (${date})`,
        date,
        summary: `Daily business overview for ${date}.`,
        revenue: reportData.revenue,
        expense: 0,
        profit: reportData.revenue,
        lowStockItemsCount: reportData.stock_sold_breakdown ? reportData.stock_sold_breakdown.length : 0,
        topProducts: reportData.top_products || [],
        recommendations: reportData.recommendations || [],
        content: `### Executive Operations Summary for ${date}\n* **Revenue**: INR ${reportData.revenue.toLocaleString()}\n* **Units Sold**: ${reportData.units_sold}\n* **Stock Added**: ${reportData.stock_added}`
      };
      setReports((prev) => [newReport, ...prev]);
      try {
        await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReport)
        });
      } catch (postErr) {
        console.warn("Failed to persist report to DB: " + postErr.message);
      }
    } catch (err) {
      console.warn("Express backend unavailable. Creating locally simulated mock report.", err);
      const mockReport = {
        id: "rep_" + Date.now(),
        title: `Simulated Report (${date})`,
        date,
        summary: `Locally simulated operations summary for ${date}.`,
        revenue: 45000,
        expense: 12000,
        profit: 33000,
        lowStockItemsCount: 0,
        topProducts: [],
        recommendations: [],
        content: `### Executive Operations Summary\n* **Gross margin levels**: Product profitability averages healthy margin levels.\n* **Inventory restock triggers**: Review procurement logs for items that have breached minimal stock limits.`
      };
      setReports((prev) => [mockReport, ...prev]);
    } finally {
      setCompileLoading(false);
    }
  };

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.quantity <= p.minStock).length;
  }, [products]);

  return (
    <BrowserRouter>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route
          path="/dashboard"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <Dashboard
                user={user}
                products={products}
                invoices={invoices}
                transactions={transactions}
                theme={theme}
                crtEnabled={crtEnabled}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
              />
            </Layout>
          }
        />

        <Route
          path="/copilot"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <Copilot
                user={user}
                products={products}
                invoices={invoices}
                transactions={transactions}
                theme={theme}
                crtEnabled={crtEnabled}
              />
            </Layout>
          }
        />

        <Route
          path="/inventory"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <Inventory
                products={products}
                user={user}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </Layout>
          }
        />

        <Route
          path="/invoices"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <Invoices
                user={user}
                invoices={invoices}
                products={products}
                onAddInvoice={handleAddInvoice}
                onEditInvoice={handleEditInvoice}
                onDeleteInvoice={handleDeleteInvoice}
              />
            </Layout>
          }
        />

        <Route
          path="/workforce"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <OperationsDashboard view="staff" user={user} crtEnabled={crtEnabled} />
            </Layout>
          }
        />

        <Route
          path="/reports"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <OperationsDashboard view="reports" user={user} crtEnabled={crtEnabled} />
            </Layout>
          }
        />

        <Route
          path="/logistics"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <Logistics crtEnabled={crtEnabled} />
            </Layout>
          }
        />

        <Route
          path="/customers"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <Customers user={user} crtEnabled={crtEnabled} />
            </Layout>
          }
        />

        <Route
          path="/backups"
          element={
            <Layout user={user} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <Backups crtEnabled={crtEnabled} />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout user={user} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} lowStockCount={lowStockCount} theme={theme} crtEnabled={crtEnabled} onToggleCrt={handleToggleCrt}>
              <SettingsPage
                user={user}
                onUpdateProfile={handleUpdateProfile}
                theme={theme}
                onChangeTheme={handleUpdateTheme}
                crtEnabled={crtEnabled}
              />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
