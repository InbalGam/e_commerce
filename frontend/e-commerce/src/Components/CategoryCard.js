import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
import styles from './Styles/CategoryCard.css';


export default function CategoryCard(props) {
    const [deleteFailed, setDeleteFailed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


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

    async function onCategorySubmit(category_name, categoryImg) {
        props.setLoading(true);
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
          const result = await updateCategory(props.el.id, category_name, imgId);
          if (result.status === 200) {
              dispatch(loadCategories());
              props.setLoading(false);
          } else if (result.status === 401){
              navigate('/login');
              props.setLoading(false);
          }
      } catch (e) {
          navigate('/error');
      }
  };


    return (
        <div className='categoryCardContainer'>
            <Link to={`${props.el.id}/products`} className='categoryCardLink'>
                <Card sx={{ minWidth: 375 }} className='categoryCard' style={{ backgroundImage: props.el.imagename ? `url(${baseURL}/image/${props.el.imagename})` : '' }}>
                </Card>
                <CardContent>
                    <Typography sx={{ fontSize: 24 }} gutterBottom className='categoryName'>
                        {props.el.category_name}
                    </Typography>
                </CardContent>
            </Link>
            <CardActions className='categoryCardButtons'>
                {props.admin ? <Button size="small" onClick={() => setShowForm(!showForm)} className='categoryCardActionButtons'><EditIcon /></Button> : ''}
                {props.admin ? <Button size="small" onClick={archive} className='categoryCardActionButtons'>{props.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}</Button> : ''}
            </CardActions>
            {deleteFailed === false ? '' : 'Could not archive category'}
            {showForm ? <CategoryAddUpdate onCategorySubmit={onCategorySubmit} category={props.el} /> : ''}
        </div>
    );
};

