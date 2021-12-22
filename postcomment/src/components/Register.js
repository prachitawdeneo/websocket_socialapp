import React,{useState,useEffect,useRef} from 'react'
import {Form,Container,Button} from 'react-bootstrap'
import { addUser, getRegUser } from '../config/Myservice';
import { useNavigate } from 'react-router';

const regForName=RegExp(/^[A-Za-z]{2,50}$/);
const regForEmail=RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForAddress=RegExp(/^[A-Za-z0-9]{5,150}$/)


export default function Register() {
    const [userData,setUserData]=useState([]);
    const nameInp=useRef(null);
    const emailInp=useRef(null);
    const mobileInp=useRef(null);
    const addressInp=useRef(null);
    const passInp=useRef(null);
    const cpassInp=useRef(null);
    const [select,setSelect]=useState();
    const [errors,setErrors]=useState({ name:'',mobile:'',address:'', email:'',password:'',con_password:''});
    const navigate=useNavigate();

    useEffect(()=>{
        getRegUser()
        .then(res=>{
            if(res.data.err === 1){
                alert(res.data.msg)
            }
            else if( res.data.err === 0){
                // console.log(res.data.regUser)
                setUserData(res.data.regUser)
                // console.log(userData)
            }
        })
    },[userData])

    const handler=(event)=>{
        const {name,value}=event.target;
        switch(name){
            case 'name':
                errors.name=regForName.test(value)?'':'Enter Valid name!';
                break;
            case 'mobile':
                errors.mobile=value.length===10?'':'Enter Valid Mobile no!';
                break;
            case 'address':
                errors.address=regForAddress.test(value)?'':'Enter Valid Address!';
                break;
            case 'email':
                errors.email=regForEmail.test(value)?'':'Email is not valid';
                break;
            case 'password':
                errors.password=forPassword(value);
                console.log(errors.password)
                
                break;
            case 'con_password':
                errors.con_password=passInp.current.value===(value)?'':'Password does not match';
                //  console.log(errors.password)
                break;
            default :
                break;
        }
        setSelect({errors,[name]:value},()=>{
            console.log(errors)
        })
    }

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
    const userReg=(event)=>{
        event.preventDefault();
        let name=nameInp.current.value;
        let mobile=mobileInp.current.value;
        let address=addressInp.current.value;
        let email=emailInp.current.value;
        let password=passInp.current.value;
        let con_password=cpassInp.current.value;
            console.log(email,password)
            if(validate(errors))
            { 
                if(userData.length !== 0){
                let arr=userData
                console.log(arr)
                userData.map(user=>
                {if( user.email===email && user.password===password)
                    {
                        alert(" User already Registered!!")
                        return navigate('/',{replace:true});
                    }


                else{
                    
                    alert('Registered In Successfully!')
                    let data={name:nameInp.current.value,email:emailInp.current.value,mobile:mobileInp.current.value,address:addressInp.current.value,password:passInp.current.value,con_password:cpassInp.current.value}
                    addUser(data)
                    .then(res=>{
                        console.log("Data Posted!!")
                        // navigate('/login',{replace:true})
                    })
                    return navigate("/",{replace:true})
             
                }
                })
                


                    }  
            else{
            let arr={con_password,password,email,mobile,address,name}
            alert('Registered In Successfully!')
              addUser(arr)
              .then(res=>{
                  console.log("Data Posted!!")
                  // navigate('/login',{replace:true})
              })
              return navigate("/",{replace:true})
             
                }
        }
        /* else{
        alert("User Not Found!")
        document.getElementById("email").value=null;
        document.getElementById("password").value=null;
        } */
           
            
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
            <h1>Register</h1>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Enter name" onChange={handler} ref={nameInp}/>
                    {errors.name.length>0 && <span style={{color:'red'}}>{errors.name}</span>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" ref={emailInp} onChange={handler}/>
                    {errors.email.length>0 && <span style={{color:'red'}}>{errors.email}</span>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control type="text" name="mobile" placeholder="Mobile no" ref={mobileInp} onChange={handler}/>
                    {errors.mobile.length>0 && <span style={{color:'red'}}>{errors.mobile}</span>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control type="text" name="address" placeholder="Addresss" ref={addressInp} onChange={handler}/>
                    {errors.address.length>0 && <span style={{color:'red'}}>{errors.address}</span>}
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" ref={passInp} onChange={handler}/>
                    {errors.password.length>0 && <span style={{color:'red'}}>{errors.password}</span>}
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" name="con_password" placeholder="Re-enter Password" ref={cpassInp} onChange={handler}/>
                    {errors.con_password.length>0 && <span style={{color:'red'}}>{errors.con_password}</span>}
                </Form.Group>

                <Button className="btn btn-dark" onClick={userReg}>Submit</Button>
            </Form>
            </Container>
        </>
    )
}
