import { useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

export const toWholeCurrency = (num) =>
  (num / 100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const commaSeperated = (num) => {
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// hooks

export const usePagination = (pathname) => {
  const [paginationMeta, setPaginationMeta] = useState({});
  const location = useLocation();
  // console.log(location);
  const params = new URLSearchParams(location.search);
  const page = parseInt(params.get("page")) || 1;
  const navigate = useNavigate();
  const goToPage = (idx) =>
    navigate({ pathname, search: `?page=${idx}&${params}` });
  return { page, goToPage, paginationMeta, setPaginationMeta };
};

export const usePaginations = (pathname) => {
  // console.log("pathname", pathname);
  const [paginationMeta, setPaginationMeta] = useState({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const page = parseInt(params.get("page")) || 1;
  const navigate = useNavigate();
  const goToPage = (idx) => navigate({ pathname, search: `?page=${idx}` });
  return { page, goToPage, paginationMeta, setPaginationMeta };
};
