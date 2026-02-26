import { Container } from "react-bootstrap";
import BannerListView from "../views/BannerListView";
import SearchBar from "../components/search/SearchBar";
import ProductGrid from "../components/products/ProductGrid";
import PaginationControl from "../components/common/PaginationControl";
import { useState, useEffect } from "react";

const API_URL =
  "https://ms-books-catalogue-production-76cc.up.railway.app/api/v1/books";

const ITEMS_PER_PAGE = 8;

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
        setFilteredBooks(mappedBooks);
      })
      .catch((err) => console.error("Error cargando libros:", err));
  }, []);

  const handleSearch = (query) => {
    const result = books.filter((book) =>
      book.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(result);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <Container className="py-4">
      <header className="mb-4 text-center">
        <h1>Bienvenido a tu librería Digital</h1>
        <p className="lead">
          Descubre miles de libros físicos y digitales.
        </p>
      </header>

      <BannerListView />

      <SearchBar onSearch={handleSearch} />

      <ProductGrid books={currentBooks} />

      <PaginationControl
        totalItems={filteredBooks.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
};

export default HomePage;