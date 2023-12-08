import * as React from "react";
import "./Products.css";
import TableContainer from "@mui/material/TableContainer";
import {
  ProductDiv,
  ProductSpan,
  ProductStyled,
  LoadingImage,
  ProductImage,
  ProductImageContainer,
  DeleteImage,
  ProductPriceDelete,
  Price,
} from "./ProductContainer.styled";
import { AddProductBtn } from "../Shared/AddProductBtn";
import { UpdateProductBtn } from "../Shared/UpdateProductBtn";
import LoadGif from "../../Image/icon/loading.gif";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import DeleteIcon from "../../Image/icon/delete.svg";
import { CardContent, Grid, Pagination, Typography } from "@mui/material";
import { productsAPI, productsDeleteAPI } from "../../api/products";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../store/slice/productsSlice";

export default function ProductContainer() {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.productsSlice);
  const [page, setPage] = React.useState(1);

  const getProduct = async (pageNumber) => {
    try {
      const res = await productsAPI(pageNumber);
      if (res && res.results) {
        dispatch(setProducts(res));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  React.useEffect(() => {
    getProduct(page);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const deleteProduct = (id) => {
    Swal.fire({
      title: "Delete Product",
      text: `Are you sure you want to delete product #${id}?`,
      showCancelButton: true,
      cancelButtonColor: "transparent",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#D63626",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        productsDeleteAPI(id)
          .then((res) => {
            let newArray = [...productsState.data].filter(
              (item) => item.id !== id
            );
            dispatch(setProducts(newArray));
            getProduct(page);
          })
          .catch(() => {});
        toast.success("The operation is successful!", {
          autoClose: 1000,
          pauseOnHover: true,
        });
      }
    });
  };

  if (!productsState.data || productsState.data.length === 0) {
    return <LoadingImage src={LoadGif} alt="loading" />;
  }

  return (
    <ProductStyled>
      <ProductDiv>
        <ProductSpan>Products</ProductSpan>
        <div className="right-side">{/* <SelectCategory /> */}</div>
        <AddProductBtn name="Add product" pagename="products" placement="end" />
      </ProductDiv>

      <TableContainer
        sx={{
          width: "100%",
          height: "500px",
          background: "inherit",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {productsState.data.map((item) => {
          if (item && item.image) {
            return (
              <Grid
                key={item.id}
                sx={{
                  width: 196,
                  height: 273,
                  background: "#FFFFFF",
                  boxShadow: "0px 4px 4px rgba(57, 57, 57, 0.25)",
                  borderRadius: "5px",
                  marginRight: 3,
                  marginBottom: 3,
                }}
              >
                <ProductImageContainer>
                  {item.image && (
                    <ProductImage
                      src={`http://127.0.0.1:8000${item.image}`}
                      alt={item.name}
                    />
                  )}
                </ProductImageContainer>
                <CardContent sx={{ display: "grid" }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="span"
                    sx={{ color: "#1E1E30", fontSize: 18 }}
                  >
                    {item.name.length > 15
                      ? `${item.name.slice(0, 15)}...`
                      : item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="#8E8E93"
                    sx={{ fontSize: 14 }}
                    component="span"
                  >
                    {item.category_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="#00B2A9"
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      display: "grid",
                    }}
                    component="span"
                  >
                    <ProductPriceDelete sx={{ backgroundColor: "red" }}>
                      <Price>{item.price} EGP</Price>
                      <UpdateProductBtn
                        name="update product"
                        pagename="products"
                        placement="end"
                        productDetails={item}
                        size="small"
                      />
                      <DeleteImage
                        size="small"
                        onClick={() => deleteProduct(item.id)}
                        src={DeleteIcon}
                        alt="delete"
                      />
                    </ProductPriceDelete>
                  </Typography>
                </CardContent>
              </Grid>
            );
          }
          return null;
        })}
      </TableContainer>
      <Stack spacing={5} className="mt-5">
        <Pagination
          count={Math.ceil(productsState.count / 12) || 1}
          color="primary"
          onChange={(event, newPage) => {
            if (newPage !== page) {
              handleChangePage(event, newPage);
            }
          }}
        />
      </Stack>
      <ToastContainer />
    </ProductStyled>
  );
}
