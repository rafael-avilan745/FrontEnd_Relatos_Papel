import { Container } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import SearchBar from "../components/search/SearchBar";
import PaginationControl from "../components/common/PaginationControl";
import { CartContext } from "../context/CartContext";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import "./ListaLibros.css";

const API_URL =
  "https://ms-books-catalogue-production-76cc.up.railway.app/api/v1/books";

const ListaLibros = () => {
  const { dispatch } = useContext(CartContext);

  const [books, setBooks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const mappedBooks = data.map((b) => ({
          id: b.id,
          nombre: b.title,
          descripcion: b.description,
          precio: b.price,
          categoria: b.category,
          cantidad: b.stockQuantity,
          fotos: b.coverImageUrl,
          estado: b.status === "AVAILABLE" ? "Disponible" : "Agotado",
        }));

        setBooks(mappedBooks);
      })
      .catch((err) => console.error("Error cargando libros:", err));
  }, []);

  const handleQtyChange = (bookId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [bookId]: Number(value),
    }));
  };

  const handleAddToCart = (book) => {
    const cantidad = quantities[book.id] || 1;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: book.id,
        nombre: book.nombre,
        precio: book.precio,
        fotos: book.fotos,
        cantidad,
      },
    });
  };

  const categorias = [...new Set(books.map((b) => b.categoria))];

  const toggleCategoria = (categoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria],
    );
    setCurrentPage(1);
  };

  const librosFiltrados =
    categoriasSeleccionadas.length === 0
      ? books
      : books.filter((b) => categoriasSeleccionadas.includes(b.categoria));
  dispatch;
  const librosBuscados = librosFiltrados.filter((book) =>
    book.nombre.toLowerCase().includes(searchText.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const librosPaginados = librosBuscados.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <Container fluid>
      <Breadcrumb />
      <SearchBar onSearch={setSearchText} />

      <div className="lista-layout">
        <aside className="lista-filtros">
          <h5>Filtros</h5>
          <strong>Categorías</strong>

          {categorias.map((cat) => (
            <div key={cat}>
              <label>
                <input
                  type="checkbox"
                  checked={categoriasSeleccionadas.includes(cat)}
                  onChange={() => toggleCategoria(cat)}
                />{" "}
                {cat}
              </label>
            </div>
          ))}
        </aside>

        <section className="lista-resultados">
          <div className="lista-items">
            {librosPaginados.map((book) => (
              <div key={book.id} className="libro-card">
                <img
                  src={book.fotos}
                  alt={book.nombre}
                  className="libro-imagen"
                  loading="lazy"
                />

                <div className="libro-info">
                  <h5>{book.nombre}</h5>
                  <p>{book.descripcion}</p>
                  <small>Categoría: {book.categoria}</small>
                </div>

                <div className="libro-acciones">
                  <strong>${book.precio}</strong>

                  <div className="libro-qty">
                    <label>
                      Qty:
                      <input
                        type="number"
                        min="1"
                        max={book.cantidad}
                        value={quantities[book.id] || 1}
                        onChange={(e) =>
                          handleQtyChange(book.id, e.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      disabled={book.estado !== "Disponible"}
                      onClick={() => handleAddToCart(book)}
                      className={`btn-add ${
                        book.estado !== "Disponible" ? "disabled" : ""
                      }`}
                    >
                      Agregar al carrito
                    </button>

                    <Link
                      to={`/libros/${book.id}`}
                      className="btn btn-secondary"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="lista-paginacion">
        <PaginationControl
          totalItems={librosBuscados.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  );
};

export default ListaLibros;
