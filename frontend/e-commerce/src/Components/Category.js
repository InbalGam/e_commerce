import DeleteIcon from '@mui/icons-material/Delete';
import {deleteSpecificCategory} from '../Api';
import { useEffect, useState } from "react";
import FadeLoader from 'react-spinners/FadeLoader';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loadCategories} from '../store/categorySlice';


function Category(props) {
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [deleteFailed, setDeleteFailed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // add edit and delete for admins only
    async function onClickDelete(event) {
        event.preventDefault();
        try {
          setIsCategoryLoading(true);
          console.log(props.el.id);
          const result = await deleteSpecificCategory(props.el.id);
          if (result.status === 401) {
            navigate('/login');
          } else {
            if (result.status === 200) {
              dispatch(loadCategories());
              setDeleteFailed(false);
              setIsCategoryLoading(false);
            } else {
              setDeleteFailed(true);
              setIsCategoryLoading(false);
            }
          }
        } catch (e) {
          navigate('/error');
        }
      };


    return (
        <li key={props.ind}>
            <div className="categoryActions">
                {props.admin ? <button className='delete_category' onClick={(event) => onClickDelete(event)}><DeleteIcon /></button> : ''}
                {deleteFailed === false ? '' : 'Could not delete category'}
            </div>
            <p>{props.el.categoryName}</p>
        </li>
    );
};

export default Category;