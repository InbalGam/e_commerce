import {archiveSpecificCategory, updateCategory, loadImage} from '../Api';
import { useEffect, useState } from "react";
import FadeLoader from 'react-spinners/FadeLoader';
import { useNavigate, Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loadCategories} from '../store/categorySlice';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import {baseURL} from '../apiKey';
import EditIcon from '@mui/icons-material/Edit';
import CategoryAddUpdate from './CategoryAddUpdate';
import styles from './Styles/Category.css';


function Category(props) {
    const [deleteFailed, setDeleteFailed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    async function onClickIsArchive(e) {
        console.log(e.target.checked);
    };

    async function archive(e) {
        e.preventDefault();
        try {
            console.log(props.el.id);
            const result = await archiveSpecificCategory(props.el.id, !props.isArchived);
            if (result.status === 401) {
              navigate('/login');
            } else {
              if (result.status === 200) {
                dispatch(loadCategories());
                setDeleteFailed(false);
                setShowForm(false);
              } else {
                setDeleteFailed(true);
                setShowForm(false);
              }
            }
          } catch (e) {
            navigate('/error');
          }
    };

    async function onCategorySubmit(categoryName, categoryImg) {
      let imgId;
      const data = new FormData();
      data.append('image', categoryImg );
      try {
          if (categoryImg) {
              const imgResult = await loadImage(data);
              const jsonData = await imgResult.json();
              imgId = jsonData.id;
          } else {
              imgId = props.el.image_id;
          }
          const result = await updateCategory(props.el.id, categoryName, imgId);
          if (result.status === 200) {
              dispatch(loadCategories());
          } else if (result.status === 401){
              navigate('/login');
          }
      } catch (e) {
          navigate('/error');
      }
  };

  return (
    <li key={props.ind}>
      <div className="category" style={{ backgroundImage: props.el.imagename ? `url(${baseURL}/image/${props.el.imagename})` : '' }}>
      <Link to={`${props.el.id}/products`} className='categoryLink'><p>{props.el.categoryName}</p></Link>
        {props.admin ?
          <div>
            <input type="checkbox" name="isArchive" onChange={onClickIsArchive} />
            <button onClick={archive} className='archiveButton'>{props.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}</button>
            <button className='editButton' onClick={() => setShowForm(!showForm)}><EditIcon /></button>
          </div> : ''}
        {deleteFailed === false ? '' : 'Could not archive category'}
        {showForm ? <CategoryAddUpdate onCategorySubmit={onCategorySubmit} category={props.el} /> : ''}
      </div>
    </li>
  );
};

export default Category;