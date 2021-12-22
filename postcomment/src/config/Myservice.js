import axios from 'axios';
import { MAIN_URL } from './Url';
let token = localStorage.getItem('_token')
export function getRegUser(){
    // console.log("Done!")
    return( axios.get(`${MAIN_URL}getuser`)
   )
}
export function addUser(data){
    console.log("Done!")
    return( axios.post(`${MAIN_URL}adduser`,data)
   )
}
export function logUser(data){
    console.log("Done!")
    return( axios.post(`${MAIN_URL}loguser`,data)
   )
}

export function getPost(){
    // console.log("Done!")
    return( axios.get(`${MAIN_URL}getpost`)
   )
}

export function postAdd(data){
    console.log("Done!")
    return( axios.post(`${MAIN_URL}addpost`,data)
   )
}

export function postComment(data,id){
    console.log("Done!")
    return( axios.put(`${MAIN_URL}addpost`,data)
   )
}