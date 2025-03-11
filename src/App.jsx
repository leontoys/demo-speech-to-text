import { useState } from 'react'
import './App.css'
import { HfInference } from "@huggingface/inference";

function App() {

  const [filePath,setFilePath] = useState("")
  const [text,setText] = useState("")

  const handleFileChange = (e)=>{
    setFilePath(e.target.files[0])
  }

  const fileLoaded = async (e)=>{

    const result = e.target.result

    const hf_key = import.meta.env.VITE_HF

    const client = new HfInference(hf_key); 
  
    //convert array buffer to blog
    const data = new Blob([result],{ type: "audio/wav" })
    
    try {

      const output = await client.automaticSpeechRecognition({
        data,
        model: "openai/whisper-large-v3",
        provider: "hf-inference",
      });     

      if(output){
        setText(output.text)
      }
      else{
        setText("Not able to transcribe at the moment.Please try later")
      }
      
    } catch (error) {

      console.error("Error",error)
      
    }
    

  }

  const handleFileUpload = async (e)=>{
    
    const reader = new FileReader()

    reader.addEventListener("load",fileLoaded)

    reader.readAsArrayBuffer(filePath)
    
  }

  return (
    <div className='App'>
      <h1>Speech to Text</h1>
      <input type='file' onChange={handleFileChange}></input>
      <button type='submit' onClick={handleFileUpload}>Transcribe</button>
      <textarea value={text} placeholder='Transcribed text will appear here...'></textarea>
    </div>
  )
}

export default App
