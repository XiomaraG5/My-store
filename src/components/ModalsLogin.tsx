
import { useRouter } from 'next/navigation';
import React from 'react'
import { useState } from 'react'

const ModalsLogin = (
    {show,onClose,seller,setSeller}:{show:boolean,onClose:any,seller:boolean,setSeller:any}
) => {
    const router = useRouter();
    const [create,setCreate]=useState(false)
    const [showPass,setShowPass]=useState(false)
    const [data, setData]=useState({
        email:'',
        password:'',
        repeatPassword:'',
        name:''
    })

    const handleRegister = async (event:any) => {
        event.preventDefault();

        if (data.password !== data.repeatPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }

        try {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.name,
                role: seller ? 'seller' : 'customer'
            }),
            });
    
          if (response.ok) {
            // alert('Usuario registrado exitosamente');
            await handleLogin(false)
            close();
          } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error al registrar el usuario');
          }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
          console.error(error);
          alert('Error al registrar el usuario');
        }
      };
    
      const handleLogin = async (event:any) => {
        event && event.preventDefault();
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
          });
    
          if (response.ok) {
            alert('Logged in successfully');
            close();
            router.push('/')
          } else {
            const errorData = await response.json();
            alert(errorData.error || 'Invalid email or password');
          }
        } catch (error) {
          console.error(error);
          alert('Failed to login');
        }
      };
    
    
    const close=()=>{
        setCreate(false)
        setShowPass(false)
        setData({
            email:'',
            password:'',
            repeatPassword:'',
            name:''
        })
        onClose()
    }
  return (
        <div id="authentication-modal" tabIndex={-1} aria-hidden={!show}  className={`${show ? 'flex' : 'hidden'} bg-zinc-900/45 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
            
                <div className="relative bg-white rounded-lg shadow dark:bg-gradient-to-r from-slate-700 to-slate-900">
                
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {seller?` ${create?"Singup":"SingIn"} as Seller`:`${create?"Singup":"SingIn"} as client`}
                        </h3>
                        <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={close}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    
                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={create ? handleRegister : handleLogin}>

                            {create && (
                                <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="text" name="name" id="name" value={data.name} onChange={(e) => setData({...data,name:e.target.value})} placeholder='Name'
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                </div>
                            )}

                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>

                                <input type="email" name="email" id="email" value={data.email} onChange={(e) => setData({...data,email:e.target.value})}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 
                                    dark:text-white" placeholder="name@company.com" required />
                            </div>

                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type={showPass?"text":"password"}  name="password" id="password" placeholder="••••••••" value={data.password} onChange={(e) => setData({...data,password:e.target.value})}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />

                                {create && 
                                <>
                                    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-3">Confirma Password</label>
                                    <input type={showPass?"text":"password"} name="password" id="password" placeholder="••••••••" value={data.repeatPassword} onChange={(e) => setData({...data,repeatPassword:e.target.value})}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 
                                        dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                </>    
                                }

                            </div>
                        
                            <button type="submit" 
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                                rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gradient-to-br from-violet-600 to-blue-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {create?"Crear":"Ingresar"}
                            </button>

                            <div className="flex justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" type="checkbox" checked={seller} onChange={()=>setSeller(!seller)} value=""
                                             className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"  />
                                    </div>
                                    <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Seller</label>
                                </div>
                                <p className="text-sm text-blue-700 hover:underline dark:text-blue-500" onClick={()=>setShowPass(!showPass)}>{showPass?"Hide Password?":"Show Password?"}</p>
                            </div>

                            {!create &&  <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                              Have you not registered? <span className="text-blue-700 hover:underline dark:text-blue-500 ps-2" onClick={()=>setCreate(true)}>SingUp</span>           
                            </div> }
                            {create &&  <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                              Already have an account? <span className="text-blue-700 hover:underline dark:text-blue-500 ps-2" onClick={()=>setCreate(false)}>SingIn</span>           
                            </div> }
                        </form>
                    </div>
                </div>
            </div>
        </div> 

  )
}

export default ModalsLogin