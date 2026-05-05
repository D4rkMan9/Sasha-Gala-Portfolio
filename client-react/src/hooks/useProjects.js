import { useState, useEffect } from 'react';
import { projectService } from '../services/api';

export function useProjects(params = {}) {
 const [projects, setProjects] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
  projectService.getAll(params)
   .then(data => {
    if (data.projects) setProjects(data.projects);
    setLoading(false);
   })
   .catch(err => {
    setError(err);
    setLoading(false);
   });
 }, []);

 return { projects, loading, error };
}

export function useProjectImages() {
 const [images, setImages] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  projectService.getImages()
   .then(data => {
    if (data.images) setImages(data.images);
    setLoading(false);
   })
   .catch(() => setLoading(false));
 }, []);

 return { images, loading };
}
