import React from 'react'
import { useNavigate } from 'react-router-dom';
import StudentList from './students/StudentList';
import Header from '../components/Header';
import Assesment from './students/Assesment';
function Home() {

  return (
    <div>
    <Header></Header>
   
    <div className=" h-full flex flex-col items-center bg-whitesmoke justify-center  ">
   
      <Assesment/>

      
    </div>
    </div>
  )
}

export default Home
