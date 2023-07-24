import {archiveSpecificProduct} from '../Api';
import { useEffect, useState } from "react";
import FadeLoader from 'react-spinners/FadeLoader';
import { useParams, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loadProducts} from '../store/productSlice';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import {baseURL} from '../apiKey';
import EditIcon from '@mui/icons-material/Edit';


function Product(props) {
    const [deleteFailed, setDeleteFailed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categoryId } = useParams();


    // add edit and delete for admins only
    async function onClickIsArchive(e) {
        console.log(e.target.checked);
    };

    async function archive(e) {
        e.preventDefault();
        try {
            console.log(props.el.id);
            const result = await archiveSpecificProduct(categoryId, props.el.id, !props.isArchived);
            if (result.status === 401) {
              navigate('/login');
            } else {
              if (result.status === 200) {
                dispatch(loadProducts(categoryId));
                setDeleteFailed(false);
              } else {
                setDeleteFailed(true);
              }
            }
          } catch (e) {
            navigate('/error');
          }
    };

//     async function onProductSubmit(categoryName, categoryImg) {
//       let imgId;
//       const data = new FormData();
//       data.append('image', categoryImg );
//       try {
//           if (categoryImg) {
//               const imgResult = await loadCategoryImage(data);
//               const jsonData = await imgResult.json();
//               imgId = jsonData.id;
//           } else {
//               imgId = props.el.image_id;
//           }
//           const result = await updateCategory(props.el.id, categoryName, imgId);
//           if (result.status === 200) {
//               dispatch(loadCategories());
//           } else if (result.status === 401){
//               navigate('/login');
//           }
//       } catch (e) {
//           navigate('/error');
//       }
//   };

    return (
        <li key={props.ind}>
            <div className="product" style={{ backgroundImage: props.el.imagename ? `url(${baseURL}/image/${props.el.imagename})` : '' }}>
                <h3>{props.el.productName}</h3>
                {props.admin ? 
                    <div> 
                        <input type="checkbox" name="isArchive" onChange={onClickIsArchive}/> 
                        <button onClick={archive} className='archiveButton'>{props.isArchived ? <UnarchiveIcon/> : <ArchiveIcon/>}</button>
                        <button className='editButton' onClick={() => setShowForm(!showForm)}><EditIcon/></button>
                    </div> : ''}
                <div className='productInfo'>
                    <p>{props.el.price}$</p>
                    <p>{props.el.discount ? props.el.discount+'% discount' : ''}</p>
                    <button className='addToCart'>Add to cart</button>
                </div>
                {deleteFailed === false ? '' : 'Could not archive product'}
                {/* {showForm ? <CategoryAddUpdate onCategorySubmit={onCategorySubmit} category={props.el}/> : ''} */}
            </div>
        </li>
    );
};

export default Product;