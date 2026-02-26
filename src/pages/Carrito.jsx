import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { books } from "../data/database";
import CartTotals from "../components/cart/CartTotals";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { Trash } from "react-bootstrap-icons";

const Carrito = () => {
  const { cart, dispatch, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_ORDERS;

  const cartItemsWithDetails = cart.map((item) => {
    const book = books.find((b) => b.id === item.id);
    return {
      ...item,
      ...book,
      cantidad: item.cantidad,
    };
  });

  const handleClearCart = () => {
    dispatch({ type: "CLEAR" });
  };

  /*const handleRemoveItem = (id) => {
    dispatch({ type: "REMOVE", payload: id });
  };*/

  const handleRemoveItem = async (id) => {
    try {
      await fetch(
        `${API_URL}orders/verified?accountId=1&bookId=${id}`,
        {
          method: "DELETE",
        }
      );

      dispatch({ type: "REMOVE", payload: id });

    } catch (error) {
      console.error("Error eliminando orden:", error);
      alert("No se pudo eliminar la orden");
    }
  };

  const handleIncrease = (id) => {
    dispatch({ type: "INCREASE", payload: id });
  };

  const handleDecrease = (id) => {
    dispatch({ type: "DECREASE", payload: id });
  };

  /*const handleCheckout = () => {
    navigate("/checkout");
  };*/

  const handleCheckout = async () => {
    try {

      for (let item of cart) {

        await fetch(`${API_URL}orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: 1,
            bookId: item.id,
            //totalAmount: Number(getTotalPrice())
            totalAmount:item.precio
          })
        });

      }

      navigate("/checkout");

    } catch (error) {
      console.error(error);
      alert("Error creando orden pendiente");
    }
  };

  return (
    <>
      <Container className="py-4">
        <Breadcrumb />
        <Row>
          <Col md={8}>
            <h3>Productos en el carrito</h3>
            {cart.length === 0 ? (
              <Card className="mt-3">
                <Card.Body className="text-center py-5">
                  <p className="text-muted mb-0">El carrito está vacío</p>
                </Card.Body>
              </Card>
            ) : (
              <div className="mt-3">
                {cartItemsWithDetails.map((item) => (
                  <Card key={item.id} className="mb-3">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col xs={12} sm={3} className="text-center mb-3 mb-sm-0">
                          <Image
                            src={item.fotos}
                            alt={item.nombre}
                            fluid
                            style={{
                              maxHeight: "150px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                            onError={(e) => {
                              e.target.src = `https://placehold.co/150x200/cccccc/666666?text=${encodeURIComponent(item.nombre)}`;
                            }}
                          />
                        </Col>
                        <Col xs={12} sm={6}>
                          <h5>{item.nombre}</h5>
                          <p className="text-muted mb-2">{item.descripcion}</p>
                          <small className="text-muted">
                            Categoría: {item.categoria}
                          </small>
                          <div className="mt-2">
                            <strong>${item.precio?.toFixed(2) || "0.00"}</strong>
                          </div>
                        </Col>
                        <Col xs={12} sm={3} className="text-center">
                          <div className="mb-2">
                            <label className="me-2">Cantidad:</label>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleDecrease(item.id)}
                                disabled={item.cantidad <= 1}
                              >
                                -
                              </Button>
                              <span className="fw-bold">{item.cantidad}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleIncrease(item.id)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="mb-2">
                            <strong>
                              Subtotal: $
                              {((item.precio || 0) * item.cantidad).toFixed(2)}
                            </strong>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash /> Eliminar
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>

          <Col md={4}>
            <CartTotals onClear={handleClearCart} />
            <hr />
            {cart.length > 0 && (
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={handleCheckout}
                >
                  Comprar
                </Button>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Carrito;
