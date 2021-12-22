import React,{useState,useEffect, useRef} from 'react'
import AddPost from './AddPost';
import { getPost } from '../config/Myservice';
import {Card,Button, Container,Form,ListGroup,Nav} from 'react-bootstrap';
import {io} from 'socket.io-client'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const regforInp=RegExp(/^[A-Za-z\s]{1,10}[\.]{0,1}[A-Za-z\s]{0,20}$/)
const socket = io('http://localhost:8989', {transports: ['websocket', 'polling', 'flashsocket']});

export default function Dashboard() {
    const cmtInp=useRef(null)
    const [postData,setPostData]=useState([])
    const [select,setSelect]=useState();
    const [errors,setErrors]=useState({comment:''});
    const [flag,setFlag]=useState(0)
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
            case 'comment':
                errors.comment=regforInp.test(value) || value===''?'':'Comment is not valid';
                break;
            default :
                break;
        }
        setSelect({errors,[name]:value},()=>{
            console.log(errors)
        })
        console.log(select)
    }

    const addComment=(id)=>{
        alert(id)
        console.log(id);
        setFlag(id)
        let data=cmtInp.current.value
        console.log(data)
        socket.emit('message',{data,id,uid});
          cmtInp.current.value = '';
        setFlag(0);
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
            <div className='row justify-content-center'>
            {postData.map(post=>
            <Card style={{ width: '18rem' }} className='col-3 m-3'>
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>
                        Description: {post.desc}<br/>
                        Post by : {post.email}
                    </Card.Text>
                    { flag !== post._id && <Button variant="primary" onClick={()=>addComment(post._id)}>Add comment</Button>}
                </Card.Body>
                { flag === post._id && <Form.Group className=" row" >
                <Form.Control type="text" style={{ width: '10rem' }} name="comment" className='col-9 m-2' placeholder="Comment here..."  onChange={handler} ref={cmtInp}/>
                {errors.comment.length>0 && <span style={{color:'red'}}>{errors.comment}</span>}
                <Button className='col-3 m-2' onClick={()=>addComment(post._id)}>Submit</Button>
            </Form.Group>}
            {post.comment.map(cmt=>
            <ListGroup variant="flush">
                <ListGroup.Item>{cmt.email} : {cmt.data}</ListGroup.Item>
            </ListGroup>
            )}
            </Card>
            )}
           
            </div>

            </Container>
        </>
    )
    
}
