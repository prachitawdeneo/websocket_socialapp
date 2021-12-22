import Button from '@restart/ui/esm/Button'
import React,{useRef,useState,useEffect} from 'react'
import { Container,Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { getRegUser, logUser } from '../config/Myservice'

const regForEmail=RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export default function Login() {
    const [user,setUser]=useState([]);
    const emailInp=useRef(null)
    const passInp=useRef(null)
    const [select,setSelect]=useState();
    const [errors,setErrors]=useState({email:'',password:''});
    const navigate=useNavigate();

    useEffect(()=>{
        getRegUser()
        .then(res=>{
            if(res.data.err === 1){
                alert(res.data.msg)
            }
            else if( res.data.err === 0){
                // console.log(res.data.regUser)
                setUser(res.data.regUser)
                // console.log(userData)
            }
        })
    },[user])

    const forPassword=(value)=>{
        const upper=RegExp(/^(?=.*[A-Z]).*$/);
        const lower=RegExp(/^(?=.*[a-z]).*$/);
        const special=RegExp(/^(?=.*[@$!%*?&]).*$/);
        const num=RegExp(/^(?=.*[0-9]).*$/);
        if(!upper.test(value)){
            return 'Password must contain atleast 1 Uppercase character';}
        else if(!lower.test(value)){
            return 'Password must contain atleast 1 Lowercase character';}
        else if(!special.test(value)){
            return 'Password must contain atleast 1 Special character';}
        // else if(value!== this.state.fname && value!== this.state.lname){
            // return 'Password cannot contain users first name or last name';}
            else if(!num.test(value)){
                return 'Password must contain atleast 1 Number';}
            else if(value.length<8){
                return 'Password must contain minimum 8 characters';}
        else{ return '';}
    };

    const handler=(event)=>{
        const {name,value}=event.target;
        switch(name){
            case 'email':
                errors.email=regForEmail.test(value)?'':'Email is not valid';
                break;
            case 'password':
                errors.password=forPassword(value);
                console.log(errors.password)
                break;
            default :
                break;
        }
        setSelect({errors,[name]:value},()=>{
            console.log(errors)
        })
        console.log(select)
    }
    const userLogin=(event)=>{
        event.preventDefault();

        let email=emailInp.current.value;
        let password=passInp.current.value
            // console.log(email,password)
            if(validate(errors))
            {user.length !==0 && user.map(user=>
                {
                    if(user.email===email && user.password===password){
                        
                        let arr={email,password}
                        alert('Logged In Successfully!')
                        logUser(arr)
                        .then(res=>{
                            if(res.data.err===1){
                                console.log(res.data) 
                                navigate('/',{replace:true})
                            }
                            else if(res.data.err===0){
                                console.log(res.data)
                                localStorage.setItem('_token',res.data.token);
                                navigate('/dashboard',{replace:true})
                            }
                            
                        })
                        //  return navigate("/menu",{replace:true})
                            
                    }
                    else{
                    alert("User Not Found!Please Register yourself!!")
                    return navigate("/register",{replace:true})
                    // document.getElementById("email").value=null;
                    // document.getElementById("password").value=null;
                    }
                }
            )
           
            }
            else{
               alert("Enter Correct Email and Password!!")
               
            
            }
    }

    const validate=(errors)=>{
        let valid=true;
        Object.values(errors).forEach((val)=> val.length >0 && (valid=false));
        return valid;
    }
    
    return (
        <>
            <Container className=' d-flex justify-content-center'style={{height:"100%"}}>
            <Form  method="post" className='bg-primary p-4 m-4'style={{height:"auto",width:"400px"}}>
            <h1>Login</h1>
                <Form.Group className="mb-3 m-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" onChange={handler} ref={emailInp}/>
                    {errors.email.length>0 && <span style={{color:'red'}}>{errors.email}</span>}
                </Form.Group>
                <Form.Group className="mb-3 m-3" controlId="formGroupEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter password" onChange={handler} ref={passInp}/>
                    {errors.password.length>0 && <span style={{color:'red'}}>{errors.password}</span>}
                </Form.Group>
                <Button className="btn btn-dark m-3" onClick={userLogin}>Login</Button>
                <div>Don't have an account? <Link to="/register" style={{textDecoration:"none"}} className='text-white'>Signup</Link></div>
            </Form>
            </Container>
        </>
    )
}
