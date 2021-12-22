import React,{useRef,useState,useEffect} from 'react'
import { Container,Form,Button ,Nav} from 'react-bootstrap'
import {useNavigate} from 'react-router';
import { getPost, postAdd } from '../config/Myservice';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';

const regforInp=RegExp(/^[A-Za-z\s]{1,10}[\.]{0,1}[A-Za-z\s]{0,20}$/)

export default function AddPost() {
    const [postData,setPostData]=useState([])
    const titleInp=useRef(null)
    const descInp=useRef(null)
    const imgInp=useRef(null)
    const [select,setSelect]=useState();
    const [errors,setErrors]=useState({title:'',desc:''});
    const [uid,setUid]=useState('')
    const navigate=useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('_token')!==undefined){
            let token=localStorage.getItem('_token');
            let decode=jwt_decode(token);
            // console.log(decode)
            setUid(decode.uid)
            getPost()
            .then(res=>{
            if(res.data.err === 1){
                alert(res.data.msg)
            }
            else if( res.data.err === 0){
                // console.log(res.data.regUser)
                setPostData(res.data.post)
                // console.log(userData)
            }
        })
    }
        
    },[postData])
    const handler=(event)=>{
        const {name,value}=event.target;
        switch(name){
            case 'title':
                errors.title=regforInp.test(value)?'':'Title is not valid';
                break;
            case 'desc':
                errors.desc=regforInp.test(value)?'':'Description is not valid';
                break;
            default :
                break;
        }
        setSelect({errors,[name]:value},()=>{
            console.log(errors)
        })
        console.log(select)
    }

    const addPost=(event)=>{
        alert("Add")
        event.preventDefault();
        let title=titleInp.current.value;
        let desc=descInp.current.value;
        // const image=new FormData();
        // image.append('file',imgInp.current.value)
        
            console.log(title,desc)
            if(validate(errors))
            { 
            //     if(postData.length !== 0){
            //     let arr=postData
            //     console.log(arr)
            //     postData.map(user=>
            //     {if( user.title===title && user.desc===desc)
            //         {
            //             alert(" Post already Added!!")
            //             return navigate('/addpost',{replace:true});
            //         }


            //     else{
                    
            //         alert('Post Added!')
            //         let data={title:title,desc:desc,email:uid}
            //         postAdd(data)
            //         .then(res=>{
            //             console.log("Post Added!!")
            //             // navigate('/login',{replace:true})
            //         })
            //         return navigate("/dashboard",{replace:true})
             
            //     }
            //     })
                


            //         }  
            // else{
            let data={title:title,desc:desc,email:uid}
            alert('Post Added!')
              postAdd(data)
              .then(res=>{
                  console.log("Post Added!!")
                  // navigate('/login',{replace:true})
              })
              return navigate("/dashboard",{replace:true})
             
        //         }
        // }
        /* else{
        alert("User Not Found!")
        document.getElementById("email").value=null;
        document.getElementById("password").value=null;
        } */
           
            
            // else{
            //    alert("Enter Correct Title and Desc!!")
                
            
            }
           
    }

    const validate=(errors)=>{
        let valid=true;
        Object.values(errors).forEach((val)=> val.length >0 && (valid=false));
        return valid;
    }

    const logOut=()=>{
        localStorage.clear();
        navigate('/',{replace:true})
    }

    return (
        <>
            <Container>
            <Nav variant="tabs" defaultActiveKey="/home">
  <Nav.Item>
    <Nav.Link eventKey="link-1"><Link to="/dashboard" style={{textDecoration:"none"}}>Home</Link></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link  eventKey="link-2"><Link to="/addpost" style={{textDecoration:"none"}}>Add Post</Link></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link  onClick={logOut}>Logout</Nav.Link>
  </Nav.Item>
</Nav>
            <Form  method="post" className='m-3'>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="title" placeholder="Enter title" onChange={handler} ref={titleInp}/>
                    {errors.title.length>0 && <span style={{color:'red'}}>{errors.title}</span>}
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="desc" placeholder="Enter description" onChange={handler} ref={descInp}/>
                    {errors.desc.length>0 && <span style={{color:'red'}}>{errors.desc}</span>}
                </Form.Group>
                {/* <Form.Group className="mb-3" >
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name="image" onChange={handler} ref={imgInp}/>
                    {errors.desc.length>0 && <span style={{color:'red'}}>{errors.desc}</span>}
                </Form.Group> */}
                <Button className="btn btn-dark" onClick={addPost}>Add Post</Button>
            </Form>
            </Container>
        </>
    )
}
