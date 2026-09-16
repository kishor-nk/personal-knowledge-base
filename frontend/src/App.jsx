import { useEffect, useMemo, useRef, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import api from "./api";
import { useAuth } from "./context/AuthContext";

function AuthPage({ register = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post(
        `/auth/${register ? "register" : "login"}`,
        form
      );

      login(data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
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
              required
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
            required
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
            required
            minLength={6}
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

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : register
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

function Toast({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`toast ${toast.type || "success"}`}>
      <span>
        {toast.type === "error" ? "⚠️" : "✓"}
      </span>
      {toast.message}
    </div>
  );
}

function LoadingSkeletons() {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="card skeleton-card" key={index}>
          <div className="skeleton skeleton-type" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton-bottom">
            <div className="skeleton skeleton-tag" />
            <div className="skeleton skeleton-tag small" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemDetailModal({ item, onClose }) {
  if (!item) {
    return null;
  }

  const fileUrl = item.filePath
    ? `http://localhost:5000${item.filePath}${localStorage.getItem("token")
      ? `?token=${encodeURIComponent(
        localStorage.getItem("token")
      )}`
      : ""
    }`
    : null;

  return (
    <div
      className="modal-overlay detail-overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="detail-modal">
        <button
          className="detail-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div
          className={`type ${item.type}`}
          style={{
            width: "fit-content",
            marginBottom: "15px"
          }}
        >
          {item.type === "document" && "📄 "}
          {item.type === "note" && "📝 "}
          {item.type === "link" && "🔗 "}
          {item.type}
        </div>

        <h2>{item.title}</h2>

        <div className="detail-meta">
          <span>
            Category: <strong>{item.category || "General"}</strong>
          </span>

          {item.created_at && (
            <span className="card-created">
              📅 Created:{" "}
              <strong>
                {formatCreatedDate(item.created_at)}
              </strong>
            </span>
          )}

          {item.updated_at &&
            item.updated_at !== item.created_at && (
              <span>
                Updated:{" "}
                <strong>
                  {new Date(
                    item.updated_at
                  ).toLocaleDateString()}
                </strong>
              </span>
            )}
        </div>

        {item.content && (
          <div className="detail-content">
            <h3>Content</h3>
            <p>{item.content}</p>
          </div>
        )}

        {item.url && (
          <div className="detail-resource">
            <h3>Resource</h3>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              {item.url}
              <span>↗</span>
            </a>
          </div>
        )}

        {item.filePath && (
          <div className="detail-resource">
            <h3>Document</h3>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open document ↗
            </a>
          </div>
        )}

        {item.tags?.length > 0 && (
          <div className="detail-tags">
            <h3>Tags</h3>

            <div className="card-tags">
              {item.tags.map(tag => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteModal({
  item,
  onCancel,
  onConfirm,
  loading
}) {
  if (!item) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <div className="delete-icon">
          🗑️
        </div>

        <h2>Delete item?</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>
            {item.title || "this item"}
          </strong>
          ?
        </p>

        <p className="warning">
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="delete-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState(
    () => searchParams.get("category") || ""
  );
  const [tag, setTag] = useState(
    () => searchParams.get("tag") || ""
  );

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const searchTimer = useRef(null);
  const requestIdRef = useRef(0);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  async function loadItems({
    searchValue = search,
    typeValue = type,
    categoryValue = category,
    tagValue = tag,
    initial = false
  } = {}) {
    const requestId = ++requestIdRef.current;

    try {
      if (initial) {
        setLoading(true);
      }

      setError("");

      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.set(
          "search",
          searchValue.trim()
        );
      }

      if (typeValue) {
        params.set("type", typeValue);
      }

      if (categoryValue) {
        params.set(
          "category",
          categoryValue
        );
      }

      if (tagValue) {
        params.set("tag", tagValue);
      }

      const query = params.toString();

      const { data } = await api.get(
        query ? `/items?${query}` : "/items"
      );

      // Ignore an older request if the user has already changed
      // the search or filters and a newer request is in progress.
      if (requestId !== requestIdRef.current) {
        return;
      }

      setItems(sortItems(data, sortBy));

      if (
        !searchValue.trim() &&
        !typeValue &&
        !categoryValue &&
        !tagValue
      ) {
        setAllItems(data);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(
        err.response?.data?.message ||
        "Failed to load items"
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadItems({ initial: true });

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      loadItems({
        searchValue: search,
        typeValue: type,
        categoryValue: category,
        tagValue: tag
      });
    }, 300);

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [search]);

  useEffect(() => {
    if (!loading) {
      loadItems({
        searchValue: search,
        typeValue: type,
        categoryValue: category,
        tagValue: tag
      });
    }
  }, [type, category, tag]);

  const categories = useMemo(() => {
    const values = allItems
      .map(item =>
        (item.category || "General").trim()
      )
      .filter(Boolean);

    return [...new Set(values)].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [allItems]);

  const tags = useMemo(() => {
    const values = allItems.flatMap(
      item => item.tags || []
    );

    return [...new Set(values)]
      .filter(Boolean)
      .sort((a, b) =>
        a.localeCompare(b)
      );
  }, [allItems]);

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

  const hasFilters =
    search.trim() ||
    type ||
    category ||
    tag;

  const activeFilterCount = [
    search.trim(),
    type,
    category,
    tag
  ].filter(Boolean).length;

  useEffect(() => {
    function handleSearchShortcut(e) {
      if (e.key === "Escape" && search) {
        setSearch("");
      }
    }

    window.addEventListener("keydown", handleSearchShortcut);

    return () => {
      window.removeEventListener("keydown", handleSearchShortcut);
    };
  }, [search]);

  function clearFilters() {
    setSearch("");
    setType("");
    setCategory("");
    setTag("");
  }

  function openDeleteModal(id) {
    setDeleteId(id);
  }

  function closeDeleteModal() {
    if (!deleteLoading) {
      setDeleteId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteId) {
      return;
    }

    try {
      setDeleteLoading(true);

      await api.delete(
        `/items/${deleteId}`
      );

      setDeleteId(null);

      const deletedItem = allItems.find(
        item =>
          String(item._id) ===
          String(deleteId)
      );

      setAllItems(prev =>
        prev.filter(
          item =>
            String(item._id) !==
            String(deleteId)
        )
      );

      setItems(prev =>
        prev.filter(
          item =>
            String(item._id) !==
            String(deleteId)
        )
      );

      if (
        detailItem &&
        String(detailItem._id) ===
        String(deleteId)
      ) {
        setDetailItem(null);
      }

      showToast(
        `"${deletedItem?.title || "Item"}" deleted successfully`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete item"
      );

      showToast(
        err.response?.data?.message ||
        "Failed to delete item",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const itemToDelete = allItems.find(
    item =>
      String(item._id) ===
      String(deleteId)
  );

  function getCreatedTime(item) {
    const value = item?.created_at ?? item?.createdAt;

    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      const time = value.getTime();
      return Number.isNaN(time) ? null : time;
    }

    const text = String(value).trim();

    if (!text) {
      return null;
    }

    // MySQL/MariaDB DATETIME values such as
    // "2026-09-14 10:30:00" are sortable by their components.
    const match = text.match(
      /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?/
    );

    if (match) {
      const [, year, month, day, hour, minute, second = "0", fraction = ""] = match;
      const milliseconds = Number((fraction + "000").slice(0, 3));
      return Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
        milliseconds
      );
    }

    const timestamp = Date.parse(text);
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  function formatCreatedDate(item) {
    const value = item?.created_at ?? item?.createdAt;

    if (!value) {
      return null;
    }

    const formatIST = date =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).format(date) + " IST";

    // MySQL/MariaDB DATETIME has no timezone information.
    // The app treats stored DATETIME values as Indian Standard Time.
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : formatIST(value);
    }

    const text = String(value).trim();

    const match = text.match(
      /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/
    );

    if (match) {
      const [, year, month, day, hour, minute, second = "0"] = match;

      // Construct as UTC so the database's IST clock values are preserved,
      // then explicitly format those same values in Asia/Kolkata.
      const istDate = new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(minute),
          Number(second)
        )
      );

      if (!Number.isNaN(istDate.getTime())) {
        return formatIST(istDate);
      }
    }

    const timestamp = Date.parse(text);

    if (Number.isNaN(timestamp)) {
      return null;
    }

    return formatIST(new Date(timestamp));
  }

  function getItemId(item) {
    const id = item?._id ?? item?.id;
    const numericId = Number(id);
    return Number.isFinite(numericId) ? numericId : 0;
  }

  function sortItems(list, order = sortBy) {
    return [...list].sort((a, b) => {
      const titleA = String(a?.title || "").trim();
      const titleB = String(b?.title || "").trim();

      if (order === "title-asc") {
        return titleA.localeCompare(titleB, undefined, {
          sensitivity: "base",
          numeric: true
        });
      }

      if (order === "title-desc") {
        return titleB.localeCompare(titleA, undefined, {
          sensitivity: "base",
          numeric: true
        });
      }

      const timeA = getCreatedTime(a);
      const timeB = getCreatedTime(b);

      // If timestamps are missing, invalid, or identical, use the
      // auto-increment database id. Higher id = created later.
      if (timeA === null && timeB === null) {
        return order === "oldest"
          ? getItemId(a) - getItemId(b)
          : getItemId(b) - getItemId(a);
      }

      if (timeA === null) {
        return 1;
      }

      if (timeB === null) {
        return -1;
      }

      if (timeA !== timeB) {
        return order === "oldest"
          ? timeA - timeB
          : timeB - timeA;
      }

      return order === "oldest"
        ? getItemId(a) - getItemId(b)
        : getItemId(b) - getItemId(a);
    });
  }

  const displayItems = items;

  return (
    <div className="app">
      <Toast toast={toast} />

      <header className="main-header">
        <div className="brand">
          <div className="brand-icon">
            🧠
          </div>

          <div>
            <h1>Knowledge Vault</h1>
            <span>
              Your personal knowledge space
            </span>
          </div>
        </div>

        <div className="header-actions">
          <Link className="secondary" to="/manage">
            🏷️ Organize
          </Link>

          <button
            className="secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main>
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
              Capture ideas, save useful
              resources, and keep everything
              you learn in one place.
            </p>
          </div>

          <div className="hero-decoration">
            🧠
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple">
              ✦
            </div>

            <div>
              <span>Total knowledge</span>
              <strong>{total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              📝
            </div>

            <div>
              <span>Notes</span>
              <strong>{notes}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              🔗
            </div>

            <div>
              <span>Links</span>
              <strong>{links}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pink">
              📄
            </div>

            <div>
              <span>Documents</span>
              <strong>{documents}</strong>
            </div>
          </div>
        </section>

        <section className="knowledge-section">
          <div className="section-heading">
            <div>
              <h2>Your knowledge</h2>

              <p>
                Everything you've saved in
                your vault
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

          <div className="toolbar">
            <div className="search-wrapper">
              <input
                value={search}
                onChange={e =>
                  setSearch(e.target.value)
                }
                placeholder="🔍  Search title, content, tags, or category..."
                aria-label="Search title, content, tags, or category"
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  title="Clear search (Esc)"
                >
                  ×
                </button>
              )}
            </div>

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

            <select
              value={category}
              onChange={e =>
                setCategory(e.target.value)
              }
            >
              <option value="">
                All categories
              </option>

              {categories.map(value => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              ))}
            </select>

            <select
              value={tag}
              onChange={e =>
                setTag(e.target.value)
              }
            >
              <option value="">
                All tags
              </option>

              {tags.map(value => (
                <option
                  key={value}
                  value={value}
                >
                  #{value}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e => {
                const nextSort = e.target.value;
                setSortBy(nextSort);
                setItems(prevItems =>
                  sortItems(prevItems, nextSort)
                );
              }}
              aria-label="Sort knowledge"
            >
              <option value="newest">
                Newest first
              </option>
              <option value="oldest">
                Oldest first
              </option>
              <option value="title-asc">
                A–Z
              </option>
              <option value="title-desc">
                Z–A
              </option>
            </select>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                height: "52px",
                padding: "4px",
                border: "1px solid #2a3449",
                borderRadius: "11px",
                background: "#0c121e"
              }}
              aria-label="View mode"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                style={{
                  width: "42px",
                  height: "42px",
                  border: "none",
                  borderRadius: "8px",
                  background: viewMode === "grid"
                    ? "rgba(117, 108, 255, 0.18)"
                    : "transparent",
                  color: viewMode === "grid"
                    ? "#aaa5ff"
                    : "#737e92",
                  fontSize: "18px"
                }}
              >
                ▦
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                style={{
                  width: "42px",
                  height: "42px",
                  border: "none",
                  borderRadius: "8px",
                  background: viewMode === "list"
                    ? "rgba(117, 108, 255, 0.18)"
                    : "transparent",
                  color: viewMode === "list"
                    ? "#aaa5ff"
                    : "#737e92",
                  fontSize: "18px"
                }}
              >
                ☰
              </button>
            </div>

            {hasFilters && (
              <button
                className="clear-filters"
                onClick={clearFilters}
                title="Clear search and all filters"
              >
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSkeletons />
          ) : (
            <>
              <div className="results-info">
                <span>
                  {displayItems.length}{" "}
                  {displayItems.length === 1
                    ? "item"
                    : "items"}
                </span>

                {hasFilters ? (
                  <span>
                    {displayItems.length === 1
                      ? "matching result"
                      : "matching results"}
                    {" "}• {activeFilterCount}{" "}
                    {activeFilterCount === 1
                      ? "filter"
                      : "filters"}{" "}
                    active
                  </span>
                ) : (
                  <span>
                    Showing all {allItems.length}{" "}
                    {allItems.length === 1
                      ? "item"
                      : "items"}
                  </span>
                )}
              </div>

              <div
                className="grid"
                style={
                  viewMode === "list"
                    ? {
                      gridTemplateColumns: "1fr",
                      gap: "14px"
                    }
                    : undefined
                }
              >
                {displayItems.map(item => {
                  const fileUrl =
                    item.filePath
                      ? `http://localhost:5000${item.filePath}${localStorage.getItem(
                        "token"
                      )
                        ? `?token=${encodeURIComponent(
                          localStorage.getItem(
                            "token"
                          )
                        )}`
                        : ""
                      }`
                      : null;

                  return (
                    <article
                      className="card"
                      key={item._id}
                      onDoubleClick={() =>
                        setDetailItem(item)
                      }
                      style={
                        viewMode === "list"
                          ? {
                            minHeight: "auto",
                            display: "grid",
                            gridTemplateColumns: "minmax(180px, 0.35fr) minmax(280px, 1fr) auto",
                            columnGap: "24px",
                            alignItems: "center"
                          }
                          : undefined
                      }
                    >
                      <div
                        className="card-top"
                        style={
                          viewMode === "list"
                            ? {
                              marginBottom: 0,
                              alignSelf: "start"
                            }
                            : undefined
                        }
                      >
                        <div
                          className={`type ${item.type}`}
                        >
                          {item.type ===
                            "document" &&
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

                      <h3>{item.title}</h3>

                      {formatCreatedDate(item) && (
                        <div
                          className="created-date"
                          style={{
                            marginTop: "6px",
                            marginBottom: "10px",
                            color: "#737e92",
                            fontSize: "12px"
                          }}
                        >
                          📅 Created {formatCreatedDate(item)}
                        </div>
                      )}

                      {item.content && (
                        <p className="card-content">
                          {item.content.slice(
                            0,
                            150
                          )}

                          {item.content.length >
                            150
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
                          onClick={e =>
                            e.stopPropagation()
                          }
                        >
                          Open resource ↗
                        </a>
                      )}

                      {item.filePath && (
                        <a
                          className="resource-link"
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e =>
                            e.stopPropagation()
                          }
                        >
                          Open document ↗
                        </a>
                      )}

                      <div className="card-bottom">
                        <div className="card-tags">
                          {(item.tags || []).map(
                            itemTag => (
                              <button
                                key={itemTag}
                                className="tag-button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setTag(itemTag);
                                }}
                              >
                                #{itemTag}
                              </button>
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
                          className="view-action"
                          onClick={() =>
                            setDetailItem(item)
                          }
                        >
                          View
                        </button>

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
                  );
                })}
              </div>

              {!items.length && (
                <div className="empty">
                  <div className="empty-icon">
                    {hasFilters ? "🔎" : "🧠"}
                  </div>

                  <h3>
                    {hasFilters
                      ? "No matching knowledge"
                      : "No knowledge found"}
                  </h3>

                  <p>
                    {hasFilters
                      ? "Try changing your search or filters."
                      : "Add something to your vault to get started."}
                  </p>

                  {hasFilters ? (
                    <button
                      className="add-knowledge"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  ) : (
                    <button
                      className="add-knowledge"
                      onClick={() =>
                        navigate("/new")
                      }
                    >
                      + Add your first item
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <DeleteModal
        item={itemToDelete}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      <ItemDetailModal
        item={detailItem}
        onClose={() =>
          setDetailItem(null)
        }
      />
    </div>
  );
}


function CategoryManager() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [categoryResponse, itemResponse] = await Promise.all([
        api.get("/categories"),
        api.get("/items")
      ]);

      const categoryData = categoryResponse.data;
      const itemData = itemResponse.data;

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : categoryData.categories || []
      );
      setItems(Array.isArray(itemData) ? itemData : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const itemCountByCategory = useMemo(() => {
    const counts = {};

    items.forEach(item => {
      const value = (item.category || "General").trim();
      if (!value) return;

      const key = value.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }, [items]);

  const normalizedCategories = useMemo(() => {
    return categories
      .map(category => ({
        ...category,
        id: category.id ?? category._id,
        name: (category.name || category.title || "").trim()
      }))
      .filter(category => category.name)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base"
        })
      );
  }, [categories]);

  async function createCategory(e) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Category name must be 100 characters or less.");
      return;
    }

    const exists = normalizedCategories.some(
      category =>
        category.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setError("That category already exists.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.post("/categories", {
        name: trimmedName
      });

      setName("");
      setMessage(`"${trimmedName}" added to your categories.`);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create category"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category) {
    if (!category.id) {
      setError("This category cannot be deleted because its ID is missing.");
      return;
    }

    if (confirmDeleteId !== category.id) {
      setConfirmDeleteId(category.id);
      setError("");
      return;
    }

    try {
      setDeletingId(category.id);
      setError("");
      setMessage("");

      await api.delete(`/categories/${category.id}`);

      setMessage(`"${category.name}" deleted.`);
      setConfirmDeleteId(null);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="form-page">
      <div className="form-card manage-card">
        <Link className="back-link" to="/">
          ← Back to vault
        </Link>

        <div className="form-header">
          <div className="form-header-icon">🏷️</div>
          <div>
            <div className="form-eyebrow">ORGANIZE</div>
            <h1>Categories & tags</h1>
            <p>
              Keep your knowledge easy to browse with reusable categories
              and quick tag filters.
            </p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <section className="manage-section">
          <div className="manage-section-heading">
            <div>
              <h2>Categories</h2>
              <p>
                {normalizedCategories.length} categor{normalizedCategories.length === 1 ? "y" : "ies"}
              </p>
            </div>
          </div>

          <form className="category-create-form" onSubmit={createCategory}>
            <label htmlFor="new-category">Create a category</label>
            <div className="category-create-row">
              <input
                id="new-category"
                value={name}
                maxLength={100}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Web Development"
              />
              <button type="submit" disabled={saving}>
                {saving ? "Adding..." : "+ Add category"}
              </button>
            </div>
            <small>Categories you create here will be available for your knowledge items.</small>
          </form>

          {loading ? (
            <div className="manage-loading">
              <div className="loading-spinner" />
              <span>Loading categories...</span>
            </div>
          ) : normalizedCategories.length === 0 ? (
            <div className="manage-empty">
              <span>🏷️</span>
              <strong>No categories yet</strong>
              <p>Create your first category above.</p>
            </div>
          ) : (
            <>
              <p className="manage-hint">Click a category name to filter your vault. Click Delete twice to confirm.</p>

              <div className="category-list">
              {normalizedCategories.map(category => {
                const count =
                  itemCountByCategory[category.name.toLowerCase()] || 0;

                return (
                  <div className="category-row" key={category.id}>
                    <button
                      className="category-row-main"
                      onClick={() =>
                        navigate(`/?category=${encodeURIComponent(category.name)}`)
                      }
                      type="button"
                    >
                      <span className="category-row-icon">#</span>
                      <span>
                        <strong>{category.name}</strong>
                        <small>
                          {count} item{count === 1 ? "" : "s"}
                        </small>
                      </span>
                    </button>

                    <button
                      className={`category-delete${confirmDeleteId === category.id ? " confirm" : ""}`}
                      type="button"
                      onClick={() => deleteCategory(category)}
                      disabled={deletingId === category.id}
                      aria-label={`${confirmDeleteId === category.id ? "Confirm delete" : "Delete"} ${category.name}`}
                    >
                      {deletingId === category.id
                        ? "..."
                        : confirmDeleteId === category.id
                          ? "Confirm"
                          : "Delete"}
                    </button>
                  </div>
                );
              })}
              </div>
            </>
          )}
        </section>

        <section className="manage-section tags-manager-section">
          <div className="manage-section-heading">
            <div>
              <h2>Tags</h2>
              <p>Click a tag to filter your vault.</p>
            </div>
          </div>

          {(() => {
            const values = [...new Set(
              items.flatMap(item => item.tags || []).filter(Boolean)
            )].sort((a, b) =>
              a.localeCompare(b, undefined, { sensitivity: "base" })
            );

            if (values.length === 0) {
              return (
                <div className="manage-empty compact">
                  <span>🔖</span>
                  <strong>No tags yet</strong>
                  <p>Add comma-separated tags while creating knowledge.</p>
                </div>
              );
            }

            return (
              <div className="managed-tags">
                {values.map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      navigate(`/?tag=${encodeURIComponent(value)}`)
                    }
                    title={`Filter by #${value}`}
                  >
                    #{value}
                  </button>
                ))}
              </div>
            );
          })()}
        </section>

        <div className="form-actions">
          <button
            className="form-cancel"
            type="button"
            onClick={() => navigate("/")}
          >
            Back to vault
          </button>
          <Link className="secondary" to="/new">
            + Add knowledge
          </Link>
        </div>
      </div>
    </div>
  );
}

function ItemForm({ edit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    type: "note",
    content: "",
    url: "",
    category: "General",
    tags: ""
  });

  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(edit);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [categoryResponse, itemResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/items")
        ]);

        const categoryData = categoryResponse.data;
        const itemData = itemResponse.data;

        const categoryList = (
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.categories || []
        )
          .map(category =>
            (category.name || category.title || "").trim()
          )
          .filter(Boolean);

        const categoryMap = new Map();
        ["General", ...categoryList].forEach(value => {
          const key = value.toLowerCase();
          if (!categoryMap.has(key)) {
            categoryMap.set(key, value);
          }
        });

        const tagMap = new Map();
        (Array.isArray(itemData) ? itemData : []).forEach(item => {
          (item.tags || []).forEach(tag => {
            const value = String(tag).trim();
            if (!value) return;

            const key = value.toLowerCase();
            if (!tagMap.has(key)) {
              tagMap.set(key, value);
            }
          });
        });

        setCategories(
          [...categoryMap.values()].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          )
        );
        setExistingTags(
          [...tagMap.values()].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          )
        );
      } catch {
        // The form remains fully usable even if suggestions fail to load.
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  useEffect(() => {
    if (!edit || !id) {
      setLoadingItem(false);
      return;
    }

    api
      .get(`/items/${id}`)
      .then(({ data: item }) => {
        setForm({
          title: item.title || "",
          type: item.type || "note",
          content: item.content || "",
          url: item.url || "",
          category: item.category || "General",
          tags: (item.tags || []).join(", ")
        });
      })
      .catch(err => {
        setError(
          err.response?.data?.message ||
          "Failed to load item"
        );
      })
      .finally(() => {
        setLoadingItem(false);
      });
  }, [edit, id]);

  function updateField(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleTypeChange(e) {
    const nextType = e.target.value;

    setForm(prev => ({
      ...prev,
      type: nextType,
      url: nextType === "link" ? prev.url : ""
    }));

    if (nextType !== "document") {
      setFile(null);
    }
  }

  function addSuggestedTag(tag) {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    const currentTags = form.tags
      .split(",")
      .map(value => value.trim())
      .filter(Boolean);

    const exists = currentTags.some(
      value => value.toLowerCase() === trimmedTag.toLowerCase()
    );

    if (exists) return;

    updateField("tags", [...currentTags, trimmedTag].join(", "));
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10 MB.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (form.type === "link" && !form.url.trim()) {
      setError("Please enter a URL for this link.");
      return;
    }

    try {
      setLoading(true);

      const body = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        body.append(
          key,
          key === "tags"
            ? JSON.stringify(
              value
                .split(",")
                .map(x => x.trim())
                .filter(Boolean)
            )
            : value
        );
      });

      if (file) {
        body.append("file", file);
      }

      if (edit) {
        await api.put(`/items/${id}`, body);
      } else {
        await api.post("/items", body);
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save item"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingItem) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading your knowledge...</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <Link to="/">← Back to vault</Link>

      <div className="form-card">
        <div className="form-header">
          <div className="form-header-icon">
            {edit ? "✏️" : "🧠"}
          </div>
          <div>
            <div className="form-eyebrow">
              {edit ? "UPDATE YOUR VAULT" : "ADD TO YOUR VAULT"}
            </div>
            <h1>
              {edit ? "Edit knowledge" : "Add knowledge"}
            </h1>
            <p>
              {edit
                ? "Update the details and keep your knowledge organized."
                : "Capture an idea, useful link, or important document."}
            </p>
          </div>
        </div>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="item-title">Title</label>
            <input
              id="item-title"
              required
              autoFocus={!edit}
              maxLength={200}
              placeholder="e.g. React performance tips"
              value={form.title}
              onChange={e =>
                updateField("title", e.target.value)
              }
            />
            <small>Give your knowledge a short, descriptive name.</small>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="item-type">Type</label>
              <select
                id="item-type"
                value={form.type}
                onChange={handleTypeChange}
              >
                <option value="note">📝 Note</option>
                <option value="link">🔗 Link</option>
                <option value="document">📄 Document</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="item-category">Category</label>
              <input
                id="item-category"
                list="category-options"
                maxLength={100}
                placeholder={loadingOptions ? "Loading categories..." : "e.g. Development"}
                value={form.category}
                onChange={e =>
                  updateField("category", e.target.value)
                }
              />
              <datalist id="category-options">
                {categories.map(category => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              <small>
                Pick an existing category or type a new one.
              </small>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="item-tags">Tags</label>
            <input
              id="item-tags"
              list="tag-options"
              maxLength={500}
              placeholder="react, frontend, performance"
              value={form.tags}
              onChange={e =>
                updateField("tags", e.target.value)
              }
            />
            <datalist id="tag-options">
              {existingTags.map(tag => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
            <small>
              Separate multiple tags with commas. Existing tags appear below.
            </small>

            {existingTags.length > 0 && (
              <div className="tag-suggestions" aria-label="Existing tags">
                {existingTags.slice(0, 12).map(tag => {
                  const selected = form.tags
                    .split(",")
                    .map(value => value.trim().toLowerCase())
                    .includes(tag.toLowerCase());

                  return (
                    <button
                      key={tag}
                      type="button"
                      className={selected ? "selected" : ""}
                      onClick={() => addSuggestedTag(tag)}
                      title={selected ? `${tag} is already selected` : `Add #${tag}`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {form.type === "link" && (
            <div className="form-field">
              <label htmlFor="item-url">Resource URL</label>
              <input
                id="item-url"
                required
                type="url"
                placeholder="https://example.com"
                value={form.url}
                onChange={e =>
                  updateField("url", e.target.value)
                }
              />
              <small>Paste the full web address you want to save.</small>
            </div>
          )}

          {form.type !== "link" && (
            <div className="form-field">
              <label htmlFor="item-content">
                {form.type === "document" ? "Document description" : "Note content"}
              </label>
              <textarea
                id="item-content"
                placeholder={
                  form.type === "document"
                    ? "Add a short description of what this document contains..."
                    : "Write your idea, explanation, takeaway, or notes..."
                }
                value={form.content}
                onChange={e =>
                  updateField("content", e.target.value)
                }
              />
            </div>
          )}

          {form.type === "document" && (
            <div className="form-field">
              <label htmlFor="item-file">Document</label>

              <div className={`file-drop-zone ${file ? "has-file" : ""}`}>
                <input
                  id="item-file"
                  type="file"
                  onChange={handleFileChange}
                  aria-describedby="file-help"
                />

                <div className="file-drop-content">
                  <span className="file-drop-icon">
                    {file ? "📎" : "📄"}
                  </span>

                  <strong>
                    {file
                      ? file.name
                      : edit
                        ? "Choose a replacement document"
                        : "Choose a document"}
                  </strong>

                  <span id="file-help">
                    {file
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB selected`
                      : "Maximum file size: 10 MB"}
                  </span>
                </div>
              </div>

              {edit && (
                <small>
                  {file
                    ? "This file will replace the existing document when you save."
                    : "Leave empty to keep the existing document."}
                </small>
              )}
            </div>
          )}

          <div className="form-actions">
            <Link className="form-cancel" to="/">
              Cancel
            </Link>

            <button type="submit" disabled={loading}>
              {loading
                ? edit
                  ? "Saving changes..."
                  : "Adding to vault..."
                : edit
                  ? "✓ Save changes"
                  : "+ Add to vault"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Protected({ children }) {
  const { loading, isAuthenticated } =
    useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading your vault...</p>
      </div>
    );
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
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
        path="/manage"
        element={
          <Protected>
            <CategoryManager />
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