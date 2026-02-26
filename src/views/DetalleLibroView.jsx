import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DetalleLibro from "../components/DetalleLibro";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";

const API_URL =
  "https://ms-books-catalogue-production-76cc.up.railway.app/api/v1/books";

const DetalleLibroView = () => {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.id === parseInt(id));

        if (found) {
          const mappedLibro = {
            id: found.id,
            nombre: found.title,
            descripcion: found.description,
            precio: found.price,
            categoria: found.category,
            cantidad: found.stockQuantity,
            fotos: found.coverImageUrl,
            estado:
              found.status === "AVAILABLE" ? "Disponible" : "Agotado",
            author: found.author,
          };

          setLibro(mappedLibro);
        }
      })
      .catch((err) =>
        console.error("Error cargando detalle del libro:", err)
      );
  }, [id]);

  if (!libro) return <p className="mt-4">Cargando...</p>;

  return (
    <div className="container mt-4">
      <Breadcrumb libro={libro} />
      <DetalleLibro libro={libro} />
    </div>
  );
};

export default DetalleLibroView;