import React, { useEffect, useState } from "react";
import "./Admin.css";
import Navbar from "../../components/Navbar";
import Menubox from "../../components/Menubox";
import BasicTable from "../../components/Basictable";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../../config/config";
import axios from "axios";
import { formatDate } from "./helper";
import BasicModal from "../../components/BasicModal";
import { useNavigate } from "react-router-dom";
import AddUserForm from "../../components/Forms/UserForm";
import ProductForm from "../../components/Forms/ProductForm";
import AddCategoryForm from "../../components/Forms/CategoryFrom";
import AddOrderForm from "../../components/Forms/OrderForm";
import AddStaffForm from "../../components/Forms/StaffsForm";
import AddMadeofForm from "../../components/Forms/MadeOfForm";
import AddBrandForm from "../../components/Forms/BrandForm";
import AddCountryForm from "../../components/Forms/CountryForm";
import { getItemById } from "./helper";
import { orderItemById } from "./helper";
// import { getBrandById } from "./helper";
// import { orderCountryById } from "./helper";
// import { getMadeofById } from "./helper";

function Admin() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("");
  const [parentMenu, setParentMenu] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState();
  const [countries, setCountries] = useState();
  const [madeOf, setMadeOf] = useState();
  const [users, setUsers] = useState();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [addButtonLabel, setAddButtonLabel] = useState();
  const [form,setForm] = useState();
  const [isShowForm,setIsShowForm]=useState(false)
  const [isFormEdit,setIsFormEdit] = useState(false)
  const [allProducts, setAllProducts] = useState()
  const [allOrders, setAllOrders] = useState()
  // const [allBrands, setAllBrands] = useState()
  // const [allCountrys, setAllCountrys] = useState()
  // const [allMadeofs, setAllMadeofs] = useState()

  useEffect(() => {
    axios
      .get(config.getCategoryApi)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get(config.getAllUsers)
      .then((response) => {
        console.log("response", response.data);
        if (response.status === 200) {
          setUsers(response.data);
        }
      })
      .catch((error) => {
        console.log("err", error);
      });

    axios
      .get(config.getBrandsApi)
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });

    axios
      .get(config.getCountriesApi)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });

    axios
      .get(config.getMadeofApis)
      .then((response) => {
        setMadeOf(response.data);
      })
      .catch((error) => {
        console.error("Error fetching made of:", error);
      });

      axios
      .get(config.getProductApi)
      .then((response) => {
        console.log(response.data);
        setAllProducts(response.data)
        const products = restructureProductData(response.data);
        console.log(products);
        setRows(products);
        setColumns(productColumns);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [menu]);

  

  const handleDeleteModalClose = () => {
    setOpen(false);
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const restructureProductData = (data) => {
    return data.map((item) => ({
      id: item.product_id,
      name: item.name,
      price: ` Rs: ${item.price}`,
      category: getCategoryNameById(item.category),
      stock: item.stock_quantity,
    }));
  };

  const convertedOrders = (orders, users) => {
    const userLookup = users.reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {});

    return orders.map((order) => ({
      id: order.order_id,
      user_id: userLookup[order.user_id],
      order_date: formatDate(order.order_date),
      order_status: order.order_status,
      total_products: 1,
      expected_delivery: formatDate(order.updated_at),
      total_amount: order.total_amount,
    }));
  };

  const restructureCategoryData = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const restructureBrandData = (data) => {
    return data.map((item) => ({
      id: item.brand_id,
      name: item.name,
      description: item.description,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const restructureCountryData = (data) => {
    return data.map((item) => ({
      id: item.country_id,
      name: item.name,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const restructureMadeofData = (data) => {
    return data.map((item) => ({
      id: item.madeof_id,
      name: item.name,
      description: item.description,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const getOnConfirmHandler = (menu) => {
    switch (menu) {
      case "Products":
        return confirmDeleteProduct;
      case "Categories":
        return confirmDeleteCategory;
      case "Brands":
        return confirmDeleteBrand;
      case "Country":
        return confirmDeleteCountry;
      case "Made of":
        return confirmDeleteMadeof;

      case "Orders":
        return confirmDeleteOrder;

      case "Staffs":
        return confirmDeletStaff

      case "Users":
        return confirmDeleteUser;

      default:
        return () => {};
    }
  };

  useEffect(() => {
    console.log("menu", menu);

    console.log("API URL:", config.getProductsApi);
    if (menu === "Products") {
      setParentMenu("Products");
      setAddButtonLabel("Add Product");
      setForm(<ProductForm onCancel={handleCloseForm} initialProductData={null} isEdit={isFormEdit}/>)
      axios
        .get(config.getProductApi)
        .then((response) => {
          console.log(response.data);
          const products = restructureProductData(response.data);
          console.log(products);
          setRows(products);
          setColumns(productColumns);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (menu === "Orders") {
      setParentMenu("Orders");
      setAddButtonLabel("Add new Order");
      setForm(<AddOrderForm onCancel={handleCloseForm} initialOrderData={null} isEdit={isFormEdit}/>)

      axios
        .get(config.getOrdersApi)
        .then((response) => {
          console.log(response.data);
          setAllOrders(response.data)
          const orders = convertedOrders(response.data, users);
          console.log("orders", orders);
          setRows(orders);
          setColumns(orderColumns);
        })
        .catch((error) => {
          console.log(error);
        });
      // setRows(orderRows);
      // setColumns(orderColumns);
    }
    if (menu === "Staffs") {
      setParentMenu("Staffs");
      setAddButtonLabel("Add Staff");
      setForm(<AddStaffForm onCancel={handleCloseForm}/>)

      axios
        .get('http://localhost:8000/api/v1/staffs/list/')
        .then((response) => {
          console.log("staffs",response.data);
          const transformedStaffData = transformStaffData(response.data)
          console.log("transformedStaffData",transformedStaffData)
          setRows(transformedStaffData)
          setColumns(staffColumns)
        })
        .catch((error) => {
          console.log(error);
        });


      setColumns(staffColumns);
    }
    if (menu === "Users") {
      setParentMenu("Users");
      setAddButtonLabel("Add User");
      axios
        .get('http://localhost:8000/api/v1/auth/users/')
        .then((response) => {
          console.log("users",response.data);
          const transformedUserData = transformUserData(response.data)
          setRows(transformedUserData)
          setColumns(usersColumns)
        })
        .catch((error) => {
          console.log(error);
        });
     
      setColumns(usersColumns);
      setForm(<AddUserForm onCancel={handleCloseForm}/>)
    }

    if (menu === "Categories") {
      setAddButtonLabel("Add Category");
      setRows(restructureCategoryData(categories));
      setColumns(categoryColumns);
      setForm(<AddCategoryForm  onCancel={handleCloseForm}/>)

    }

    if (menu === "Brands") {
      setAddButtonLabel("Add Brand");
      setRows(restructureBrandData(brands));
      setForm(<AddBrandForm  onCancel={handleCloseForm}/>)

      axios
      .get(config.getBrandsApi)
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
      setColumns(categoryColumns);
    }
    if (menu === "Country") {
      setAddButtonLabel("Add Country");
      setRows(restructureCountryData(countries));
      setForm(<AddCountryForm  onCancel={handleCloseForm}/>)

      setColumns(countryColumns);
    }
    if (menu === "Made of") {
      setAddButtonLabel("Add Made of");
      setRows(restructureMadeofData(madeOf));
      setColumns(categoryColumns);
      setForm(<AddMadeofForm  onCancel={handleCloseForm}/>)

    }
  }, [menu,open,countries,isFormEdit]);

  

  const productColumns = [
    // { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 1 },
    { field: "stock", headerName: " Stock Quantity", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const orderColumns = [
    // { field: "id", headerName: "ID", flex: 1 ,hide:true},
    { field: "user_id", headerName: "User", flex: 1 },
    { field: "order_date", headerName: "Ordered On", flex: 1 },
    { field: "order_status", headerName: "Order Status", flex: 1 },
    { field: "total_products", headerName: " Total Products", flex: 1 },
    { field: "expected_delivery", headerName: "Expected Delivery On", flex: 1 },
    { field: "total_amount", headerName: "Total Amount", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditOrder(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteOrder(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const staffColumns = [
    // { field: "staff_id", headerName: "Staff ID", flex: 1 },
    { field: "user_id", headerName: "User Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditStaff(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteStaff(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];
  const transformStaffData = (staffData) => {
    return staffData.map((staff) => ({
      staff_id: staff.staff_id,
      user_id: staff.user_id,
      name: `${staff.first_name} ${staff.last_name}`,
      email: staff.email || "N/A", 
      status: staff.is_active ? "Active" : "Inactive",
      id: staff.staff_id, 
    }));
  };

  const usersColumns = [
    { field: "user_id", headerName: "User Id", flex: 1, hide:true},
    { field: "email", headerName: "Email", flex: 1 },
    { field: "joined_on", headerName: "Joined On", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditUsers(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteUsers(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];
  const transformUserData = (userData) => {
    return userData.map((user) => ({
      user_id: user.id,
      name: user.name || "N/A", 
      email: user.email,
      joined_on: new Date(user.date_joined).toLocaleDateString(), 
      status: user.is_active ? "Active" : "Inactive",
      id: user.id, 
    }));
  };

  const categoryColumns = [
    // { field: "id", headerName: "Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Descrption", flex: 1 },
    { field: "added", headerName: "Added On", flex: 1 },
    { field: "updated", headerName: "Updated On", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditCategory(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const countryColumns = [
    // { field: "id", headerName: "Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "added", headerName: "Added On", flex: 1 },
    { field: "updated", headerName: "Updated On", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditCategory(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const handleAddButton = () => {
    setIsShowForm(true)
    setIsFormEdit(false)
  };

  const handleCloseForm=()=>{
    setIsShowForm(false)
  }

   // Add your edit logic here
  const handleEdit = (id) => {
    console.log("Edit ID:", id);
    setIsFormEdit(true)
    setIsShowForm(true)
    const productData = getItemById(id,allProducts)
    console.log("products",productData)
    console.log("rows",rows)
    console.log("allProducts",allProducts)
    setForm(<ProductForm onCancel={handleCloseForm} initialProductData={productData} isEdit={isFormEdit}/>)
  };

  const handleDelete = (id) => {
    setOpen(true);
    setSelectedId(id);
    console.log("selected id for delete",id)
  };

  const confirmDeleteProduct = () => {
    axios
      .delete(`${config.deleteProductApi}${selectedId}/`)
      .then((response) => {
        if (response.status === 200) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
          setOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const confirmDeleteCategory = () => {
    axios
      .delete(`${config.deleteCategoryApi}${selectedId}/`)
      .then((response) => {
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          
          alert("Category deleted !");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDeleteBrand = () => {
    console.log("deleting brand id",selectedId)
    axios
      .delete(`${config.deleteBrandApi}${selectedId}/`)
      .then((response) => {
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        console.log("delete res", response);
        if (response.status === 200) {
          alert("Brand deleted !");
          window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDeleteCountry = () => {
    axios
      .delete(`${config.deleteCountryApi}${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Country deleted !");
          window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const confirmDeleteMadeof = () => {
    axios
      .delete(`${config.deleteMadeOfApi}${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Made of deleted !");
          window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const   confirmDeleteOrder = () => {
    axios
      .delete(`http://localhost:8000/api/v1/orders/delete/${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Order  deleted !");
          // window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const   confirmDeletStaff = () => {
    axios
      .delete(`http://localhost:8000/api/v1/staffs/delete/${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Staff  deleted !");
          // window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  const confirmDeleteUser = () => {
    axios
      .delete(`http://localhost:8000/api/v1/auth/users/${selectedId}/delete/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("User  deleted !");
          window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditOrder = (id) => {
    console.log("Edit ID:", id);
    setIsFormEdit(true)
    setIsShowForm(true)
    const orderData = getItemById(id,allOrders)
    console.log("orders",orderData)
    console.log("rows",rows)
    console.log("allOrders",allOrders)
    setForm(<AddOrderForm onCancel={handleCloseForm} initialOrderData={orderData} isEdit={isFormEdit}/>)
  };

  const handleDeleteOrder = (id) => {
    setSelectedId(id)
    setOpen(true)
    console.log("order id for delete",id)
    // Add your delete logic here
  };

  const handleEditStaff = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDeleteStaff = (id) => {
    console.log("Delete ID:", id);
    setOpen(true)
    setSelectedId(id)
    // Add your delete logic here
  };

  const handleEditUsers = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDeleteUsers = (id) => {
    console.log("Delete ID:", id);
    setOpen(true)
    setSelectedId(id)
    // Add your delete logic here
  };

  const handleEditCategory = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDeleteCategory = (id) => {
    console.log("Delete ID:", id);
    // Add your delete logic here
  };

  return (
    <div className="container">
      <Navbar></Navbar>
      <div className="menu-container">
        <div className="menus">
          <Menubox
            text={"Products"}
            action={setMenu}
            menu={menu}
            parentMenu={parentMenu}
          />
          <Menubox
            text={"Orders"}
            action={setMenu}
            menu={menu}
            parentMenu={parentMenu}
          />
          <Menubox
            text={"Staffs"}
            action={setMenu}
            menu={menu}
            parentMenu={parentMenu}
          />
          <Menubox
            text={"Users"}
            action={setMenu}
            menu={menu}
            parentMenu={parentMenu}
          />
        </div>
        <div className="submenu">
          {parentMenu === "Products" ? (
            <>
              <Menubox text={"Categories"} action={setMenu} menu={menu} />
              <Menubox text={"Brands"} action={setMenu} menu={menu} />
              <Menubox text={"Country"} action={setMenu} menu={menu} />
              <Menubox text={"Made of"} action={setMenu} menu={menu} />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="add-button-container">
        <button className="add-button" onClick={handleAddButton}>
          {" "}
          + {addButtonLabel}
        </button>
      </div>
      <div className="table-container">
        <BasicTable rows={rows} columns={columns}></BasicTable>
      </div>

      <BasicModal
        open={open}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={getOnConfirmHandler(menu)}
        heading={`Delete ${menu}`}
        content={"Are you sure you want to delete this item?"}
      />

      {isShowForm && 
        <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={form}
        customStyle={{height:'87vh',overflowY:'scroll', marginTop:'0px'}}
        />
      }
    </div>

  );
}

export default Admin;




