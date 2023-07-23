import {archiveSpecificCategory} from '../Api';
import { useEffect, useState } from "react";
import FadeLoader from 'react-spinners/FadeLoader';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loadCategories} from '../store/categorySlice';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import {baseURL} from '../apiKey';


function Category(props) {
    const [deleteFailed, setDeleteFailed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // add edit and delete for admins only
    async function onClickIsArchive(e) {
        console.log(e.target.checked);
    };

    async function archive(e) {
        e.preventDefault();
        try {
            //setIsCategoryLoading(true);
            console.log(props.el.id);
            const result = await archiveSpecificCategory(props.el.id, !props.isArchived);
            if (result.status === 401) {
              navigate('/login');
            } else {
              if (result.status === 200) {
                dispatch(loadCategories());
                setDeleteFailed(false);
              } else {
                setDeleteFailed(true);
              }
            }
          } catch (e) {
            navigate('/error');
          }
    };

    return (
        <li key={props.ind}>
            <div className="categoryActions" style={{ backgroundImage: props.el.imagename ? `url(${baseURL}/image/${props.el.imagename})` : '' }}>
            <p>{props.el.categoryName}</p>
                {props.admin ? 
                    <div> 
                        <input type="checkbox" name="isArchive" onChange={onClickIsArchive}/> 
                        <button onClick={archive}>{props.isArchived ? <UnarchiveIcon/> : <ArchiveIcon/>}</button>
                    </div> : ''}
                {deleteFailed === false ? '' : 'Could not archive category'}
            </div>
        </li>
    );
};

export default Category;