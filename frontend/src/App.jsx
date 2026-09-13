import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import api from "./api";

function AuthPage({ register = false }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post(
        `/auth/${register ? "register" : "login"}`,
        form
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>🧠 Knowledge Vault</h1>

        <p>
          {register
            ? "Create your account"
            : "Welcome back"}
        </p>

        <form onSubmit={submit}>
          {register && (
            <input
              placeholder="Name"
              value={form.name}
              onChange={e =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button type="submit">
            {register
              ? "Create account"
              : "Login"}
          </button>
        </form>

        <Link
          to={
            register
              ? "/login"
              : "/register"
          }
        >
          {register
            ? "Already have an account? Login"
            : "Create an account"}
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  async function load() {
    try {
      setError("");

      const { data } = await api.get("/items");

      /*
        allItems ALWAYS contains every item.
        Therefore statistics are never affected
        by search/category/type filters.
      */
      setAllItems(data);

      const searchText =
        search.trim().toLowerCase();

      const filtered = data.filter(item => {
        const matchesType =
          !type || item.type === type;

        const matchesCategory =
          !category ||
          (item.category || "")
            .toLowerCase()
            .includes(category.toLowerCase());

        const matchesSearch =
          !searchText ||
          (item.title || "")
            .toLowerCase()
            .includes(searchText) ||
          (item.content || "")
            .toLowerCase()
            .includes(searchText) ||
          (item.tags || []).some(tag =>
            tag.toLowerCase().includes(searchText)
          );

        return (
          matchesType &&
          matchesCategory &&
          matchesSearch
        );
      });

      setItems(filtered);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load items"
      );
    }
  }

  useEffect(() => {
    api.get("/auth/me").then(({ data }) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [type, category]);

  const total = allItems.length;

  const notes = allItems.filter(
    item => item.type === "note"
  ).length;

  const links = allItems.filter(
    item => item.type === "link"
  ).length;

  const documents = allItems.filter(
    item => item.type === "document"
  ).length;

  function openDeleteModal(id) {
    setDeleteId(id);
  }

  function closeDeleteModal() {
    setDeleteId(null);
  }

  async function confirmDelete() {
    try {
      await api.delete(
        `/items/${deleteId}`
      );

      setDeleteId(null);

      await load();
    } catch (err) {
      setDeleteId(null);

      setError(
        err.response?.data?.message ||
        "Failed to delete item"
      );
    }
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  const itemToDelete = allItems.find(
    item =>
      String(item._id) ===
      String(deleteId)
  );

  return (
    <div className="app">

      {/* HEADER */}

      <header className="main-header">
        <div className="brand">

          <div className="brand-icon">
            🧠
          </div>

          <div>
            <h1>
              Knowledge Vault
            </h1>

            <span>
              Your personal knowledge space
            </span>
          </div>

        </div>

        <button
          className="secondary"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main>

        {/* HERO */}

        <section className="hero">

          <div>

            <div className="hero-label">
              YOUR KNOWLEDGE HUB
            </div>

            <h2>
              Your knowledge,
              <br />
              <span>organized.</span>
            </h2>

            <p>
              Capture ideas, save useful resources,
              and keep everything you learn in one place.
            </p>

          </div>

          <div className="hero-decoration">
            🧠
          </div>

        </section>

        {/* STATS */}

        <section className="stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              ✦
            </div>

            <div>
              <span>
                Total knowledge
              </span>

              <strong>
                {total}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              📝
            </div>

            <div>
              <span>
                Notes
              </span>

              <strong>
                {notes}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              🔗
            </div>

            <div>
              <span>
                Links
              </span>

              <strong>
                {links}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon pink">
              📄
            </div>

            <div>
              <span>
                Documents
              </span>

              <strong>
                {documents}
              </strong>
            </div>

          </div>

        </section>

        {/* KNOWLEDGE SECTION */}

        <section className="knowledge-section">

          <div className="section-heading">

            <div>
              <h2>
                Your knowledge
              </h2>

              <p>
                Everything you've saved in your vault
              </p>
            </div>

            <button
              className="add-knowledge"
              onClick={() =>
                navigate("/new")
              }
            >
              <span>+</span>
              Add knowledge
            </button>

          </div>

          {/* FILTERS */}

          <div className="toolbar">

            <input
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
              onKeyDown={e =>
                e.key === "Enter" && load()
              }
              placeholder="🔍  Search your knowledge..."
            />

            <select
              value={type}
              onChange={e =>
                setType(e.target.value)
              }
            >
              <option value="">
                All types
              </option>

              <option value="note">
                Notes
              </option>

              <option value="link">
                Links
              </option>

              <option value="document">
                Documents
              </option>
            </select>

            <input
              value={category}
              onChange={e =>
                setCategory(e.target.value)
              }
              placeholder="Category"
            />

          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* CARDS */}

          <div className="grid">

            {items.map(item => (

              <article
                className="card"
                key={item._id}
              >

                <div className="card-top">

                  <div
                    className={`type ${item.type}`}
                  >
                    {item.type === "document" &&
                      "📄 "}

                    {item.type === "note" &&
                      "📝 "}

                    {item.type === "link" &&
                      "🔗 "}

                    {item.type}
                  </div>

                  <button
                    className="card-menu"
                    onClick={() =>
                      navigate(
                        `/edit/${item._id}`
                      )
                    }
                  >
                    ⋯
                  </button>

                </div>

                <h3>
                  {item.title}
                </h3>

                {item.content && (
                  <p className="card-content">
                    {item.content.slice(
                      0,
                      150
                    )}

                    {item.content.length > 150
                      ? "..."
                      : ""}
                  </p>
                )}

                {item.url && (
                  <a
                    className="resource-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open resource ↗
                  </a>
                )}

                {item.filePath && (
                  <a
                    className="resource-link"
                    href={`http://localhost:5000${item.filePath}${localStorage.getItem("token") ? `?token=${encodeURIComponent(localStorage.getItem("token"))}` : ""}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open document ↗
                  </a>
                )}

                <div className="card-bottom">

                  <div className="card-tags">

                    {(item.tags || []).map(
                      tag => (
                        <span key={tag}>
                          #{tag}
                        </span>
                      )
                    )}

                  </div>

                  <div className="category-badge">
                    {item.category ||
                      "General"}
                  </div>

                </div>

                <div className="actions">

                  <button
                    className="edit-action"
                    onClick={() =>
                      navigate(
                        `/edit/${item._id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-action"
                    onClick={() =>
                      openDeleteModal(
                        item._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

          {/* EMPTY STATE */}

          {!items.length && !error && (
            <div className="empty">

              <div className="empty-icon">
                🧠
              </div>

              <h3>
                No knowledge found
              </h3>

              <p>
                Try changing your filters
                or add something new.
              </p>

              <button
                className="add-knowledge"
                onClick={() =>
                  navigate("/new")
                }
              >
                + Add your first item
              </button>

            </div>
          )}

        </section>

      </main>

      {/* DELETE MODAL */}

      {deleteId && (

        <div className="modal-overlay">

          <div className="delete-modal">

            <div className="delete-icon">
              🗑️
            </div>

            <h2>
              Delete item?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {itemToDelete?.title ||
                  "this item"}
              </strong>
              ?
            </p>

            <p className="warning">
              This action cannot be undone.
            </p>

            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={
                  closeDeleteModal
                }
              >
                Cancel
              </button>

              <button
                className="delete-button"
                onClick={
                  confirmDelete
                }
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function ItemForm({ edit = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const id =
    location.pathname
      .split("/")
      .pop();

  const [form, setForm] = useState({
    title: "",
    type: "note",
    content: "",
    url: "",
    category: "General",
    tags: ""
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!edit) {
      return;
    }

    api
      .get(`/items/${id}`)
      .then(({ data: item }) => {
        if (item) {
          setForm({
            title: item.title || "",
            type: item.type || "note",
            content: item.content || "",
            url: item.url || "",
            category:
              item.category ||
              "General",
            tags:
              (item.tags || []).join(
                ", "
              )
          });
        }
      })
      .catch(err => {
        setError(
          err.response?.data?.message ||
          "Failed to load item"
        );
      });
  }, [edit, id]);

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const body = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          body.append(
            key,
            key === "tags"
              ? JSON.stringify(
                  value
                    .split(",")
                    .map(x =>
                      x.trim()
                    )
                    .filter(Boolean)
                )
              : value
          );
        }
      );

      if (file) {
        body.append(
          "file",
          file
        );
      }

      if (edit) {
        await api.put(
          `/items/${id}`,
          body
        );
      } else {
        await api.post(
          "/items",
          body
        );
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save item"
      );
    }
  }

  return (
    <div className="form-page">

      <Link to="/">
        ← Back
      </Link>

      <div className="form-card">

        <h1>
          {edit
            ? "Edit item"
            : "Add knowledge"}
        </h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>

          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={e =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
          />

          <select
            value={form.type}
            onChange={e =>
              setForm({
                ...form,
                type: e.target.value
              })
            }
          >
            <option value="note">
              Note
            </option>

            <option value="link">
              Link
            </option>

            <option value="document">
              Document
            </option>
          </select>

          <input
            placeholder="Category"
            value={form.category}
            onChange={e =>
              setForm({
                ...form,
                category: e.target.value
              })
            }
          />

          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={e =>
              setForm({
                ...form,
                tags: e.target.value
              })
            }
          />

          {form.type === "link" && (
            <input
              placeholder="https://example.com"
              value={form.url}
              onChange={e =>
                setForm({
                  ...form,
                  url: e.target.value
                })
              }
            />
          )}

          {form.type !== "link" && (
            <textarea
              placeholder="Content / description"
              value={form.content}
              onChange={e =>
                setForm({
                  ...form,
                  content: e.target.value
                })
              }
            />
          )}

          {form.type === "document" && (
            <div>
              <input
                type="file"
                onChange={e =>
                  setFile(
                    e.target.files[0]
                  )
                }
              />
              {edit && (
                <small style={{ display: "block", marginTop: "4px", color: "#8993a7" }}>
                  {file ? `Replacement selected: ${file.name}` : "Leave empty to keep existing document"}
                </small>
              )}
            </div>
          )}

          <button type="submit">
            {edit
              ? "Save changes"
              : "Add to vault"}
          </button>

        </form>

      </div>

    </div>
  );
}

function Protected({ children }) {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<AuthPage />}
      />

      <Route
        path="/register"
        element={
          <AuthPage register />
        }
      />

      <Route
        path="/"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />

      <Route
        path="/new"
        element={
          <Protected>
            <ItemForm />
          </Protected>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <Protected>
            <ItemForm edit />
          </Protected>
        }
      />

    </Routes>
  );
}