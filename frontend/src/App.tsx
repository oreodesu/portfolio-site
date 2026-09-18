import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TodoPage from "./pages/TodoApp/TodoPage";
import ExpensePage from "./pages/ExpenseApp/ExpensePage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works/todo" element={<TodoPage />} />
          <Route path="/works/expense" element={<ExpensePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
