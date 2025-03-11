import { useState } from 'react'
import './App.css'
import { HfInference } from "@huggingface/inference";

function App() {

  const [filePath,setFilePath] = useState("")

  const handleFileChange = (e)=>{
    setFilePath(e.target.files[0])
  }

  const fileLoaded = async (e)=>{

    console.log("file-loaded")

    const result = e.target.result

    console.log("result",result)

    const hf_key = import.meta.env.VITE_HF

    const client = new HfInference(hf_key); 
  
    //convert array buffer to blog
    const data = new Blob([result])

    console.log("blob",data)

    
    try {

      const output = await client.automaticSpeechRecognition({
        data,
        model: "openai/whisper-large-v3",
        provider: "fal-ai",
      });     

    console.log(output);

      
    } catch (error) {

      console.error("Error",error)
      
    }
    

  }

  const handleFileUpload = async (e)=>{
    
    const reader = new FileReader()

    reader.addEventListener("load",fileLoaded)

    reader.readAsArrayBuffer(filePath)

    console.log("waiting")
    
  }

  return (
    <div className='App'>
      <input type='file' onChange={handleFileChange}></input>
      <button type='submit' onClick={handleFileUpload}>Upload</button>
    </div>
  )
}

export default App
