import Footer from "../components/Footer/Footer.js";
import Searchresult from "../components/Bodysearch/Bodysearch.js";
import { useLocation,useOutletContext } from 'react-router-dom';
import { useEffect, useState } from "react";
import { searchPost,getAll } from "../services/post.service.js";
import { deleteOnInFavorites,addFavorite  } from "../services/user.service.js";
const SearchResultpage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState();
    const [totalPages, setTotalPages]= useState();
    const [user, setUser] = useOutletContext();
    const location = useLocation();
    const value = location.state?.value;
    const category = location.state?.category;
    const listpage = location.state?.listpage;
    const checkCurrentpage = (n) =>{
        setCurrentPage(n)
    }
    const checkPrev = () =>{
        setCurrentPage(currentPage -1)
    }
    const checkNext = () =>{
        setCurrentPage(currentPage +1)
    }
    const getDataSearch = async () => {
        try {
            const posts = (await searchPost(value,currentPage)).data.data;
            setData(posts.data);
            setTotalPages(posts.totalPages)
        } catch (error) {

        }
    }

    const getDatafilter = async () => {
        const address = category[0].address
        const area = category[4].area
        const price_min = category[1].price_min
        const price_max = category[2].price_max
        const utils = category[3].amenities
        const search = category[5].searchValue;
        try {
            const posts = (await getAll(currentPage,search,address,area,price_min,price_max,utils));
            setData(posts.data.posts);
        } catch (error) {

        }
    }

    const getData = async () => {
        try {
            const posts = await getAll(currentPage);
            setData(posts.data.posts);
            setTotalPages(posts.data.totalPages)
        } catch (error) {
        }
    }

    const addPostfavourites = async (userId, idPost) => {
        try {
            const posts = (await addFavorite(idPost, userId));
        } catch (error) {
            
        }
    }
    const removePostfavourites = async (userId, idPost) => {
        try {
            const posts = (await deleteOnInFavorites(idPost, userId));
        } catch (error) {
            
        }
    }
    useEffect(()=> {
        if(value!= null){
            getDataSearch();
        }
        else if(category!=null){
            getDatafilter();
        }
        else if(listpage!==null && listpage === 'list page'){
            getData();
        }
        else if(listpage!==null && listpage === 'favorite page'){
            getData();
        }
    },[currentPage, value, category,listpage])
    return (

        <>
            <div className="container mt-3 mb-3">
                <div className="row gap-4">
                    <Searchresult totalPages={totalPages} currentPage={currentPage} setCurrentPage={checkCurrentpage} 
                    checkNext={checkNext} checkPrev={checkPrev} dataSource={data} addFavorite={addPostfavourites} user={user} 
                    removeFavorite={removePostfavourites}/>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}
export default SearchResultpage